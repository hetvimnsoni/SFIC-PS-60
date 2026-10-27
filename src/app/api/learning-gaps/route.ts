import { NextResponse } from "next/server";
import { db } from "@/lib/db/database";

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
    const studentId = searchParams.get("studentId") || undefined;
    const priority = searchParams.get("priority") || undefined;
    const status = searchParams.get("status") || undefined;

    let gaps = db.getLearningGaps(studentId);

    if (priority) {
      gaps = gaps.filter((g) => g.priority === priority);
    }

    if (status) {
      gaps = gaps.filter((g) => g.status === status);
    }

    return NextResponse.json({ success: true, gaps }, { headers: noCacheHeaders });
  } catch (error) {
    console.error("API GET /api/learning-gaps error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch learning gaps" },
      { status: 500, headers: noCacheHeaders }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentId } = body;

    if (!studentId) {
      return NextResponse.json(
        { success: false, error: "studentId is required" },
        { status: 400, headers: noCacheHeaders }
      );
    }

    const updatedGaps = db.recalculateLearningGapsForStudent(studentId);
    return NextResponse.json(
      { success: true, gaps: updatedGaps },
      { headers: noCacheHeaders }
    );
  } catch (error) {
    console.error("API POST /api/learning-gaps error:", error);
    return NextResponse.json(
      { success: false, error: "Recalculation failed" },
      { status: 500, headers: noCacheHeaders }
    );
  }
}
