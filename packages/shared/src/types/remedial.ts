import type { SubjectCode } from "./assessment";

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

export interface InterventionEvent {
  id: string;
  studentId: string;
  conceptId: string;
  remedialPlanId?: string;
  eventType: "plan_created" | "plan_approved" | "activity_completed" | "reassessment_conducted" | "teacher_note";
  notes: string;
  createdAt: string;
}
