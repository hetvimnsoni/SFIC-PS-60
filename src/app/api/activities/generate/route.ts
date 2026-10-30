import { NextResponse } from "next/server";
import { db } from "@/lib/db/database";
import { generateLearningActivity, TOPIC_CATALOG, getTopicsForSubject } from "@/lib/engine/questionGenerator";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      subjectCode = "MATH",
      topicId,
      conceptId,
      difficulty = "Easy",
      count = 4,
      studentName,
    } = body;

    const activity = generateLearningActivity({
      subjectCode: (subjectCode || "MATH").toUpperCase() as any,
      topicId,
      conceptId,
      difficulty: difficulty as any,
      count: Number(count) || 4,
      studentName,
    });

    // Save generated activity to DB store so it can be queried or tracked
    db.saveActivity(activity);

    return NextResponse.json({
      success: true,
      activity,
      topics: getTopicsForSubject((subjectCode || "MATH").toUpperCase()),
    });
  } catch (error) {
    console.error("API POST /api/activities/generate error:", error);
    return NextResponse.json({ success: false, error: "Failed to generate activity" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const subjectCode = (searchParams.get("subjectCode") || "MATH").toUpperCase() as any;
    const topicId = searchParams.get("topicId") || searchParams.get("conceptId") || undefined;
    const difficulty = (searchParams.get("difficulty") || "Easy") as any;
    const count = Number(searchParams.get("count")) || 4;
    const studentName = searchParams.get("studentName") || undefined;

    const activity = generateLearningActivity({
      subjectCode,
      topicId,
      difficulty,
      count,
      studentName,
    });

    db.saveActivity(activity);

    return NextResponse.json({
      success: true,
      activity,
      topics: getTopicsForSubject(subjectCode),
    });
  } catch (error) {
    console.error("API GET /api/activities/generate error:", error);
    return NextResponse.json({ success: false, error: "Failed to generate activity" }, { status: 500 });
  }
}

