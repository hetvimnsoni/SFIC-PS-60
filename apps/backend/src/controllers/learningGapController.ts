import type { Request, Response } from "express";
import { learningGapService } from "../services/learningGapService";

export class LearningGapController {
  async getAll(req: Request, res: Response) {
    try {
      const studentId = req.query.studentId as string | undefined;
      const priority = req.query.priority as string | undefined;
      const status = req.query.status as string | undefined;

      const gaps = await learningGapService.getLearningGaps(studentId, priority, status);
      res.status(200).json({ success: true, count: gaps.length, learningGaps: gaps });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || "Failed to fetch learning gaps" });
    }
  }

  async getStudentGaps(req: Request, res: Response) {
    try {
      const studentId = String(req.params.id);
      const gaps = await learningGapService.getGapsForStudent(studentId);
      res.status(200).json({ success: true, count: gaps.length, learningGaps: gaps });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async analyze(req: Request, res: Response) {
    try {
      const {
        studentId,
        studentName,
        studentClass,
        subject,
        conceptName,
        marksObtained,
        maximumMarks,
        teacherObservations,
        language,
      } = req.body;

      if (marksObtained === undefined || maximumMarks === undefined) {
        return res.status(400).json({ success: false, error: "marksObtained and maximumMarks are required" });
      }

      const result = await learningGapService.analyzeGap({
        studentId,
        studentName,
        studentClass,
        subject,
        conceptName,
        marksObtained,
        maximumMarks,
        teacherObservations,
        language,
      });

      res.status(200).json({ success: true, ...result });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || "Gap analysis failed" });
    }
  }
}

export const learningGapController = new LearningGapController();
