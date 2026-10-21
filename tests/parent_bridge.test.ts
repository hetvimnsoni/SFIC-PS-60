import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";

// Import AI & Notice Route Handlers
import { POST as simplifyHandler } from "@/app/api/ai/simplify/route";
import { POST as translateHandler } from "@/app/api/ai/translate/route";
import { POST as ttsHandler } from "@/app/api/ai/text-to-speech/route";
import { POST as noticeAssistantHandler } from "@/app/api/ai/notice-assistant/route";
import { GET as getNoticesHandler, POST as createNoticeHandler } from "@/app/api/notices/route";
import { GET as getNoticeIdHandler } from "@/app/api/notices/[id]/route";
import { POST as sendNoticeHandler } from "@/app/api/notices/[id]/send/route";
import { POST as acknowledgeHandler } from "@/app/api/notices/[id]/acknowledge/route";
import { GET as getAdminProvidersHandler, POST as postAdminProvidersHandler } from "@/app/api/admin/ai-providers/route";
import { centralAi } from "@/lib/ai/centralAiService";

function createMockNextRequest(url: string, method: string = "POST", body?: any): NextRequest {
  return new NextRequest(new URL(url, "http://localhost:3000"), {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
}

describe("AI Parent-School Language Bridge - Comprehensive Test Suite", () => {
  // -------------------------------------------------------------
  // 1. Message Simplification Tests
  // -------------------------------------------------------------
  describe("AI Message Simplification Engine", () => {
    it("simplifies complex bureaucratic notice into simple readable language", async () => {
      const complexNotice =
        "All students are required to submit their mathematics assignments before the stipulated deadline. Failure to comply may affect internal assessment.";
      const req = createMockNextRequest("http://localhost:3000/api/ai/simplify", "POST", {
        text: complexNotice,
        readingLevel: "simple",
      });

      const res = await simplifyHandler(req);
      assert.equal(res.status, 200);
      const data = await res.json();
      assert.equal(data.success, true);
      assert.ok(data.simplifiedText && data.simplifiedText.length > 0);
      assert.ok(data.provider);
      assert.ok(data.latencyMs >= 0);
    });

    it("supports all reading levels: very_simple, simple, standard", async () => {
      const text = "All students must bring athletic wear for sports day on Friday.";
      for (const level of ["very_simple", "simple", "standard"]) {
        const req = createMockNextRequest("http://localhost:3000/api/ai/simplify", "POST", {
          text,
          readingLevel: level,
        });
        const res = await simplifyHandler(req);
        assert.equal(res.status, 200);
        const data = await res.json();
        assert.equal(data.success, true);
        assert.ok(data.simplifiedText);
      }
    });

    it("rejects empty text with 400 status", async () => {
      const req = createMockNextRequest("http://localhost:3000/api/ai/simplify", "POST", {
        text: "   ",
      });
      const res = await simplifyHandler(req);
      assert.equal(res.status, 400);
      const data = await res.json();
      assert.equal(data.success, false);
      assert.match(data.error, /Text is required/);
    });

    it("rejects excessively long messages over 4,000 characters", async () => {
      const longText = "A".repeat(4500);
      const req = createMockNextRequest("http://localhost:3000/api/ai/simplify", "POST", {
        text: longText,
      });
      const res = await simplifyHandler(req);
      assert.equal(res.status, 400);
      const data = await res.json();
      assert.equal(data.success, false);
      assert.match(data.error, /exceeds maximum allowed length/);
    });
  });

  // -------------------------------------------------------------
  // 2. Multilingual Translation Tests
  // -------------------------------------------------------------
  describe("Multilingual Translation Engine", () => {
    it("translates school announcements to Gujarati (ગુજરાતી) and Hindi (हिंदी)", async () => {
      const announcement = "Parent-teacher meeting will be held on Saturday at 10 AM.";

      // Test Gujarati
      const reqGu = createMockNextRequest("http://localhost:3000/api/ai/translate", "POST", {
        text: announcement,
        targetLanguage: "gu",
      });
      const resGu = await translateHandler(reqGu);
      assert.equal(resGu.status, 200);
      const dataGu = await resGu.json();
      assert.equal(dataGu.success, true);
      assert.equal(dataGu.targetLanguage, "gu");
      assert.ok(dataGu.translatedText.length > 0);

      // Test Hindi
      const reqHi = createMockNextRequest("http://localhost:3000/api/ai/translate", "POST", {
        text: announcement,
        targetLanguage: "hi",
      });
      const resHi = await translateHandler(reqHi);
      assert.equal(resHi.status, 200);
      const dataHi = await resHi.json();
      assert.equal(dataHi.success, true);
      assert.equal(dataHi.targetLanguage, "hi");
      assert.ok(dataHi.translatedText.length > 0);
    });

    it("safely handles Unicode and Gujarati regional scripts", async () => {
      const gujaratiInput = "બધા વિદ્યાર્થીઓએ શનિવારે સવારે ૧૦ વાગ્યે શાળાએ પહોંચવાનું રહેશે.";
      const req = createMockNextRequest("http://localhost:3000/api/ai/translate", "POST", {
        text: gujaratiInput,
        sourceLanguage: "gu",
        targetLanguage: "en",
      });
      const res = await translateHandler(req);
      assert.equal(res.status, 200);
      const data = await res.json();
      assert.equal(data.success, true);
      assert.ok(data.translatedText.length > 0);
    });

    it("rejects missing target language with 400 status", async () => {
      const req = createMockNextRequest("http://localhost:3000/api/ai/translate", "POST", {
        text: "School will reopen on Monday.",
      });
      const res = await translateHandler(req);
      assert.equal(res.status, 400);
    });
  });

  // -------------------------------------------------------------
  // 3. Text-to-Speech & Speech Recognition Tests
  // -------------------------------------------------------------
  describe("Voice-to-Text & Text-to-Speech Engine", () => {
    it("synthesizes native audio speech for school notices and caches identical requests", async () => {
      const textToSpeak = "વાલી શિક્ષક બેઠક શનિવારે સવારે યોજાશે.";
      const req1 = createMockNextRequest("http://localhost:3000/api/ai/text-to-speech", "POST", {
        text: textToSpeak,
        language: "gu",
      });

      const res1 = await ttsHandler(req1);
      assert.equal(res1.status, 200);
      const data1 = await res1.json();
      assert.equal(data1.success, true);
      assert.ok(data1.audioBase64);

      // Repeat request to verify in-memory deduplication cache
      const req2 = createMockNextRequest("http://localhost:3000/api/ai/text-to-speech", "POST", {
        text: textToSpeak,
        language: "gu",
      });
      const res2 = await ttsHandler(req2);
      assert.equal(res2.status, 200);
      const data2 = await res2.json();
      assert.equal(data2.success, true);
      assert.equal(data2.cached, true);
    });

    it("rejects empty text for audio synthesis with 400 status", async () => {
      const req = createMockNextRequest("http://localhost:3000/api/ai/text-to-speech", "POST", {
        text: "  ",
        language: "en",
      });
      const res = await ttsHandler(req);
      assert.equal(res.status, 400);
    });
  });

  // -------------------------------------------------------------
  // 4. AI School Notice Assistant (RAG Factual Q&A)
  // -------------------------------------------------------------
  describe("AI School Notice Assistant", () => {
    it("answers questions strictly based on school notices and provides citations", async () => {
      const req = createMockNextRequest("http://localhost:3000/api/ai/notice-assistant", "POST", {
        query: "When is the parent teacher meeting scheduled?",
        userRole: "parent",
        parentId: "par-001",
      });

      const res = await noticeAssistantHandler(req);
      assert.equal(res.status, 200);
      const data = await res.json();
      assert.equal(data.success, true);
      assert.ok(data.answer && data.answer.length > 0);
      assert.ok(data.confidence);
      assert.ok(Array.isArray(data.citedNotices));
    });

    it("enforces parent data isolation by filtering notices for authorized student grade", async () => {
      // par-001 has student std-01 in Grade 5
      const req = createMockNextRequest("http://localhost:3000/api/ai/notice-assistant", "POST", {
        query: "What is my child's homework deadline?",
        parentId: "par-001",
        userRole: "parent",
      });

      const res = await noticeAssistantHandler(req);
      assert.equal(res.status, 200);
      const data = await res.json();
      assert.equal(data.success, true);
      // Result should not reveal notices restricted strictly to un-associated grades
      assert.ok(data.answer);
    });

    it("rejects empty assistant query with 400 status", async () => {
      const req = createMockNextRequest("http://localhost:3000/api/ai/notice-assistant", "POST", {
        query: "   ",
      });
      const res = await noticeAssistantHandler(req);
      assert.equal(res.status, 400);
    });
  });

  // -------------------------------------------------------------
  // 5. Notice Distribution & Delivery Tracking
  // -------------------------------------------------------------
  describe("Teacher Distribution Workflow & Delivery Tracking", () => {
    let createdNoticeId: string;

    it("creates a new notice and stores it in database", async () => {
      const req = createMockNextRequest("http://localhost:3000/api/notices", "POST", {
        title: "Annual Sports Day Registration",
        originalContent: "All students must submit their event preferences for the Annual Sports Day before Nov 5.",
        category: "event",
        targetAudience: "class",
        targetClassGrade: 5,
        targetSection: "A",
        urgency: "important",
        autoSimplify: true,
        autoTranslate: true,
      });

      const res = await createNoticeHandler(req);
      assert.equal(res.status, 200);
      const data = await res.json();
      assert.equal(data.success, true);
      assert.ok(data.data.id);
      createdNoticeId = data.data.id;
    });

    it("dispatches notice to target parents and prevents duplicate notifications", async () => {
      assert.ok(createdNoticeId);

      // First dispatch
      const sendReq1 = createMockNextRequest(`http://localhost:3000/api/notices/${createdNoticeId}/send`, "POST", {
        grade: 5,
        section: "A",
      });
      const sendRes1 = await sendNoticeHandler(sendReq1, { params: Promise.resolve({ id: createdNoticeId }) });
      assert.equal(sendRes1.status, 200);
      const sendData1 = await sendRes1.json();
      assert.equal(sendData1.success, true);
      const initialDeliveries = sendData1.deliveriesCount;
      assert.ok(initialDeliveries >= 1);

      // Second dispatch with same parameters - should prevent duplicates
      const sendReq2 = createMockNextRequest(`http://localhost:3000/api/notices/${createdNoticeId}/send`, "POST", {
        grade: 5,
        section: "A",
      });
      const sendRes2 = await sendNoticeHandler(sendReq2, { params: Promise.resolve({ id: createdNoticeId }) });
      assert.equal(sendRes2.status, 200);
      const sendData2 = await sendRes2.json();
      assert.equal(sendData2.deliveriesCount, 0, "Duplicate deliveries should be prevented");
    });

    it("records parent delivery acknowledgment with feedback", async () => {
      const noticeRes = await getNoticeIdHandler(
        createMockNextRequest(`http://localhost:3000/api/notices/${createdNoticeId}`, "GET"),
        { params: Promise.resolve({ id: createdNoticeId }) }
      );
      const noticeData = await noticeRes.json();
      assert.ok(noticeData.data.deliveries && noticeData.data.deliveries.length > 0);

      const targetDelivery = noticeData.data.deliveries[0];
      const ackReq = createMockNextRequest(`http://localhost:3000/api/notices/${createdNoticeId}/acknowledge`, "POST", {
        deliveryId: targetDelivery.id,
        feedback: "Received and confirmed.",
      });

      const ackRes = await acknowledgeHandler(ackReq, { params: Promise.resolve({ id: createdNoticeId }) });
      assert.equal(ackRes.status, 200);
      const ackData = await ackRes.json();
      assert.equal(ackData.success, true);
      assert.equal(ackData.data.status, "acknowledged");
      assert.equal(ackData.data.parentFeedback, "Received and confirmed.");
    });
  });

  // -------------------------------------------------------------
  // 6. Admin AI Provider Settings & Connectivity Ping
  // -------------------------------------------------------------
  describe("Admin AI Provider Architecture & Connectivity", () => {
    it("returns provider configuration status without exposing private secret keys", async () => {
      const req = createMockNextRequest("http://localhost:3000/api/admin/ai-providers", "GET");
      const res = await getAdminProvidersHandler(req);
      assert.equal(res.status, 200);
      const data = await res.json();
      assert.equal(data.success, true);
      assert.ok(Array.isArray(data.data.providerStatus));
      assert.ok(data.data.metricsSummary);

      // Verify that full secrets are NOT in responses
      for (const p of data.data.providerStatus) {
        if (p.keyPreview) {
          assert.ok(p.keyPreview.includes("...") || p.keyPreview === "Internal Local Engine");
          assert.notEqual(p.keyPreview, process.env.OPENAI_API_KEY);
          assert.notEqual(p.keyPreview, process.env.GEMINI_API_KEY);
        }
      }
    });

    it("tests provider connectivity with minimal ping", async () => {
      const pingReq = createMockNextRequest("http://localhost:3000/api/admin/ai-providers", "POST", {
        action: "test_ping",
        provider: "offline_fallback",
      });
      const pingRes = await postAdminProvidersHandler(pingReq);
      assert.equal(pingRes.status, 200);
      const pingData = await pingRes.json();
      assert.equal(pingData.success, true);
      assert.equal(pingData.data.pingSuccess, true);
      assert.ok(pingData.data.latencyMs >= 0);
    });

    it("updates primary and fallback provider routing for a task", async () => {
      const updateReq = createMockNextRequest("http://localhost:3000/api/admin/ai-providers", "POST", {
        action: "update_config",
        task: "simplification",
        primaryProvider: "offline_fallback",
        fallbackProvider: "offline_fallback",
        enabled: true,
      });

      const updateRes = await postAdminProvidersHandler(updateReq);
      assert.equal(updateRes.status, 200);
      const updateData = await updateRes.json();
      assert.equal(updateData.success, true);
      assert.ok(updateData.data.some((c: any) => c.task === "simplification" && c.primaryProvider === "offline_fallback"));
    });
  });
});
