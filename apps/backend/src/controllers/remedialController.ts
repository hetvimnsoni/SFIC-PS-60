import type { Request, Response } from "express";
import { remedialService } from "../services/remedialService";

export class RemedialController {
  async getAll(req: Request, res: Response) {
    try {
      const studentId = req.query.studentId as string | undefined;
      const status = req.query.status as string | undefined;

      const plans = await remedialService.getRemedialPlans(studentId, status);
      res.status(200).json({ success: true, count: plans.length, remedialPlans: plans });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || "Failed to fetch remedial plans" });
    }
  }

  async getStudentPlans(req: Request, res: Response) {
    try {
      const studentId = String(req.params.id);
      const plans = await remedialService.getRemedialPlans(studentId);
      res.status(200).json({ success: true, count: plans.length, remedialPlans: plans });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const plan = await remedialService.getRemedialPlanById(id);
      if (!plan) {
        return res.status(404).json({ success: false, error: `Remedial plan '${id}' not found` });
      }
      res.status(200).json({ success: true, remedialPlan: plan });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async generate(req: Request, res: Response) {
    try {
      const {
        studentId,
        studentName,
        conceptId,
        conceptName,
        subjectCode,
        latestPercentage,
        gapReason,
        language,
      } = req.body;

      const result = await remedialService.generatePlan({
        studentId,
        studentName,
        conceptId,
        conceptName,
        subjectCode,
        latestPercentage,
        gapReason,
        language,
      });

      res.status(200).json({ success: true, ...result });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || "Remedial plan generation failed" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const updated = await remedialService.updatePlan(id, req.body);
      if (!updated) {
        return res.status(404).json({ success: false, error: `Remedial plan '${id}' not found` });
      }
      res.status(200).json({ success: true, remedialPlan: updated });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}

export const remedialController = new RemedialController();
