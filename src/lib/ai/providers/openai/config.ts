import { secretManager } from "../../security/secret-manager";

export function getOpenAiConfig() {
  return {
    apiKey: secretManager.getSecret("OPENAI_API_KEY") || "",
    model: process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini",
    baseUrl: process.env.OPENAI_BASE_URL?.trim() || "https://api.openai.com/v1",
  };
}
