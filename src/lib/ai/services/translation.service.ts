import { aiRouter } from "../router";
import type { TranslationResult, AiProviderName, ReadingLevel } from "../types";

export interface TranslateParams {
  text: string;
  sourceLanguage?: string;
  targetLanguage: string;
  readingLevel?: ReadingLevel;
  preserveEntities?: boolean;
  provider?: AiProviderName;
}

export class TranslationService {
  async translate(params: TranslateParams): Promise<TranslationResult> {
    if (!params.text || !params.text.trim()) {
      throw new Error("Text is required for translation.");
    }
    if (!params.targetLanguage) {
      throw new Error("Target language is required.");
    }

    return await aiRouter.translate(params);
  }
}

export const translationService = new TranslationService();
