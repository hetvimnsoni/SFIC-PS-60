import type { AiProviderName } from "../types";

export interface KeyValidationResult {
  valid: boolean;
  error?: string;
  provider: AiProviderName;
}

/**
 * Validates the syntax and format of common AI provider keys
 */
export function validateKeyFormat(provider: AiProviderName, key: string): KeyValidationResult {
  const trimmed = key.trim();

  if (!trimmed) {
    return { valid: false, error: "API key cannot be empty.", provider };
  }

  switch (provider) {
    case "openai": {
      if (!trimmed.startsWith("sk-")) {
        return {
          valid: false,
          error: "OpenAI API keys typically start with 'sk-'.",
          provider,
        };
      }
      if (trimmed.length < 20) {
        return {
          valid: false,
          error: "OpenAI API key is unusually short.",
          provider,
        };
      }
      return { valid: true, provider };
    }

    case "gemini": {
      if (trimmed.length < 20) {
        return {
          valid: false,
          error: "Google Gemini API key should be at least 20 characters.",
          provider,
        };
      }
      return { valid: true, provider };
    }

    case "anthropic": {
      if (!trimmed.startsWith("sk-ant-")) {
        return {
          valid: false,
          error: "Anthropic Claude API keys typically start with 'sk-ant-'.",
          provider,
        };
      }
      if (trimmed.length < 25) {
        return {
          valid: false,
          error: "Anthropic Claude API key is too short.",
          provider,
        };
      }
      return { valid: true, provider };
    }

    case "google_translate":
    case "google-translate": {
      if (trimmed.length < 15) {
        return {
          valid: false,
          error: "Google Cloud Translation API key is too short.",
          provider,
        };
      }
      return { valid: true, provider };
    }

    case "bhashini": {
      if (trimmed.length < 10) {
        return {
          valid: false,
          error: "Bhashini API key is too short.",
          provider,
        };
      }
      return { valid: true, provider };
    }

    case "offline_fallback":
      return { valid: true, provider };

    default:
      return { valid: true, provider };
  }
}

/**
 * Verifies whether the request caller has Administrator authorization
 */
export function verifyAdminAccess(headersOrRole: Headers | string | null | undefined): boolean {
  if (!headersOrRole) return false;

  if (typeof headersOrRole === "string") {
    return headersOrRole.toLowerCase() === "admin";
  }

  // Check header 'x-user-role' or cookie
  const roleHeader = headersOrRole.get("x-user-role") || headersOrRole.get("role");
  if (roleHeader && roleHeader.toLowerCase() === "admin") {
    return true;
  }

  // Also check authorization bearer token or admin token if provided
  const adminSecret = process.env.ADMIN_SECRET_KEY;
  const authHeader = headersOrRole.get("authorization");
  if (adminSecret && authHeader && authHeader.replace(/^Bearer\s+/i, "") === adminSecret) {
    return true;
  }

  // In zero-config demo / development mode, allow if simulated
  if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
    return true;
  }

  return false;
}
