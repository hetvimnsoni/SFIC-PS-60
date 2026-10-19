import type { Request, Response, NextFunction } from "express";
import {
  validateLogin,
  validateCreateStudent,
  validateCreateAssessment,
  validateAiTutorRequest,
} from "../../../../packages/shared/src/schemas/validation";

export function validateLoginBody(req: Request, res: Response, next: NextFunction) {
  const result = validateLogin(req.body);
  if (!result.isValid) {
    return res.status(400).json({ success: false, errors: result.errors });
  }
  req.body = result.data;
  next();
}

export function validateStudentBody(req: Request, res: Response, next: NextFunction) {
  const result = validateCreateStudent(req.body);
  if (!result.isValid) {
    return res.status(400).json({ success: false, errors: result.errors });
  }
  req.body = result.data;
  next();
}

export function validateAssessmentBody(req: Request, res: Response, next: NextFunction) {
  const result = validateCreateAssessment(req.body);
  if (!result.isValid) {
    return res.status(400).json({ success: false, errors: result.errors });
  }
  req.body = result.data;
  next();
}

export function validateAiTutorBody(req: Request, res: Response, next: NextFunction) {
  const result = validateAiTutorRequest(req.body);
  if (!result.isValid) {
    return res.status(400).json({ success: false, errors: result.errors });
  }
  req.body = result.data;
  next();
}
