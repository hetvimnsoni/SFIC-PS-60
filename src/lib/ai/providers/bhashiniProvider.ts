import type {
  ITranslationProvider,
  ISpeechToTextProvider,
  ITextToSpeechProvider,
  TranslationOptions,
  TranscriptionOptions,
  AudioSynthesisOptions,
} from "./interfaces";
import type {
  TranslationResult,
  TranscriptionResult,
  AudioSynthesisResult,
  AiProviderName,
} from "@/lib/types";
import { sanitizePrompt } from "../aiProvider";

const TIMEOUT_MS = 25000;

export class BhashiniProvider
  implements ITranslationProvider, ISpeechToTextProvider, ITextToSpeechProvider
{
  name: AiProviderName = "bhashini";
  private apiKey: string;
  private userId: string;
  private pipelineId: string;
  private inferenceApiKey: string;
  private endpointUrl: string;

  constructor() {
    this.apiKey = process.env.BHASHINI_API_KEY?.trim() || "";
    this.userId = process.env.BHASHINI_USER_ID?.trim() || "";
    this.pipelineId = process.env.BHASHINI_PIPELINE_ID?.trim() || "64392f96daac500b55c543d6";
    this.inferenceApiKey = process.env.BHASHINI_INFERENCE_KEY?.trim() || this.apiKey;
    this.endpointUrl =
      process.env.BHASHINI_ENDPOINT_URL?.trim() ||
      "https://dhruva-api.bhashini.gov.in/services/inference/pipeline";
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey && this.userId);
  }

  async translate(text: string, options: TranslationOptions): Promise<TranslationResult> {
    const startTime = Date.now();
    if (!this.isConfigured()) {
      throw new Error("Bhashini API key or User ID is not configured.");
    }

    const cleanText = sanitizePrompt(text);
    const sourceLang = options.sourceLanguage && options.sourceLanguage !== "auto" ? options.sourceLanguage : "en";
    const targetLang = options.targetLanguage;

    const payload = {
      pipelineTasks: [
        {
          taskType: "translation",
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

    const response = await fetch(this.endpointUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: this.inferenceApiKey,
        userID: this.userId,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Bhashini Translation API HTTP ${response.status}: ${errText.slice(0, 160)}`);
    }

    const data = await response.json();
    const translatedText =
      data.pipelineResponse?.[0]?.output?.[0]?.target ||
      data.output?.[0]?.target;

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
    if (!this.isConfigured()) {
      throw new Error("Bhashini API key or User ID is not configured.");
    }

    const lang = options?.language || "gu";
    const base64Audio = audioBuffer.toString("base64");

    const payload = {
      pipelineTasks: [
        {
          taskType: "asr",
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

    const response = await fetch(this.endpointUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: this.inferenceApiKey,
        userID: this.userId,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Bhashini ASR API HTTP ${response.status}: ${errText.slice(0, 160)}`);
    }

    const data = await response.json();
    const transcript =
      data.pipelineResponse?.[0]?.output?.[0]?.source ||
      data.output?.[0]?.source ||
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
    if (!this.isConfigured()) {
      throw new Error("Bhashini API key or User ID is not configured.");
    }

    const lang = options.language || "gu";
    const payload = {
      pipelineTasks: [
        {
          taskType: "tts",
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

    const response = await fetch(this.endpointUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: this.inferenceApiKey,
        userID: this.userId,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Bhashini TTS API HTTP ${response.status}: ${errText.slice(0, 160)}`);
    }

    const data = await response.json();
    const audioBase64 =
      data.pipelineResponse?.[0]?.audio?.[0]?.audioContent ||
      data.audio?.[0]?.audioContent;

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
