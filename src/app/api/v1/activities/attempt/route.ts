import { NextResponse } from "next/server";
import { activityRepository } from "@backend/repositories/activityRepository";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentId, activityId, score, maximumScore, answers, incorrectQuestions } = body;

    if (!studentId || !activityId || score === undefined || !maximumScore) {
      return NextResponse.json(
        { success: false, error: "Missing required attempt fields" },
        { status: 400 }
      );
    }

    const attempt = await activityRepository.recordAttempt({
      studentId,
      activityId,
      score: Number(score),
      maximumScore: Number(maximumScore),
      percentage: Math.round((Number(score) / Number(maximumScore)) * 100),
      answers: answers || {},
      incorrectQuestions: incorrectQuestions || [],
    });

    return NextResponse.json({ success: true, attempt });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to record attempt" }, { status: 500 });
  }
}
