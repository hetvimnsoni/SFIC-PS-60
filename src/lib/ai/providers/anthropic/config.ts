import { secretManager } from "../../security/secret-manager";

export function getAnthropicConfig() {
  return {
    apiKey: secretManager.getSecret("ANTHROPIC_API_KEY") || "",
    model: process.env.ANTHROPIC_MODEL?.trim() || "claude-3-5-sonnet-20241022",
    baseUrl: "https://api.anthropic.com/v1",
    version: "2023-06-01",
  };
}
