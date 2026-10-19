import type { SubjectCode } from "./assessment";

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
