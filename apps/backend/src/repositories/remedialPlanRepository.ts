import { db } from "../../../../src/lib/db/database";
import type { RemedialPlan } from "../../../../packages/shared/src/types";

export class RemedialPlanRepository {
  async findAll(studentId?: string, status?: string): Promise<RemedialPlan[]> {
    let plans = db.getRemedialPlans(studentId);
    if (status) {
      plans = plans.filter((p) => p.status.toLowerCase() === status.toLowerCase());
    }
    return plans;
  }

  async findById(id: string): Promise<RemedialPlan | null> {
    return db.getRemedialPlanById(id) || null;
  }

  async createForGap(gapId: string, customNotes?: string): Promise<RemedialPlan | null> {
    return db.createRemedialPlanForGap(gapId, customNotes);
  }

  async saveCustom(plan: RemedialPlan): Promise<RemedialPlan> {
    return db.saveCustomRemedialPlan(plan);
  }

  async update(id: string, updates: Partial<RemedialPlan>): Promise<RemedialPlan | null> {
    return db.updateRemedialPlan(id, updates);
  }
}

export const remedialPlanRepository = new RemedialPlanRepository();
