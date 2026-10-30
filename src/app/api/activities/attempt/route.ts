import { NextResponse } from "next/server";
import { db } from "@/lib/db/database";
import type { ActivityQuestion, LearningActivity } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { activityId, studentId, assignmentId, answers, questions, activityData } = body;

    if (!activityId || !studentId || !answers) {
      return NextResponse.json(
        { success: false, error: "Missing activityId, studentId, or answers" },
        { status: 400 }
      );
    }

    let activity = db.getActivityById(activityId);

    // If activity not found in database but provided in request or questions provided, register it
    if (!activity && (activityData || questions)) {
      const newAct: LearningActivity = activityData || {
        id: activityId,
        conceptId: "c-practice-01",
        subjectCode: "MATH",
        grade: 4,
        title: "Dynamic Practice Quiz",
        activityType: "mcq",
        difficulty: "Easy",
        estimatedMinutes: 8,
        questions: questions || [],
        createdAt: new Date().toISOString(),
      };
      activity = db.saveActivity(newAct);
    }

    const evaluationQuestions: ActivityQuestion[] =
      activity?.questions || questions || [];

    if (evaluationQuestions.length === 0) {
      return NextResponse.json({ success: false, error: "No questions found for this activity" }, { status: 404 });
    }

    let score = 0;
    const incorrectQuestions: string[] = [];

    // Calculate score objectively against activity questions
    evaluationQuestions.forEach((q) => {
      const studentAns = answers[q.id];
      if (
        studentAns !== undefined &&
        String(studentAns).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase()
      ) {
        score += 1;
      } else {
        incorrectQuestions.push(q.id);
      }
    });

    const totalQuestions = evaluationQuestions.length;
    const percentage = Math.round((score / totalQuestions) * 100);

    const attempt = db.recordActivityAttempt({
      assignmentId,
      studentId,
      activityId,
      score,
      maximumScore: totalQuestions,
      percentage,
      answers,
      incorrectQuestions,
    });

    return NextResponse.json({
      success: true,
      attempt,
      percentage: attempt.percentage,
      feedback:
        attempt.percentage >= 80
          ? "Outstanding work! Concept mastered with high confidence."
          : attempt.percentage >= 50
          ? "Good practice! Review the questions you missed with your teacher."
          : "Keep practicing! Hands-on practice with objects will help build your foundation.",
    });
  } catch (error) {
    console.error("API POST /api/activities/attempt error:", error);
    return NextResponse.json({ success: false, error: "Failed to record attempt" }, { status: 500 });
  }
}
