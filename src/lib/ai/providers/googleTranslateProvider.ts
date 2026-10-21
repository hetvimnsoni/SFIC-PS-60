import type {
  ITranslationProvider,
  TranslationOptions,
} from "./interfaces";
import type { TranslationResult, AiProviderName } from "@/lib/types";
import { sanitizePrompt } from "../aiProvider";

const TIMEOUT_MS = 20000;

export class GoogleTranslateProvider implements ITranslationProvider {
  name: AiProviderName = "google_translate";
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey =
      apiKey ||
      process.env.GOOGLE_TRANSLATE_API_KEY?.trim() ||
      process.env.GOOGLE_CLOUD_API_KEY?.trim() ||
      "";
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.length > 5);
  }

  async translate(text: string, options: TranslationOptions): Promise<TranslationResult> {
    const startTime = Date.now();
    if (!this.isConfigured()) {
      throw new Error("Google Cloud Translation API key is not configured.");
    }

    const cleanText = sanitizePrompt(text);
    const url = `https://translation.googleapis.com/language/translate/v2?key=${this.apiKey}`;

    const payload: any = {
      q: [cleanText],
      target: options.targetLanguage,
      format: "text",
    };

    if (options.sourceLanguage && options.sourceLanguage !== "auto") {
      payload.source = options.sourceLanguage;
    }

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Google Translate API HTTP ${response.status}: ${errText.slice(0, 160)}`);
    }

    const data = await response.json();
    const item = data.data?.translations?.[0];

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
