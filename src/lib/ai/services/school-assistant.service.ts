import { aiRouter } from "../router";
import { db } from "@/lib/db/database";
import type { AssistantContext, AssistantResponse, AiProviderName } from "../types";

export interface SchoolAssistantQueryOptions {
  query: string;
  userRole?: string;
  studentId?: string;
  studentGrade?: number;
  language?: string;
  provider?: AiProviderName;
}

export class SchoolAssistantService {
  /**
   * Safe, school-grounded retrieval and assistant interaction.
   * Restricts private student data by user authorization and grade.
   */
  async askQuestion(options: SchoolAssistantQueryOptions): Promise<AssistantResponse & {
    success: boolean;
    authorizedStudentInfo?: any;
    error?: string;
  }> {
    const {
      query,
      userRole = "teacher",
      studentId,
      studentGrade,
      language = "en",
      provider,
    } = options;

    if (!query || !query.trim()) {
      return {
        answer: "Please provide a valid question.",
        citedNoticeIds: [],
        confidence: "low",
        provider: provider || "gemini",
        modelUsed: "none",
        latencyMs: 0,
        success: false,
        error: "Query is required.",
      };
    }

    // Retrieve notices according to student grade authorization
    const allNotices = db.getNotices();
    const authorizedNotices = allNotices.filter((notice) => {
      if (!notice.targetClassGrade) return true; // School-wide notice
      if (studentGrade && notice.targetClassGrade === studentGrade) return true;
      if (userRole === "teacher" || userRole === "admin") return true; // Staff can view all grades
      return false;
    });

    // Check if query is about authorized learning gaps or students
    let authorizedContextText = "";
    if (userRole === "teacher" || userRole === "admin") {
      const gaps = db.getLearningGaps();
      const students = db.getStudents();
      authorizedContextText = `Staff Telemetry: ${students.length} enrolled students, ${gaps.length} learning gaps.`;
    } else if (studentId) {
      const student = db.getStudentById(studentId);
      if (student) {
        const studentGaps = db.getLearningGaps(studentId);
        authorizedContextText = `Student: ${student.displayName} (Grade ${student.grade}). Active gaps: ${studentGaps.length}.`;
      }
    }

    const context: AssistantContext = {
      notices: authorizedNotices,
      studentGrade,
      language,
    };

    try {
      const result = await aiRouter.askNoticeAssistant({
        query: `${query}\n${authorizedContextText ? `[Context: ${authorizedContextText}]` : ""}`,
        context,
        provider,
      });

      return {
        ...result,
        success: true,
      };
    } catch (err: any) {
      return {
        answer: "I am unable to answer this question at this time. Please check your school notice board or contact the teacher directly.",
        citedNoticeIds: [],
        confidence: "low",
        provider: provider || "offline_fallback",
        modelUsed: "none",
        latencyMs: 0,
        success: false,
        error: err.message || "Failed to process school assistant query",
      };
    }
  }
}

export const schoolAssistantService = new SchoolAssistantService();
