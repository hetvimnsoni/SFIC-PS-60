import { TimeoutError } from "./errors";
import type { AiProviderName } from "../types";

export async function withTimeout<T>(
  promise: Promise<T>,
  ms: number = 25000,
  operationName: string = "AI Request",
  provider?: AiProviderName
): Promise<T> {
  let timer: NodeJS.Timeout | null = null;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(new TimeoutError(`${operationName} timed out after ${ms}ms`, provider));
    }, ms);
  });

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    return result;
  } finally {
    if (timer) clearTimeout(timer);
  }
}
