import type { SubjectCode } from "./assessment";

export interface WorksheetQuestion {
  questionNumber: number;
  question: string;
  marks: number;
  type?: string;
  options?: string[];
  answerKey: string;
  stepExplanation: string;
}

export interface WorksheetData {
  title: string;
  subject: string;
  subjectCode?: SubjectCode;
  grade: number;
  concept: string;
  studentName?: string;
  instructions: string;
  totalMarks: number;
  questions: WorksheetQuestion[];
  teacherGuidelines?: string;
}
