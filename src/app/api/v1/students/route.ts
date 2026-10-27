import { NextResponse } from "next/server";
import { studentService } from "@backend/services/studentService";
import { validateCreateStudent } from "@shared/schemas/validation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const noCacheHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
  Pragma: "no-cache",
  Expires: "0",
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const classroomId = searchParams.get("classroomId") || undefined;
    const grade = searchParams.get("grade") ? parseInt(searchParams.get("grade")!) : undefined;
    const search = searchParams.get("search") || undefined;

    const students = await studentService.getStudents({ classroomId, grade, search });
    return NextResponse.json(
      { success: true, count: students.length, students },
      { headers: noCacheHeaders }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch students" },
      { status: 500, headers: noCacheHeaders }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validateCreateStudent(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400, headers: noCacheHeaders }
      );
    }

    const newStudent = await studentService.createStudent({
      ...validation.data!,
      enrollmentStatus: validation.data!.enrollmentStatus || "active",
    });
    return NextResponse.json(
      { success: true, student: newStudent },
      { status: 201, headers: noCacheHeaders }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to add student" },
      { status: 500, headers: noCacheHeaders }
    );
  }
}
