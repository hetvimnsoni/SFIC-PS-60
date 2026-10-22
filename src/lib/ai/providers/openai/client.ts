import { AuthenticationError, RateLimitError, ProviderUnavailableError, AiError } from "../../utils/errors";
import { withTimeout } from "../../utils/timeout";
import type { OpenAiChatPayload } from "./types";

export class OpenAiClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl: string = "https://api.openai.com/v1") {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl.replace(/\/+$/, "");
  }

  public async chatCompletion(payload: OpenAiChatPayload, timeoutMs: number = 25000): Promise<{
    content: string;
    usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
  }> {
    const url = `${this.baseUrl}/chat/completions`;

    const requestPromise = fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const response = await withTimeout(requestPromise, timeoutMs, "OpenAI Chat Completion", "openai");

    if (!response.ok) {
      const errText = await response.text();
      let message = `OpenAI API error (${response.status})`;
      try {
        const json = JSON.parse(errText);
        if (json.error?.message) {
          message += `: ${json.error.message}`;
        }
      } catch {
        message += `: ${errText.slice(0, 150)}`;
      }

      if (response.status === 401) {
        throw new AuthenticationError(message, "openai");
      }
      if (response.status === 429) {
        throw new RateLimitError(message, "openai");
      }
      if (response.status >= 500) {
        throw new ProviderUnavailableError(message, "openai");
      }
      throw new AiError(message, { provider: "openai", statusCode: response.status });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    return {
      content,
      usage: data.usage,
    };
  }

  public async models(timeoutMs: number = 10000): Promise<string[]> {
    const url = `${this.baseUrl}/models`;
    const requestPromise = fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    });

    const response = await withTimeout(requestPromise, timeoutMs, "OpenAI Models Ping", "openai");
    if (!response.ok) {
      const errText = await response.text();
      let msg = `OpenAI Ping error (${response.status})`;
      try {
        const json = JSON.parse(errText);
        if (json.error?.message) msg += `: ${json.error.message}`;
      } catch {
        msg += `: ${errText.slice(0, 120)}`;
      }

      if (response.status === 401) throw new AuthenticationError(msg, "openai");
      if (response.status === 429) throw new RateLimitError(msg, "openai");
      if (response.status >= 500) throw new ProviderUnavailableError(msg, "openai");
      throw new AiError(msg, { provider: "openai", statusCode: response.status });
    }

    const data = await response.json();
    return Array.isArray(data.data) ? data.data.map((m: any) => m.id) : [];
  }
}
