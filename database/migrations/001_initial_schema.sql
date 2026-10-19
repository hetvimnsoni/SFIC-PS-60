-- ==============================================================================
-- ShikshaSetu AI - PostgreSQL Schema Migration (001_initial_schema.sql)
-- SFIC Gujarat Hackathon 2026 - Problem Statement PS-60
-- Target Database: PostgreSQL 14+ (Supabase, Neon, AWS RDS, Vercel Postgres)
-- ==============================================================================

-- 1. Schools & Configuration
CREATE TABLE IF NOT EXISTS schools (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(64) UNIQUE NOT NULL,
    preferred_language VARCHAR(8) DEFAULT 'en' CHECK (preferred_language IN ('en', 'gu')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS school_settings (
    id VARCHAR(64) PRIMARY KEY,
    school_id VARCHAR(64) REFERENCES schools(id) ON DELETE CASCADE,
    mastery_threshold INTEGER DEFAULT 80 CHECK (mastery_threshold BETWEEN 50 AND 100),
    developing_threshold INTEGER DEFAULT 60 CHECK (developing_threshold BETWEEN 30 AND 90),
    preferred_language VARCHAR(8) DEFAULT 'en' CHECK (preferred_language IN ('en', 'gu')),
    enable_ai_assist BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Classrooms & Curriculum Structure
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
    code VARCHAR(16) NOT NULL CHECK (code IN ('MATH', 'ENG', 'GUJ', 'EVS')),
    language_code VARCHAR(8) DEFAULT 'en'
);

CREATE TABLE IF NOT EXISTS concepts (
    id VARCHAR(64) PRIMARY KEY,
    subject_id VARCHAR(64) REFERENCES subjects(id) ON DELETE CASCADE,
    subject_code VARCHAR(16) NOT NULL,
    grade INTEGER NOT NULL CHECK (grade BETWEEN 1 AND 5),
    name VARCHAR(255) NOT NULL,
    name_gujarati VARCHAR(255),
    description TEXT,
    prerequisites JSONB DEFAULT '[]'::jsonb
);

-- 3. Students
CREATE TABLE IF NOT EXISTS students (
    id VARCHAR(64) PRIMARY KEY,
    student_code VARCHAR(64) UNIQUE NOT NULL,
    display_name VARCHAR(128) NOT NULL,
    classroom_id VARCHAR(64) REFERENCES classrooms(id) ON DELETE RESTRICT,
    grade INTEGER NOT NULL CHECK (grade BETWEEN 1 AND 5),
    section VARCHAR(8) NOT NULL,
    enrollment_status VARCHAR(32) DEFAULT 'active' CHECK (enrollment_status IN ('active', 'transferred', 'graduated')),
    notes TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Assessments & Results
CREATE TABLE IF NOT EXISTS assessments (
    id VARCHAR(64) PRIMARY KEY,
    classroom_id VARCHAR(64) REFERENCES classrooms(id) ON DELETE CASCADE,
    subject_id VARCHAR(64) REFERENCES subjects(id) ON DELETE RESTRICT,
    subject_code VARCHAR(16) NOT NULL,
    title VARCHAR(255) NOT NULL,
    assessment_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(32) DEFAULT 'published' CHECK (status IN ('draft', 'published')),
    max_marks NUMERIC(5,2) NOT NULL CHECK (max_marks > 0),
    concept_ids JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS assessment_results (
    id VARCHAR(64) PRIMARY KEY,
    assessment_id VARCHAR(64) REFERENCES assessments(id) ON DELETE CASCADE,
    student_id VARCHAR(64) REFERENCES students(id) ON DELETE CASCADE,
    concept_id VARCHAR(64) REFERENCES concepts(id) ON DELETE RESTRICT,
    marks_obtained NUMERIC(5,2) NOT NULL CHECK (marks_obtained >= 0),
    maximum_marks NUMERIC(5,2) NOT NULL CHECK (maximum_marks > 0),
    percentage NUMERIC(5,2) GENERATED ALWAYS AS (ROUND((marks_obtained / maximum_marks) * 100, 2)) STORED,
    question_count INTEGER,
    correct_count INTEGER,
    notes TEXT,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Learning Gaps Tracking
CREATE TABLE IF NOT EXISTS learning_gaps (
    id VARCHAR(64) PRIMARY KEY,
    student_id VARCHAR(64) REFERENCES students(id) ON DELETE CASCADE,
    concept_id VARCHAR(64) REFERENCES concepts(id) ON DELETE RESTRICT,
    priority VARCHAR(16) NOT NULL CHECK (priority IN ('High', 'Medium', 'Low')),
    mastery_status VARCHAR(32) NOT NULL CHECK (mastery_status IN ('Needs Support', 'Developing', 'Mastered')),
    reason TEXT NOT NULL,
    status VARCHAR(32) DEFAULT 'Active' CHECK (status IN ('Active', 'Under Intervention', 'Resolved', 'Overridden')),
    attempts_count INTEGER DEFAULT 1,
    latest_percentage NUMERIC(5,2) NOT NULL,
    previous_percentage NUMERIC(5,2),
    delta_percentage_points NUMERIC(5,2),
    remedial_plan_id VARCHAR(64),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, concept_id)
);

-- 6. Remedial Plans
CREATE TABLE IF NOT EXISTS remedial_plans (
    id VARCHAR(64) PRIMARY KEY,
    student_id VARCHAR(64) REFERENCES students(id) ON DELETE CASCADE,
    concept_id VARCHAR(64) REFERENCES concepts(id) ON DELETE RESTRICT,
    learning_objective TEXT NOT NULL,
    recommendation_reason TEXT NOT NULL,
    status VARCHAR(32) DEFAULT 'Suggested' CHECK (status IN ('Suggested', 'Approved', 'In Progress', 'Completed', 'Needs Review')),
    estimated_minutes INTEGER DEFAULT 25,
    difficulty VARCHAR(32) DEFAULT 'Beginner' CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
    required_materials JSONB DEFAULT '[]'::jsonb,
    steps JSONB NOT NULL DEFAULT '[]'::jsonb,
    practice_questions_summary TEXT,
    reassessment_criteria TEXT,
    teacher_instructions TEXT,
    teacher_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    review_date TIMESTAMP WITH TIME ZONE
);

-- 7. Interactive Activities & Attempts
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
