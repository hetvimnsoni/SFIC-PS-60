export type UserRole = "teacher" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  schoolId: string;
}

export interface School {
  id: string;
  name: string;
  code: string;
  preferredLanguage: "en" | "gu";
}

export interface Classroom {
  id: string;
  schoolId: string;
  grade: number; // 1 to 5
  section: string; // "A", "B", "C"
  academicYear: string;
}

export interface Student {
  id: string;
  studentCode: string;
  displayName: string;
  classroomId: string;
  grade: number;
  section: string;
  enrollmentStatus: "active" | "transferred" | "graduated";
  notes?: string;
  createdAt: string;
}

export type SubjectCode = "MATH" | "ENG" | "GUJ" | "EVS";

export interface Subject {
  id: string;
  name: string;
  nameGujarati?: string;
  code: SubjectCode;
  languageCode: "en" | "gu";
}

export interface Concept {
  id: string;
  subjectId: string;
  subjectCode: SubjectCode;
  grade: number;
  name: string;
  nameGujarati?: string;
  description: string;
  prerequisites?: string[];
}

export interface Assessment {
  id: string;
  classroomId: string;
  subjectId: string;
  subjectCode: SubjectCode;
  title: string;
  assessmentDate: string;
  status: "draft" | "published";
  maxMarks: number;
  conceptIds: string[];
  createdAt: string;
}

export interface AssessmentResult {
  id: string;
  assessmentId: string;
  studentId: string;
  conceptId: string;
  marksObtained: number;
  maximumMarks: number;
  percentage: number;
  questionCount?: number;
  correctCount?: number;
  notes?: string;
  recordedAt: string;
}

export type MasteryStatus = "Needs Support" | "Developing" | "Mastered";
export type GapPriority = "High" | "Medium" | "Low";
export type GapStatus = "Active" | "Under Intervention" | "Resolved" | "Overridden";

export interface LearningGap {
  id: string;
  studentId: string;
  studentName?: string;
  conceptId: string;
  conceptName?: string;
  subjectCode?: SubjectCode;
  grade?: number;
  priority: GapPriority;
  masteryStatus: MasteryStatus;
  reason: string;
  status: GapStatus;
  attemptsCount: number;
  latestPercentage: number;
  previousPercentage?: number;
  deltaPercentagePoints?: number;
  updatedAt: string;
  remedialPlanId?: string;
}

export type PlanStatus = "Suggested" | "Approved" | "In Progress" | "Completed" | "Needs Review";

export interface RemedialStep {
  stepNumber: number;
  title: string;
  description: string;
  durationMinutes: number;
  activityType?: string;
}

export interface RemedialPlan {
  id: string;
  studentId: string;
  studentName?: string;
  conceptId: string;
  conceptName?: string;
  subjectCode?: SubjectCode;
  learningObjective: string;
  recommendationReason: string;
  status: PlanStatus;
  estimatedMinutes: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  requiredMaterials: string[];
  steps: RemedialStep[];
  practiceQuestionsSummary?: string;
  reassessmentCriteria: string;
  teacherInstructions: string;
  teacherNotes?: string;
  createdAt: string;
  reviewDate?: string;
}

export type ActivityType =
  | "mcq"
  | "true_false"
  | "fill_in_the_blank"
  | "matching"
  | "numerical"
  | "word_problem";

export interface ActivityQuestion {
  id: string;
  questionText: string;
  questionTextGujarati?: string;
  type: ActivityType;
  options?: string[]; // for mcq
  correctAnswer: string | number | boolean;
  explanation: string;
  hint?: string;
  imageUrl?: string;
}

export interface LearningActivity {
  id: string;
  conceptId: string;
  conceptName?: string;
  subjectCode: SubjectCode;
  grade: number;
  title: string;
  titleGujarati?: string;
  activityType: ActivityType;
  difficulty: "Easy" | "Medium" | "Hard";
  estimatedMinutes: number;
  questions: ActivityQuestion[];
  createdAt: string;
}

export interface ActivityAssignment {
  id: string;
  activityId: string;
  studentId: string;
  remedialPlanId?: string;
  status: "Assigned" | "In Progress" | "Completed";
  assignedAt: string;
  completedAt?: string;
  score?: number;
  maxScore?: number;
}

export interface ActivityAttempt {
  id: string;
  assignmentId?: string;
  studentId: string;
  activityId: string;
  score: number;
  maximumScore: number;
  percentage: number;
  answers: Record<string, string | number | boolean>;
  incorrectQuestions: string[];
  completedAt: string;
}

export interface InterventionEvent {
  id: string;
  studentId: string;
  conceptId: string;
  remedialPlanId?: string;
  eventType: "plan_created" | "plan_approved" | "activity_completed" | "reassessment_conducted" | "teacher_note";
  notes: string;
  createdAt: string;
}

export interface SchoolSettings {
  id: string;
  schoolId: string;
  masteryThreshold: number; // default: 80%
  developingThreshold: number; // default: 60%
  preferredLanguage: "en" | "gu";
  enableAiAssist: boolean;
}
