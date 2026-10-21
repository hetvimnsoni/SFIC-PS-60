import { NextRequest, NextResponse } from "next/server";
import { centralAi } from "@/lib/ai/centralAiService";
import type { SupportedLanguage } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, language = "en", voice } = body;

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json(
        { success: false, error: "Text is required for audio synthesis." },
        { status: 400 }
      );
    }

    if (text.length > 2000) {
      return NextResponse.json(
        { success: false, error: "Text exceeds maximum allowed length of 2,000 characters for speech." },
        { status: 400 }
      );
    }

    const result = await centralAi.synthesize(text.trim(), {
      language: language as SupportedLanguage,
      voice,
    });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error("Error in /api/ai/text-to-speech:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to synthesize speech.",
      },
      { status: 500 }
    );
  }
}
