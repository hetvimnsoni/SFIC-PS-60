import { NextRequest, NextResponse } from "next/server";
import { chatService } from "@/lib/ai/services/chat.service";
import { validateChatMessage } from "@/lib/ai/middleware/validation";
import { checkRateLimit } from "@/lib/ai/middleware/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "local-client";
    checkRateLimit(ip, 30, 60);

    const body = await req.json();
    const { message, history = [], language = "en", userRole = "teacher", provider } = body;

    const validatedMessage = validateChatMessage(message);

    const result = await chatService.sendMessage({
      message: validatedMessage,
      history,
      language,
      userRole,
      provider,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || "AI provider failed to generate response.",
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
      latencyMs: result.latencyMs,
      note: result.note,
    });
  } catch (error: any) {
    const status = error.statusCode || (error.name === "ValidationError" ? 400 : 500);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to process chat request.",
      },
      { status }
    );
  }
}
