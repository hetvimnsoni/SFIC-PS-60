import { aiRouter } from "../router";
import type { TranscriptionResult, AiProviderName, TranscriptionOptions } from "../types";

export interface TranscribeParams {
  audioBuffer: Buffer;
  mimeType: string;
  options?: TranscriptionOptions;
  provider?: AiProviderName;
}

export class SpeechToTextService {
  async transcribe(params: TranscribeParams): Promise<TranscriptionResult> {
    if (!params.audioBuffer || params.audioBuffer.length === 0) {
      throw new Error("Audio buffer is required for transcription.");
    }

    return await aiRouter.transcribe(params);
  }
}

export const speechToTextService = new SpeechToTextService();
