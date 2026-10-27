import { NextResponse } from "next/server";
import { studentService } from "@backend/services/studentService";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const noCacheHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
  Pragma: "no-cache",
  Expires: "0",
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const student = await studentService.getStudentById(id);
    if (!student) {
      return NextResponse.json(
        { success: false, error: `Student with id '${id}' not found` },
        { status: 404, headers: noCacheHeaders }
      );
    }
    return NextResponse.json({ success: true, student }, { headers: noCacheHeaders });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500, headers: noCacheHeaders }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await studentService.updateStudent(id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: `Student with id '${id}' not found` },
        { status: 404, headers: noCacheHeaders }
      );
    }
    return NextResponse.json({ success: true, student: updated }, { headers: noCacheHeaders });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update student" },
      { status: 500, headers: noCacheHeaders }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await studentService.deleteStudent(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: `Student with id '${id}' not found` },
        { status: 404, headers: noCacheHeaders }
      );
    }
    return NextResponse.json(
      { success: true, message: `Student '${id}' deleted successfully` },
      { headers: noCacheHeaders }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete student" },
      { status: 500, headers: noCacheHeaders }
    );
  }
}
