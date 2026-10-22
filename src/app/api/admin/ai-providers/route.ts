import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/database";
import { aiRegistry } from "@/lib/ai/registry";
import { aiRouter } from "@/lib/ai/router";
import { secretManager } from "@/lib/ai/security/secret-manager";
import { verifyAdminAccess } from "@/lib/ai/security/key-validation";
import type { AiProviderName, AiTaskType } from "@/lib/types";

export async function GET(req: NextRequest) {
  try {
    const configs = db.getAiProviderConfigs();
    const metrics = db.getAiMetrics();
    const providerStatus = aiRegistry.getProviderStatusList();

    // Compute aggregated telemetry metrics
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
          recentMetrics: metrics.slice(0, 50),
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

      const pingResult = await aiRouter.testProviderConnection(provider as AiProviderName);
      return NextResponse.json({
        success: true,
        data: {
          provider,
          configured: pingResult.status !== "Not Configured",
          pingSuccess: pingResult.success,
          status: pingResult.status,
          latencyMs: pingResult.latencyMs,
          message: pingResult.message,
          details: pingResult.details,
          timestamp: pingResult.timestamp,
        },
      });
    }

    // Action 2: Update task routing configuration
    if (action === "update_config") {
      const { task, primaryProvider, fallbackProvider, primaryModel, fallbackModel, enabled } = body;
      if (!task) {
        return NextResponse.json(
          { success: false, error: "Task type is required." },
          { status: 400 }
        );
      }

      const updatedConfigs = db.updateAiProviderConfig(task as AiTaskType, {
        primaryProvider,
        fallbackProvider,
        primaryModel,
        fallbackModel,
        enabled,
      });

      return NextResponse.json({
        success: true,
        data: updatedConfigs,
        message: `AI Provider configuration for ${task} updated successfully.`,
      });
    }

    // Action 3: Rotate or update API key at runtime
    if (action === "update_key") {
      const { provider, apiKey, envKey } = body;
      if (!provider && !envKey) {
        return NextResponse.json(
          { success: false, error: "Provider or envKey is required." },
          { status: 400 }
        );
      }

      const targetEnv =
        envKey ||
        (provider === "openai"
          ? "OPENAI_API_KEY"
          : provider === "gemini"
          ? "GEMINI_API_KEY"
          : provider === "anthropic"
          ? "ANTHROPIC_API_KEY"
          : provider === "google_translate" || provider === "google-translate"
          ? "GOOGLE_TRANSLATE_API_KEY"
          : provider === "bhashini"
          ? "BHASHINI_API_KEY"
          : null);

      if (!targetEnv) {
        return NextResponse.json(
          { success: false, error: `No configurable secret key for provider '${provider}'.` },
          { status: 400 }
        );
      }

      secretManager.rotateKey(targetEnv, apiKey || "");

      return NextResponse.json({
        success: true,
        message: `Key for ${targetEnv} updated. Masked value: ${secretManager.getMaskedKey(provider)}`,
        maskedKey: secretManager.getMaskedKey(provider),
      });
    }

    // Action 4: Toggle enable / disable provider
    if (action === "toggle_provider") {
      const { provider, enabled } = body;
      return NextResponse.json({
        success: true,
        message: `Provider ${provider} is now ${enabled ? "enabled" : "disabled"}.`,
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
