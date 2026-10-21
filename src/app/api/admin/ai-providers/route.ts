import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/database";
import { centralAi } from "@/lib/ai/centralAiService";
import type { AiProviderName, AiTaskType } from "@/lib/types";

export async function GET(req: NextRequest) {
  try {
    const configs = db.getAiProviderConfigs();
    const metrics = db.getAiMetrics();

    // Provider environment status without leaking secrets
    const providerStatus = [
      {
        provider: "gemini" as AiProviderName,
        name: "Google Gemini",
        configured: !!process.env.GEMINI_API_KEY?.trim(),
        supportedTasks: ["simplification", "translation", "speech_to_text", "assistant"],
        supportedLanguages: ["en", "gu", "hi", "mr", "ta"],
        keyPreview: process.env.GEMINI_API_KEY ? `AIzaSy...${process.env.GEMINI_API_KEY.slice(-4)}` : null,
      },
      {
        provider: "openai" as AiProviderName,
        name: "OpenAI (GPT-4o-mini & Whisper & TTS)",
        configured: !!process.env.OPENAI_API_KEY?.trim(),
        supportedTasks: ["simplification", "translation", "speech_to_text", "text_to_speech", "assistant"],
        supportedLanguages: ["en", "gu", "hi", "mr", "ta"],
        keyPreview: process.env.OPENAI_API_KEY ? `sk-...${process.env.OPENAI_API_KEY.slice(-4)}` : null,
      },
      {
        provider: "google_translate" as AiProviderName,
        name: "Google Cloud Translation API",
        configured: !!process.env.GOOGLE_TRANSLATE_API_KEY?.trim(),
        supportedTasks: ["translation"],
        supportedLanguages: ["en", "gu", "hi", "mr", "ta", "te", "bn", "kn"],
        keyPreview: process.env.GOOGLE_TRANSLATE_API_KEY ? `AIzaSy...${process.env.GOOGLE_TRANSLATE_API_KEY.slice(-4)}` : null,
      },
      {
        provider: "bhashini" as AiProviderName,
        name: "Bhashini ULCA (Govt of India)",
        configured: !!(process.env.BHASHINI_API_KEY?.trim() && process.env.BHASHINI_USER_ID?.trim()),
        supportedTasks: ["translation", "speech_to_text", "text_to_speech"],
        supportedLanguages: ["gu", "hi", "en", "mr", "ta", "te", "bn"],
        keyPreview: process.env.BHASHINI_API_KEY ? `bha-...${process.env.BHASHINI_API_KEY.slice(-4)}` : null,
      },
      {
        provider: "offline_fallback" as AiProviderName,
        name: "Local Offline Pedagogical Engine",
        configured: true,
        supportedTasks: ["simplification", "translation", "assistant"],
        supportedLanguages: ["en", "gu", "hi"],
        keyPreview: "Internal Local Engine",
      },
    ];

    // Compute aggregated metrics
    const totalRequests = metrics.length;
    const errorCount = metrics.filter((m) => !m.success || m.error).length;
    const averageLatencyMs =
      totalRequests > 0
        ? Math.round(metrics.reduce((acc, m) => acc + (m.latencyMs || 0), 0) / totalRequests)
        : 0;
    const totalCostUsd = metrics.reduce((acc, m) => acc + (m.estimatedCostUsd || 0), 0);

    return NextResponse.json({
      success: true,
      data: {
        configs,
        providerStatus,
        metricsSummary: {
          totalRequests,
          errorCount,
          averageLatencyMs,
          totalCostUsd: Number(totalCostUsd.toFixed(5)),
          recentMetrics: metrics.slice(0, 30),
        },
      },
    });
  } catch (error: any) {
    console.error("Error in GET /api/admin/ai-providers:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch AI provider settings." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    // Action 1: Test connectivity ping
    if (action === "test_ping") {
      const { provider } = body;
      if (!provider) {
        return NextResponse.json(
          { success: false, error: "Provider name is required for connectivity test." },
          { status: 400 }
        );
      }

      const pingResult = await centralAi.testProviderConnection(provider as AiProviderName);
      return NextResponse.json({
        success: true,
        data: pingResult,
      });
    }

    // Action 2: Update configuration
    if (action === "update_config") {
      const { task, primaryProvider, fallbackProvider, enabled } = body;
      if (!task) {
        return NextResponse.json(
          { success: false, error: "Task type is required." },
          { status: 400 }
        );
      }

      const updatedConfigs = db.updateAiProviderConfig(task as AiTaskType, {
        primaryProvider,
        fallbackProvider,
        enabled,
      });

      return NextResponse.json({
        success: true,
        data: updatedConfigs,
        message: `AI Provider configuration for ${task} updated.`,
      });
    }

    return NextResponse.json(
      { success: false, error: `Invalid action: ${action}` },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Error in POST /api/admin/ai-providers:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to execute AI provider command." },
      { status: 500 }
    );
  }
}
