import { AuthenticationError, RateLimitError, ProviderUnavailableError, AiError } from "../../utils/errors";
import { withTimeout } from "../../utils/timeout";
import type { AnthropicMessagesPayload, AnthropicMessagesResponse } from "./types";

export class AnthropicClient {
  private apiKey: string;
  private baseUrl: string;
  private version: string;

  constructor(
    apiKey: string,
    baseUrl: string = "https://api.anthropic.com/v1",
    version: string = "2023-06-01"
  ) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl.replace(/\/+$/, "");
    this.version = version;
  }

  public async createMessage(
    payload: AnthropicMessagesPayload,
    timeoutMs: number = 25000
  ): Promise<AnthropicMessagesResponse> {
    const url = `${this.baseUrl}/messages`;

    const requestPromise = fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
        "anthropic-version": this.version,
      },
      body: JSON.stringify(payload),
    });

    const response = await withTimeout(requestPromise, timeoutMs, "Anthropic Claude createMessage", "anthropic");

    if (!response.ok) {
      const errText = await response.text();
      let message = `Anthropic API error (${response.status})`;
      try {
        const json = JSON.parse(errText);
        if (json.error?.message) {
          message += `: ${json.error.message}`;
        }
      } catch {
        message += `: ${errText.slice(0, 150)}`;
      }

      if (response.status === 401 || response.status === 403) {
        throw new AuthenticationError(message, "anthropic");
      }
      if (response.status === 429) {
        throw new RateLimitError(message, "anthropic");
      }
      if (response.status >= 500) {
        throw new ProviderUnavailableError(message, "anthropic");
      }
      throw new AiError(message, { provider: "anthropic", statusCode: response.status });
    }

    const data: AnthropicMessagesResponse = await response.json();
    return data;
  }

  public async ping(timeoutMs: number = 10000): Promise<boolean> {
    // Anthropic doesn't have a public GET /models endpoint, so test with a 1-token minimal query
    const payload: AnthropicMessagesPayload = {
      model: "claude-3-haiku-20240307",
      max_tokens: 1,
      messages: [{ role: "user", content: "hi" }],
    };
    await this.createMessage(payload, timeoutMs);
    return true;
  }
}
