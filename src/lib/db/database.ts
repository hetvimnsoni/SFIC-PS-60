import fs from "fs";
import path from "path";
import {
  SEED_SCHOOL,
  SEED_SETTINGS,
  SEED_CLASSROOMS,
  SEED_SUBJECTS,
  SEED_CONCEPTS,
  SEED_STUDENTS,
  SEED_ASSESSMENTS,
  SEED_RESULTS,
  SEED_LEARNING_GAPS,
  SEED_REMEDIAL_PLANS,
  SEED_ACTIVITIES,
} from "./seedData";
import { detectLearningGap } from "../engine/gapDetection";
import { generateRemedialPlan } from "../engine/remedialEngine";
import { calculatePercentage } from "../engine/calculations";
import type {
  School,
  SchoolSettings,
  Classroom,
  Subject,
  Concept,
  Student,
  Assessment,
  AssessmentResult,
  LearningGap,
  RemedialPlan,
  LearningActivity,
  ActivityAttempt,
} from "../types";

interface DataStore {
  school: School;
  settings: SchoolSettings;
  classrooms: Classroom[];
  subjects: Subject[];
  concepts: Concept[];
  students: Student[];
  assessments: Assessment[];
  results: AssessmentResult[];
  learningGaps: LearningGap[];
  remedialPlans: RemedialPlan[];
  activities: LearningActivity[];
  attempts: ActivityAttempt[];
}

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_FILE = path.join(DATA_DIR, "shikshasetu_store.json");

function getInitialStore(): DataStore {
  return {
    school: { ...SEED_SCHOOL },
    settings: { ...SEED_SETTINGS },
    classrooms: [...SEED_CLASSROOMS],
    subjects: [...SEED_SUBJECTS],
    concepts: [...SEED_CONCEPTS],
    students: [...SEED_STUDENTS],
    assessments: [...SEED_ASSESSMENTS],
    results: [...SEED_RESULTS],
    learningGaps: [...SEED_LEARNING_GAPS],
    remedialPlans: [...SEED_REMEDIAL_PLANS],
    activities: [...SEED_ACTIVITIES],
    attempts: [],
  };
}

let memoryStore: DataStore | null = null;

function ensureDataDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadStore(): DataStore {
  if (memoryStore) return memoryStore;

  ensureDataDirectory();

  if (fs.existsSync(STORE_FILE)) {
    try {
      const content = fs.readFileSync(STORE_FILE, "utf-8");
      memoryStore = JSON.parse(content) as DataStore;
      return memoryStore;
    } catch (e) {
      console.error("Failed to load store from disk, initializing fresh seed:", e);
    }
  }

  memoryStore = getInitialStore();
  saveStore(memoryStore);
  return memoryStore;
}

function saveStore(store: DataStore) {
  ensureDataDirectory();
  const json = JSON.stringify(store, null, 2);
  const tempFile = `${STORE_FILE}.tmp.${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  try {
    fs.writeFileSync(tempFile, json, "utf-8");
    try {
      fs.copyFileSync(tempFile, STORE_FILE);
      try {
        fs.unlinkSync(tempFile);
      } catch {}
    } catch {
      // Fallback direct write
      fs.writeFileSync(STORE_FILE, json, "utf-8");
      try {
        if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
      } catch {}
    }
  } catch {
    fs.writeFileSync(STORE_FILE, json, "utf-8");
  }
  memoryStore = store;
}

export const db = {
  getSchool(): School {
    return loadStore().school;
  },

  getSettings(): SchoolSettings {
    return loadStore().settings;
  },

  updateSettings(updates: Partial<SchoolSettings>): SchoolSettings {
    const store = loadStore();
    store.settings = { ...store.settings, ...updates };
    saveStore(store);
    return store.settings;
  },

  getClassrooms(): Classroom[] {
    return loadStore().classrooms;
  },

  getSubjects(): Subject[] {
    return loadStore().subjects;
  },

  getConcepts(subjectId?: string): Concept[] {
    const store = loadStore();
    if (!subjectId) return store.concepts;
    return store.concepts.filter((c) => c.subjectId === subjectId);
  },

  getConceptById(id: string): Concept | undefined {
    return loadStore().concepts.find((c) => c.id === id);
  },

  getStudents(classroomId?: string): Student[] {
    const store = loadStore();
    if (!classroomId) return store.students;
    return store.students.filter((s) => s.classroomId === classroomId);
  },

  getStudentById(id: string): Student | undefined {
    return loadStore().students.find((s) => s.id === id);
  },

  addStudent(studentData: Omit<Student, "id" | "createdAt">): Student {
    const store = loadStore();
    const newStudent: Student = {
      ...studentData,
      id: `std-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    store.students.push(newStudent);
    saveStore(store);
    return newStudent;
  },

  updateStudent(id: string, updates: Partial<Student>): Student | null {
    const store = loadStore();
    const index = store.students.findIndex((s) => s.id === id);
    if (index === -1) return null;
    store.students[index] = { ...store.students[index], ...updates };
    saveStore(store);
    return store.students[index];
  },

  deleteStudent(id: string): boolean {
    const store = loadStore();
    const beforeLen = store.students.length;
    store.students = store.students.filter((s) => s.id !== id);
    if (store.students.length !== beforeLen) {
      saveStore(store);
      return true;
    }
    return false;
  },

  getAssessments(classroomId?: string): Assessment[] {
    const store = loadStore();
    if (!classroomId) return store.assessments;
    return store.assessments.filter((a) => a.classroomId === classroomId);
  },

  getAssessmentById(id: string): Assessment | undefined {
    return loadStore().assessments.find((a) => a.id === id);
  },

  createAssessment(
    assessmentData: Omit<Assessment, "id" | "createdAt">,
    initialResults?: Omit<AssessmentResult, "id" | "assessmentId">[]
  ): Assessment {
    const store = loadStore();
    const assessmentId = `asm-${Date.now()}`;
    const newAssessment: Assessment = {
      ...assessmentData,
      id: assessmentId,
      createdAt: new Date().toISOString(),
    };
    store.assessments.push(newAssessment);

    if (initialResults && initialResults.length > 0) {
      for (const res of initialResults) {
        const pct = calculatePercentage(res.marksObtained, res.maximumMarks);
        const resultRecord: AssessmentResult = {
          ...res,
          id: `res-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          assessmentId,
          percentage: pct,
          recordedAt: res.recordedAt || new Date().toISOString(),
        };
        store.results.push(resultRecord);
      }
    }

    saveStore(store);

    // Recalculate learning gaps for affected students
    if (initialResults) {
      const studentIds = Array.from(new Set(initialResults.map((r) => r.studentId)));
      for (const sId of studentIds) {
        this.recalculateLearningGapsForStudent(sId);
      }
    }

    return newAssessment;
  },

  getResults(studentId?: string, conceptId?: string): AssessmentResult[] {
    const store = loadStore();
    let res = store.results;
    if (studentId) res = res.filter((r) => r.studentId === studentId);
    if (conceptId) res = res.filter((r) => r.conceptId === conceptId);
    return res;
  },

  recordResults(resultsData: Omit<AssessmentResult, "id">[]): AssessmentResult[] {
    const store = loadStore();
    const created: AssessmentResult[] = [];
    const studentIds = new Set<string>();

    for (const r of resultsData) {
      const pct = calculatePercentage(r.marksObtained, r.maximumMarks);
      const newResult: AssessmentResult = {
        ...r,
        id: `res-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        percentage: pct,
        recordedAt: r.recordedAt || new Date().toISOString(),
      };
      store.results.push(newResult);
      created.push(newResult);
      studentIds.add(r.studentId);
    }

    saveStore(store);

    // Automatically recalculate gaps for all updated students
    for (const sId of studentIds) {
      this.recalculateLearningGapsForStudent(sId);
    }

    return created;
  },

  getLearningGaps(studentId?: string): LearningGap[] {
    const store = loadStore();
    if (!studentId) return store.learningGaps;
    return store.learningGaps.filter((g) => g.studentId === studentId);
  },

  recalculateLearningGapsForStudent(studentId: string): LearningGap[] {
    const store = loadStore();
    const student = store.students.find((s) => s.id === studentId);
    if (!student) return [];

    const thresholds = {
      mastery: store.settings.masteryThreshold,
      developing: store.settings.developingThreshold,
    };

    // Find all unique concepts evaluated for this student
    const studentResults = store.results.filter((r) => r.studentId === studentId);
    const conceptIds = Array.from(new Set(studentResults.map((r) => r.conceptId)));

    for (const conceptId of conceptIds) {
      const concept = store.concepts.find((c) => c.id === conceptId);
      if (!concept) continue;

      const history = studentResults
        .filter((r) => r.conceptId === conceptId)
        .sort((a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime())
        .map((r) => ({
          marksObtained: r.marksObtained,
          maximumMarks: r.maximumMarks,
          recordedAt: r.recordedAt,
        }));

      const detection = detectLearningGap(conceptId, concept.name, history, thresholds);

      // Find existing gap record if any
      const existingGapIndex = store.learningGaps.findIndex(
        (g) => g.studentId === studentId && g.conceptId === conceptId
      );

      if (existingGapIndex !== -1) {
        const existing = store.learningGaps[existingGapIndex];
        store.learningGaps[existingGapIndex] = {
          ...existing,
          priority: detection.priority,
          masteryStatus: detection.masteryStatus,
          reason: detection.reason,
          status: detection.masteryStatus === "Mastered" ? "Resolved" : existing.status,
          attemptsCount: detection.attemptsCount,
          latestPercentage: detection.latestPercentage,
          previousPercentage: detection.previousPercentage,
          deltaPercentagePoints: detection.deltaPercentagePoints,
          updatedAt: new Date().toISOString(),
        };

        if (detection.masteryStatus === "Mastered") {
          const relatedPlan = store.remedialPlans.find(
            (p) => p.studentId === studentId && p.conceptId === conceptId
          );
          if (relatedPlan) {
            relatedPlan.status = "Completed";
          }
        }
      } else if (detection.requiresRemediation) {
        // Create new gap
        const newGap: LearningGap = {
          id: `gap-${studentId}-${conceptId}`,
          studentId,
          studentName: student.displayName,
          conceptId,
          conceptName: concept.name,
          subjectCode: concept.subjectCode,
          grade: student.grade,
          priority: detection.priority,
          masteryStatus: detection.masteryStatus,
          reason: detection.reason,
          status: "Active",
          attemptsCount: detection.attemptsCount,
          latestPercentage: detection.latestPercentage,
          previousPercentage: detection.previousPercentage,
          deltaPercentagePoints: detection.deltaPercentagePoints,
          updatedAt: new Date().toISOString(),
        };
        store.learningGaps.push(newGap);
      }
    }

    saveStore(store);
    return store.learningGaps.filter((g) => g.studentId === studentId);
  },

  getRemedialPlans(studentId?: string): RemedialPlan[] {
    const store = loadStore();
    if (!studentId) return store.remedialPlans;
    return store.remedialPlans.filter((p) => p.studentId === studentId);
  },

  getRemedialPlanById(id: string): RemedialPlan | undefined {
    return loadStore().remedialPlans.find((p) => p.id === id);
  },

  createRemedialPlanForGap(gapId: string, customNotes?: string): RemedialPlan | null {
    const store = loadStore();
    const gap = store.learningGaps.find((g) => g.id === gapId);
    if (!gap) return null;

    const student = store.students.find((s) => s.id === gap.studentId);
    const concept = store.concepts.find((c) => c.id === gap.conceptId);
    if (!student || !concept) return null;

    const studentResults = store.results
      .filter((r) => r.studentId === gap.studentId && r.conceptId === gap.conceptId)
      .sort((a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime());

    const detection = detectLearningGap(
      gap.conceptId,
      concept.name,
      studentResults.map((r) => ({
        marksObtained: r.marksObtained,
        maximumMarks: r.maximumMarks,
        recordedAt: r.recordedAt,
      })),
      {
        mastery: store.settings.masteryThreshold,
        developing: store.settings.developingThreshold,
      }
    );

    const plan = generateRemedialPlan(
      student.id,
      student.displayName,
      concept.id,
      concept.name,
      concept.subjectCode,
      detection,
      customNotes
    );

    const existingPlanIndex = store.remedialPlans.findIndex(
      (p) => p.studentId === student.id && p.conceptId === concept.id
    );
    if (existingPlanIndex !== -1) {
      store.remedialPlans[existingPlanIndex] = plan;
    } else {
      store.remedialPlans.push(plan);
    }

    // Link plan to gap
    gap.remedialPlanId = plan.id;
    gap.status = "Under Intervention";
    gap.updatedAt = new Date().toISOString();

    saveStore(store);
    return plan;
  },

  saveCustomRemedialPlan(plan: RemedialPlan): RemedialPlan {
    const store = loadStore();
    const existingIndex = store.remedialPlans.findIndex((p) => p.id === plan.id);
    if (existingIndex !== -1) {
      store.remedialPlans[existingIndex] = plan;
    } else {
      store.remedialPlans.unshift(plan);
    }

    // Link to gap if exists
    const matchingGap = store.learningGaps.find(
      (g) => g.studentId === plan.studentId && g.conceptId === plan.conceptId
    );
    if (matchingGap) {
      matchingGap.remedialPlanId = plan.id;
      if (matchingGap.status === "Active") {
        matchingGap.status = "Under Intervention";
      }
      matchingGap.updatedAt = new Date().toISOString();
    }

    saveStore(store);
    return plan;
  },

  updateRemedialPlan(id: string, updates: Partial<RemedialPlan>): RemedialPlan | null {
    const store = loadStore();
    const index = store.remedialPlans.findIndex((p) => p.id === id);
    if (index === -1) return null;

    store.remedialPlans[index] = { ...store.remedialPlans[index], ...updates };
    saveStore(store);
    return store.remedialPlans[index];
  },

  getActivities(conceptId?: string): LearningActivity[] {
    const store = loadStore();
    if (!conceptId) return store.activities;
    return store.activities.filter((a) => a.conceptId === conceptId);
  },

  getActivityById(id: string): LearningActivity | undefined {
    return loadStore().activities.find((a) => a.id === id);
  },

  recordActivityAttempt(attemptData: Omit<ActivityAttempt, "id" | "completedAt">): ActivityAttempt {
    const store = loadStore();
    const pct = calculatePercentage(attemptData.score, attemptData.maximumScore);
    const attempt: ActivityAttempt = {
      ...attemptData,
      id: `att-${Date.now()}`,
      percentage: pct,
      completedAt: new Date().toISOString(),
    };
    store.attempts.push(attempt);

    // If associated with a remedial plan, update plan status to 'In Progress' or 'Completed'
    const activity = store.activities.find((a) => a.id === attempt.activityId);
    if (activity) {
      const relatedPlan = store.remedialPlans.find(
        (p) =>
          p.studentId === attempt.studentId &&
          p.conceptId === activity.conceptId &&
          (p.status === "Approved" || p.status === "In Progress" || p.status === "Suggested")
      );
      if (relatedPlan) {
        relatedPlan.status = pct >= 80 ? "Completed" : "In Progress";
      }
    }

    saveStore(store);
    return attempt;
  },

  getAttempts(studentId?: string): ActivityAttempt[] {
    const store = loadStore();
    if (!studentId) return store.attempts;
    return store.attempts.filter((a) => a.studentId === studentId);
  },

  resetToDemoData(): void {
    const fresh = getInitialStore();
    saveStore(fresh);
  },
};
