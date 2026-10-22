export interface OpenAiConfigOptions {
  apiKey?: string;
  model?: string;
  baseUrl?: string;
  organization?: string;
}

export interface OpenAiChatPayload {
  model: string;
  messages: Array<{
    role: "system" | "user" | "assistant";
    content: string;
  }>;
  temperature?: number;
  max_tokens?: number;
  response_format?: { type: "json_object" | "text" };
}
