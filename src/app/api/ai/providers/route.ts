import { NextRequest, NextResponse } from "next/server";
import { aiRegistry } from "@/lib/ai/registry";
import { db } from "@/lib/db/database";
import { aiRouter } from "@/lib/ai/router";
import { secretManager } from "@/lib/ai/security/secret-manager";
import type { AiProviderName, AiTaskType } from "@/lib/types";

export async function GET() {
  try {
    const providerStatus = aiRegistry.getProviderStatusList();
    const configs = db.getAiProviderConfigs();

    return NextResponse.json({
      success: true,
      data: {
        providers: providerStatus,
        configs,
      },
      error: null,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: {
          code: "PROVIDER_REGISTRY_ERROR",
          message: error.message || "Failed to retrieve AI providers.",
        },
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, provider, task, primaryProvider, fallbackProvider, primaryModel, fallbackModel } = body;

    if (action === "test_ping" && provider) {
      const pingResult = await aiRouter.testProviderConnection(provider as AiProviderName);
      return NextResponse.json({
        success: true,
        data: pingResult,
        error: null,
      });
    }

    if (action === "update_config" && task) {
      const updated = db.updateAiProviderConfig(task as AiTaskType, {
        primaryProvider,
        fallbackProvider,
        primaryModel,
        fallbackModel,
      });
      return NextResponse.json({
        success: true,
        data: updated,
        error: null,
      });
    }

    if (action === "update_key" && provider) {
      const { apiKey } = body;
      const envKey =
        provider === "openai"
          ? "OPENAI_API_KEY"
          : provider === "gemini"
          ? "GEMINI_API_KEY"
          : provider === "anthropic"
          ? "ANTHROPIC_API_KEY"
          : provider === "google_translate" || provider === "google-translate"
          ? "GOOGLE_TRANSLATE_API_KEY"
          : provider === "bhashini"
          ? "BHASHINI_API_KEY"
          : null;

      if (!envKey) {
        return NextResponse.json(
          {
            success: false,
            data: null,
            error: { code: "INVALID_PROVIDER", message: `No secret key for provider '${provider}'.` },
          },
          { status: 400 }
        );
      }

      secretManager.rotateKey(envKey, apiKey || "");
      return NextResponse.json({
        success: true,
        data: {
          provider,
          maskedKey: secretManager.getMaskedKey(provider),
          message: `Key for ${provider} updated successfully.`,
        },
        error: null,
      });
    }

    return NextResponse.json(
      {
        success: false,
        data: null,
        error: { code: "INVALID_ACTION", message: `Unsupported action '${action}'.` },
      },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: { code: "INTERNAL_ERROR", message: error.message || "Provider command failed." },
      },
      { status: 500 }
    );
  }
}
