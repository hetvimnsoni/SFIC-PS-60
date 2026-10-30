import { NextResponse } from "next/server";
import { db } from "@/lib/db/database";
import { generateLearningActivity, TOPIC_CATALOG } from "@/lib/engine/questionGenerator";

// Ensure the activity store has at least one activity for each subject and difficulty level
function ensureComprehensiveActivities() {
  const existing = db.getActivities();
  const subjects: Array<"MATH" | "GUJ" | "ENG" | "EVS"> = ["MATH", "GUJ", "ENG", "EVS"];
  const difficulties: Array<"Easy" | "Medium" | "Hard"> = ["Easy", "Medium", "Hard"];

  for (const sub of subjects) {
    for (const diff of difficulties) {
      const found = existing.find((a) => a.subjectCode === sub && a.difficulty === diff);
      if (!found) {
        const topic = TOPIC_CATALOG.find((t) => t.subjectCode === sub) || TOPIC_CATALOG[0];
        const newAct = generateLearningActivity({
          subjectCode: sub,
          topicId: topic.id,
          difficulty: diff,
          count: 4,
        });
        db.saveActivity(newAct);
      }
    }
  }
}

export async function GET(request: Request) {
  try {
    ensureComprehensiveActivities();

    const { searchParams } = new URL(request.url);
    const conceptId = searchParams.get("conceptId") || undefined;
    const subjectCode = searchParams.get("subjectCode") || undefined;
    const difficulty = searchParams.get("difficulty") || undefined;

    let activities = db.getActivities(conceptId);

    if (subjectCode && subjectCode !== "all") {
      activities = activities.filter((a) => a.subjectCode === subjectCode);
    }

    if (difficulty && difficulty !== "all") {
      activities = activities.filter((a) => a.difficulty === difficulty);
    }

    return NextResponse.json({ success: true, activities });
  } catch (error) {
    console.error("API GET /api/activities error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch activities" }, { status: 500 });
  }
}
