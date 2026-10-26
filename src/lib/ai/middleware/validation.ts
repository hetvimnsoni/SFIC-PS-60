import { ValidationError } from "../utils/errors";
import type { AiProviderName, AiTaskType } from "../types";

export interface ChatValidationRules {
  maxCharacters?: number;
  minCharacters?: number;
  requireMessage?: boolean;
}

export function validateChatMessage(
  message: unknown,
  rules: ChatValidationRules = { maxCharacters: 4000, minCharacters: 1, requireMessage: true }
): string {
  if (message === undefined || message === null || typeof message !== "string") {
    throw new ValidationError("Message is required and must be a text string.");
  }

  const trimmed = message.trim();
  if (rules.requireMessage && trimmed.length === 0) {
    throw new ValidationError("Message is required.");
  }

  if (rules.maxCharacters && trimmed.length > rules.maxCharacters) {
    throw new ValidationError(
      `Message is too long. Please limit your question to ${rules.maxCharacters.toLocaleString()} characters.`
    );
  }

  return trimmed;
}

export function validateProviderSelection(provider: unknown): AiProviderName {
  const validProviders: AiProviderName[] = [
    "openai",
    "gemini",
    "anthropic",
    "google_translate",
    "bhashini",
    "offline_fallback",
  ];

  if (typeof provider !== "string" || !validProviders.includes(provider as AiProviderName)) {
    throw new ValidationError(
      `Invalid provider selection '${String(provider)}'. Supported providers: ${validProviders.join(", ")}`
    );
  }

  return provider as AiProviderName;
}

export function validateTaskType(task: unknown): AiTaskType {
  const validTasks: AiTaskType[] = [
    "chat",
    "simplification",
    "translation",
    "speech_to_text",
    "text_to_speech",
    "assistant",
  ];

  if (typeof task !== "string" || !validTasks.includes(task as AiTaskType)) {
    throw new ValidationError(
      `Invalid task type '${String(task)}'. Supported tasks: ${validTasks.join(", ")}`
    );
  }

  return task as AiTaskType;
}
