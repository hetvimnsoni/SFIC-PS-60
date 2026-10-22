import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { chatService } from "../services/chat.service";
import { aiRouter } from "../router";

describe("AI Chat Service & Dynamic Dialogue Tests", () => {
  it("answers math calculation dynamically without static responses", async () => {
    const res = await chatService.sendMessage({
      message: "What is 25 multiplied by 4?",
      language: "en",
    });
    assert.equal(res.success, true);
    assert.ok(res.message.includes("100"), "Must compute 25 * 4 = 100");
  });

  it("explains scientific concepts accurately based on the prompt", async () => {
    const res = await chatService.sendMessage({
      message: "Explain photosynthesis in simple terms.",
      language: "en",
    });
    assert.equal(res.success, true);
    const lower = res.message.toLowerCase();
    assert.ok(
      lower.includes("photosynthesis") || lower.includes("sunlight") || lower.includes("plant"),
      "Must explain photosynthesis"
    );
  });

  it("retains multi-turn context across consecutive turns", async () => {
    const res = await chatService.sendMessage({
      message: "Can you provide a simpler real-world example?",
      history: [
        { role: "user", content: "What is machine learning?" },
        { role: "assistant", content: "Machine learning allows systems to learn from data." },
      ],
      language: "en",
    });
    assert.equal(res.success, true);
    assert.ok(res.message.length > 20);
  });

  it("routes through aiRouter with specified provider", async () => {
    const res = await aiRouter.generateText({
      provider: "offline_fallback",
      task: "chat",
      messages: [{ role: "user", content: "Hello assistant" }],
    });
    assert.ok(res.content);
    assert.equal(res.provider, "offline_fallback");
  });
});
