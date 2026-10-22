export interface GoogleTranslateRequestPayload {
  q: string[];
  target: string;
  source?: string;
  format?: "text" | "html";
}

export interface GoogleTranslateResponsePayload {
  data: {
    translations: Array<{
      translatedText: string;
      detectedSourceLanguage?: string;
    }>;
  };
}
