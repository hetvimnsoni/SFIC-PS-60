const MAX_INPUT_CHARS = 4000;

/**
 * Strips personal identifiers (phone numbers, email addresses) and caps length to prevent token overflow
 */
export function sanitizePrompt(text: string): string {
  if (!text) return "";
  let sanitized = text.slice(0, MAX_INPUT_CHARS);
  // Anonymize phone numbers, email addresses if any accidentally passed
  sanitized = sanitized.replace(
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/g,
    "[EMAIL]"
  );
  sanitized = sanitized.replace(/\b\d{10}\b/g, "[PHONE]");

  // Neutralize prompt injection attempts and system instruction overrides
  sanitized = sanitized
    .replace(/(?:SYSTEM\s+OVERRIDE|SYSTEM_OVERRIDE)\s*:/gi, "[FILTERED_INSTRUCTION]:")
    .replace(/(?:IGNORE\s+ALL\s+PREVIOUS\s+INSTRUCTIONS)\s*:/gi, "[FILTERED_INSTRUCTION]:")
    .replace(/\[\s*SYSTEM\s*\]/gi, "[FILTERED_ROLE]");

  return sanitized;
}

/**
 * Robust JSON parser that extracts structured payloads wrapped in markdown code fences
 */
export function extractJsonFromMarkdown<T = any>(text: string): T | null {
  if (!text) return null;
  try {
    return JSON.parse(text) as T;
  } catch {
    // Try to extract content between ```json and ``` or between { and }
    const matchJsonFence = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (matchJsonFence && matchJsonFence[1]) {
      try {
        return JSON.parse(matchJsonFence[1].trim()) as T;
      } catch {
        // continue
      }
    }

    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      try {
        return JSON.parse(text.slice(firstBrace, lastBrace + 1)) as T;
      } catch {
        // continue
      }
    }

    const firstBracket = text.indexOf("[");
    const lastBracket = text.lastIndexOf("]");
    if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
      try {
        return JSON.parse(text.slice(firstBracket, lastBracket + 1)) as T;
      } catch {
        // continue
      }
    }
  }
  return null;
}
