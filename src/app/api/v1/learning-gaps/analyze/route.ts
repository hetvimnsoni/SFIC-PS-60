import { NextResponse } from "next/server";
import { learningGapService } from "@backend/services/learningGapService";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      studentId,
      studentName,
      studentClass,
      subject,
      conceptName,
      marksObtained,
      maximumMarks,
      teacherObservations,
      language,
    } = body;

    if (marksObtained === undefined || maximumMarks === undefined) {
      return NextResponse.json(
        { success: false, error: "marksObtained and maximumMarks are required" },
        { status: 400 }
      );
    }

    const result = await learningGapService.analyzeGap({
      studentId,
      studentName,
      studentClass,
      subject,
      conceptName,
      marksObtained,
      maximumMarks,
      teacherObservations,
      language,
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to analyze learning gap" }, { status: 500 });
  }
}
