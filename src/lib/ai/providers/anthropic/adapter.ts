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
  AssistantContext,
  AssistantResponse,
} from "../../types";
import { getAnthropicConfig } from "./config";
import { AnthropicClient } from "./client";
import { sanitizePrompt, extractJsonFromMarkdown } from "../../utils/sanitizer";
import { AuthenticationError, RateLimitError, ProviderUnavailableError } from "../../utils/errors";
import type { AnthropicMessage } from "./types";

export class AnthropicAdapter implements IProviderAdapter {
  readonly id: AiProviderName = "anthropic";
  readonly name = "Anthropic Claude";
  readonly description = "Frontier Claude models engineered for nuanced comprehension, reasoning, and pedagogical alignment.";
  readonly capabilities: AiCapability[] = [
    "chat",
    "simplification",
    "translation",
    "assistant",
  ];
  readonly supportedModels = ["claude-3-5-sonnet-20241022", "claude-3-5-haiku-20241022", "claude-3-haiku-20240307"];
  readonly defaultModel = "claude-3-5-sonnet-20241022";

  get baseUrl(): string {
    return getAnthropicConfig().baseUrl;
  }

  isConfigured(): boolean {
    const config = getAnthropicConfig();
    return Boolean(config.apiKey && config.apiKey.length >= 10);
  }

  private getClient(): AnthropicClient {
    const config = getAnthropicConfig();
    if (!config.apiKey) {
      throw new AuthenticationError("Anthropic API key is not configured.", "anthropic");
    }
    return new AnthropicClient(config.apiKey, config.baseUrl, config.version);
  }

  async testConnection(): Promise<ConnectionTestResult> {
    const timestamp = new Date().toISOString();
    const config = getAnthropicConfig();

    if (!this.isConfigured()) {
      return {
        success: false,
        status: "Not Configured",
        latencyMs: 0,
        message: "ANTHROPIC_API_KEY is not configured in environment.",
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
        message: `Successfully connected to Anthropic API. Model '${config.model}' ready.`,
        details: { model: config.model, apiVersion: config.version },
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
          message: `Anthropic Service Unavailable: ${err.message}`,
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
    const model = request.model || getAnthropicConfig().model;

    const messages: AnthropicMessage[] = [];
    for (const msg of request.messages) {
      if (msg.role === "system") continue;
      messages.push({
        role: msg.role === "assistant" ? "assistant" : "user",
        content: sanitizePrompt(msg.content),
      });
    }

    if (messages.length === 0) {
      messages.push({ role: "user", content: "Hello" });
    }

    const payload = {
      model,
      max_tokens: request.maxTokens ?? 1500,
      messages,
      system: request.systemInstruction,
      temperature: request.temperature ?? 0.7,
    };

    const res = await client.createMessage(payload);
    const text = res.content?.[0]?.text || "";
    const latencyMs = Date.now() - startTime;

    return {
      text,
      content: text,
      role: "assistant",
      provider: "anthropic",
      modelUsed: model,
      latencyMs,
      isAiGenerated: true,
      usage: res.usage
        ? {
            promptTokens: res.usage.input_tokens,
            completionTokens: res.usage.output_tokens,
            totalTokens: res.usage.input_tokens + res.usage.output_tokens,
          }
        : undefined,
    };
  }

  async simplify(text: string, options: SimplificationOptions): Promise<SimplificationResult> {
    const startTime = Date.now();
    const client = this.getClient();
    const model = getAnthropicConfig().model;

    const system = `You are an educational communication specialist for primary schools in India.
Simplify this school notice for parents whose reading comprehension level is "${options.readingLevel}".
Preserve all dates, deadlines, venue details, and student instructions.
Return strictly valid JSON with keys: "simplifiedText", "keyChangesSummary", "preservationCheckPassed" (boolean). Do not include markdown codeblocks or conversational text.`;

    const res = await client.createMessage({
      model,
      max_tokens: 1000,
      messages: [{ role: "user", content: sanitizePrompt(text) }],
      system,
      temperature: 0.2,
    });

    const textOut = res.content?.[0]?.text || "";
    const parsed = extractJsonFromMarkdown<{
      simplifiedText?: string;
      keyChangesSummary?: string;
      preservationCheckPassed?: boolean;
    }>(textOut);

    const latencyMs = Date.now() - startTime;

    return {
      simplifiedText: parsed?.simplifiedText || textOut,
      originalText: text,
      readingLevel: options.readingLevel,
      keyChangesSummary: parsed?.keyChangesSummary || "Simplified for primary school parents",
      preservationCheckPassed: parsed?.preservationCheckPassed ?? true,
      provider: "anthropic",
      modelUsed: model,
      latencyMs,
      isAiGenerated: true,
    };
  }

  async translate(text: string, options: TranslationOptions): Promise<TranslationResult> {
    const startTime = Date.now();
    const client = this.getClient();
    const model = getAnthropicConfig().model;

    const system = `You are an expert multilingual Indian translator.
Translate the text accurately into target language: "${options.targetLanguage}".
Preserve all names, dates, times, and entities.
Return strictly valid JSON with keys: "translatedText", "sourceLanguage", "preservedEntities". Do not include conversational remarks.`;

    const res = await client.createMessage({
      model,
      max_tokens: 1200,
      messages: [{ role: "user", content: sanitizePrompt(text) }],
      system,
      temperature: 0.2,
    });

    const textOut = res.content?.[0]?.text || "";
    const parsed = extractJsonFromMarkdown<{
      translatedText?: string;
      sourceLanguage?: string;
      preservedEntities?: string[];
    }>(textOut);

    const latencyMs = Date.now() - startTime;

    return {
      translatedText: parsed?.translatedText || textOut,
      sourceLanguage: options.sourceLanguage || parsed?.sourceLanguage || "auto",
      targetLanguage: options.targetLanguage,
      preservedEntities: parsed?.preservedEntities || [],
      provider: "anthropic",
      modelUsed: model,
      latencyMs,
      isAiGenerated: true,
    };
  }

  async askAssistant(query: string, context: AssistantContext): Promise<AssistantResponse> {
    const startTime = Date.now();
    const client = this.getClient();
    const model = getAnthropicConfig().model;

    const noticeSnippets = context.notices
      .slice(0, 5)
      .map((n) => `[Notice ID: ${n.id}] Title: ${n.title}\nContent: ${n.originalContent}`)
      .join("\n\n");

    const system = `You are a school notice assistant. Answer questions strictly based on the school notices provided below.
If the answer cannot be found in the notices, state that clearly and politely.
Notices:\n${noticeSnippets}
Return strictly valid JSON with keys: "answer", "citedNoticeIds", "confidence" ("high" | "medium" | "low").`;

    const res = await client.createMessage({
      model,
      max_tokens: 800,
      messages: [{ role: "user", content: sanitizePrompt(query) }],
      system,
      temperature: 0.2,
    });

    const textOut = res.content?.[0]?.text || "";
    const parsed = extractJsonFromMarkdown<{
      answer?: string;
      citedNoticeIds?: string[];
      confidence?: "high" | "medium" | "low";
    }>(textOut);

    const latencyMs = Date.now() - startTime;

    return {
      answer: parsed?.answer || textOut,
      citedNoticeIds: parsed?.citedNoticeIds || [],
      confidence: parsed?.confidence || "medium",
      provider: "anthropic",
      modelUsed: model,
      latencyMs,
    };
  }
}
