# ShikshaSetu AI - System Architecture

> **Hackathon**: SFIC Gujarat Hackathon 2026  
> **Problem Statement**: PS-60 - Smart Tracking and Remedial Action System for Student Learning Gaps in Primary Schools  
> **Live Website**: [https://shikshasetu-ai-iota.vercel.app](https://shikshasetu-ai-iota.vercel.app)

---

## 1. Architectural Philosophy

ShikshaSetu AI is engineered with a strict separation of concerns across **Presentation (Frontend)**, **Business Logic & Orchestration (Backend Services)**, **Contract Specifications (Shared Types & Schemas)**, and **Persistence (Repositories & Database)**.

The system supports two complementary deployment models:
1. **Unified Serverless Fullstack (Default on Vercel)**: Next.js App Router hosts both the React UI and the `/api/v1` serverless route handlers, executing the service/repository layer in serverless functions with zero cold-start complexity and single-domain deployment.
2. **Decoupled Standalone Backend**: A dedicated Node.js TypeScript Express server (`apps/backend`) hosting `/api/v1` on port 5000, suitable for long-running worker tasks, Docker containerization, or independent cloud hosting (Render, Railway, Fly.io, AWS).

Both deployment models execute the **identical** business logic, repositories, and AI orchestration layer, preventing any logic drift.

---

## 2. Layered Backend Design

All backend operations strictly follow the 5-tier architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Request                         │
│  (Next.js Client / Centralized ApiClient / Postman / Tests) │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 1. ROUTE LAYER                                              │
│ - Standalone Express: apps/backend/src/routes/*.ts         │
│ - Next.js Serverless: src/app/api/v1/*/route.ts             │
│ - Handles HTTP methods, parameter extraction, route matching│
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. CONTROLLER LAYER (apps/backend/src/controllers/*.ts)      │
│ - Validates request payload via Shared Schemas              │
│ - Translates HTTP inputs to domain types                    │
│ - Formats consistent JSON responses (HTTP 200, 201, 400, 404│
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. SERVICE LAYER (apps/backend/src/services/*.ts)            │
│ - Core Pedagogical Business Logic:                          │
│   • studentService: Enrollment, directory filters           │
│   • assessmentService: Assessment creation, mark processing │
│   • learningGapService: Deterministic score calculation &   │
│     rule-based threshold classification (<60%, 60-79%, >=80%)│
│   • remedialService: 5-step concrete intervention generator │
│   • worksheetService: Dynamic printable question generation │
│   • aiService: Child-safe AI tutor & assistant (Gemini/OAI) │
│   • reportService: School-wide mastery analytics            │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. REPOSITORY LAYER (apps/backend/src/repositories/*.ts)    │
│ - Encapsulates data queries & state mutations               │
│ - studentRepository, assessmentRepository,                  │
│   learningGapRepository, remedialPlanRepository,             │
│   activityRepository, settingsRepository                    │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. DATABASE ADAPTER & PERSISTENCE                           │
│ - Local Store: data/shikshasetu_store.json + memory cache   │
│ - Production Store: PostgreSQL (database/migrations/*.sql)  │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Communication Contracts

### Centralized Frontend API Client
The frontend interacts with backend endpoints strictly through [`src/services/apiClient.ts`](file:///c:/Users/Raj/Desktop/SFIC%20PS-60/src/services/apiClient.ts).
- Resolves URL from `NEXT_PUBLIC_API_URL` (defaults to `/api/v1`).
- Transparently transmits role-based authorization headers (`X-User-Role: teacher | admin`).
- Automatically extracts and throws structured error messages.

### Shared Types & Validation Schemas
Located in [`packages/shared/src/`](file:///c:/Users/Raj/Desktop/SFIC%20PS-60/packages/shared/src/):
- **Types**: `Student`, `Classroom`, `Subject`, `Concept`, `Assessment`, `AssessmentResult`, `LearningGap`, `RemedialPlan`, `WorksheetData`, `TutorResponseData`, `OverviewReport`.
- **Validation**: Strict boundary checks for email format, student code, grade ranges (1 to 5), non-zero max marks, and prompt sizes.
- **Constants**: Default mastery (80%) and developing (60%) thresholds, Gujarat primary subject codes (MATH, ENG, GUJ, EVS), and demo user credentials.

---

## 4. Real AI Provider & Security Directives

AI capabilities are orchestrated server-side via [`src/lib/ai/aiProvider.ts`](file:///c:/Users/Raj/Desktop/SFIC%20PS-60/src/lib/ai/aiProvider.ts):
1. **Never Expose Secrets**: API keys (`GEMINI_API_KEY`, `OPENAI_API_KEY`) are read strictly server-side in Node.js / Vercel Serverless.
2. **Child Privacy Safeguard**: Prompts are sanitized with regex patterns to strip emails and phone numbers before any external model call.
3. **Deterministic vs Generative Separation**: Calculations (percentage, delta percentage points, mastery status) are executed by deterministic math rules (`calculations.ts`), never guessed by an LLM.
4. **Pedagogical Fallback**: If external API keys are omitted or rate limits are reached, the system executes an offline deterministic pedagogical engine calibrated to the Gujarat State curriculum.
5. **Transparency**: Every AI response includes metadata flags:
   - `isAiGenerated`: `boolean`
   - `provider`: `"gemini" | "openai" | "offline_fallback"`
   - `modelUsed`: `"gemini-1.5-flash" | "deterministic_pedagogical_rule_engine"`
   - `note`: User-facing disclosure of how the pedagogical recommendation was produced.

---

## 5. Security Architecture

1. **Role-Based Access Control (RBAC)**:
   - `teacher`: Can view student gaps, enter formative assessment scores, approve remedial plans, and use AI teaching tools.
   - `admin` (Principal): Super-user access with school-wide analytics, settings configuration, student deletion, and demo resets.
2. **Rate Limiting**: Sliding-window rate limiter middleware on AI and worksheet generation endpoints to safeguard token budgets.
3. **CORS Safeguard**: Configurable origin header (`CORS_ORIGIN`) for the standalone Express backend.
4. **Input Sanitization**: Truncation of user inputs at 4,000 characters to prevent prompt injection and token overflow attacks.
