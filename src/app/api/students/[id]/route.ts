import { NextResponse } from "next/server";
import { db } from "@/lib/db/database";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const student = await db.getStudentByIdAsync(id);

    if (!student) {
      return NextResponse.json({ success: false, error: "Student not found" }, { status: 404 });
    }

    const results = db.getResults(id);
    const gaps = db.getLearningGaps(id);
    const remedialPlans = db.getRemedialPlans(id);
    const attempts = db.getAttempts(id);

    return NextResponse.json({
      success: true,
      student,
      results,
      gaps,
      remedialPlans,
      attempts,
    });
  } catch (error) {
    console.error("API GET /api/students/[id] error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updates = await request.json();

    // Check duplicate roll code if changed
    if (updates.studentCode) {
      const all = await db.getStudentsAsync();
      const duplicate = all.find(
        (s) =>
          s.id !== id &&
          s.studentCode.trim().toLowerCase() === String(updates.studentCode).trim().toLowerCase()
      );
      if (duplicate) {
        return NextResponse.json(
          {
            success: false,
            error: `Student code '${updates.studentCode}' is already in use by ${duplicate.displayName}.`,
          },
          { status: 409 }
        );
      }
    }

    const updated = await db.updateStudentAsync(id, updates);

    if (!updated) {
      return NextResponse.json({ success: false, error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, student: updated });
  } catch (error) {
    console.error("API PUT /api/students/[id] error:", error);
    return NextResponse.json({ success: false, error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await db.deleteStudentAsync(id);

    if (!deleted) {
      return NextResponse.json({ success: false, error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Student removed successfully" });
  } catch (error) {
    console.error("API DELETE /api/students/[id] error:", error);
    return NextResponse.json({ success: false, error: "Delete failed" }, { status: 500 });
  }
}
