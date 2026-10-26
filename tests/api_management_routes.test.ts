import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { POST as chatHandler } from "../src/app/api/chat/route";
import { GET as healthHandler } from "../src/app/api/ai/health/route";
import { GET as usageHandler } from "../src/app/api/ai/usage/route";
import { GET as providersGetHandler, POST as providersPostHandler } from "../src/app/api/ai/providers/route";

function createMockRequest(url: string, method: string, body?: any, headers?: Record<string, string>): Request {
  return new Request(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}

describe("Centralized AI API Management & Unified Route Tests", () => {
  it("POST /api/chat processes general dynamic questions", async () => {
    const req = createMockRequest("http://localhost:3000/api/chat", "POST", {
      message: "What is 15 multiplied by 8?",
      language: "en",
    });

    const res = await chatHandler(req as any);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.ok(data.message.includes("120"), "Must compute 15 * 8 = 120");
    assert.ok(!data.message.includes("Aarav Patel was identified with a 35% baseline"), "Never return old hardcoded string");
  });

  it("POST /api/chat rejects empty and excessively long messages", async () => {
    const emptyReq = createMockRequest("http://localhost:3000/api/chat", "POST", {
      message: "",
    });
    const emptyRes = await chatHandler(emptyReq as any);
    assert.equal(emptyRes.status, 400);

    const longReq = createMockRequest("http://localhost:3000/api/chat", "POST", {
      message: "x".repeat(4001),
    });
    const longRes = await chatHandler(longReq as any);
    assert.equal(longRes.status, 400);
  });

  it("GET /api/ai/health returns system health and configured provider statuses", async () => {
    const res = await healthHandler();
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.data.status, "healthy");
    assert.ok(Array.isArray(data.data.providers));
    assert.ok(data.data.providers.length >= 5);
  });

  it("GET /api/ai/usage returns telemetry summary and provider metrics", async () => {
    const res = await usageHandler();
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.ok("totalRequests" in data.data.summary);
    assert.ok("averageLatencyMs" in data.data.summary);
    assert.ok(data.data.byProvider);
  });

  it("GET /api/ai/providers returns registered providers and task configurations", async () => {
    const res = await providersGetHandler();
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.ok(Array.isArray(data.data.providers));
    assert.ok(Array.isArray(data.data.configs));
  });

  it("POST /api/ai/providers tests connection ping and evaluates provider", async () => {
    const req = createMockRequest("http://localhost:3000/api/ai/providers", "POST", {
      action: "test_ping",
      provider: "offline_fallback",
    });

    const res = await providersPostHandler(req as any);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.data.success, true);
    assert.equal(data.data.status, "Connected");
  });

  it("POST /api/ai/providers updates task routing configurations safely", async () => {
    const req = createMockRequest("http://localhost:3000/api/ai/providers", "POST", {
      action: "update_config",
      task: "chat",
      primaryProvider: "gemini",
      fallbackProvider: "openai",
      primaryModel: "gemini-3.5-flash-lite",
      fallbackModel: "gpt-4o-mini",
    });

    const res = await providersPostHandler(req as any);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
  });
});
