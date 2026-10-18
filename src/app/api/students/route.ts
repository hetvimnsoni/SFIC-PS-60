import { NextResponse } from "next/server";
import { db } from "@/lib/db/database";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const classroomId = searchParams.get("classroomId") || undefined;
    const grade = searchParams.get("grade") ? parseInt(searchParams.get("grade")!) : undefined;
    const search = searchParams.get("search")?.toLowerCase();

    let students = db.getStudents(classroomId);

    if (grade) {
      students = students.filter((s) => s.grade === grade);
    }

    if (search) {
      students = students.filter(
        (s) =>
          s.displayName.toLowerCase().includes(search) ||
          s.studentCode.toLowerCase().includes(search)
      );
    }

    return NextResponse.json({ success: true, students });
  } catch (error) {
    console.error("API /api/students error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch students" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentCode, displayName, classroomId, grade, section, enrollmentStatus, notes } = body;

    if (!studentCode || !displayName || !classroomId || !grade || !section) {
      return NextResponse.json(
        { success: false, error: "Missing required student fields" },
        { status: 400 }
      );
    }

    const newStudent = db.addStudent({
      studentCode,
      displayName,
      classroomId,
      grade: Number(grade),
      section,
      enrollmentStatus: enrollmentStatus || "active",
      notes: notes || "",
    });

    return NextResponse.json({ success: true, student: newStudent });
  } catch (error) {
    console.error("API POST /api/students error:", error);
    return NextResponse.json({ success: false, error: "Failed to add student" }, { status: 500 });
  }
}
