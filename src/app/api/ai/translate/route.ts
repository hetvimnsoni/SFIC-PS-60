import { NextRequest, NextResponse } from "next/server";
import { centralAi } from "@/lib/ai/centralAiService";
import type { SupportedLanguage } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, targetLanguage, sourceLanguage = "auto", readingLevel = "simple" } = body;

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json(
        { success: false, error: "Text is required for translation." },
        { status: 400 }
      );
    }

    if (!targetLanguage || typeof targetLanguage !== "string") {
      return NextResponse.json(
        { success: false, error: "Target language is required (e.g., 'gu', 'hi', 'en')." },
        { status: 400 }
      );
    }

    if (text.length > 5000) {
      return NextResponse.json(
        { success: false, error: "Text exceeds maximum allowed length of 5,000 characters." },
        { status: 400 }
      );
    }

    const result = await centralAi.translate(text.trim(), {
      targetLanguage: targetLanguage as SupportedLanguage,
      sourceLanguage: (sourceLanguage || "auto") as SupportedLanguage,
      readingLevel: readingLevel as any,
    });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error("Error in /api/ai/translate:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to translate message.",
      },
      { status: 500 }
    );
  }
}
