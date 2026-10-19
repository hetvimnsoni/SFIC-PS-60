import { NextResponse } from "next/server";
import { worksheetService } from "@backend/services/worksheetService";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      grade,
      subject,
      concept,
      difficulty,
      questionCount,
      language,
      questionType,
      studentName,
    } = body;

    const result = await worksheetService.generateWorksheet({
      grade,
      subject,
      concept,
      difficulty,
      questionCount,
      language,
      questionType,
      studentName,
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to generate worksheet" }, { status: 500 });
  }
}
