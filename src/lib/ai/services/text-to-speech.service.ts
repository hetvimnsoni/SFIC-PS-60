import { aiRouter } from "../router";
import type { AudioSynthesisResult, AiProviderName, AudioSynthesisOptions } from "../types";

export interface SynthesizeParams {
  text: string;
  options: AudioSynthesisOptions;
  provider?: AiProviderName;
}

export class TextToSpeechService {
  async synthesize(params: SynthesizeParams): Promise<AudioSynthesisResult> {
    if (!params.text || !params.text.trim()) {
      throw new Error("Text is required for speech synthesis.");
    }

    return await aiRouter.synthesize(params);
  }
}

export const textToSpeechService = new TextToSpeechService();
