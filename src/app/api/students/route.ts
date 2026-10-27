import { NextResponse } from "next/server";
import { db } from "@/lib/db/database";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const classroomId = searchParams.get("classroomId") || undefined;
    const grade = searchParams.get("grade") ? parseInt(searchParams.get("grade")!) : undefined;
    const search = searchParams.get("search") || undefined;

    const students = await db.getStudentsAsync({ classroomId, grade, search });
    return NextResponse.json({ success: true, count: students.length, students });
  } catch (error) {
    console.error("API /api/students error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch students" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentCode, displayName, classroomId, grade, section, enrollmentStatus, notes } = body;

    if (!studentCode?.trim() || !displayName?.trim() || !grade) {
      return NextResponse.json(
        { success: false, error: "Missing required student fields (name, student code, grade)" },
        { status: 400 }
      );
    }

    const trimmedCode = studentCode.trim();
    const trimmedName = displayName.trim();
    const parsedGrade = Number(grade);
    const sec = (section || "A").trim().toUpperCase();
    const clsId = classroomId || `cls-${parsedGrade}${sec.toLowerCase()}`;

    // Duplicate check on roll / student code
    const existingStudents = await db.getStudentsAsync();
    const isDuplicate = existingStudents.some(
      (s) => s.studentCode.trim().toLowerCase() === trimmedCode.toLowerCase()
    );
    if (isDuplicate) {
      return NextResponse.json(
        { success: false, error: `Student with code '${trimmedCode}' already exists.` },
        { status: 409 }
      );
    }

    const newStudent = await db.addStudentAsync({
      studentCode: trimmedCode,
      displayName: trimmedName,
      classroomId: clsId,
      grade: parsedGrade,
      section: sec,
      enrollmentStatus: enrollmentStatus || "active",
      notes: notes?.trim() || "",
    });

    return NextResponse.json({ success: true, student: newStudent }, { status: 200 });
  } catch (error) {
    console.error("API POST /api/students error:", error);
    return NextResponse.json({ success: false, error: "Failed to add student" }, { status: 500 });
  }
}
