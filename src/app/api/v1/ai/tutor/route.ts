import { NextResponse } from "next/server";
import { aiService } from "@backend/services/aiService";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query, grade = 4, subject = "Mathematics", language = "en" } = body;

    if (!query || typeof query !== "string" || !query.trim()) {
      return NextResponse.json({ success: false, error: "Teacher query is required." }, { status: 400 });
    }

    const result = await aiService.askTutor(query, Number(grade), subject, language);
    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to generate AI tutor response" }, { status: 500 });
  }
}
