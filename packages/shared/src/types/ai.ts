export interface AIMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: string;
}

export interface AiRequestOptions {
  prompt: string;
  systemInstruction?: string;
  temperature?: number;
  maxTokens?: number;
  responseFormat?: "json" | "text";
}

export interface AiResponse<T = any> {
  success: boolean;
  content: string;
  data?: T;
  isAiGenerated: boolean;
  provider: "gemini" | "openai" | "offline_fallback";
  modelUsed: string;
  note?: string;
  error?: string;
}

export interface TutorResponseData {
  topic: string;
  simpleExplanation: string;
  classroomExample: string;
  stepByStepActivity: {
    stepNumber: number;
    title: string;
    instruction: string;
    durationMinutes: number;
  }[];
  practiceQuestions: {
    questionNumber: number;
    question: string;
    options?: string[];
    answer: string;
    explanation: string;
  }[];
  teacherPedagogyTip: string;
  language: "en" | "gu";
}

export interface GapAnalysisResponseData {
  studentId?: string;
  studentName?: string;
  conceptName?: string;
  deterministicMetrics: {
    marksObtained: number;
    maximumMarks: number;
    calculatedPercentage: number;
    masteryStatus: string;
    priority: string;
  };
  aiPedagogicalDiagnosis: {
    evidenceSummary: string;
    underlyingMisconception: string;
    recommendedRemedialActivities: string[];
    suggestedReassessmentMethod: string;
    ethicalSafetyDisclosure: string;
  };
}

export type AiProviderName =
  | "gemini"
  | "openai"
  | "google_translate"
  | "bhashini"
  | "web_speech"
  | "offline_fallback";

export type AiTaskType =
  | "simplification"
  | "translation"
  | "speech_to_text"
  | "text_to_speech"
  | "assistant";

export interface AiProviderConfig {
  task: AiTaskType;
  primaryProvider: AiProviderName;
  fallbackProvider?: AiProviderName;
  primaryModel?: string;
  fallbackModel?: string;
  enabled: boolean;
}

export interface AiUsageMetric {
  id: string;
  task: AiTaskType;
  provider: AiProviderName;
  model: string;
  tokensPrompt?: number;
  tokensCompletion?: number;
  latencyMs: number;
  success: boolean;
  estimatedCostUsd: number;
  timestamp: string;
  error?: string;
}

export interface SimplificationResult {
  simplifiedText: string;
  originalText: string;
  readingLevel: "very_simple" | "simple" | "standard";
  keyChangesSummary: string;
  preservationCheckPassed: boolean;
  preservationWarning?: string;
  provider: AiProviderName;
  modelUsed: string;
  latencyMs: number;
  isAiGenerated: boolean;
}

export interface TranslationResult {
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  detectedSourceLanguage?: string;
  preservedEntities: string[];
  provider: AiProviderName;
  modelUsed: string;
  latencyMs: number;
  isAiGenerated: boolean;
}

export interface TranscriptionResult {
  transcript: string;
  detectedLanguage?: string;
  confidence?: number;
  durationSeconds?: number;
  provider: AiProviderName;
  modelUsed: string;
  latencyMs: number;
  isAiGenerated: boolean;
}

export interface AudioSynthesisResult {
  audioBase64?: string;
  audioUrl?: string;
  mimeType: string;
  durationMs?: number;
  provider: AiProviderName;
  modelUsed: string;
  latencyMs: number;
  isAiGenerated: boolean;
  cached?: boolean;
}

