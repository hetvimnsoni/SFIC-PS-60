import { NextResponse } from "next/server";
import { remedialService } from "@backend/services/remedialService";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      studentId,
      studentName,
      conceptId,
      conceptName,
      subjectCode,
      latestPercentage,
      gapReason,
      language,
    } = body;

    const result = await remedialService.generatePlan({
      studentId,
      studentName,
      conceptId,
      conceptName,
      subjectCode,
      latestPercentage,
      gapReason,
      language,
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Remedial plan generation failed" }, { status: 500 });
  }
}
