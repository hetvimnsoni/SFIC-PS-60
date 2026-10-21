import type {
  ReadingLevel,
  SupportedLanguage,
  SimplificationResult,
  TranslationResult,
  TranscriptionResult,
  AudioSynthesisResult,
  SchoolNotice,
  AiProviderName,
} from "@/lib/types";

export interface SimplificationOptions {
  readingLevel: ReadingLevel;
  originalLanguage?: SupportedLanguage;
  preserveEntities?: boolean;
}

export interface ISimplificationProvider {
  name: AiProviderName;
  simplify(text: string, options: SimplificationOptions): Promise<SimplificationResult>;
}

export interface TranslationOptions {
  sourceLanguage?: string;
  targetLanguage: string;
  readingLevel?: ReadingLevel;
  preserveEntities?: boolean;
}

export interface ITranslationProvider {
  name: AiProviderName;
  translate(text: string, options: TranslationOptions): Promise<TranslationResult>;
}

export interface TranscriptionOptions {
  language?: string;
  prompt?: string;
}

export interface ISpeechToTextProvider {
  name: AiProviderName;
  transcribe(audioBuffer: Buffer, mimeType: string, options?: TranscriptionOptions): Promise<TranscriptionResult>;
}

export interface AudioSynthesisOptions {
  language: string;
  voice?: string;
  speed?: number;
}

export interface ITextToSpeechProvider {
  name: AiProviderName;
  synthesize(text: string, options: AudioSynthesisOptions): Promise<AudioSynthesisResult>;
}

export interface AssistantContext {
  notices: SchoolNotice[];
  userRole?: string;
  studentGrade?: number;
  studentSection?: string;
}

export interface IAssistantProvider {
  name: AiProviderName;
  ask(query: string, context: AssistantContext): Promise<{
    answer: string;
    citedNoticeIds: string[];
    confidence: "high" | "medium" | "low";
    provider: AiProviderName;
    modelUsed: string;
    latencyMs: number;
  }>;
}
