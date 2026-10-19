import type { Request, Response } from "express";
import { reportService } from "../services/reportService";

export class ReportController {
  async getOverview(req: Request, res: Response) {
    try {
      const grade = req.query.grade ? Number(req.query.grade) : undefined;
      const report = await reportService.getOverviewReport(grade);
      res.status(200).json({ success: true, report });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || "Failed to generate report" });
    }
  }
}

export const reportController = new ReportController();
