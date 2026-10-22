import { aiRouter } from "../router";
import type { SimplificationResult, AiProviderName, ReadingLevel } from "../types";

export interface SimplifyParams {
  text: string;
  readingLevel: ReadingLevel;
  provider?: AiProviderName;
  preserveEntities?: boolean;
}

export class SimplificationService {
  async simplify(params: SimplifyParams): Promise<SimplificationResult> {
    if (!params.text || !params.text.trim()) {
      throw new Error("Text is required for simplification.");
    }

    return await aiRouter.simplify(params);
  }
}

export const simplificationService = new SimplificationService();
