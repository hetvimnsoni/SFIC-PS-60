import { Pool, type PoolClient, type QueryResult, type QueryResultRow } from "pg";
import type { Student, Classroom } from "../types";
import {
  SEED_SCHOOL,
  SEED_SETTINGS,
  SEED_CLASSROOMS,
  SEED_SUBJECTS,
  SEED_CONCEPTS,
  SEED_STUDENTS,
} from "./seedData";

// Resolve PostgreSQL connection string from standard environment variables
export function getPostgresConnectionString(): string | undefined {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.PGURI
  );
}

export function isPostgresConfigured(): boolean {
  const url = getPostgresConnectionString();
  return Boolean(url && url.trim().length > 0);
}

let poolInstance: Pool | null = null;
let schemaInitialized = false;
let schemaInitPromise: Promise<void> | null = null;

export function getPostgresPool(): Pool | null {
  const connectionString = getPostgresConnectionString();
  if (!connectionString) return null;

  if (!poolInstance) {
    const isLocalhost =
      connectionString.includes("localhost") || connectionString.includes("127.0.0.1");

    poolInstance = new Pool({
      connectionString,
      ssl: isLocalhost ? false : { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 8000,
    });

    poolInstance.on("error", (err) => {
      console.error("[PostgreSQL Pool Error]:", err.message);
    });
  }

  return poolInstance;
}

/**
 * Execute parameterized query safely with connection pool
 */
export async function queryPostgres<T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  const pool = getPostgresPool();
  if (!pool) {
    throw new Error("PostgreSQL connection string is not configured.");
  }
  await ensurePostgresSchema();
  return pool.query<T>(text, params);
}

/**
 * Automatically initializes database schema, constraints, indexes, and initial seeds
 * if the connected PostgreSQL instance is newly provisioned.
 */
export async function ensurePostgresSchema(): Promise<void> {
  if (schemaInitialized) return;
  if (!isPostgresConfigured()) return;

  if (schemaInitPromise) {
    return schemaInitPromise;
  }

  schemaInitPromise = (async () => {
    const pool = getPostgresPool();
    if (!pool) return;

    let client: PoolClient | null = null;
    try {
      client = await pool.connect();
      await client.query("BEGIN");

      // 1. Schools & Configuration
      await client.query(`
        CREATE TABLE IF NOT EXISTS schools (
            id VARCHAR(64) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            code VARCHAR(64) UNIQUE NOT NULL,
            preferred_language VARCHAR(8) DEFAULT 'en',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS school_settings (
            id VARCHAR(64) PRIMARY KEY,
            school_id VARCHAR(64) REFERENCES schools(id) ON DELETE CASCADE,
            mastery_threshold INTEGER DEFAULT 80,
            developing_threshold INTEGER DEFAULT 60,
            preferred_language VARCHAR(8) DEFAULT 'en',
            enable_ai_assist BOOLEAN DEFAULT TRUE,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS classrooms (
            id VARCHAR(64) PRIMARY KEY,
            school_id VARCHAR(64) REFERENCES schools(id) ON DELETE CASCADE,
            grade INTEGER NOT NULL CHECK (grade BETWEEN 1 AND 5),
            section VARCHAR(8) NOT NULL,
            academic_year VARCHAR(16) NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(school_id, grade, section, academic_year)
        );

        CREATE TABLE IF NOT EXISTS subjects (
            id VARCHAR(64) PRIMARY KEY,
            name VARCHAR(128) NOT NULL,
            name_gujarati VARCHAR(128),
            code VARCHAR(16) NOT NULL,
            language_code VARCHAR(8) DEFAULT 'en'
        );

        CREATE TABLE IF NOT EXISTS concepts (
            id VARCHAR(64) PRIMARY KEY,
            subject_id VARCHAR(64) REFERENCES subjects(id) ON DELETE CASCADE,
            subject_code VARCHAR(16) NOT NULL,
            grade INTEGER NOT NULL,
            name VARCHAR(255) NOT NULL,
            name_gujarati VARCHAR(255),
            description TEXT,
            prerequisites JSONB DEFAULT '[]'::jsonb
        );

        CREATE TABLE IF NOT EXISTS students (
            id VARCHAR(64) PRIMARY KEY,
            student_code VARCHAR(64) UNIQUE NOT NULL,
            display_name VARCHAR(128) NOT NULL,
            classroom_id VARCHAR(64) REFERENCES classrooms(id) ON DELETE RESTRICT,
            grade INTEGER NOT NULL CHECK (grade BETWEEN 1 AND 5),
            section VARCHAR(8) NOT NULL,
            enrollment_status VARCHAR(32) DEFAULT 'active',
            notes TEXT DEFAULT '',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS assessments (
            id VARCHAR(64) PRIMARY KEY,
            classroom_id VARCHAR(64) REFERENCES classrooms(id) ON DELETE CASCADE,
            subject_id VARCHAR(64) REFERENCES subjects(id) ON DELETE RESTRICT,
            subject_code VARCHAR(16) NOT NULL,
            title VARCHAR(255) NOT NULL,
            assessment_date TIMESTAMP WITH TIME ZONE NOT NULL,
            status VARCHAR(32) DEFAULT 'published',
            max_marks NUMERIC(5,2) NOT NULL,
            concept_ids JSONB DEFAULT '[]'::jsonb,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS assessment_results (
            id VARCHAR(64) PRIMARY KEY,
            assessment_id VARCHAR(64) REFERENCES assessments(id) ON DELETE CASCADE,
            student_id VARCHAR(64) REFERENCES students(id) ON DELETE CASCADE,
            concept_id VARCHAR(64) REFERENCES concepts(id) ON DELETE RESTRICT,
            marks_obtained NUMERIC(5,2) NOT NULL,
            maximum_marks NUMERIC(5,2) NOT NULL,
            percentage NUMERIC(5,2) NOT NULL,
            question_count INTEGER,
            correct_count INTEGER,
            notes TEXT,
            recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS learning_gaps (
            id VARCHAR(64) PRIMARY KEY,
            student_id VARCHAR(64) REFERENCES students(id) ON DELETE CASCADE,
            concept_id VARCHAR(64) REFERENCES concepts(id) ON DELETE RESTRICT,
            priority VARCHAR(16) NOT NULL,
            mastery_status VARCHAR(32) NOT NULL,
            reason TEXT NOT NULL,
            status VARCHAR(32) DEFAULT 'Active',
            attempts_count INTEGER DEFAULT 1,
            latest_percentage NUMERIC(5,2) NOT NULL,
            previous_percentage NUMERIC(5,2),
            delta_percentage_points NUMERIC(5,2),
            remedial_plan_id VARCHAR(64),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(student_id, concept_id)
        );

        CREATE TABLE IF NOT EXISTS remedial_plans (
            id VARCHAR(64) PRIMARY KEY,
            student_id VARCHAR(64) REFERENCES students(id) ON DELETE CASCADE,
            concept_id VARCHAR(64) REFERENCES concepts(id) ON DELETE RESTRICT,
            learning_objective TEXT NOT NULL,
            recommendation_reason TEXT NOT NULL,
            status VARCHAR(32) DEFAULT 'Suggested',
            estimated_minutes INTEGER DEFAULT 25,
            difficulty VARCHAR(32) DEFAULT 'Beginner',
            required_materials JSONB DEFAULT '[]'::jsonb,
            steps JSONB NOT NULL DEFAULT '[]'::jsonb,
            practice_questions_summary TEXT,
            reassessment_criteria TEXT,
            teacher_instructions TEXT,
            teacher_notes TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            review_date TIMESTAMP WITH TIME ZONE
        );

        CREATE TABLE IF NOT EXISTS learning_activities (
            id VARCHAR(64) PRIMARY KEY,
            concept_id VARCHAR(64) REFERENCES concepts(id) ON DELETE CASCADE,
            subject_code VARCHAR(16) NOT NULL,
            grade INTEGER NOT NULL,
            title VARCHAR(255) NOT NULL,
            title_gujarati VARCHAR(255),
            activity_type VARCHAR(32) NOT NULL,
            difficulty VARCHAR(16) DEFAULT 'Medium',
            estimated_minutes INTEGER DEFAULT 10,
            questions JSONB NOT NULL DEFAULT '[]'::jsonb,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS activity_attempts (
            id VARCHAR(64) PRIMARY KEY,
            student_id VARCHAR(64) REFERENCES students(id) ON DELETE CASCADE,
            activity_id VARCHAR(64) REFERENCES learning_activities(id) ON DELETE CASCADE,
            score NUMERIC(5,2) NOT NULL,
            maximum_score NUMERIC(5,2) NOT NULL,
            percentage NUMERIC(5,2) NOT NULL,
            answers JSONB DEFAULT '{}'::jsonb,
            incorrect_questions JSONB DEFAULT '[]'::jsonb,
            completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        -- Performance Indexes
        CREATE INDEX IF NOT EXISTS idx_students_classroom ON students(classroom_id);
        CREATE INDEX IF NOT EXISTS idx_students_grade ON students(grade);
        CREATE INDEX IF NOT EXISTS idx_students_code ON students(student_code);
        CREATE INDEX IF NOT EXISTS idx_assessment_results_student ON assessment_results(student_id);
        CREATE INDEX IF NOT EXISTS idx_assessment_results_composite ON assessment_results(student_id, concept_id, recorded_at);
        CREATE INDEX IF NOT EXISTS idx_learning_gaps_student ON learning_gaps(student_id);
        CREATE INDEX IF NOT EXISTS idx_remedial_plans_student ON remedial_plans(student_id);
      `);

      // Seed baseline School if empty
      const schoolCheck = await client.query("SELECT COUNT(*) FROM schools");
      if (parseInt(schoolCheck.rows[0].count, 10) === 0) {
        await client.query(
          `INSERT INTO schools (id, name, code, preferred_language) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`,
          [SEED_SCHOOL.id, SEED_SCHOOL.name, SEED_SCHOOL.code, SEED_SCHOOL.preferredLanguage]
        );
        await client.query(
          `INSERT INTO school_settings (id, school_id, mastery_threshold, developing_threshold, preferred_language, enable_ai_assist)
           VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING`,
          [
            SEED_SETTINGS.id,
            SEED_SETTINGS.schoolId,
            SEED_SETTINGS.masteryThreshold,
            SEED_SETTINGS.developingThreshold,
            SEED_SETTINGS.preferredLanguage,
            SEED_SETTINGS.enableAiAssist,
          ]
        );

        // Seed classrooms
        for (const cls of SEED_CLASSROOMS) {
          await client.query(
            `INSERT INTO classrooms (id, school_id, grade, section, academic_year) VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING`,
            [cls.id, cls.schoolId, cls.grade, cls.section, cls.academicYear]
          );
        }

        // Seed subjects
        for (const sub of SEED_SUBJECTS) {
          await client.query(
            `INSERT INTO subjects (id, name, name_gujarati, code, language_code) VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING`,
            [sub.id, sub.name, sub.nameGujarati, sub.code, sub.languageCode]
          );
        }

        // Seed concepts
        for (const cpt of SEED_CONCEPTS) {
          await client.query(
            `INSERT INTO concepts (id, subject_id, subject_code, grade, name, name_gujarati, description, prerequisites)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT DO NOTHING`,
            [
              cpt.id,
              cpt.subjectId,
              cpt.subjectCode,
              cpt.grade,
              cpt.name,
              cpt.nameGujarati,
              cpt.description,
              JSON.stringify(cpt.prerequisites || []),
            ]
          );
        }

        // Seed initial students
        for (const std of SEED_STUDENTS) {
          await client.query(
            `INSERT INTO students (id, student_code, display_name, classroom_id, grade, section, enrollment_status, notes, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW()) ON CONFLICT (id) DO NOTHING`,
            [
              std.id,
              std.studentCode,
              std.displayName,
              std.classroomId,
              std.grade,
              std.section,
              std.enrollmentStatus,
              std.notes || "",
            ]
          );
        }
      }

      await client.query("COMMIT");
      schemaInitialized = true;
      console.log("[PostgreSQL] Schema, constraints, indexes and baseline seeds verified successfully.");
    } catch (err) {
      if (client) await client.query("ROLLBACK");
      console.error("[PostgreSQL Schema Initialization Error]:", err);
      throw err;
    } finally {
      if (client) client.release();
      schemaInitPromise = null;
    }
  })();

  return schemaInitPromise;
}

/**
 * PostgreSQL Student Repository implementation with full parameterization & ACID transactions
 */
export const postgresStudentDb = {
  async getStudents(filters?: {
    classroomId?: string;
    grade?: number;
    search?: string;
  }): Promise<Student[]> {
    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (filters?.classroomId && filters.classroomId !== "all") {
      conditions.push(`s.classroom_id = $${paramIndex++}`);
      params.push(filters.classroomId);
    }

    if (filters?.grade) {
      conditions.push(`s.grade = $${paramIndex++}`);
      params.push(filters.grade);
    }

    if (filters?.search && filters.search.trim().length > 0) {
      const q = `%${filters.search.trim().toLowerCase()}%`;
      conditions.push(
        `(LOWER(s.display_name) LIKE $${paramIndex} OR LOWER(s.student_code) LIKE $${paramIndex})`
      );
      params.push(q);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const sql = `
      SELECT 
        s.id,
        s.student_code AS "studentCode",
        s.display_name AS "displayName",
        s.classroom_id AS "classroomId",
        s.grade,
        s.section,
        s.enrollment_status AS "enrollmentStatus",
        s.notes,
        s.created_at AS "createdAt",
        s.updated_at AS "updatedAt"
      FROM students s
      ${whereClause}
      ORDER BY s.display_name ASC
    `;

    const res = await queryPostgres(sql, params);
    return res.rows.map(mapStudentRow);
  },

  async getStudentById(id: string): Promise<Student | null> {
    const sql = `
      SELECT 
        s.id,
        s.student_code AS "studentCode",
        s.display_name AS "displayName",
        s.classroom_id AS "classroomId",
        s.grade,
        s.section,
        s.enrollment_status AS "enrollmentStatus",
        s.notes,
        s.created_at AS "createdAt",
        s.updated_at AS "updatedAt"
      FROM students s
      WHERE s.id = $1
      LIMIT 1
    `;
    const res = await queryPostgres(sql, [id]);
    if (res.rows.length === 0) return null;
    return mapStudentRow(res.rows[0]);
  },

  async getStudentByCode(studentCode: string): Promise<Student | null> {
    const sql = `
      SELECT 
        s.id,
        s.student_code AS "studentCode",
        s.display_name AS "displayName",
        s.classroom_id AS "classroomId",
        s.grade,
        s.section,
        s.enrollment_status AS "enrollmentStatus",
        s.notes,
        s.created_at AS "createdAt",
        s.updated_at AS "updatedAt"
      FROM students s
      WHERE LOWER(s.student_code) = LOWER($1)
      LIMIT 1
    `;
    const res = await queryPostgres(sql, [studentCode.trim()]);
    if (res.rows.length === 0) return null;
    return mapStudentRow(res.rows[0]);
  },

  async createStudent(data: Omit<Student, "id" | "createdAt">): Promise<Student> {
    const id = `std-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const studentCode = data.studentCode.trim();
    const displayName = data.displayName.trim();
    const grade = Number(data.grade);
    const section = (data.section || "A").trim().toUpperCase();
    const classroomId = data.classroomId || `cls-${grade}${section.toLowerCase()}`;
    const enrollmentStatus = data.enrollmentStatus || "active";
    const notes = data.notes?.trim() || "";

    // Verify classroom exists before foreign key insert, creating on-demand if needed
    await queryPostgres(
      `INSERT INTO classrooms (id, school_id, grade, section, academic_year)
       VALUES ($1, 'sch-gn-01', $2, $3, '2026-27')
       ON CONFLICT (id) DO NOTHING`,
      [classroomId, grade, section]
    );

    const sql = `
      INSERT INTO students (
        id,
        student_code,
        display_name,
        classroom_id,
        grade,
        section,
        enrollment_status,
        notes,
        created_at,
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      RETURNING 
        id,
        student_code AS "studentCode",
        display_name AS "displayName",
        classroom_id AS "classroomId",
        grade,
        section,
        enrollment_status AS "enrollmentStatus",
        notes,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `;

    const res = await queryPostgres(sql, [
      id,
      studentCode,
      displayName,
      classroomId,
      grade,
      section,
      enrollmentStatus,
      notes,
    ]);

    return mapStudentRow(res.rows[0]);
  },

  async updateStudent(id: string, updates: Partial<Student>): Promise<Student | null> {
    const existing = await this.getStudentById(id);
    if (!existing) return null;

    const setClauses: string[] = [];
    const params: any[] = [id];
    let paramIndex = 2;

    if (updates.displayName !== undefined) {
      setClauses.push(`display_name = $${paramIndex++}`);
      params.push(updates.displayName.trim());
    }
    if (updates.studentCode !== undefined) {
      setClauses.push(`student_code = $${paramIndex++}`);
      params.push(updates.studentCode.trim());
    }
    if (updates.grade !== undefined) {
      setClauses.push(`grade = $${paramIndex++}`);
      params.push(Number(updates.grade));
    }
    if (updates.section !== undefined) {
      setClauses.push(`section = $${paramIndex++}`);
      params.push(updates.section.trim().toUpperCase());
    }
    if (updates.classroomId !== undefined) {
      setClauses.push(`classroom_id = $${paramIndex++}`);
      params.push(updates.classroomId.trim());
    }
    if (updates.enrollmentStatus !== undefined) {
      setClauses.push(`enrollment_status = $${paramIndex++}`);
      params.push(updates.enrollmentStatus);
    }
    if (updates.notes !== undefined) {
      setClauses.push(`notes = $${paramIndex++}`);
      params.push(updates.notes.trim());
    }

    setClauses.push("updated_at = NOW()");

    if (setClauses.length === 1) {
      return existing;
    }

    const sql = `
      UPDATE students
      SET ${setClauses.join(", ")}
      WHERE id = $1
      RETURNING 
        id,
        student_code AS "studentCode",
        display_name AS "displayName",
        classroom_id AS "classroomId",
        grade,
        section,
        enrollment_status AS "enrollmentStatus",
        notes,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `;

    const res = await queryPostgres(sql, params);
    if (res.rows.length === 0) return null;
    return mapStudentRow(res.rows[0]);
  },

  async deleteStudent(id: string): Promise<boolean> {
    const pool = getPostgresPool();
    if (!pool) return false;

    let client: PoolClient | null = null;
    try {
      client = await pool.connect();
      await client.query("BEGIN");

      // Cascading cleanups for student records
      await client.query("DELETE FROM learning_gaps WHERE student_id = $1", [id]);
      await client.query("DELETE FROM remedial_plans WHERE student_id = $1", [id]);
      await client.query("DELETE FROM assessment_results WHERE student_id = $1", [id]);
      await client.query("DELETE FROM activity_attempts WHERE student_id = $1", [id]);
      const res = await client.query("DELETE FROM students WHERE id = $1", [id]);

      await client.query("COMMIT");
      return (res.rowCount || 0) > 0;
    } catch (err) {
      if (client) await client.query("ROLLBACK");
      console.error(`[PostgreSQL deleteStudent error for ${id}]:`, err);
      throw err;
    } finally {
      if (client) client.release();
    }
  },
};

function mapStudentRow(row: any): Student {
  return {
    id: row.id,
    studentCode: row.studentCode,
    displayName: row.displayName,
    classroomId: row.classroomId,
    grade: Number(row.grade),
    section: row.section,
    enrollmentStatus: row.enrollmentStatus || "active",
    notes: row.notes || "",
    createdAt: row.createdAt ? new Date(row.createdAt).toISOString() : new Date().toISOString(),
  };
}
