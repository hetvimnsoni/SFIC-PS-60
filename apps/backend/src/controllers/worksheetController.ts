import type { Request, Response } from "express";
import { worksheetService } from "../services/worksheetService";

export class WorksheetController {
  async generate(req: Request, res: Response) {
    try {
      const {
        grade,
        subject,
        concept,
        difficulty,
        questionCount,
        language,
        questionType,
        studentName,
      } = req.body;

      const result = await worksheetService.generateWorksheet({
        grade,
        subject,
        concept,
        difficulty,
        questionCount,
        language,
        questionType,
        studentName,
      });

      res.status(200).json({ success: true, ...result });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || "Failed to generate worksheet" });
    }
  }
}

export const worksheetController = new WorksheetController();
