import { NextResponse } from "next/server";
import { db } from "@/lib/db/database";
import { validateAssessmentMarks } from "@/lib/engine/calculations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { results } = body; // Array of { assessmentId, studentId, conceptId, marksObtained, maximumMarks, notes, recordedAt }

    if (!results || !Array.isArray(results) || results.length === 0) {
      return NextResponse.json(
        { success: false, error: "Results array is required" },
        { status: 400 }
      );
    }

    // Validate all results
    for (const r of results) {
      const val = validateAssessmentMarks(Number(r.marksObtained), Number(r.maximumMarks));
      if (!val.isValid) {
        return NextResponse.json(
          { success: false, error: val.error || "Invalid assessment marks" },
          { status: 400 }
        );
      }
    }

    const recorded = db.recordResults(
      results.map((r: any) => ({
        assessmentId: r.assessmentId,
        studentId: r.studentId,
        conceptId: r.conceptId,
        marksObtained: Number(r.marksObtained),
        maximumMarks: Number(r.maximumMarks),
        percentage: Math.round((Number(r.marksObtained) / Number(r.maximumMarks)) * 100),
        notes: r.notes || "",
        recordedAt: r.recordedAt || new Date().toISOString(),
      }))
    );

    return NextResponse.json({ success: true, count: recorded.length, results: recorded });
  } catch (error) {
    console.error("API POST /api/assessments/results error:", error);
    return NextResponse.json({ success: false, error: "Failed to record results" }, { status: 500 });
  }
}
