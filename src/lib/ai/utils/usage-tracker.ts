import { db } from "@/lib/db/database";
import type { AiProviderName, AiTaskType, AiUsageMetric } from "../types";

export interface LogMetricParams {
  task: AiTaskType;
  provider: AiProviderName;
  model: string;
  latencyMs: number;
  success: boolean;
  tokensPrompt?: number;
  tokensCompletion?: number;
  estimatedCostUsd?: number;
  error?: string;
}

// Approximate cost table per 1K tokens ($ USD)
const COST_PER_1K_TOKENS: Record<string, { prompt: number; completion: number }> = {
  "gpt-4o-mini": { prompt: 0.00015, completion: 0.0006 },
  "gpt-4o": { prompt: 0.005, completion: 0.015 },
  "gemini-1.5-flash": { prompt: 0.000075, completion: 0.0003 },
  "gemini-1.5-pro": { prompt: 0.00125, completion: 0.005 },
  "claude-3-5-sonnet-20241022": { prompt: 0.003, completion: 0.015 },
  "claude-3-haiku-20240307": { prompt: 0.00025, completion: 0.00125 },
  "google-translate-v2": { prompt: 0.00002, completion: 0.00002 },
  "bhashini-nmt": { prompt: 0.00001, completion: 0.00001 },
  "deterministic_pedagogical_rule_engine": { prompt: 0, completion: 0 },
};

export function estimateTokenCount(text: string): number {
  if (!text) return 0;
  // Rule of thumb: ~4 characters per token for English, ~2 for Unicode Indic scripts
  const isUnicodeIndic = /[\u0A80-\u0AFF\u0900-\u097F]/.test(text);
  const factor = isUnicodeIndic ? 2 : 4;
  return Math.max(1, Math.round(text.length / factor));
}

export function calculateEstimatedCost(
  model: string,
  promptTokens: number = 0,
  completionTokens: number = 0
): number {
  const rates = COST_PER_1K_TOKENS[model] || { prompt: 0.0001, completion: 0.0003 };
  const cost = (promptTokens / 1000) * rates.prompt + (completionTokens / 1000) * rates.completion;
  return Number(cost.toFixed(6));
}

export function recordAiUsage(params: LogMetricParams): AiUsageMetric {
  const promptTokens = params.tokensPrompt ?? 0;
  const completionTokens = params.tokensCompletion ?? 0;
  const cost =
    params.estimatedCostUsd ??
    calculateEstimatedCost(params.model, promptTokens, completionTokens);

  const metric: AiUsageMetric = {
    id: `metric-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    task: params.task,
    provider: params.provider,
    model: params.model,
    tokensPrompt: promptTokens,
    tokensCompletion: completionTokens,
    latencyMs: params.latencyMs,
    success: params.success,
    estimatedCostUsd: cost,
    timestamp: new Date().toISOString(),
    error: params.error,
  };

  try {
    db.recordAiMetric(metric);
  } catch (err) {
    console.warn("Failed to record AI usage metric to database:", err);
  }

  return metric;
}
