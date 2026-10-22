import { AuthenticationError, RateLimitError, ProviderUnavailableError, AiError } from "../../utils/errors";
import { withTimeout } from "../../utils/timeout";
import type { GoogleTranslateRequestPayload, GoogleTranslateResponsePayload } from "./types";

export class GoogleTranslateClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl: string = "https://translation.googleapis.com/language/translate/v2") {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl.replace(/\/+$/, "");
  }

  public async translate(
    payload: GoogleTranslateRequestPayload,
    timeoutMs: number = 20000
  ): Promise<GoogleTranslateResponsePayload> {
    const url = `${this.baseUrl}?key=${this.apiKey}`;

    const requestPromise = fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const response = await withTimeout(
      requestPromise,
      timeoutMs,
      "Google Cloud Translation translate",
      "google_translate"
    );

    if (!response.ok) {
      const errText = await response.text();
      let message = `Google Translation API error (${response.status})`;
      try {
        const json = JSON.parse(errText);
        if (json.error?.message) {
          message += `: ${json.error.message}`;
        }
      } catch {
        message += `: ${errText.slice(0, 150)}`;
      }

      if (response.status === 400 && message.toLowerCase().includes("key")) {
        throw new AuthenticationError(message, "google_translate");
      }
      if (response.status === 401 || response.status === 403) {
        throw new AuthenticationError(message, "google_translate");
      }
      if (response.status === 429) {
        throw new RateLimitError(message, "google_translate");
      }
      if (response.status >= 500) {
        throw new ProviderUnavailableError(message, "google_translate");
      }
      throw new AiError(message, { provider: "google_translate", statusCode: response.status });
    }

    const data: GoogleTranslateResponsePayload = await response.json();
    return data;
  }

  public async ping(timeoutMs: number = 8000): Promise<boolean> {
    const payload: GoogleTranslateRequestPayload = {
      q: ["test"],
      target: "en",
      format: "text",
    };
    await this.translate(payload, timeoutMs);
    return true;
  }
}
