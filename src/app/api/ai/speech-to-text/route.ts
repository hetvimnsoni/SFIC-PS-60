import { NextRequest, NextResponse } from "next/server";
import { centralAi } from "@/lib/ai/centralAiService";
import type { SupportedLanguage } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let audioBuffer: Buffer | null = null;
    let mimeType = "audio/webm";
    let language: SupportedLanguage | undefined = undefined;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("audio") as File | null;
      const langParam = formData.get("language") as string | null;

      if (!file) {
        return NextResponse.json(
          { success: false, error: "No audio file provided in request." },
          { status: 400 }
        );
      }

      // Max audio size: 10MB
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, error: "Audio file exceeds maximum size of 10MB." },
          { status: 400 }
        );
      }

      mimeType = file.type || "audio/webm";
      const arrayBuf = await file.arrayBuffer();
      audioBuffer = Buffer.from(arrayBuf);
      if (langParam) language = langParam as SupportedLanguage;
    } else {
      const body = await req.json();
      const { audioBase64, mimeType: bodyMime, language: bodyLang } = body;

      if (!audioBase64 || typeof audioBase64 !== "string") {
        return NextResponse.json(
          { success: false, error: "Base64 audio or multipart audio file is required." },
          { status: 400 }
        );
      }

      const cleanBase64 = audioBase64.replace(/^data:audio\/\w+;base64,/, "");
      audioBuffer = Buffer.from(cleanBase64, "base64");
      if (bodyMime) mimeType = bodyMime;
      if (bodyLang) language = bodyLang as SupportedLanguage;
    }

    if (!audioBuffer || audioBuffer.length === 0) {
      return NextResponse.json(
        { success: false, error: "Empty audio buffer received." },
        { status: 400 }
      );
    }

    const result = await centralAi.transcribe(audioBuffer, mimeType, { language });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error("Error in /api/ai/speech-to-text:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to transcribe audio recording.",
      },
      { status: 500 }
    );
  }
}
