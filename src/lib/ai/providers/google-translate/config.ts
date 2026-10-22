import { secretManager } from "../../security/secret-manager";

export function getGoogleTranslateConfig() {
  return {
    apiKey:
      secretManager.getSecret("GOOGLE_TRANSLATE_API_KEY") ||
      secretManager.getSecret("GOOGLE_CLOUD_API_KEY") ||
      "",
    baseUrl: "https://translation.googleapis.com/language/translate/v2",
  };
}
