import { NextResponse } from "next/server";
import { aiRegistry } from "@/lib/ai/registry";
import { secretManager } from "@/lib/ai/security/secret-manager";

export async function GET() {
  try {
    const providers = aiRegistry.getAll();
    const activeProvider = process.env.AI_PROVIDER || "gemini";

    const providerSummaries = providers.map((adapter) => ({
      id: adapter.id,
      name: adapter.name,
      configured: adapter.isConfigured(),
      capabilities: adapter.capabilities,
      hasKey: Boolean(secretManager.getSecret(adapter.id === "openai" ? "OPENAI_API_KEY" : adapter.id === "gemini" ? "GEMINI_API_KEY" : adapter.id === "anthropic" ? "ANTHROPIC_API_KEY" : adapter.id === "google_translate" ? "GOOGLE_TRANSLATE_API_KEY" : "BHASHINI_API_KEY")),
    }));

    return NextResponse.json({
      success: true,
      data: {
        status: "healthy",
        activeProvider,
        timestamp: new Date().toISOString(),
        providers: providerSummaries,
      },
      error: null,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: {
          code: "HEALTH_CHECK_FAILED",
          message: error.message || "AI health check failed",
        },
      },
      { status: 500 }
    );
  }
}
