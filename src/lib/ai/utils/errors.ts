import type { AiProviderName } from "../types";

export class AiError extends Error {
  public readonly provider?: AiProviderName;
  public readonly statusCode: number;
  public readonly isRetryable: boolean;
  public readonly code: string;

  constructor(
    message: string,
    options: {
      provider?: AiProviderName;
      statusCode?: number;
      isRetryable?: boolean;
      code?: string;
      cause?: unknown;
    } = {}
  ) {
    super(message);
    this.name = "AiError";
    this.provider = options.provider;
    this.statusCode = options.statusCode ?? 500;
    this.isRetryable = options.isRetryable ?? false;
    this.code = options.code ?? "AI_ERROR";
    if (options.cause) {
      this.cause = options.cause;
    }
  }
}

export class AuthenticationError extends AiError {
  constructor(message: string, provider?: AiProviderName) {
    super(message, {
      provider,
      statusCode: 401,
      isRetryable: false,
      code: "AUTHENTICATION_ERROR",
    });
    this.name = "AuthenticationError";
  }
}

export class RateLimitError extends AiError {
  constructor(message: string, provider?: AiProviderName) {
    super(message, {
      provider,
      statusCode: 429,
      isRetryable: true,
      code: "RATE_LIMIT_ERROR",
    });
    this.name = "RateLimitError";
  }
}

export class TimeoutError extends AiError {
  constructor(message: string, provider?: AiProviderName) {
    super(message, {
      provider,
      statusCode: 504,
      isRetryable: true,
      code: "TIMEOUT_ERROR",
    });
    this.name = "TimeoutError";
  }
}

export class ProviderUnavailableError extends AiError {
  constructor(message: string, provider?: AiProviderName) {
    super(message, {
      provider,
      statusCode: 503,
      isRetryable: true,
      code: "PROVIDER_UNAVAILABLE",
    });
    this.name = "ProviderUnavailableError";
  }
}

export class CapabilityNotSupportedError extends AiError {
  constructor(capability: string, provider: AiProviderName) {
    super(`Capability '${capability}' is not supported by provider '${provider}'.`, {
      provider,
      statusCode: 400,
      isRetryable: false,
      code: "CAPABILITY_NOT_SUPPORTED",
    });
    this.name = "CapabilityNotSupportedError";
  }
}

export class ValidationError extends AiError {
  constructor(message: string) {
    super(message, {
      statusCode: 400,
      isRetryable: false,
      code: "VALIDATION_ERROR",
    });
    this.name = "ValidationError";
  }
}

/**
 * Strips secret tokens and private values from error messages for safe logging & user display
 */
export function sanitizeErrorMessage(message: string): string {
  if (!message) return "An unexpected AI error occurred.";
  return message
    .replace(/sk-[a-zA-Z0-9_-]{20,}/g, "sk-••••••••")
    .replace(/AIzaSy[a-zA-Z0-9_-]{20,}/g, "AIzaSy••••••••")
    .replace(/sk-ant-[a-zA-Z0-9_-]{20,}/g, "sk-ant-••••••••")
    .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/g, "[EMAIL]")
    .replace(/\b\d{10}\b/g, "[PHONE]");
}
