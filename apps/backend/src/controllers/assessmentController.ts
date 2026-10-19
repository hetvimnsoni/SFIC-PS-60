import type { Request, Response } from "express";
import { assessmentService } from "../services/assessmentService";

export class AssessmentController {
  async getAll(req: Request, res: Response) {
    try {
      const classroomId = req.query.classroomId as string | undefined;
      const subjectId = req.query.subjectId as string | undefined;
      const assessments = await assessmentService.getAssessments(classroomId, subjectId);
      res.status(200).json({ success: true, count: assessments.length, assessments });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || "Failed to fetch assessments" });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const assessment = await assessmentService.getAssessmentById(id);
      if (!assessment) {
        return res.status(404).json({ success: false, error: `Assessment '${id}' not found` });
      }
      res.status(200).json({ success: true, assessment });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { initialResults, ...assessmentData } = req.body;
      const created = await assessmentService.createAssessment(assessmentData, initialResults);
      res.status(201).json({ success: true, assessment: created });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || "Failed to create assessment" });
    }
  }

  async recordResults(req: Request, res: Response) {
    try {
      const { results } = req.body;
      if (!Array.isArray(results) || results.length === 0) {
        return res.status(400).json({ success: false, error: "Array of results is required" });
      }
      const recorded = await assessmentService.recordResults(results);
      res.status(201).json({ success: true, recordedCount: recorded.length, results: recorded });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || "Failed to record results" });
    }
  }

  async getResults(req: Request, res: Response) {
    try {
      const studentId = req.query.studentId as string | undefined;
      const conceptId = req.query.conceptId as string | undefined;
      const results = await assessmentService.getResults(studentId, conceptId);
      res.status(200).json({ success: true, count: results.length, results });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}

export const assessmentController = new AssessmentController();
