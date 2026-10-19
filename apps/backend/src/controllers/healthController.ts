import type { Request, Response } from "express";
import type { HealthResponse } from "../../../../packages/shared/src/types";

export class HealthController {
  getHealth(req: Request, res: Response) {
    const geminiKey = process.env.GEMINI_API_KEY?.trim();
    const openAiKey = process.env.OPENAI_API_KEY?.trim();

    const response: HealthResponse = {
      status: "healthy",
      version: "1.0.0",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
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

    res.status(200).json({ success: true, ...response });
  }
}

export const healthController = new HealthController();
