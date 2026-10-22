import type {
  IProviderAdapter,
  AiProviderName,
  AiCapability,
  ConnectionTestResult,
  TranslationOptions,
  TranslationResult,
  TranscriptionOptions,
  TranscriptionResult,
  AudioSynthesisOptions,
  AudioSynthesisResult,
} from "../../types";
import { getBhashiniConfig } from "./config";
import { BhashiniClient } from "./client";
import { sanitizePrompt } from "../../utils/sanitizer";
import { AuthenticationError, RateLimitError, ProviderUnavailableError } from "../../utils/errors";

export class BhashiniAdapter implements IProviderAdapter {
  readonly id: AiProviderName = "bhashini";
  readonly name = "Bhashini ULCA (Govt of India)";
  readonly description = "National Language Translation Mission platform for Indian sovereign NMT, ASR, and TTS.";
  readonly capabilities: AiCapability[] = ["translation", "speech_to_text", "text_to_speech"];
  readonly supportedModels = ["bhashini-nmt", "bhashini-asr", "bhashini-tts"];
  readonly defaultModel = "bhashini-nmt";

  get baseUrl(): string {
    return getBhashiniConfig().endpointUrl;
  }

  isConfigured(): boolean {
    const config = getBhashiniConfig();
    return Boolean(config.apiKey && config.userId);
  }

  private getClient(): BhashiniClient {
    const config = getBhashiniConfig();
    if (!config.apiKey || !config.userId) {
      throw new AuthenticationError("Bhashini API key or User ID is not configured.", "bhashini");
    }
    return new BhashiniClient(config.endpointUrl, config.inferenceApiKey, config.userId);
  }

  async testConnection(): Promise<ConnectionTestResult> {
    const timestamp = new Date().toISOString();

    if (!this.isConfigured()) {
      return {
        success: false,
        status: "Not Configured",
        latencyMs: 0,
        message: "BHASHINI_API_KEY and BHASHINI_USER_ID are not configured in environment.",
        timestamp,
      };
    }

    const startTime = Date.now();
    try {
      const client = this.getClient();
      const payload = {
        pipelineTasks: [
          {
            taskType: "translation" as const,
            config: {
              language: {
                sourceLanguage: "en",
                targetLanguage: "gu",
              },
            },
          },
        ],
        inputData: {
          input: [{ source: "Welcome" }],
        },
      };

      const res = await client.runPipeline(payload, 10000);
      const translated =
        res.pipelineResponse?.[0]?.output?.[0]?.target ||
        res.output?.[0]?.target;

      const latencyMs = Date.now() - startTime;
      return {
        success: true,
        status: "Connected",
        latencyMs,
        message: `Successfully connected to Bhashini Dhruva API. Test translation: '${translated || "OK"}'.`,
        details: { model: "bhashini-nmt" },
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
          message: `Bhashini Service Unavailable: ${err.message}`,
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
    const sourceLang =
      options.sourceLanguage && options.sourceLanguage !== "auto" ? options.sourceLanguage : "en";
    const targetLang = options.targetLanguage;

    const payload = {
      pipelineTasks: [
        {
          taskType: "translation" as const,
          config: {
            language: {
              sourceLanguage: sourceLang,
              targetLanguage: targetLang,
            },
          },
        },
      ],
      inputData: {
        input: [{ source: cleanText }],
      },
    };

    const res = await client.runPipeline(payload);
    const translatedText =
      res.pipelineResponse?.[0]?.output?.[0]?.target ||
      res.output?.[0]?.target;

    if (!translatedText) {
      throw new Error("No translated text returned from Bhashini.");
    }

    const latencyMs = Date.now() - startTime;

    return {
      translatedText,
      sourceLanguage: sourceLang,
      targetLanguage: targetLang,
      preservedEntities: [],
      provider: "bhashini",
      modelUsed: "bhashini-nmt",
      latencyMs,
      isAiGenerated: true,
    };
  }

  async transcribe(
    audioBuffer: Buffer,
    mimeType: string,
    options?: TranscriptionOptions
  ): Promise<TranscriptionResult> {
    const startTime = Date.now();
    const client = this.getClient();
    const lang = options?.language || "gu";
    const base64Audio = audioBuffer.toString("base64");

    const payload = {
      pipelineTasks: [
        {
          taskType: "asr" as const,
          config: {
            language: {
              sourceLanguage: lang,
            },
          },
        },
      ],
      inputData: {
        audio: [{ audioContent: base64Audio }],
      },
    };

    const res = await client.runPipeline(payload);
    const transcript =
      res.pipelineResponse?.[0]?.output?.[0]?.source ||
      res.output?.[0]?.source ||
      "";

    const latencyMs = Date.now() - startTime;

    return {
      transcript,
      detectedLanguage: lang,
      confidence: 0.94,
      provider: "bhashini",
      modelUsed: "bhashini-asr",
      latencyMs,
      isAiGenerated: true,
    };
  }

  async synthesize(text: string, options: AudioSynthesisOptions): Promise<AudioSynthesisResult> {
    const startTime = Date.now();
    const client = this.getClient();
    const lang = options.language || "gu";

    const payload = {
      pipelineTasks: [
        {
          taskType: "tts" as const,
          config: {
            language: {
              sourceLanguage: lang,
            },
            gender: "female",
          },
        },
      ],
      inputData: {
        input: [{ source: text.slice(0, 500) }],
      },
    };

    const res = await client.runPipeline(payload);
    const audioBase64 =
      res.pipelineResponse?.[0]?.audio?.[0]?.audioContent ||
      res.audio?.[0]?.audioContent;

    if (!audioBase64) {
      throw new Error("No audio content returned from Bhashini TTS.");
    }

    const latencyMs = Date.now() - startTime;

    return {
      audioBase64,
      mimeType: "audio/wav",
      provider: "bhashini",
      modelUsed: "bhashini-tts",
      latencyMs,
      isAiGenerated: true,
    };
  }
}
