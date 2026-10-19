import type { Request, Response } from "express";
import { studentService } from "../services/studentService";

export class StudentController {
  async getAll(req: Request, res: Response) {
    try {
      const classroomId = req.query.classroomId as string | undefined;
      const grade = req.query.grade ? Number(req.query.grade) : undefined;
      const search = req.query.search as string | undefined;

      const students = await studentService.getStudents({ classroomId, grade, search });
      res.status(200).json({ success: true, count: students.length, students });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || "Failed to fetch students" });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const student = await studentService.getStudentById(id);
      if (!student) {
        return res.status(404).json({ success: false, error: `Student with id '${id}' not found` });
      }
      res.status(200).json({ success: true, student });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const newStudent = await studentService.createStudent(req.body);
      res.status(201).json({ success: true, student: newStudent });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || "Failed to create student" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const updated = await studentService.updateStudent(id, req.body);
      if (!updated) {
        return res.status(404).json({ success: false, error: `Student with id '${id}' not found` });
      }
      res.status(200).json({ success: true, student: updated });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || "Failed to update student" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const deleted = await studentService.deleteStudent(id);
      if (!deleted) {
        return res.status(404).json({ success: false, error: `Student with id '${id}' not found` });
      }
      res.status(200).json({ success: true, message: `Student '${id}' deleted successfully` });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || "Failed to delete student" });
    }
  }
}

export const studentController = new StudentController();
