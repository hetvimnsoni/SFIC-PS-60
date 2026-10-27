import { db } from "../../../../src/lib/db/database";
import type { Student, Classroom } from "../../../../packages/shared/src/types";

export class StudentRepository {
  async findAll(classroomId?: string, grade?: number, search?: string): Promise<Student[]> {
    return db.getStudentsAsync({ classroomId, grade, search });
  }

  async findById(id: string): Promise<Student | null> {
    const student = await db.getStudentByIdAsync(id);
    return student || null;
  }

  async create(data: Omit<Student, "id" | "createdAt">): Promise<Student> {
    return db.addStudentAsync(data);
  }

  async update(id: string, updates: Partial<Student>): Promise<Student | null> {
    return db.updateStudentAsync(id, updates);
  }

  async delete(id: string): Promise<boolean> {
    return db.deleteStudentAsync(id);
  }

  async getClassrooms(): Promise<Classroom[]> {
    return db.getClassrooms();
  }
}

export const studentRepository = new StudentRepository();
