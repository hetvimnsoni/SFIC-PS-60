import type {
  IProviderAdapter,
  AiProviderName,
  AiCapability,
  ConnectionTestResult,
  TranslationOptions,
  TranslationResult,
} from "../../types";
import { getGoogleTranslateConfig } from "./config";
import { GoogleTranslateClient } from "./client";
import { sanitizePrompt } from "../../utils/sanitizer";
import { AuthenticationError, RateLimitError, ProviderUnavailableError } from "../../utils/errors";

export class GoogleTranslateAdapter implements IProviderAdapter {
  readonly id: AiProviderName = "google_translate";
  readonly name = "Google Cloud Translation API";
  readonly description = "High-fidelity translation across Gujarati, Hindi, Marathi, Tamil, Telugu, and English.";
  readonly capabilities: AiCapability[] = ["translation"];
  readonly supportedModels = ["google-translate-v2"];
  readonly defaultModel = "google-translate-v2";

  get baseUrl(): string {
    return getGoogleTranslateConfig().baseUrl;
  }

  isConfigured(): boolean {
    const config = getGoogleTranslateConfig();
    return Boolean(config.apiKey && config.apiKey.length >= 10);
  }

  private getClient(): GoogleTranslateClient {
    const config = getGoogleTranslateConfig();
    if (!config.apiKey) {
      throw new AuthenticationError("Google Cloud Translation API key is not configured.", "google_translate");
    }
    return new GoogleTranslateClient(config.apiKey, config.baseUrl);
  }

  async testConnection(): Promise<ConnectionTestResult> {
    const timestamp = new Date().toISOString();

    if (!this.isConfigured()) {
      return {
        success: false,
        status: "Not Configured",
        latencyMs: 0,
        message: "GOOGLE_TRANSLATE_API_KEY is not configured in environment.",
        timestamp,
      };
    }

    const startTime = Date.now();
    try {
      const client = this.getClient();
      await client.ping(10000);
      const latencyMs = Date.now() - startTime;
      return {
        success: true,
        status: "Connected",
        latencyMs,
        message: "Successfully connected to Google Cloud Translation API.",
        details: { model: "google-translate-v2" },
        timestamp,
      };
    } catch (err: any) {
      const latencyMs = Date.now() - startTime;
      if (err instanceof AuthenticationError || err.statusCode === 401 || err.statusCode === 403) {
        return {
          success: false,
          status: "Invalid Credentials",
          latencyMs,
          message: `Authentication Failed: ${err.message}`,
          timestamp,
        };
      }
      if (err instanceof RateLimitError || err.statusCode === 429) {
        return {
          success: false,
          status: "Rate Limited",
          latencyMs,
          message: `Rate Limit Exceeded: ${err.message}`,
          timestamp,
        };
      }
      if (err instanceof ProviderUnavailableError || (err.statusCode && err.statusCode >= 500)) {
        return {
          success: false,
          status: "Provider Unavailable",
          latencyMs,
          message: `Google Translation Service Unavailable: ${err.message}`,
          timestamp,
        };
      }
      return {
        success: false,
        status: "Configuration Error",
        latencyMs,
        message: `Connection Error: ${err.message}`,
        timestamp,
      };
    }
  }

  async translate(text: string, options: TranslationOptions): Promise<TranslationResult> {
    const startTime = Date.now();
    const client = this.getClient();
    const cleanText = sanitizePrompt(text);

    const payload: any = {
      q: [cleanText],
      target: options.targetLanguage,
      format: "text",
    };

    if (options.sourceLanguage && options.sourceLanguage !== "auto") {
      payload.source = options.sourceLanguage;
    }

    const res = await client.translate(payload);
    const item = res.data?.translations?.[0];

    if (!item?.translatedText) {
      throw new Error("No translation returned from Google Cloud Translation API.");
    }

    const latencyMs = Date.now() - startTime;

    return {
      translatedText: item.translatedText,
      sourceLanguage: options.sourceLanguage || item.detectedSourceLanguage || "auto",
      targetLanguage: options.targetLanguage,
      detectedSourceLanguage: item.detectedSourceLanguage,
      preservedEntities: [],
      provider: "google_translate",
      modelUsed: "google-translate-v2",
      latencyMs,
      isAiGenerated: true,
    };
  }
}
