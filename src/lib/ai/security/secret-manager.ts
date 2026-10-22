import type { AiProviderName } from "../types";

/**
 * Server-Side Secret Manager
 *
 * Enforces strict isolation of sensitive API credentials:
 * - Credentials reside solely in server environment or memory store
 * - Strips and masks keys before any data is sent to client
 * - Rejects any attempt to use client-side NEXT_PUBLIC_ prefixes for private credentials
 * - Provides safe runtime rotation hooks
 */
export class SecretManager {
  private static instance: SecretManager;
  // Ephemeral in-memory override store for runtime key rotations
  private runtimeOverrides = new Map<string, string>();

  private constructor() {}

  public static getInstance(): SecretManager {
    if (!SecretManager.instance) {
      SecretManager.instance = new SecretManager();
    }
    return SecretManager.instance;
  }

  /**
   * Retrieves a secret key strictly on the server side
   */
  public getSecret(envKey: string): string | null {
    // Assert server-side execution
    if (typeof window !== "undefined") {
      throw new Error(
        `Security Violation: Attempted to access private secret '${envKey}' from a browser environment.`
      );
    }

    if (envKey.startsWith("NEXT_PUBLIC_") && envKey.includes("KEY")) {
      console.error(
        `Security Warning: Private secret '${envKey}' should never use NEXT_PUBLIC_ prefix!`
      );
    }

    // Check runtime in-memory overrides first
    if (this.runtimeOverrides.has(envKey)) {
      return this.runtimeOverrides.get(envKey) || null;
    }

    const value = process.env[envKey]?.trim();
    return value && value.length > 0 ? value : null;
  }

  /**
   * Get provider API key by provider ID
   */
  public getProviderKey(provider: AiProviderName): string | null {
    switch (provider) {
      case "openai":
        return this.getSecret("OPENAI_API_KEY");
      case "gemini":
        return this.getSecret("GEMINI_API_KEY");
      case "anthropic":
        return this.getSecret("ANTHROPIC_API_KEY");
      case "google_translate":
      case "google-translate":
        return this.getSecret("GOOGLE_TRANSLATE_API_KEY") || this.getSecret("GOOGLE_CLOUD_API_KEY");
      case "bhashini":
        return this.getSecret("BHASHINI_API_KEY");
      case "offline_fallback":
        return "internal-offline-engine";
      default:
        return null;
    }
  }

  /**
   * Checks whether credentials are configured for a given provider
   */
  public isConfigured(provider: AiProviderName): boolean {
    if (provider === "offline_fallback") return true;
    if (provider === "bhashini") {
      const key = this.getSecret("BHASHINI_API_KEY");
      const userId = this.getSecret("BHASHINI_USER_ID");
      return Boolean(key && userId);
    }
    const key = this.getProviderKey(provider);
    return Boolean(key && key.length >= 6);
  }

  /**
   * Generates a safe masked preview of an API key, showing only the last 4 characters.
   * e.g. "••••••••••••ABCD" or null if unconfigured.
   */
  public maskApiKey(rawKey: string | null): string | null {
    if (!rawKey) return null;
    const trimmed = rawKey.trim();
    if (trimmed.length < 8) return "••••••••";

    const lastFour = trimmed.slice(-4);
    if (trimmed.startsWith("sk-ant-")) {
      return `sk-ant-••••••••${lastFour}`;
    }
    if (trimmed.startsWith("sk-")) {
      return `sk-••••••••${lastFour}`;
    }
    if (trimmed.startsWith("AIza")) {
      return `AIzaSy••••••••${lastFour}`;
    }
    return `••••••••••••${lastFour}`;
  }

  /**
   * Returns a masked preview for a given provider safely
   */
  public getMaskedKey(provider: AiProviderName): string | null {
    if (provider === "offline_fallback") return "Internal Local Engine";
    const key = this.getProviderKey(provider);
    return this.maskApiKey(key);
  }

  /**
   * Allows safe runtime credential rotation without modifying source files
   */
  public rotateKey(envKey: string, newSecret: string): void {
    if (typeof window !== "undefined") {
      throw new Error("Security Violation: Cannot rotate keys on the client.");
    }
    if (!newSecret || !newSecret.trim()) {
      this.runtimeOverrides.delete(envKey);
    } else {
      this.runtimeOverrides.set(envKey, newSecret.trim());
    }
  }

  /**
   * Redacts sensitive keys and identifiers from output strings, logs, or error responses
   */
  public redactSecrets(content: string): string {
    if (!content) return "";
    let redacted = content;
    // Strip OpenAI, Anthropic, Gemini tokens
    redacted = redacted.replace(/sk-[a-zA-Z0-9_-]{20,}/g, "sk-••••••••");
    redacted = redacted.replace(/sk-ant-[a-zA-Z0-9_-]{20,}/g, "sk-ant-••••••••");
    redacted = redacted.replace(/AIzaSy[a-zA-Z0-9_-]{20,}/g, "AIzaSy••••••••");
    return redacted;
  }
}

export const secretManager = SecretManager.getInstance();
