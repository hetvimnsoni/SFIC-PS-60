import { secretManager } from "../../security/secret-manager";

export function getBhashiniConfig() {
  const apiKey = secretManager.getSecret("BHASHINI_API_KEY") || "";
  const userId = secretManager.getSecret("BHASHINI_USER_ID") || "";
  const pipelineId = process.env.BHASHINI_PIPELINE_ID?.trim() || "64392f96daac500b55c543d6";
  const inferenceApiKey = secretManager.getSecret("BHASHINI_INFERENCE_KEY") || apiKey;
  const endpointUrl =
    process.env.BHASHINI_ENDPOINT_URL?.trim() ||
    "https://dhruva-api.bhashini.gov.in/services/inference/pipeline";

  return {
    apiKey,
    userId,
    pipelineId,
    inferenceApiKey,
    endpointUrl,
  };
}
