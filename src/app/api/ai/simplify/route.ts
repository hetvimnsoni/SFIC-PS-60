import { NextRequest, NextResponse } from "next/server";
import { centralAi } from "@/lib/ai/centralAiService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, readingLevel = "simple", originalLanguage = "en" } = body;

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json(
        { success: false, error: "Text is required for simplification." },
        { status: 400 }
      );
    }

    if (text.length > 4000) {
      return NextResponse.json(
        { success: false, error: "Message exceeds maximum allowed length of 4,000 characters." },
        { status: 400 }
      );
    }

    const validLevels = ["very_simple", "simple", "standard"];
    const level = validLevels.includes(readingLevel) ? readingLevel : "simple";

    const result = await centralAi.simplify(text.trim(), {
      readingLevel: level as any,
      originalLanguage: originalLanguage as any,
    });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error("Error in /api/ai/simplify:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to simplify message.",
      },
      { status: 500 }
    );
  }
}
