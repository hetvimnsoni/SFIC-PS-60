export interface EnvironmentConfig {
  port: number;
  nodeEnv: string;
  corsOrigin: string;
  apiPrefix: string;
  databaseUrl?: string;
  ai: {
    provider: "gemini" | "openai" | "offline_fallback";
    geminiApiKey?: string;
    geminiModel: string;
    openAiApiKey?: string;
    openAiModel: string;
    openAiBaseUrl?: string;
  };
}

export const config: EnvironmentConfig = {
  port: Number(process.env.PORT || 5000),
  nodeEnv: process.env.NODE_ENV || "development",
  corsOrigin: process.env.CORS_ORIGIN || "*",
  apiPrefix: "/api/v1",
  databaseUrl: process.env.DATABASE_URL,
  ai: {
    provider: (process.env.AI_PROVIDER as any) || (process.env.GEMINI_API_KEY ? "gemini" : "offline_fallback"),
    geminiApiKey: process.env.GEMINI_API_KEY?.trim(),
    geminiModel: process.env.GEMINI_MODEL || "gemini-1.5-flash",
    openAiApiKey: process.env.OPENAI_API_KEY?.trim(),
    openAiModel: process.env.OPENAI_MODEL || "gpt-4o-mini",
    openAiBaseUrl: process.env.OPENAI_BASE_URL,
  },
};
