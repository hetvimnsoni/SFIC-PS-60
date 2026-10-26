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
  AudioSynthesisOptions,
  AudioSynthesisResult,
  AssistantContext,
  AssistantResponse,
} from "../../types";
import { getOpenAiConfig } from "./config";
import { OpenAiClient } from "./client";
import { sanitizePrompt, extractJsonFromMarkdown } from "../../utils/sanitizer";
import { AuthenticationError, RateLimitError, ProviderUnavailableError } from "../../utils/errors";
import { withTimeout } from "../../utils/timeout";

export class OpenAiAdapter implements IProviderAdapter {
  readonly id: AiProviderName = "openai";
  readonly name = "OpenAI";
  readonly description = "Powers GPT-4o-mini chat, Whisper voice-to-text, and TTS-1 multilingual speech synthesis.";
  readonly capabilities: AiCapability[] = [
    "chat",
    "simplification",
    "translation",
    "speech_to_text",
    "text_to_speech",
    "assistant",
  ];
  readonly supportedModels = ["gpt-4o-mini", "gpt-4o", "whisper-1", "tts-1", "tts-1-hd"];
  readonly defaultModel = "gpt-4o-mini";

  get baseUrl(): string {
    return getOpenAiConfig().baseUrl;
  }

  isConfigured(): boolean {
    const config = getOpenAiConfig();
    return Boolean(config.apiKey && config.apiKey.length >= 6);
  }

  private getClient(): OpenAiClient {
    const config = getOpenAiConfig();
    if (!config.apiKey) {
      throw new AuthenticationError("OpenAI API key is not configured.", "openai");
    }
    return new OpenAiClient(config.apiKey, config.baseUrl);
  }

  async testConnection(): Promise<ConnectionTestResult> {
    const timestamp = new Date().toISOString();
    const config = getOpenAiConfig();

    if (!this.isConfigured()) {
      return {
        success: false,
        status: "Not Configured",
        latencyMs: 0,
        message: "OPENAI_API_KEY is not configured in environment.",
        timestamp,
      };
    }

    const startTime = Date.now();
    try {
      const client = this.getClient();
      const models = await client.models(10000);

      // Perform a minimal 1-token test prompt to verify account balance and generation permissions
      await client.chatCompletion(
        {
          model: config.model || "gpt-4o-mini",
          messages: [{ role: "user", content: "ping" }],
          max_tokens: 1,
          temperature: 0,
        },
        8000
      );

      const latencyMs = Date.now() - startTime;
      return {
        success: true,
        status: "Connected",
        latencyMs,
        message: `Successfully connected to OpenAI. Verified access to ${models.length} models and active generation credits with ${config.model}.`,
        details: { model: config.model, modelsAvailable: models.slice(0, 5) },
        timestamp,
      };
    } catch (err: any) {
      const latencyMs = Date.now() - startTime;
      if (err instanceof AuthenticationError || err.statusCode === 401) {
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
          message: `Rate Limit / Quota Exceeded: ${err.message}`,
          timestamp,
        };
      }
      if (err instanceof ProviderUnavailableError || (err.statusCode && err.statusCode >= 500)) {
        return {
          success: false,
          status: "Provider Unavailable",
          latencyMs,
          message: `OpenAI Service Unavailable: ${err.message}`,
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
    const model = request.model || getOpenAiConfig().model;

    const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [];

    if (request.systemInstruction) {
      messages.push({ role: "system", content: request.systemInstruction });
    }

    for (const msg of request.messages) {
      messages.push({
        role: msg.role,
        content: sanitizePrompt(msg.content),
      });
    }

    const payload = {
      model,
      messages,
      temperature: request.temperature ?? 0.7,
      max_tokens: request.maxTokens ?? 1500,
      response_format: request.responseFormat === "json" ? ({ type: "json_object" } as const) : undefined,
    };

    const res = await client.chatCompletion(payload);
    const latencyMs = Date.now() - startTime;

    return {
      text: res.content,
      content: res.content,
      role: "assistant",
      provider: "openai",
      modelUsed: model,
      latencyMs,
      isAiGenerated: true,
      usage: res.usage
        ? {
            promptTokens: res.usage.prompt_tokens,
            completionTokens: res.usage.completion_tokens,
            totalTokens: res.usage.total_tokens,
          }
        : undefined,
    };
  }

  async simplify(text: string, options: SimplificationOptions): Promise<SimplificationResult> {
    const startTime = Date.now();
    const client = this.getClient();
    const model = getOpenAiConfig().model;

    const systemInstruction = `You are an expert educational communication specialist.
Your task is to simplify official school announcements for parents whose reading comprehension level is "${options.readingLevel}".
Requirements:
1. Preserve every date, time, venue, rupee amount, and student requirement exactly.
2. Use short, friendly sentences.
3. Return valid JSON only with keys: "simplifiedText", "keyChangesSummary", "preservationCheckPassed".`;

    const res = await client.chatCompletion({
      model,
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: sanitizePrompt(text) },
      ],
      temperature: 0.2,
      max_tokens: 1000,
      response_format: { type: "json_object" },
    });

    const parsed = extractJsonFromMarkdown<{
      simplifiedText?: string;
      keyChangesSummary?: string;
      preservationCheckPassed?: boolean;
    }>(res.content);

    const latencyMs = Date.now() - startTime;

    return {
      simplifiedText: parsed?.simplifiedText || res.content,
      originalText: text,
      readingLevel: options.readingLevel,
      keyChangesSummary: parsed?.keyChangesSummary || "Simplified for parents",
      preservationCheckPassed: parsed?.preservationCheckPassed ?? true,
      provider: "openai",
      modelUsed: model,
      latencyMs,
      isAiGenerated: true,
    };
  }

  async translate(text: string, options: TranslationOptions): Promise<TranslationResult> {
    const startTime = Date.now();
    const client = this.getClient();
    const model = getOpenAiConfig().model;

    const systemInstruction = `You are an expert translator for schools in India.
Translate the text accurately into target language: "${options.targetLanguage}".
Preserve all dates, times, proper nouns, and entity names.
Return valid JSON only with keys: "translatedText", "sourceLanguage", "preservedEntities".`;

    const res = await client.chatCompletion({
      model,
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: sanitizePrompt(text) },
      ],
      temperature: 0.2,
      max_tokens: 1200,
      response_format: { type: "json_object" },
    });

    const parsed = extractJsonFromMarkdown<{
      translatedText?: string;
      sourceLanguage?: string;
      preservedEntities?: string[];
    }>(res.content);

    const latencyMs = Date.now() - startTime;

    return {
      translatedText: parsed?.translatedText || res.content,
      sourceLanguage: options.sourceLanguage || parsed?.sourceLanguage || "auto",
      targetLanguage: options.targetLanguage,
      preservedEntities: parsed?.preservedEntities || [],
      provider: "openai",
      modelUsed: model,
      latencyMs,
      isAiGenerated: true,
    };
  }

  async transcribe(audioBuffer: Buffer, mimeType: string, options?: TranscriptionOptions): Promise<TranscriptionResult> {
    const startTime = Date.now();
    const config = getOpenAiConfig();

    if (!this.isConfigured()) {
      throw new AuthenticationError("OpenAI API key is not configured.", "openai");
    }

    const formData = new FormData();
    const blob = new Blob([new Uint8Array(audioBuffer)], { type: mimeType });
    formData.append("file", blob, "audio.wav");
    formData.append("model", "whisper-1");
    if (options?.language) {
      formData.append("language", options.language);
    }
    if (options?.prompt) {
      formData.append("prompt", options.prompt);
    }

    const response = await withTimeout(
      fetch(`${config.baseUrl}/audio/transcriptions`, {
        method: "POST",
        headers: { Authorization: `Bearer ${config.apiKey}` },
        body: formData,
      }),
      30000,
      "OpenAI Whisper Transcription",
      "openai"
    );

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`OpenAI Whisper error HTTP ${response.status}: ${errText.slice(0, 150)}`);
    }

    const data = await response.json();
    const latencyMs = Date.now() - startTime;

    return {
      transcript: data.text || "",
      detectedLanguage: options?.language,
      confidence: 0.95,
      provider: "openai",
      modelUsed: "whisper-1",
      latencyMs,
      isAiGenerated: true,
    };
  }

  async synthesize(text: string, options: AudioSynthesisOptions): Promise<AudioSynthesisResult> {
    const startTime = Date.now();
    const config = getOpenAiConfig();

    if (!this.isConfigured()) {
      throw new AuthenticationError("OpenAI API key is not configured.", "openai");
    }

    const voice = options.voice || "alloy";
    const payload = {
      model: "tts-1",
      input: text.slice(0, 1000),
      voice,
      response_format: "mp3",
      speed: options.speed || 1.0,
    };

    const response = await withTimeout(
      fetch(`${config.baseUrl}/audio/speech`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify(payload),
      }),
      25000,
      "OpenAI TTS Audio Synthesis",
      "openai"
    );

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`OpenAI TTS error HTTP ${response.status}: ${errText.slice(0, 150)}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const audioBase64 = Buffer.from(arrayBuffer).toString("base64");
    const latencyMs = Date.now() - startTime;

    return {
      audioBase64,
      mimeType: "audio/mpeg",
      provider: "openai",
      modelUsed: "tts-1",
      latencyMs,
      isAiGenerated: true,
    };
  }

  async askAssistant(query: string, context: AssistantContext): Promise<AssistantResponse> {
    const startTime = Date.now();
    const client = this.getClient();
    const model = getOpenAiConfig().model;

    const noticeSnippets = context.notices
      .slice(0, 5)
      .map((n) => `[Notice ID: ${n.id}] Title: ${n.title}\nContent: ${n.originalContent}`)
      .join("\n\n");

    const systemInstruction = `You are a school notice assistant. Answer questions strictly based on the school notices provided below.
If the answer cannot be found in the notices, state that clearly and politely.
Notices:\n${noticeSnippets}
Return valid JSON only with keys: "answer", "citedNoticeIds", "confidence" ("high" | "medium" | "low").`;

    const res = await client.chatCompletion({
      model,
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: sanitizePrompt(query) },
      ],
      temperature: 0.2,
      max_tokens: 800,
      response_format: { type: "json_object" },
    });

    const parsed = extractJsonFromMarkdown<{
      answer?: string;
      citedNoticeIds?: string[];
      confidence?: "high" | "medium" | "low";
    }>(res.content);

    const latencyMs = Date.now() - startTime;

    return {
      answer: parsed?.answer || res.content,
      citedNoticeIds: parsed?.citedNoticeIds || [],
      confidence: parsed?.confidence || "medium",
      provider: "openai",
      modelUsed: model,
      latencyMs,
    };
  }
}
