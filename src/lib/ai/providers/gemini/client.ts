import { AuthenticationError, RateLimitError, ProviderUnavailableError, AiError } from "../../utils/errors";
import { withTimeout } from "../../utils/timeout";
import type { GeminiGeneratePayload } from "./types";

export class GeminiClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl: string = "https://generativelanguage.googleapis.com/v1beta") {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl.replace(/\/+$/, "");
  }

  public async generateContent(
    model: string,
    payload: GeminiGeneratePayload,
    timeoutMs: number = 25000
  ): Promise<{ text: string; raw: any }> {
    const url = `${this.baseUrl}/models/${model}:generateContent?key=${this.apiKey}`;

    const requestPromise = fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const response = await withTimeout(requestPromise, timeoutMs, "Gemini generateContent", "gemini");

    if (!response.ok) {
      const errText = await response.text();
      let message = `Gemini API error (${response.status})`;
      try {
        const json = JSON.parse(errText);
        if (json.error?.message) {
          message += `: ${json.error.message}`;
        }
      } catch {
        message += `: ${errText.slice(0, 150)}`;
      }

      if (response.status === 400 && message.toLowerCase().includes("key")) {
        throw new AuthenticationError(message, "gemini");
      }
      if (response.status === 403 || response.status === 401) {
        throw new AuthenticationError(message, "gemini");
      }
      if (response.status === 429) {
        throw new RateLimitError(message, "gemini");
      }
      if (response.status >= 500) {
        throw new ProviderUnavailableError(message, "gemini");
      }
      throw new AiError(message, { provider: "gemini", statusCode: response.status });
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];
    const text = candidate?.content?.parts?.[0]?.text;

    if (!text && data.promptFeedback?.blockReason) {
      throw new AiError(`Gemini request blocked: ${data.promptFeedback.blockReason}`, {
        provider: "gemini",
        statusCode: 400,
      });
    }

    return {
      text: text || "",
      raw: data,
    };
  }

  public async listModels(timeoutMs: number = 10000): Promise<string[]> {
    const url = `${this.baseUrl}/models?key=${this.apiKey}`;
    const requestPromise = fetch(url, { method: "GET" });

    const response = await withTimeout(requestPromise, timeoutMs, "Gemini listModels Ping", "gemini");
    if (!response.ok) {
      const errText = await response.text();
      let msg = `Gemini Ping error (${response.status})`;
      try {
        const json = JSON.parse(errText);
        if (json.error?.message) msg += `: ${json.error.message}`;
      } catch {
        msg += `: ${errText.slice(0, 120)}`;
      }

      if (response.status === 403 || response.status === 401) throw new AuthenticationError(msg, "gemini");
      if (response.status === 429) throw new RateLimitError(msg, "gemini");
      if (response.status >= 500) throw new ProviderUnavailableError(msg, "gemini");
      throw new AiError(msg, { provider: "gemini", statusCode: response.status });
    }

    const data = await response.json();
    return Array.isArray(data.models) ? data.models.map((m: any) => m.name.replace(/^models\//, "")) : [];
  }
}
