import { assessmentRepository } from "../repositories/assessmentRepository";
import type { Assessment, AssessmentResult } from "../../../../packages/shared/src/types";

export class AssessmentService {
  async getAssessments(classroomId?: string, subjectId?: string): Promise<Assessment[]> {
    return assessmentRepository.findAll(classroomId, subjectId);
  }

  async getAssessmentById(id: string): Promise<Assessment | null> {
    return assessmentRepository.findById(id);
  }

  async createAssessment(
    data: Omit<Assessment, "id" | "createdAt">,
    initialResults?: Omit<AssessmentResult, "id" | "assessmentId">[]
  ): Promise<Assessment> {
    return assessmentRepository.create(data, initialResults);
  }

  async recordResults(results: Omit<AssessmentResult, "id">[]): Promise<AssessmentResult[]> {
    return assessmentRepository.recordResults(results);
  }

  async getResults(studentId?: string, conceptId?: string): Promise<AssessmentResult[]> {
    return assessmentRepository.getResults(studentId, conceptId);
  }
}

export const assessmentService = new AssessmentService();
