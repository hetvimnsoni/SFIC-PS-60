/**
 * Backward-Compatibility Facade
 * Delegates directly to the new centralized router in src/lib/ai/router.ts.
 */
import { aiRouter } from "./router";
import type {
  SimplificationOptions,
  TranslationOptions,
  TranscriptionOptions,
  AudioSynthesisOptions,
  AssistantContext,
} from "./types";
import type {
  SimplificationResult,
  TranslationResult,
  TranscriptionResult,
  AudioSynthesisResult,
  AiTaskType,
  AiProviderName,
  AiProviderConfig,
} from "@/lib/types";

export class CentralAiService {
  async getConfig(task: AiTaskType): Promise<AiProviderConfig> {
    return aiRouter.getTaskConfig(task);
  }

  async simplify(text: string, options: SimplificationOptions): Promise<SimplificationResult> {
    return aiRouter.simplify({
      text,
      readingLevel: options.readingLevel,
      preserveEntities: options.preserveEntities,
    });
  }

  async translate(text: string, options: TranslationOptions): Promise<TranslationResult> {
    return aiRouter.translate({
      text,
      sourceLanguage: options.sourceLanguage,
      targetLanguage: options.targetLanguage,
      readingLevel: options.readingLevel,
      preserveEntities: options.preserveEntities,
    });
  }

  async transcribe(
    audioBuffer: Buffer,
    mimeType: string,
    options?: TranscriptionOptions
  ): Promise<TranscriptionResult> {
    return aiRouter.transcribe({
      audioBuffer,
      mimeType,
      options,
    });
  }

  async synthesize(text: string, options: AudioSynthesisOptions): Promise<AudioSynthesisResult> {
    return aiRouter.synthesize({
      text,
      options,
    });
  }

  async askNoticeAssistant(query: string, context: AssistantContext) {
    return aiRouter.askNoticeAssistant({
      query,
      context,
    });
  }

  async testProviderConnection(providerName: AiProviderName): Promise<{
    provider: AiProviderName;
    configured: boolean;
    pingSuccess: boolean;
    latencyMs: number;
    message: string;
  }> {
    const res = await aiRouter.testProviderConnection(providerName);
    return {
      provider: providerName,
      configured: res.status !== "Not Configured",
      pingSuccess: res.success,
      latencyMs: res.latencyMs,
      message: res.message,
    };
  }
}

export const centralAi = new CentralAiService();
