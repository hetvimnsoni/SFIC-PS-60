import { NextResponse } from "next/server";
import type { HealthResponse } from "@shared/types";

export async function GET() {
  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  const openAiKey = process.env.OPENAI_API_KEY?.trim();

  const response: HealthResponse = {
    status: "healthy",
    version: "1.0.0",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "production",
    database: {
      status: "connected",
      type: process.env.DATABASE_URL ? "postgresql" : "json",
    },
    ai: {
      provider: (process.env.AI_PROVIDER as any) || (geminiKey ? "gemini" : "offline_fallback"),
      model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
      liveAiConfigured: Boolean(geminiKey || openAiKey),
    },
  };

  return NextResponse.json({ success: true, ...response });
}
