import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { translationService } from "../services/translation.service";
import { aiRouter } from "../router";

describe("AI Translation Service & Multilingual Routing Tests", () => {
  it("translates school announcements to Gujarati with entity preservation", async () => {
    const res = await translationService.translate({
      text: "School will be closed tomorrow.",
      targetLanguage: "gu",
      provider: "offline_fallback",
    });

    assert.ok(res.translatedText);
    assert.equal(res.targetLanguage, "gu");
    assert.ok(
      res.translatedText.includes("આવતીકાલે") || res.translatedText.includes("શાળા બંધ રહેશે"),
      "Must contain Gujarati translation"
    );
  });

  it("rejects empty text or missing target language", async () => {
    await assert.rejects(
      async () => {
        await translationService.translate({
          text: "",
          targetLanguage: "gu",
        });
      },
      { message: "Text is required for translation." }
    );

    await assert.rejects(
      async () => {
        await translationService.translate({
          text: "Hello",
          targetLanguage: "",
        });
      },
      { message: "Target language is required." }
    );
  });

  it("handles translation routing via aiRouter directly", async () => {
    const res = await aiRouter.translate({
      text: "Sports Day",
      targetLanguage: "gu",
      provider: "offline_fallback",
    });

    assert.equal(res.provider, "offline_fallback");
    assert.ok(res.translatedText);
  });
});
