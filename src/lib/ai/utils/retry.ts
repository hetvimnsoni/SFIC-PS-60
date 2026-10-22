import { AiError } from "./errors";

export interface RetryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  backoffFactor?: number;
  maxDelayMs?: number;
}

export async function withRetry<T>(
  operation: (attempt: number) => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const maxRetries = options.maxRetries ?? 2;
  const initialDelay = options.initialDelayMs ?? 500;
  const backoffFactor = options.backoffFactor ?? 2;
  const maxDelay = options.maxDelayMs ?? 4000;

  let lastError: any;

  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      return await operation(attempt);
    } catch (err: any) {
      lastError = err;

      // Don't retry non-retryable errors (e.g. 401 Auth, 400 Validation, 403 Forbidden)
      if (err instanceof AiError && !err.isRetryable) {
        throw err;
      }

      if (err?.statusCode === 401 || err?.statusCode === 403 || err?.statusCode === 400) {
        throw err;
      }

      // Check if we exhausted retries
      if (attempt > maxRetries) {
        break;
      }

      // Calculate exponential backoff with jitter
      const delay = Math.min(
        initialDelay * Math.pow(backoffFactor, attempt - 1) + Math.random() * 200,
        maxDelay
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}
