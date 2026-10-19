import { db } from "../../../../src/lib/db/database";
import type { LearningGap } from "../../../../packages/shared/src/types";

export class LearningGapRepository {
  async findAll(studentId?: string, priority?: string, status?: string): Promise<LearningGap[]> {
    let gaps = db.getLearningGaps(studentId);
    if (priority) {
      gaps = gaps.filter((g) => g.priority.toLowerCase() === priority.toLowerCase());
    }
    if (status) {
      gaps = gaps.filter((g) => g.status.toLowerCase() === status.toLowerCase());
    }
    return gaps;
  }

  async findByStudentId(studentId: string): Promise<LearningGap[]> {
    return db.getLearningGaps(studentId);
  }

  async recalculateForStudent(studentId: string): Promise<LearningGap[]> {
    return db.recalculateLearningGapsForStudent(studentId);
  }
}

export const learningGapRepository = new LearningGapRepository();
