# ShikshaSetu AI — Centralized AI Integration & API Management Setup Guide

Welcome to the centralized AI integration system for **AI Parent-School Language Bridge** (*ShikshaSetu AI*).

This document details how external generative models, translation services, speech recognition (ASR), and voice synthesis (TTS) providers are structured, configured, securely managed, and orchestrated.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Directory Structure](#2-directory-structure)
3. [Supported AI Providers & Credentials](#3-supported-ai-providers--credentials)
4. [Environment Variables Reference](#4-environment-variables-reference)
5. [How to Add or Rotate an API Key](#5-how-to-add-or-rotate-an-api-key)
6. [Administrator Management Dashboard (`/admin/ai-providers`)](#6-administrator-management-dashboard)
7. [Provider Router & Automated Failover](#7-provider-router--automated-failover)
8. [Testing Connection & Verification](#8-testing-connection--verification)
9. [How to Add a New AI Provider Adapter](#9-how-to-add-a-new-ai-provider-adapter)
10. [Troubleshooting Common API Errors](#10-troubleshooting-common-api-errors)
11. [Cloud Deployment Platform Setup (Vercel, Render, Railway, AWS, Docker)](#11-cloud-deployment-platform-setup)

---

## 1. Architecture Overview

All external AI services are organized under a dedicated, modular folder: `src/lib/ai/`.

### Key Design Tenets
- **Strict Server-Side Isolation:** No private API keys or secret tokens are ever bundled in client-side JavaScript or returned in API responses.
- **Unified Adapter Interface (`IProviderAdapter`):** Every provider conforms to a standardized contract (`chat`, `simplify`, `translate`, `transcribe`, `synthesize`, `askAssistant`, `testConnection`).
- **Resilient Router (`aiRouter`):** Dispatches requests to the configured primary provider, handles bounded retries (with exponential backoff and jitter), timeouts (default 25s), and transparent failover.
- **Zero-Config Offline Fallback:** If external cloud keys are absent or temporarily degraded, the built-in deterministic pedagogical engine transparently services student calculations and curriculum requests.
- **Real Connectivity Ping:** Provider connection tests make minimal, real API requests and evaluate actual HTTP responses instead of naively checking string lengths.

```
       [ Chat UI / Parent Bridge ]
                    │
                    ▼
     [ Secure Backend Route Handlers ]
     (/api/v1/ai/chat, /api/ai/translate, etc.)
                    │
                    ▼
           [ AI Router (aiRouter) ]
                    │
    ┌───────────────┴───────────────┐
    ▼                               ▼
[Primary Provider Adapter]     [Failover Provider Adapter]
(e.g., OpenAI / Gemini)        (e.g., Anthropic / Offline)
    │                               │
    ▼                               ▼
[External API Endpoint]         [External API Endpoint]
```

---

## 2. Directory Structure

```
src/lib/ai/
├── index.ts                      # Central barrel export
├── types.ts                      # Core interfaces (IProviderAdapter, ChatRequest, etc.)
├── registry.ts                   # Central ProviderRegistry managing all adapters
├── router.ts                     # Central AiRouter with timeout, retry & failover
├── config.ts                     # Metadata catalog, default models, and env bindings
│
├── providers/                    # Provider-specific modules
│   ├── openai/
│   │   ├── client.ts             # HTTP REST / SDK client wrapper
│   │   ├── adapter.ts            # Implements IProviderAdapter
│   │   ├── config.ts             # Config reader
│   │   └── types.ts              # OpenAI payloads & response types
│   ├── gemini/
│   │   ├── client.ts             # Google Generative Language REST client
│   │   ├── adapter.ts            # Implements IProviderAdapter
│   │   ├── config.ts             # Config reader
│   │   └── types.ts              # Gemini request & content types
│   ├── anthropic/
│   │   ├── client.ts             # Anthropic Messages REST client
│   │   ├── adapter.ts            # Implements IProviderAdapter
│   │   ├── config.ts             # Config reader
│   │   └── types.ts              # Claude payloads & response types
│   ├── google-translate/
│   │   ├── client.ts             # Google Cloud Translation v2 REST client
│   │   ├── adapter.ts            # Implements IProviderAdapter
│   │   ├── config.ts             # Config reader
│   │   └── types.ts              # Translation request/response types
│   ├── bhashini/
│   │   ├── client.ts             # Bhashini Dhruva pipeline REST client
│   │   ├── adapter.ts            # Implements IProviderAdapter
│   │   ├── config.ts             # Config reader
│   │   └── types.ts              # Pipeline payloads & task types
│   └── offline-fallback/
│       └── adapter.ts            # Local deterministic pedagogical engine
│
├── services/                     # High-level domain services
│   ├── chat.service.ts           # Dynamic multi-turn chatbot orchestration
│   ├── translation.service.ts    # Multilingual translation with entity preservation
│   ├── simplification.service.ts # Complex notice simplification
│   ├── speech-to-text.service.ts # Voice notice dictation (ASR)
│   └── text-to-speech.service.ts # Native speech audio synthesis (TTS)
│
├── security/                     # Secret protection & validation
│   ├── secret-manager.ts         # In-memory rotation store, key masking (••••••••ABCD)
│   └── key-validation.ts         # Syntax validation & admin role authorization
│
├── utils/                        # Shared runtime utilities
│   ├── errors.ts                 # Standardized AiError, RateLimitError, AuthError
│   ├── retry.ts                  # Bounded retry with exponential backoff & jitter
│   ├── timeout.ts                # AbortController timeout wrapper
│   ├── sanitizer.ts              # PII scrubber & markdown code-fence JSON parser
│   └── usage-tracker.ts          # Latency, token count, and cost telemetry
│
└── tests/                        # Comprehensive unit tests
    ├── providers.test.ts         # Registry & key validation test suite
    ├── chat.test.ts              # Dynamic chatbot response test suite
    └── translation.test.ts       # Multilingual translation test suite
```

---

## 3. Supported AI Providers & Credentials

| Provider | Provider ID | Supported Tasks | Default Model | Required Credentials |
| :--- | :--- | :--- | :--- | :--- |
| **OpenAI** | `openai` | Chat, Simplification, Translation, STT, TTS, Assistant | `gpt-4o-mini` | `OPENAI_API_KEY` |
| **Google Gemini** | `gemini` | Chat, Simplification, Translation, STT, Assistant | `gemini-1.5-flash` | `GEMINI_API_KEY` |
| **Anthropic Claude** | `anthropic` | Chat, Simplification, Translation, Assistant | `claude-3-5-sonnet-20241022` | `ANTHROPIC_API_KEY` |
| **Google Cloud Translation** | `google_translate` | Multilingual Translation | `google-translate-v2` | `GOOGLE_TRANSLATE_API_KEY` |
| **Bhashini ULCA** | `bhashini` | Translation (NMT), Speech (ASR), Voice (TTS) | `bhashini-nmt` | `BHASHINI_API_KEY`, `BHASHINI_USER_ID` |
| **Local Offline Engine** | `offline_fallback` | Pedagogical Fallback, Translation, Assistant | `deterministic_pedagogical_rule_engine` | *None (Built-in)* |

---

## 4. Environment Variables Reference

Add your credentials to `.env.local` (local development) or your cloud deployment platform settings:

```env
# ------------------------------------------------------------------------------
# Generative & Multilingual AI Credentials
# ------------------------------------------------------------------------------

# Active default provider ("openai" or "gemini")
AI_PROVIDER=openai

# 1. OpenAI (https://platform.openai.com/api-keys)
OPENAI_API_KEY=sk-proj-your-openai-api-key-here
OPENAI_MODEL=gpt-4o-mini
OPENAI_BASE_URL=https://api.openai.com/v1

# 2. Google Gemini (https://aistudio.google.com/)
GEMINI_API_KEY=AIzaSy-your-gemini-api-key-here
GEMINI_MODEL=gemini-1.5-flash

# 3. Anthropic Claude (https://console.anthropic.com/)
ANTHROPIC_API_KEY=sk-ant-api03-your-anthropic-key-here
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022

# 4. Google Cloud Translation API (https://cloud.google.com/translate)
GOOGLE_TRANSLATE_API_KEY=AIzaSy-your-google-cloud-key-here

# 5. Bhashini ULCA (https://bhashini.gov.in/ or https://ulca.bhashini.gov.in/)
BHASHINI_API_KEY=your_bhashini_api_key_here
BHASHINI_USER_ID=your_bhashini_user_id_here
BHASHINI_PIPELINE_ID=64392f96daac500b55c543d6
BHASHINI_INFERENCE_KEY=your_inference_api_key_here
```

> [!IMPORTANT]
> Never prepend private API keys with `NEXT_PUBLIC_`. Private keys must stay on the server. Never commit `.env.local` to git.

---

## 5. How to Add or Rotate an API Key

### Method A: Server Environment File (Recommended for Production)
1. Open or create `.env.local` at the root of the project.
2. Add or replace the corresponding key (e.g., `OPENAI_API_KEY=sk-proj-...`).
3. Restart your development server (`npm run dev`) or trigger a deployment on your hosting service.

### Method B: Live Runtime Update via Admin Dashboard
1. Navigate to `/admin/ai-providers` in your browser.
2. Click **Update Key** on the provider card.
3. Enter the new API key in the secure modal and click **Save & Test**.
4. The system validates key syntax, applies it immediately to the runtime memory store without restarting the node process, and executes an automated connection test.

---

## 6. Administrator Management Dashboard

The dedicated admin dashboard is located at:
`http://localhost:3000/admin/ai-providers`

### Dashboard Sections
1. **Overview & Global Telemetry:** Displays total requests, average response latency, estimated accumulated cost, and total active providers.
2. **All Providers Card Grid:** Individual cards displaying connection status, masked API key preview (`••••••••••••ABCD`), supported capabilities, default model, and action buttons.
3. **Capability Routing & Failover Tab:** Allows administrators to select which provider is primary and fallback for each of the 6 educational tasks.
4. **API Usage Telemetry Tab:** Live audit table of recent API requests with timestamp, task, model, latency, and token cost.
5. **Error Logs Tab:** Sanitized error logs isolating API faults without exposing secret credentials.
6. **Detailed Provider Sub-Pages:**
   - `/admin/ai-providers/openai`
   - `/admin/ai-providers/gemini`
   - `/admin/ai-providers/anthropic`
   - `/admin/ai-providers/google-translate`
   - `/admin/ai-providers/bhashini`

---

## 7. Provider Router & Automated Failover

The router (`src/lib/ai/router.ts`) orchestrates request execution:

```typescript
import { aiRouter } from "@/lib/ai";

// 1. Interactive Chat Generation
const chatResult = await aiRouter.generateText({
  provider: "openai", // optional override; defaults to configured task primary
  task: "chat",
  messages: [
    { role: "user", content: "What is the difference between equal sharing and repeated subtraction?" }
  ],
});

// 2. Multilingual Translation
const translationResult = await aiRouter.translate({
  text: "Parent-Teacher meeting is scheduled for Saturday morning.",
  sourceLanguage: "en",
  targetLanguage: "gu",
});
```

### Failover Rules
1. If the primary provider's key is not configured, the router immediately delegates to the configured failover provider.
2. If the primary provider encounters a temporary 5xx server error, rate limit (429), or network timeout, the router executes bounded retries (up to 1 retry with exponential backoff).
3. If retries fail, it triggers the secondary provider.
4. If all external providers fail or credentials are unconfigured, it seamlessly executes built-in deterministic pedagogical rules.

---

## 8. Testing Connection & Verification

To verify that all registered providers pass automated connection checks and adhere to child privacy standards:

```bash
# Run the complete test suite (includes 102+ automated tests)
npm test
```

Specific test files:
- `src/lib/ai/tests/providers.test.ts` — Validates provider registration, key masking, and connection statuses.
- `src/lib/ai/tests/chat.test.ts` — Tests dynamic multi-turn dialogue without static responses.
- `src/lib/ai/tests/translation.test.ts` — Validates entity preservation and Gujarati translation.
- `tests/chatbot_flow.test.ts` — End-to-end chatbot validation ensuring questions receive relevant, dynamic answers.

---

## 9. How to Add a New AI Provider Adapter

Adding a new provider takes only four steps without modifying the chatbot or UI:

1. **Create Adapter Folder:** Create `src/lib/ai/providers/[new-provider]/`.
2. **Implement Client:** Create `client.ts` to execute HTTP calls with timeout wrapping.
3. **Implement Adapter:** Create `adapter.ts` implementing `IProviderAdapter`:
   ```typescript
   import type { IProviderAdapter, AiProviderName, ConnectionTestResult, ChatRequest, ChatResponse } from "../../types";

   export class MyNewProviderAdapter implements IProviderAdapter {
     readonly id = "my_provider" as AiProviderName;
     readonly name = "My New Provider";
     readonly description = "Specialized educational LLM.";
     readonly capabilities = ["chat", "simplification"];
     readonly supportedModels = ["model-v1"];
     readonly defaultModel = "model-v1";

     isConfigured(): boolean {
       return Boolean(process.env.MY_PROVIDER_KEY);
     }

     async testConnection(): Promise<ConnectionTestResult> {
       // Minimal ping call
       return { success: true, status: "Connected", latencyMs: 120, message: "OK", timestamp: new Date().toISOString() };
     }

     async chat(req: ChatRequest): Promise<ChatResponse> {
       // Call client
     }
   }
   ```
4. **Register in Registry:** Add `this.register(new MyNewProviderAdapter());` in `src/lib/ai/registry.ts`.

---

## 10. Troubleshooting Common API Errors

| Error Symptom | Cause | Solution |
| :--- | :--- | :--- |
| `AuthenticationError (401)` | Missing, expired, or mistyped API key | Verify the API key in `.env.local` or update via `/admin/ai-providers`. |
| `RateLimitError (429)` | Quota exceeded or high concurrency | The router applies automatic bounded backoff. Upgrade your provider tier or set an alternative failover engine. |
| `TimeoutError (504)` | Provider took > 25 seconds to respond | Verify your internet connection. Large audio transcriptions may take longer. |
| `ValidationError (400)` | Empty text or prompt > 4,000 characters | Check request payload length. Long texts must be chunked or shortened. |

---

## 11. Cloud Deployment Platform Setup

### Vercel
1. In the Vercel dashboard, open your project settings.
2. Go to **Settings** &gt; **Environment Variables**.
3. Add:
   - `OPENAI_API_KEY`
   - `GEMINI_API_KEY`
   - `ANTHROPIC_API_KEY`
   - `GOOGLE_TRANSLATE_API_KEY`
   - `BHASHINI_API_KEY` and `BHASHINI_USER_ID`
4. Redeploy project.

### Render / Railway
1. Navigate to your service **Variables** tab.
2. Add the provider variables.
3. Save changes; the platform will initiate a zero-downtime rolling restart.

### Docker
Pass variables in your `docker-compose.yml` or run command:
```bash
docker run -p 3000:3000 \
  -e OPENAI_API_KEY="sk-..." \
  -e GEMINI_API_KEY="AIzaSy..." \
  -e ANTHROPIC_API_KEY="sk-ant-..." \
  shikshasetu-ai:latest
```

---

*ShikshaSetu AI Architecture Team — SFIC Gujarat Hackathon 2026 Problem Statement PS-60*
