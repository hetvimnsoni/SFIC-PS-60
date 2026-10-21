import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/database";
import { centralAi } from "@/lib/ai/centralAiService";
import type { SupportedLanguage } from "@/lib/types";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const {
      targetLanguage,
      customTranslation,
      isApproved = false,
      flagged = false,
      flagReason,
    } = body;

    const notice = db.getNoticeById(id);
    if (!notice) {
      return NextResponse.json(
        { success: false, error: "Notice not found." },
        { status: 404 }
      );
    }

    if (!targetLanguage) {
      return NextResponse.json(
        { success: false, error: "Target language is required." },
        { status: 400 }
      );
    }

    // If teacher provided manual or edited translation
    if (customTranslation) {
      const saved = db.saveTranslation({
        noticeId: id,
        language: targetLanguage as SupportedLanguage,
        translatedTitle: notice.title,
        translatedContent: customTranslation,
        provider: "manual_edit" as any,
        isApprovedByTeacher: !!isApproved,
        flaggedAsIncorrect: !!flagged,
        flagReason: flagReason || undefined,
      });

      return NextResponse.json({
        success: true,
        data: saved,
      });
    }

    // Otherwise run through real AI translation engine
    const sourceText = notice.simplifiedContent || notice.originalContent;
    const trResult = await centralAi.translate(sourceText, {
      targetLanguage: targetLanguage as SupportedLanguage,
      sourceLanguage: notice.originalLanguage,
      readingLevel: notice.readingLevel,
    });

    const saved = db.saveTranslation({
      noticeId: id,
      language: targetLanguage as SupportedLanguage,
      translatedTitle: notice.title,
      translatedContent: trResult.translatedText,
      provider: trResult.provider,
      isApprovedByTeacher: !!isApproved,
      flaggedAsIncorrect: false,
    });

    return NextResponse.json({
      success: true,
      data: saved,
      aiMeta: {
        provider: trResult.provider,
        modelUsed: trResult.modelUsed,
        latencyMs: trResult.latencyMs,
      },
    });
  } catch (error: any) {
    console.error("Error in POST /api/notices/[id]/translate:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process translation." },
      { status: 500 }
    );
  }
}
