import { db } from "../../../../src/lib/db/database";
import type { LearningActivity, ActivityAttempt } from "../../../../packages/shared/src/types";

export class ActivityRepository {
  async findAll(conceptId?: string): Promise<LearningActivity[]> {
    return db.getActivities(conceptId);
  }

  async findById(id: string): Promise<LearningActivity | null> {
    return db.getActivityById(id) || null;
  }

  async recordAttempt(data: Omit<ActivityAttempt, "id" | "completedAt">): Promise<ActivityAttempt> {
    return db.recordActivityAttempt(data);
  }

  async getAttempts(studentId?: string): Promise<ActivityAttempt[]> {
    return db.getAttempts(studentId);
  }
}

export const activityRepository = new ActivityRepository();
