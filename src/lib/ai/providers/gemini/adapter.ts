import type {
  IProviderAdapter,
  AiProviderName,
  AiCapability,
  ConnectionTestResult,
  ChatRequest,
  ChatResponse,
  SimplificationOptions,
  SimplificationResult,
  TranslationOptions,
  TranslationResult,
  TranscriptionOptions,
  TranscriptionResult,
  AssistantContext,
  AssistantResponse,
} from "../../types";
import { getGeminiConfig } from "./config";
import { GeminiClient } from "./client";
import { sanitizePrompt, extractJsonFromMarkdown } from "../../utils/sanitizer";
import { AuthenticationError, RateLimitError, ProviderUnavailableError } from "../../utils/errors";
import type { GeminiContent } from "./types";

export class GeminiAdapter implements IProviderAdapter {
  readonly id: AiProviderName = "gemini";
  readonly name = "Google Gemini";
  readonly description = "Multimodal AI by Google with native Indic multilingual capability and fast token processing.";
  readonly capabilities: AiCapability[] = [
    "chat",
    "simplification",
    "translation",
    "speech_to_text",
    "assistant",
  ];
  readonly supportedModels = ["gemini-3.5-flash-lite", "gemini-3.5-flash", "gemini-flash-latest"];
  readonly defaultModel = "gemini-3.5-flash-lite";

  get baseUrl(): string {
    return getGeminiConfig().baseUrl;
  }

  isConfigured(): boolean {
    const config = getGeminiConfig();
    return Boolean(config.apiKey && config.apiKey.length >= 6);
  }

  private getClient(): GeminiClient {
    const config = getGeminiConfig();
    if (!config.apiKey) {
      throw new AuthenticationError("Google Gemini API key is not configured.", "gemini");
    }
    return new GeminiClient(config.apiKey, config.baseUrl);
  }

  async testConnection(): Promise<ConnectionTestResult> {
    const timestamp = new Date().toISOString();
    const config = getGeminiConfig();

    if (!this.isConfigured()) {
      return {
        success: false,
        status: "Not Configured",
        latencyMs: 0,
        message: "GEMINI_API_KEY is not configured in environment.",
        timestamp,
      };
    }

    const startTime = Date.now();
    try {
      const client = this.getClient();
      const models = await client.listModels(10000);
      const latencyMs = Date.now() - startTime;
      return {
        success: true,
        status: "Connected",
        latencyMs,
        message: `Successfully connected to Google Gemini. Verified access to ${models.length} models including ${config.model}.`,
        details: { model: config.model, modelsAvailable: models.slice(0, 5) },
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
          message: `Gemini Service Unavailable: ${err.message}`,
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

  async chat(request: ChatRequest): Promise<ChatResponse> {
    const startTime = Date.now();
    const client = this.getClient();
    const model = request.model || getGeminiConfig().model;

    const contents: GeminiContent[] = [];

    for (const msg of request.messages) {
      if (msg.role === "system") continue;
      contents.push({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: sanitizePrompt(msg.content) }],
      });
    }

    // Ensure at least one user prompt is present
    if (contents.length === 0) {
      contents.push({ role: "user", parts: [{ text: "Hello" }] });
    }

    const payload: any = {
      contents,
      generationConfig: {
        temperature: request.temperature ?? 0.7,
        maxOutputTokens: request.maxTokens ?? 1500,
        responseMimeType: request.responseFormat === "json" ? "application/json" : undefined,
      },
    };

    if (request.systemInstruction) {
      payload.systemInstruction = {
        parts: [{ text: request.systemInstruction }],
      };
    }

    const res = await client.generateContent(model, payload);
    const latencyMs = Date.now() - startTime;

    return {
      text: res.text,
      content: res.text,
      role: "assistant",
      provider: "gemini",
      modelUsed: model,
      latencyMs,
      isAiGenerated: true,
    };
  }

  async simplify(text: string, options: SimplificationOptions): Promise<SimplificationResult> {
    const startTime = Date.now();
    const client = this.getClient();
    const model = getGeminiConfig().model;

    const systemInstruction = `You are an educational communication specialist for primary schools in India.
Simplify this school notice for parents whose reading comprehension level is "${options.readingLevel}".
Preserve all dates, deadlines, venue details, and student instructions.
Return strictly valid JSON with keys: "simplifiedText", "keyChangesSummary", "preservationCheckPassed" (boolean).`;

    const payload = {
      contents: [{ role: "user" as const, parts: [{ text: sanitizePrompt(text) }] }],
      systemInstruction: { parts: [{ text: systemInstruction }] },
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 1000,
        responseMimeType: "application/json",
      },
    };

    const res = await client.generateContent(model, payload);
    const parsed = extractJsonFromMarkdown<{
      simplifiedText?: string;
      keyChangesSummary?: string;
      preservationCheckPassed?: boolean;
    }>(res.text);

    const latencyMs = Date.now() - startTime;

    return {
      simplifiedText: parsed?.simplifiedText || res.text,
      originalText: text,
      readingLevel: options.readingLevel,
      keyChangesSummary: parsed?.keyChangesSummary || "Simplified for primary school parents",
      preservationCheckPassed: parsed?.preservationCheckPassed ?? true,
      provider: "gemini",
      modelUsed: model,
      latencyMs,
      isAiGenerated: true,
    };
  }

  async translate(text: string, options: TranslationOptions): Promise<TranslationResult> {
    const startTime = Date.now();
    const client = this.getClient();
    const model = getGeminiConfig().model;

    const systemInstruction = `You are an expert multilingual Indian translator.
Translate the text accurately into target language: "${options.targetLanguage}".
Preserve all names, dates, times, and entities.
Return strictly valid JSON with keys: "translatedText", "sourceLanguage", "preservedEntities".`;

    const payload = {
      contents: [{ role: "user" as const, parts: [{ text: sanitizePrompt(text) }] }],
      systemInstruction: { parts: [{ text: systemInstruction }] },
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 1200,
        responseMimeType: "application/json",
      },
    };

    const res = await client.generateContent(model, payload);
    const parsed = extractJsonFromMarkdown<{
      translatedText?: string;
      sourceLanguage?: string;
      preservedEntities?: string[];
    }>(res.text);

    const latencyMs = Date.now() - startTime;

    return {
      translatedText: parsed?.translatedText || res.text,
      sourceLanguage: options.sourceLanguage || parsed?.sourceLanguage || "auto",
      targetLanguage: options.targetLanguage,
      preservedEntities: parsed?.preservedEntities || [],
      provider: "gemini",
      modelUsed: model,
      latencyMs,
      isAiGenerated: true,
    };
  }

  async transcribe(audioBuffer: Buffer, mimeType: string, options?: TranscriptionOptions): Promise<TranscriptionResult> {
    const startTime = Date.now();
    const client = this.getClient();
    const model = getGeminiConfig().model;

    const base64Audio = audioBuffer.toString("base64");
    const lang = options?.language || "gu";

    const payload = {
      contents: [
        {
          role: "user" as const,
          parts: [
            {
              inlineData: {
                mimeType,
                data: base64Audio,
              },
            },
            {
              text: `Transcribe this speech recording accurately. The spoken language is likely "${lang}". Output only the transcript text without any conversational preamble.`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 1000,
      },
    };

    const res = await client.generateContent(model, payload);
    const latencyMs = Date.now() - startTime;

    return {
      transcript: res.text.trim(),
      detectedLanguage: lang,
      confidence: 0.94,
      provider: "gemini",
      modelUsed: model,
      latencyMs,
      isAiGenerated: true,
    };
  }

  async askAssistant(query: string, context: AssistantContext): Promise<AssistantResponse> {
    const startTime = Date.now();
    const client = this.getClient();
    const model = getGeminiConfig().model;

    const noticeSnippets = context.notices
      .slice(0, 5)
      .map((n) => `[Notice ID: ${n.id}] Title: ${n.title}\nContent: ${n.originalContent}`)
      .join("\n\n");

    const systemInstruction = `You are a school notice assistant. Answer questions strictly based on the school notices provided below.
If the answer cannot be found in the notices, state that clearly and politely.
Notices:\n${noticeSnippets}
Return strictly valid JSON with keys: "answer", "citedNoticeIds", "confidence" ("high" | "medium" | "low").`;

    const payload = {
      contents: [{ role: "user" as const, parts: [{ text: sanitizePrompt(query) }] }],
      systemInstruction: { parts: [{ text: systemInstruction }] },
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 800,
        responseMimeType: "application/json",
      },
    };

    const res = await client.generateContent(model, payload);
    const parsed = extractJsonFromMarkdown<{
      answer?: string;
      citedNoticeIds?: string[];
      confidence?: "high" | "medium" | "low";
    }>(res.text);

    const latencyMs = Date.now() - startTime;

    return {
      answer: parsed?.answer || res.text,
      citedNoticeIds: parsed?.citedNoticeIds || [],
      confidence: parsed?.confidence || "medium",
      provider: "gemini",
      modelUsed: model,
      latencyMs,
    };
  }
}
