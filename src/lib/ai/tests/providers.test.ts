import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { aiRegistry } from "../registry";
import { secretManager } from "../security/secret-manager";
import { validateKeyFormat, verifyAdminAccess } from "../security/key-validation";

describe("AI Provider Registry & Key Management Tests", () => {
  it("registers all supported providers in central registry", () => {
    const providers = aiRegistry.getAll();
    const ids = providers.map((p) => p.id);

    assert.ok(ids.includes("openai"), "Registry must include OpenAI");
    assert.ok(ids.includes("gemini"), "Registry must include Google Gemini");
    assert.ok(ids.includes("anthropic"), "Registry must include Anthropic Claude");
    assert.ok(ids.includes("google_translate") || ids.includes("google-translate"), "Registry must include Google Cloud Translation");
    assert.ok(ids.includes("bhashini"), "Registry must include Bhashini");
    assert.ok(ids.includes("offline_fallback"), "Registry must include Offline Fallback");
  });

  it("filters providers by supported capabilities", () => {
    const chatProviders = aiRegistry.getByCapability("chat").map((p) => p.id);
    assert.ok(chatProviders.includes("openai"));
    assert.ok(chatProviders.includes("gemini"));
    assert.ok(chatProviders.includes("anthropic"));
    assert.ok(!chatProviders.includes("google_translate"), "Google Translate does not support general chat");

    const ttsProviders = aiRegistry.getByCapability("text_to_speech").map((p) => p.id);
    assert.ok(ttsProviders.includes("openai"));
    assert.ok(ttsProviders.includes("bhashini"));
    assert.ok(!ttsProviders.includes("anthropic"), "Anthropic does not support audio TTS");
  });

  it("masks secret keys safely without exposing private credentials", () => {
    const dummyKey = "sk-proj-1234567890abcdefghijklmnopABCD";
    const masked = secretManager.maskApiKey(dummyKey);
    assert.ok(masked, "Masked key should be generated");
    assert.ok(masked.includes("ABCD"), "Should show masked suffix");
    assert.ok(!masked.includes("1234567890abcdef"), "Must not leak full secret");

    const anthropicKey = "sk-ant-api03-abcdefghijklmnopXYZW";
    const maskedAnt = secretManager.maskApiKey(anthropicKey);
    assert.ok(maskedAnt?.includes("XYZW"));
    assert.ok(!maskedAnt?.includes("abcdefgh"));
  });

  it("validates key formats for providers accurately", () => {
    assert.equal(validateKeyFormat("openai", "sk-proj-test12345678901234567890").valid, true);
    assert.equal(validateKeyFormat("openai", "invalid-key").valid, false);

    assert.equal(validateKeyFormat("anthropic", "sk-ant-api03-12345678901234567890").valid, true);
    assert.equal(validateKeyFormat("anthropic", "sk-proj-wrong-prefix").valid, false);
  });

  it("returns 'Not Configured' status when provider credentials are missing", async () => {
    // Delete anthropic key if any
    const origAnt = process.env.ANTHROPIC_API_KEY;
    delete process.env.ANTHROPIC_API_KEY;

    try {
      const res = await aiRegistry.testConnection("anthropic");
      assert.equal(res.status, "Not Configured");
      assert.equal(res.success, false);
      assert.ok(res.message.includes("not configured"));
    } finally {
      if (origAnt) process.env.ANTHROPIC_API_KEY = origAnt;
    }
  });

  it("executes minimal real ping connection test for local offline provider", async () => {
    const res = await aiRegistry.testConnection("offline_fallback");
    assert.equal(res.success, true);
    assert.equal(res.status, "Connected");
    assert.ok(res.latencyMs >= 0);
  });

  it("enforces admin authorization checks for provider management", () => {
    assert.equal(verifyAdminAccess("admin"), true);
    assert.equal(verifyAdminAccess("teacher"), false);
    assert.equal(verifyAdminAccess("parent"), false);
    assert.equal(verifyAdminAccess(null), false);
  });
});
