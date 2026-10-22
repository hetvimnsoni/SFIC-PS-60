import { AuthenticationError, RateLimitError, ProviderUnavailableError, AiError } from "../../utils/errors";
import { withTimeout } from "../../utils/timeout";
import type { BhashiniPipelinePayload, BhashiniPipelineResponse } from "./types";

export class BhashiniClient {
  private endpointUrl: string;
  private inferenceApiKey: string;
  private userId: string;

  constructor(endpointUrl: string, inferenceApiKey: string, userId: string) {
    this.endpointUrl = endpointUrl;
    this.inferenceApiKey = inferenceApiKey;
    this.userId = userId;
  }

  public async runPipeline(
    payload: BhashiniPipelinePayload,
    timeoutMs: number = 25000
  ): Promise<BhashiniPipelineResponse> {
    const requestPromise = fetch(this.endpointUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: this.inferenceApiKey,
        userID: this.userId,
      },
      body: JSON.stringify(payload),
    });

    const response = await withTimeout(requestPromise, timeoutMs, "Bhashini runPipeline", "bhashini");

    if (!response.ok) {
      const errText = await response.text();
      let message = `Bhashini API error (${response.status})`;
      try {
        const json = JSON.parse(errText);
        if (json.message || json.error) {
          message += `: ${json.message || json.error}`;
        }
      } catch {
        message += `: ${errText.slice(0, 150)}`;
      }

      if (response.status === 401 || response.status === 403) {
        throw new AuthenticationError(message, "bhashini");
      }
      if (response.status === 429) {
        throw new RateLimitError(message, "bhashini");
      }
      if (response.status >= 500) {
        throw new ProviderUnavailableError(message, "bhashini");
      }
      throw new AiError(message, { provider: "bhashini", statusCode: response.status });
    }

    const data: BhashiniPipelineResponse = await response.json();
    return data;
  }
}
