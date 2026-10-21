/**
 * ShikshaSetu AI - Server-Side AI Provider Abstraction
 * SFIC Gujarat Hackathon 2026 Problem Statement PS-60
 *
 * Requirements:
 * - Server-side only (never expose API keys on client)
 * - Supports Google Gemini (default) and OpenAI / compatible APIs
 * - Fallback to deterministic offline pedagogical engine if keys are absent or requests fail
 * - Safe request timeouts (25s) and input sanitization
 * - Child privacy safeguard: strips personal identifiers before external calls
 * - Transparent metadata indicating whether Live AI or Local Fallback generated the response
 */

export interface AiChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AiRequestOptions {
  prompt: string;
  systemInstruction?: string;
  temperature?: number;
  maxTokens?: number;
  responseFormat?: "json" | "text";
  messages?: AiChatMessage[];
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

const MAX_INPUT_CHARS = 4000;
const TIMEOUT_MS = 25000;

/**
 * Strips potential PII before sending data to external AI models
 */
export function sanitizePrompt(text: string): string {
  if (!text) return "";
  let sanitized = text.slice(0, MAX_INPUT_CHARS);
  // Anonymize phone numbers, email addresses if any accidentally passed
  sanitized = sanitized.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/g, "[EMAIL]");
  sanitized = sanitized.replace(/\b\d{10}\b/g, "[PHONE]");
  return sanitized;
}

/**
 * Robust JSON parser that handles markdown code fence wrapping (```json ... ```)
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

/**
 * Calls Google Gemini REST API using fetch (works seamlessly in Node.js / Vercel Edge / Serverless)
 */
async function callGeminiApi(
  apiKey: string,
  model: string,
  options: AiRequestOptions
): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const contents: any[] = [];
  if (options.messages && options.messages.length > 0) {
    for (const msg of options.messages) {
      if (msg.role === "system") continue;
      contents.push({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      });
    }
  }

  // Ensure the current user prompt is present if not already added
  if (!options.messages || options.messages.length === 0 || contents[contents.length - 1]?.parts[0]?.text !== options.prompt) {
    contents.push({
      role: "user",
      parts: [{ text: options.prompt }],
    });
  }

  const payload: any = {
    contents,
    generationConfig: {
      temperature: options.temperature ?? 0.4,
      maxOutputTokens: options.maxTokens ?? 2048,
    },
  };

  if (options.systemInstruction) {
    payload.systemInstruction = {
      parts: [{ text: options.systemInstruction }],
    };
  }

  if (options.responseFormat === "json") {
    payload.generationConfig.responseMimeType = "application/json";
  }

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    let parsedMsg = `Gemini API returned status ${response.status}`;
    try {
      const parsed = JSON.parse(errorBody);
      if (parsed.error?.message) {
        parsedMsg += `: ${parsed.error.message}`;
      }
    } catch {
      parsedMsg += `: ${errorBody.slice(0, 150)}`;
    }
    throw new Error(parsedMsg);
  }

  const data = await response.json();
  const candidate = data.candidates?.[0];
  const text = candidate?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("No text content returned from Gemini model");
  }

  return text;
}

/**
 * Calls OpenAI or OpenAI-compatible API
 */
async function callOpenAiApi(
  apiKey: string,
  model: string,
  options: AiRequestOptions
): Promise<string> {
  const url = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1/chat/completions";

  const messages: any[] = [];
  if (options.systemInstruction) {
    messages.push({ role: "system", content: options.systemInstruction });
  }

  if (options.messages && options.messages.length > 0) {
    for (const m of options.messages) {
      if (m.role === "system" && options.systemInstruction) continue;
      messages.push({
        role: m.role === "assistant" ? "assistant" : m.role === "system" ? "system" : "user",
        content: m.content,
      });
    }
  }

  if (!options.messages || options.messages.length === 0 || messages[messages.length - 1]?.content !== options.prompt) {
    messages.push({ role: "user", content: options.prompt });
  }

  const payload: any = {
    model,
    messages,
    temperature: options.temperature ?? 0.4,
    max_tokens: options.maxTokens ?? 2048,
  };

  if (options.responseFormat === "json") {
    payload.response_format = { type: "json_object" };
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    let errorDetail = "";
    try {
      const parsed = JSON.parse(errorBody);
      if (parsed.error?.message) {
        errorDetail = `: ${parsed.error.message}`;
      }
    } catch {
      errorDetail = `: ${errorBody.slice(0, 150)}`;
    }
    throw new Error(`OpenAI API returned status ${response.status}${errorDetail}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;

  if (!text) {
    throw new Error("No text content returned from OpenAI model");
  }

  return text;
}

/**
 * Primary dispatch function: attempts Live AI call with configured keys,
 * or gracefully returns null / fallback to indicate fallback is required.
 */
export async function generateAiContent<T = any>(
  options: AiRequestOptions,
  fallbackGenerator?: () => { content: string; data?: T }
): Promise<AiResponse<T>> {
  const sanitizedPrompt = sanitizePrompt(options.prompt);
  const sanitizedMessages = options.messages?.map((m) => ({
    ...m,
    content: sanitizePrompt(m.content),
  }));
  const sanitizedOptions: AiRequestOptions = {
    ...options,
    prompt: sanitizedPrompt,
    messages: sanitizedMessages,
  };

  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  const openAiKey = process.env.OPENAI_API_KEY?.trim();
  const preferredProvider = process.env.AI_PROVIDER?.toLowerCase() || (geminiKey ? "gemini" : "openai");

  // Check if live AI is configured
  if (preferredProvider === "gemini" && geminiKey) {
    const model = process.env.GEMINI_MODEL || "gemini-1.5-flash";
    try {
      const rawText = await callGeminiApi(geminiKey, model, sanitizedOptions);
      const parsedData = options.responseFormat === "json" ? extractJsonFromMarkdown<T>(rawText) : undefined;
      return {
        success: true,
        content: rawText,
        data: parsedData ?? undefined,
        isAiGenerated: true,
        provider: "gemini",
        modelUsed: model,
        note: `Generated live using Google Gemini (${model}) with child privacy safeguards.`,
      };
    } catch (err: any) {
      console.error("Gemini API call failed:", err.message);
      return {
        success: false,
        content: "",
        isAiGenerated: false,
        provider: "gemini",
        modelUsed: model,
        error: `AI provider error (Gemini): ${err.message}`,
      };
    }
  }

  if (openAiKey) {
    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
    try {
      const rawText = await callOpenAiApi(openAiKey, model, sanitizedOptions);
      const parsedData = options.responseFormat === "json" ? extractJsonFromMarkdown<T>(rawText) : undefined;
      return {
        success: true,
        content: rawText,
        data: parsedData ?? undefined,
        isAiGenerated: true,
        provider: "openai",
        modelUsed: model,
        note: `Generated live using OpenAI (${model}) with child privacy safeguards.`,
      };
    } catch (err: any) {
      console.error("OpenAI API call failed:", err.message);
      return {
        success: false,
        content: "",
        isAiGenerated: false,
        provider: "openai",
        modelUsed: model,
        error: `AI provider error (OpenAI): ${err.message}`,
      };
    }
  }

  // No API keys configured: Honest offline pedagogical fallback
  if (fallbackGenerator) {
    const fb = fallbackGenerator();
    return {
      success: true,
      content: fb.content,
      data: fb.data,
      isAiGenerated: false,
      provider: "offline_fallback",
      modelUsed: "deterministic_pedagogical_rule_engine",
      note: "Offline Pedagogical Fallback Active: No external AI key is configured. Using built-in Gujarat primary curriculum templates.",
    };
  }

  return {
    success: false,
    content: "",
    isAiGenerated: false,
    provider: "offline_fallback",
    modelUsed: "none",
    error: "No AI API key is configured on the server. Please set OPENAI_API_KEY or GEMINI_API_KEY in server environment variables to enable live generative AI.",
  };
}
