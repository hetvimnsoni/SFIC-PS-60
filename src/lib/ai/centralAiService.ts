import { GeminiProvider } from "./providers/geminiProvider";
import { OpenAiProvider } from "./providers/openAiProvider";
import { GoogleTranslateProvider } from "./providers/googleTranslateProvider";
import { BhashiniProvider } from "./providers/bhashiniProvider";
import { OfflineFallbackProvider } from "./providers/offlineFallbackProvider";
import type {
  SimplificationOptions,
  TranslationOptions,
  TranscriptionOptions,
  AudioSynthesisOptions,
  AssistantContext,
} from "./providers/interfaces";
import type {
  SimplificationResult,
  TranslationResult,
  TranscriptionResult,
  AudioSynthesisResult,
  AiTaskType,
  AiProviderName,
  AiProviderConfig,
  AiUsageMetric,
} from "@/lib/types";
import { db } from "@/lib/db/database";

// In-memory audio cache for TTS to avoid duplicate external API bills
const audioCache = new Map<string, AudioSynthesisResult>();

export class CentralAiService {
  private gemini = new GeminiProvider();
  private openAi = new OpenAiProvider();
  private googleTranslate = new GoogleTranslateProvider();
  private bhashini = new BhashiniProvider();
  private offlineFallback = new OfflineFallbackProvider();

  /**
   * Get active configuration for a given task from DB or defaults
   */
  async getConfig(task: AiTaskType): Promise<AiProviderConfig> {
    const configs = db.getAiProviderConfigs();
    const existing = configs.find((c) => c.task === task);
    if (existing) return existing;

    // Default heuristics based on environment availability
    const geminiKey = process.env.GEMINI_API_KEY?.trim();
    const openAiKey = process.env.OPENAI_API_KEY?.trim();
    const googleTranslateKey = process.env.GOOGLE_TRANSLATE_API_KEY?.trim();
    const bhashiniKey = process.env.BHASHINI_API_KEY?.trim();

    let primary: AiProviderName = "offline_fallback";
    let fallback: AiProviderName = "offline_fallback";

    switch (task) {
      case "simplification":
        primary = geminiKey ? "gemini" : openAiKey ? "openai" : "offline_fallback";
        fallback = "offline_fallback";
        break;
      case "translation":
        primary = googleTranslateKey
          ? "google_translate"
          : geminiKey
          ? "gemini"
          : bhashiniKey
          ? "bhashini"
          : "offline_fallback";
        fallback = "offline_fallback";
        break;
      case "speech_to_text":
        primary = openAiKey ? "openai" : geminiKey ? "gemini" : bhashiniKey ? "bhashini" : "offline_fallback";
        fallback = "offline_fallback";
        break;
      case "text_to_speech":
        primary = openAiKey ? "openai" : bhashiniKey ? "bhashini" : "offline_fallback";
        fallback = "offline_fallback";
        break;
      case "assistant":
        primary = geminiKey ? "gemini" : openAiKey ? "openai" : "offline_fallback";
        fallback = "offline_fallback";
        break;
    }

    return {
      task,
      primaryProvider: primary,
      fallbackProvider: fallback,
      enabled: true,
    };
  }

  /**
   * Record metric into database
   */
  private logMetric(metric: Omit<AiUsageMetric, "id" | "timestamp">) {
    try {
      db.recordAiMetric({
        ...metric,
        id: `metric-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        timestamp: new Date().toISOString(),
      });
    } catch (e) {
      console.warn("Could not save AI metric:", e);
    }
  }

  /**
   * 1. Simplification Task Orchestrator
   */
  async simplify(text: string, options: SimplificationOptions): Promise<SimplificationResult> {
    const config = await this.getConfig("simplification");
    const primary = this.resolveSimplificationProvider(config.primaryProvider);
    const fallback = this.resolveSimplificationProvider(config.fallbackProvider || "offline_fallback");

    const startTime = Date.now();
    try {
      const result = await primary.simplify(text, options);
      this.logMetric({
        task: "simplification",
        provider: result.provider,
        model: result.modelUsed,
        latencyMs: result.latencyMs,
        success: true,
        tokensPrompt: Math.round(text.length / 4),
        tokensCompletion: Math.round(result.simplifiedText.length / 4),
        estimatedCostUsd: 0.0001,
      });
      return result;
    } catch (primaryErr: any) {
      console.warn(`Primary simplification provider (${config.primaryProvider}) failed: ${primaryErr.message}. Executing fallback.`);
      const fbResult = await fallback.simplify(text, options);
      this.logMetric({
        task: "simplification",
        provider: fbResult.provider,
        model: fbResult.modelUsed,
        latencyMs: Date.now() - startTime,
        success: true,
        estimatedCostUsd: 0,
        error: `Fallback triggered: ${primaryErr.message}`,
      });
      return fbResult;
    }
  }

  /**
   * 2. Translation Task Orchestrator
   */
  async translate(text: string, options: TranslationOptions): Promise<TranslationResult> {
    const config = await this.getConfig("translation");
    const primary = this.resolveTranslationProvider(config.primaryProvider);
    const fallback = this.resolveTranslationProvider(config.fallbackProvider || "offline_fallback");

    const startTime = Date.now();
    try {
      const result = await primary.translate(text, options);
      this.logMetric({
        task: "translation",
        provider: result.provider,
        model: result.modelUsed,
        latencyMs: result.latencyMs,
        success: true,
        tokensPrompt: Math.round(text.length / 4),
        tokensCompletion: Math.round(result.translatedText.length / 4),
        estimatedCostUsd: 0.00008,
      });
      return result;
    } catch (primaryErr: any) {
      console.warn(`Primary translation provider (${config.primaryProvider}) failed: ${primaryErr.message}. Executing fallback.`);
      const fbResult = await fallback.translate(text, options);
      this.logMetric({
        task: "translation",
        provider: fbResult.provider,
        model: fbResult.modelUsed,
        latencyMs: Date.now() - startTime,
        success: true,
        estimatedCostUsd: 0,
        error: `Fallback triggered: ${primaryErr.message}`,
      });
      return fbResult;
    }
  }

  /**
   * 3. Speech-to-Text Task Orchestrator
   */
  async transcribe(
    audioBuffer: Buffer,
    mimeType: string,
    options?: TranscriptionOptions
  ): Promise<TranscriptionResult> {
    const config = await this.getConfig("speech_to_text");
    const primary = this.resolveSttProvider(config.primaryProvider);

    const startTime = Date.now();
    try {
      const result = await primary.transcribe(audioBuffer, mimeType, options);
      this.logMetric({
        task: "speech_to_text",
        provider: result.provider,
        model: result.modelUsed,
        latencyMs: result.latencyMs,
        success: true,
        estimatedCostUsd: 0.0006,
      });
      return result;
    } catch (primaryErr: any) {
      console.warn(`Primary STT provider (${config.primaryProvider}) failed: ${primaryErr.message}.`);
      // Try secondary if available
      if (config.primaryProvider !== "gemini" && this.gemini.isConfigured()) {
        try {
          const geminiResult = await this.gemini.transcribe(audioBuffer, mimeType, options);
          return geminiResult;
        } catch {
          // continue to failure
        }
      }
      throw primaryErr;
    }
  }

  /**
   * 4. Text-to-Speech Task Orchestrator (with caching)
   */
  async synthesize(text: string, options: AudioSynthesisOptions): Promise<AudioSynthesisResult> {
    const cacheKey = `${options.language}:${options.voice || "default"}:${text.trim()}`;
    if (audioCache.has(cacheKey)) {
      const cached = audioCache.get(cacheKey)!;
      return { ...cached, cached: true };
    }

    const config = await this.getConfig("text_to_speech");
    const primary = this.resolveTtsProvider(config.primaryProvider);

    const startTime = Date.now();
    try {
      const result = await primary.synthesize(text, options);
      this.logMetric({
        task: "text_to_speech",
        provider: result.provider,
        model: result.modelUsed,
        latencyMs: result.latencyMs,
        success: true,
        estimatedCostUsd: 0.0005,
      });
      audioCache.set(cacheKey, result);
      return result;
    } catch (primaryErr: any) {
      console.warn(`TTS provider (${config.primaryProvider}) failed: ${primaryErr.message}.`);
      throw primaryErr;
    }
  }

  /**
   * 5. Notice Assistant Q&A Orchestrator
   */
  async askNoticeAssistant(query: string, context: AssistantContext) {
    const config = await this.getConfig("assistant");
    const primary = this.resolveAssistantProvider(config.primaryProvider);
    const fallback = this.resolveAssistantProvider(config.fallbackProvider || "offline_fallback");

    const startTime = Date.now();
    try {
      const result = await primary.ask(query, context);
      this.logMetric({
        task: "assistant",
        provider: result.provider,
        model: result.modelUsed,
        latencyMs: result.latencyMs,
        success: true,
        estimatedCostUsd: 0.0002,
      });
      return result;
    } catch (primaryErr: any) {
      console.warn(`Primary notice assistant (${config.primaryProvider}) failed: ${primaryErr.message}. Executing fallback.`);
      const fbResult = await fallback.ask(query, context);
      this.logMetric({
        task: "assistant",
        provider: fbResult.provider,
        model: fbResult.modelUsed,
        latencyMs: Date.now() - startTime,
        success: true,
        estimatedCostUsd: 0,
        error: `Fallback triggered: ${primaryErr.message}`,
      });
      return fbResult;
    }
  }

  /**
   * Safe connectivity test for Admin Settings
   */
  async testProviderConnection(providerName: AiProviderName): Promise<{
    provider: AiProviderName;
    configured: boolean;
    pingSuccess: boolean;
    latencyMs: number;
    message: string;
  }> {
    const startTime = Date.now();
    switch (providerName) {
      case "gemini": {
        if (!this.gemini.isConfigured()) {
          return { provider: "gemini", configured: false, pingSuccess: false, latencyMs: 0, message: "GEMINI_API_KEY is not configured." };
        }
        try {
          const res = await this.gemini.simplify("Welcome parents to school.", { readingLevel: "standard" });
          return { provider: "gemini", configured: true, pingSuccess: true, latencyMs: Date.now() - startTime, message: `Connected to Gemini (${res.modelUsed}). Ping latency: ${res.latencyMs}ms` };
        } catch (e: any) {
          return { provider: "gemini", configured: true, pingSuccess: false, latencyMs: Date.now() - startTime, message: `Ping failed: ${e.message}` };
        }
      }
      case "openai": {
        if (!this.openAi.isConfigured()) {
          return { provider: "openai", configured: false, pingSuccess: false, latencyMs: 0, message: "OPENAI_API_KEY is not configured." };
        }
        try {
          const res = await this.openAi.simplify("Welcome parents to school.", { readingLevel: "standard" });
          return { provider: "openai", configured: true, pingSuccess: true, latencyMs: Date.now() - startTime, message: `Connected to OpenAI (${res.modelUsed}). Ping latency: ${res.latencyMs}ms` };
        } catch (e: any) {
          return { provider: "openai", configured: true, pingSuccess: false, latencyMs: Date.now() - startTime, message: `Ping failed: ${e.message}` };
        }
      }
      case "google_translate": {
        if (!this.googleTranslate.isConfigured()) {
          return { provider: "google_translate", configured: false, pingSuccess: false, latencyMs: 0, message: "GOOGLE_TRANSLATE_API_KEY is not configured." };
        }
        try {
          const res = await this.googleTranslate.translate("Welcome", { targetLanguage: "gu" });
          return { provider: "google_translate", configured: true, pingSuccess: true, latencyMs: Date.now() - startTime, message: `Connected to Google Cloud Translation. Translated 'Welcome' to '${res.translatedText}' in ${res.latencyMs}ms` };
        } catch (e: any) {
          return { provider: "google_translate", configured: true, pingSuccess: false, latencyMs: Date.now() - startTime, message: `Ping failed: ${e.message}` };
        }
      }
      case "bhashini": {
        if (!this.bhashini.isConfigured()) {
          return { provider: "bhashini", configured: false, pingSuccess: false, latencyMs: 0, message: "BHASHINI_API_KEY / BHASHINI_USER_ID is not configured." };
        }
        try {
          const res = await this.bhashini.translate("Welcome", { targetLanguage: "gu" });
          return { provider: "bhashini", configured: true, pingSuccess: true, latencyMs: Date.now() - startTime, message: `Connected to Bhashini ULCA API (${res.modelUsed}) in ${res.latencyMs}ms` };
        } catch (e: any) {
          return { provider: "bhashini", configured: true, pingSuccess: false, latencyMs: Date.now() - startTime, message: `Ping failed: ${e.message}` };
        }
      }
      case "offline_fallback":
      default:
        return {
          provider: "offline_fallback",
          configured: true,
          pingSuccess: true,
          latencyMs: 1,
          message: "Local deterministic pedagogical & translation engine ready (0 external network latency).",
        };
    }
  }

  // --- Resolvers ---
  private resolveSimplificationProvider(name: AiProviderName) {
    if (name === "gemini" && this.gemini.isConfigured()) return this.gemini;
    if (name === "openai" && this.openAi.isConfigured()) return this.openAi;
    return this.offlineFallback;
  }

  private resolveTranslationProvider(name: AiProviderName) {
    if (name === "google_translate" && this.googleTranslate.isConfigured()) return this.googleTranslate;
    if (name === "gemini" && this.gemini.isConfigured()) return this.gemini;
    if (name === "openai" && this.openAi.isConfigured()) return this.openAi;
    if (name === "bhashini" && this.bhashini.isConfigured()) return this.bhashini;
    return this.offlineFallback;
  }

  private resolveSttProvider(name: AiProviderName) {
    if (name === "openai" && this.openAi.isConfigured()) return this.openAi;
    if (name === "gemini" && this.gemini.isConfigured()) return this.gemini;
    if (name === "bhashini" && this.bhashini.isConfigured()) return this.bhashini;
    return this.offlineFallback;
  }

  private resolveTtsProvider(name: AiProviderName) {
    if (name === "openai" && this.openAi.isConfigured()) return this.openAi;
    if (name === "bhashini" && this.bhashini.isConfigured()) return this.bhashini;
    return this.offlineFallback;
  }

  private resolveAssistantProvider(name: AiProviderName) {
    if (name === "gemini" && this.gemini.isConfigured()) return this.gemini;
    if (name === "openai" && this.openAi.isConfigured()) return this.openAi;
    return this.offlineFallback;
  }
}

export const centralAi = new CentralAiService();
