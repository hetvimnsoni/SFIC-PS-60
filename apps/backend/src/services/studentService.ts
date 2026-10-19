import { studentRepository } from "../repositories/studentRepository";
import type { Student } from "../../../../packages/shared/src/types";

export class StudentService {
  async getStudents(filters?: { classroomId?: string; grade?: number; search?: string }): Promise<Student[]> {
    return studentRepository.findAll(filters?.classroomId, filters?.grade, filters?.search);
  }

  async getStudentById(id: string): Promise<Student | null> {
    return studentRepository.findById(id);
  }

  async createStudent(data: Omit<Student, "id" | "createdAt">): Promise<Student> {
    return studentRepository.create(data);
  }

  async updateStudent(id: string, updates: Partial<Student>): Promise<Student | null> {
    return studentRepository.update(id, updates);
  }

  async deleteStudent(id: string): Promise<boolean> {
    return studentRepository.delete(id);
  }
}

export const studentService = new StudentService();
