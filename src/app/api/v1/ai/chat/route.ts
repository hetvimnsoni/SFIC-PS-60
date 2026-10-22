import { NextResponse } from "next/server";
import { aiService } from "@backend/services/aiService";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, history = [], language = "en", userRole = "teacher" } = body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ success: false, error: "Message is required." }, { status: 400 });
    }

    if (message.length > 4000) {
      return NextResponse.json(
        { success: false, error: "Message is too long. Please limit your question to 4,000 characters." },
        { status: 400 }
      );
    }

    const result = await aiService.askAssistant(message, history, language, userRole);
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || "Failed to generate AI assistant response",
          provider: result.provider,
          modelUsed: result.modelUsed,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      reply: result.message,
      text: result.message,
      isAiGenerated: result.isAiGenerated,
      provider: result.provider,
      modelUsed: result.modelUsed,
      note: result.note,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to process chat message" }, { status: 500 });
  }
}
