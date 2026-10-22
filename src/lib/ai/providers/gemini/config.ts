import { secretManager } from "../../security/secret-manager";

export function getGeminiConfig() {
  return {
    apiKey: secretManager.getSecret("GEMINI_API_KEY") || "",
    model: process.env.GEMINI_MODEL?.trim() || "gemini-1.5-flash",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta",
  };
}
