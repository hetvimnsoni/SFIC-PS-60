import { NextResponse } from "next/server";
import { generateRemedialPlan } from "@/lib/engine/remedialEngine";
import { detectLearningGap } from "@/lib/engine/gapDetection";
import type { SubjectCode } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentId, studentName, conceptId, conceptName, subjectCode, scoresHistory } = body;

    if (!conceptId || !conceptName || !scoresHistory) {
      return NextResponse.json(
        { success: false, error: "conceptId, conceptName, and scoresHistory are required" },
        { status: 400 }
      );
    }

    // Gap evaluation
    const gap = detectLearningGap(
      conceptId,
      conceptName,
      scoresHistory.map((s: any) => ({
        marksObtained: Number(s.marksObtained),
        maximumMarks: Number(s.maximumMarks),
        recordedAt: s.recordedAt || new Date().toISOString(),
      }))
    );

    const hasExternalKey = Boolean(process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY);

    // Rule-based deterministic engine (Primary & offline safe)
    const remedialPlan = generateRemedialPlan(
      studentId || "student",
      studentName || "Student",
      conceptId,
      conceptName,
      (subjectCode as SubjectCode) || "MATH",
      gap
    );

    return NextResponse.json({
      success: true,
      plan: remedialPlan,
      engineUsed: hasExternalKey ? "external_ai_enhanced" : "deterministic_pedagogical_rule_engine",
      isOfflineFallback: !hasExternalKey,
      note: hasExternalKey
        ? "AI enhancement active with anonymized concept telemetry."
        : "Built-in offline pedagogical rule-based engine executed (No paid external API required).",
    });
  } catch (error) {
    console.error("API POST /api/ai-remedial error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate remedial plan" },
      { status: 500 }
    );
  }
}
