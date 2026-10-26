import { NextResponse } from "next/server";
import { db } from "@/lib/db/database";

export async function GET() {
  try {
    const metrics = db.getAiMetrics();
    const totalRequests = metrics.length;
    const successfulRequests = metrics.filter((m) => m.success && !m.error).length;
    const failedRequests = totalRequests - successfulRequests;

    const averageLatencyMs =
      totalRequests > 0
        ? Math.round(metrics.reduce((acc, m) => acc + (m.latencyMs || 0), 0) / totalRequests)
        : 0;

    const totalCostUsd = metrics.reduce((acc, m) => acc + (m.estimatedCostUsd || 0), 0);

    const providerCounts: Record<string, { total: number; success: number; failed: number }> = {};
    for (const m of metrics) {
      if (!providerCounts[m.provider]) {
        providerCounts[m.provider] = { total: 0, success: 0, failed: 0 };
      }
      providerCounts[m.provider].total += 1;
      if (m.success && !m.error) providerCounts[m.provider].success += 1;
      else providerCounts[m.provider].failed += 1;
    }

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalRequests,
          successfulRequests,
          failedRequests,
          averageLatencyMs,
          totalCostUsd: Number(totalCostUsd.toFixed(5)),
        },
        byProvider: providerCounts,
        recentMetrics: metrics.slice(0, 50),
      },
      error: null,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: {
          code: "USAGE_METRICS_ERROR",
          message: error.message || "Failed to retrieve AI usage metrics.",
        },
      },
      { status: 500 }
    );
  }
}
