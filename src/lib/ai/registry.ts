import type {
  IProviderAdapter,
  AiProviderName,
  AiCapability,
  ConnectionTestResult,
  ConnectionStatus,
} from "./types";
import { SUPPORTED_PROVIDERS_METADATA } from "./config";
import { secretManager } from "./security/secret-manager";
import { OpenAiAdapter } from "./providers/openai/adapter";
import { GeminiAdapter } from "./providers/gemini/adapter";
import { AnthropicAdapter } from "./providers/anthropic/adapter";
import { GoogleTranslateAdapter } from "./providers/google-translate/adapter";
import { BhashiniAdapter } from "./providers/bhashini/adapter";
import { OfflineFallbackAdapter } from "./providers/offline-fallback/adapter";

export interface ProviderStatusInfo {
  provider: AiProviderName;
  name: string;
  description: string;
  configured: boolean;
  status: ConnectionStatus;
  supportedTasks: AiCapability[];
  supportedLanguages: string[];
  supportedModels: string[];
  defaultModel: string;
  baseUrl?: string;
  keyPreview: string | null;
  lastTestedAt?: string;
  lastTestMessage?: string;
  docUrl: string;
}

export class ProviderRegistry {
  private static instance: ProviderRegistry;
  private adapters = new Map<AiProviderName, IProviderAdapter>();
  private connectionStatuses = new Map<
    AiProviderName,
    { status: ConnectionStatus; testedAt: string; message: string }
  >();

  private constructor() {
    this.registerDefaults();
  }

  public static getInstance(): ProviderRegistry {
    if (!ProviderRegistry.instance) {
      ProviderRegistry.instance = new ProviderRegistry();
    }
    return ProviderRegistry.instance;
  }

  private registerDefaults() {
    this.register(new OpenAiAdapter());
    this.register(new GeminiAdapter());
    this.register(new AnthropicAdapter());
    this.register(new GoogleTranslateAdapter());
    this.register(new BhashiniAdapter());
    this.register(new OfflineFallbackAdapter());
  }

  public register(adapter: IProviderAdapter): void {
    this.adapters.set(adapter.id, adapter);
    // Also alias hyphen vs underscore for google-translate
    if (adapter.id === "google_translate") {
      this.adapters.set("google-translate" as AiProviderName, adapter);
    }
  }

  public get(id: AiProviderName): IProviderAdapter | undefined {
    return this.adapters.get(id);
  }

  public getOrThrow(id: AiProviderName): IProviderAdapter {
    const adapter = this.get(id);
    if (!adapter) {
      throw new Error(`AI Provider '${id}' is not registered in the system.`);
    }
    return adapter;
  }

  public getAll(): IProviderAdapter[] {
    // Return unique adapters (excluding duplicate aliases)
    const seen = new Set<string>();
    const list: IProviderAdapter[] = [];
    for (const [_, adapter] of this.adapters.entries()) {
      if (!seen.has(adapter.id)) {
        seen.add(adapter.id);
        list.push(adapter);
      }
    }
    return list;
  }

  public getByCapability(capability: AiCapability): IProviderAdapter[] {
    return this.getAll().filter((a) => a.capabilities.includes(capability));
  }

  public async testConnection(provider: AiProviderName): Promise<ConnectionTestResult> {
    const adapter = this.get(provider);
    if (!adapter) {
      return {
        success: false,
        status: "Configuration Error",
        latencyMs: 0,
        message: `Provider '${provider}' is not registered.`,
        timestamp: new Date().toISOString(),
      };
    }

    const result = await adapter.testConnection();
    this.connectionStatuses.set(provider, {
      status: result.status,
      testedAt: result.timestamp,
      message: result.message,
    });
    return result;
  }

  public getProviderStatusList(): ProviderStatusInfo[] {
    const registered = this.getAll();

    return registered.map((adapter) => {
      const meta = SUPPORTED_PROVIDERS_METADATA[adapter.id];
      const configured = adapter.isConfigured();
      const cachedTest = this.connectionStatuses.get(adapter.id);

      const status: ConnectionStatus = cachedTest
        ? cachedTest.status
        : configured
        ? "Connected"
        : "Not Configured";

      return {
        provider: adapter.id,
        name: adapter.name,
        description: adapter.description,
        configured,
        status,
        supportedTasks: adapter.capabilities,
        supportedLanguages:
          adapter.id === "bhashini"
            ? ["gu", "hi", "en", "mr", "ta", "te", "bn"]
            : adapter.id === "google_translate" || adapter.id === "google-translate"
            ? ["en", "gu", "hi", "mr", "ta", "te", "bn", "kn"]
            : ["en", "gu", "hi", "mr", "ta"],
        supportedModels: adapter.supportedModels,
        defaultModel: adapter.defaultModel,
        baseUrl: adapter.baseUrl,
        keyPreview: secretManager.getMaskedKey(adapter.id),
        lastTestedAt: cachedTest?.testedAt,
        lastTestMessage: cachedTest?.message,
        docUrl: meta?.docUrl || "https://platform.openai.com/docs",
      };
    });
  }
}

export const aiRegistry = ProviderRegistry.getInstance();
