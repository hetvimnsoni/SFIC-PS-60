import type {
  ReadingLevel,
  SupportedLanguage,
  SimplificationResult,
  TranslationResult,
  TranscriptionResult,
  AudioSynthesisResult,
  SchoolNotice,
  AiProviderName,
  AiTaskType,
  AiProviderConfig,
  AiUsageMetric,
} from "@/lib/types";

export type {
  ReadingLevel,
  SupportedLanguage,
  SimplificationResult,
  TranslationResult,
  TranscriptionResult,
  AudioSynthesisResult,
  SchoolNotice,
  AiProviderName,
  AiTaskType,
  AiProviderConfig,
  AiUsageMetric,
};

export type AiCapability =
  | "chat"
  | "simplification"
  | "translation"
  | "speech_to_text"
  | "text_to_speech"
  | "assistant";

export type ConnectionStatus =
  | "Connected"
  | "Not Configured"
  | "Invalid Credentials"
  | "Rate Limited"
  | "Provider Unavailable"
  | "Configuration Error"
  | "Unknown";

export interface ConnectionTestResult {
  success: boolean;
  status: ConnectionStatus;
  latencyMs: number;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
}

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
  timestamp?: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  systemInstruction?: string;
  temperature?: number;
  maxTokens?: number;
  responseFormat?: "text" | "json";
  model?: string;
}

export interface ChatResponse {
  text: string;
  content: string;
  role: "assistant";
  provider: AiProviderName;
  modelUsed: string;
  latencyMs: number;
  isAiGenerated: boolean;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  note?: string;
}

export interface SimplificationOptions {
  readingLevel: ReadingLevel;
  originalLanguage?: SupportedLanguage;
  preserveEntities?: boolean;
}

export interface TranslationOptions {
  sourceLanguage?: string;
  targetLanguage: string;
  readingLevel?: ReadingLevel;
  preserveEntities?: boolean;
}

export interface TranscriptionOptions {
  language?: string;
  prompt?: string;
}

export interface AudioSynthesisOptions {
  language: string;
  voice?: string;
  speed?: number;
}

export interface AssistantContext {
  notices: SchoolNotice[];
  userRole?: string;
  studentGrade?: number;
  studentSection?: string;
  language?: string;
}

export interface AssistantResponse {
  answer: string;
  citedNoticeIds: string[];
  confidence: "high" | "medium" | "low";
  provider: AiProviderName;
  modelUsed: string;
  latencyMs: number;
}

export interface ProviderMetadata {
  id: AiProviderName;
  name: string;
  description: string;
  logoIcon: string;
  docUrl: string;
  capabilities: AiCapability[];
  supportedModels: string[];
  defaultModel: string;
  baseUrl?: string;
  envKeys: string[];
}

export interface IProviderAdapter {
  readonly id: AiProviderName;
  readonly name: string;
  readonly description: string;
  readonly capabilities: AiCapability[];
  readonly supportedModels: string[];
  readonly defaultModel: string;
  readonly baseUrl?: string;

  isConfigured(): boolean;
  testConnection(): Promise<ConnectionTestResult>;

  chat?(request: ChatRequest): Promise<ChatResponse>;
  simplify?(text: string, options: SimplificationOptions): Promise<SimplificationResult>;
  translate?(text: string, options: TranslationOptions): Promise<TranslationResult>;
  transcribe?(audioBuffer: Buffer, mimeType: string, options?: TranscriptionOptions): Promise<TranscriptionResult>;
  synthesize?(text: string, options: AudioSynthesisOptions): Promise<AudioSynthesisResult>;
  askAssistant?(query: string, context: AssistantContext): Promise<AssistantResponse>;
}
