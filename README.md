# ShikshaSetu AI (શિક્ષાસેતુ AI)

> **"Every Gap Identified. Every Child Supported."**  
> *Smart Tracking and Remedial Action System for Student Learning Gaps in Primary Schools.*  
> **SFIC Gujarat Hackathon 2026 • Problem Statement: PS-60**

---

## 1. Executive Summary & Product Vision

**ShikshaSetu AI** is a modern, responsive, accessible web application designed to empower primary-school teachers, headmasters, and parents in identifying individual student learning gaps, understanding underlying conceptual bottlenecks, executing targeted 5-step remedial plans, and measuring empirical growth over time.

### Core Workflow:
```
Student Registration
  ↓
Diagnostic Assessment (Concept-Level)
  ↓
Concept-Level Analysis
  ↓
Learning-Gap Detection Engine (Rule-based & Explainable)
  ↓
Personalized Remedial Plan (5 Steps + Concrete Manipulatives)
  ↓
Practice Activities (Digital Interactive Quiz & Printable Worksheets)
  ↓
Reassessment & Empirical Verification
  ↓
Progress Tracking (True Percentage-Point Gains)
  ↓
Teacher Intervention & Parent Partnership
```

---

## 2. Hackathon 2-Minute Judge Walkthrough

To experience the complete problem-solving flow during judging:

1. **Open the Application**: Navigate to `http://localhost:3000`. Notice the SFIC Hackathon banner and overview.
2. **Access Dashboard**: Click **"Explore Teacher Dashboard"** (or `/dashboard`). Review the 5 top metric cards, the subject performance chart, and the urgent attention list.
3. **Switch Language**: Use the language switcher in the header to toggle between **English** and **ગુજરાતી (Gujarati)** to see all navigation, badges, and metrics translate seamlessly.
4. **Launch Aarav Patel's Case**:
   - In the top banner or sidebar, click **"Launch Aarav's Case"** (or navigate to `/students/std-aarav`).
   - Observe the **"Division Basics & Equal Sharing"** learning gap card showing **"Needs Support — High Priority"** with a baseline score of **35%** (attempts: 40% on Sep 10, 35% on Sep 24).
   - Read the **Transparent AI Detection Reasoning**:
     > *"Recent assessment performance (35%) is below the configured support threshold (60%), and previous result (40%) also showed persistent difficulty."*
5. **Review Prescribed Remedial Plan**:
   - Review the 5-step concrete sequence using physical counters, equal sharing circles, guided practice, and formative checks.
6. **Launch Student Practice**:
   - Click **"Launch Practice Activity"** to open the interactive student quiz.
   - Answer the division question (e.g. 12 laddus shared among 3 friends = 4 laddus). Instant scoring and feedback are saved.
7. **Record Reassessment & Measure Growth**:
   - Click **"Record Reassessment"**. Enter **17 out of 20 marks (85%)**.
   - Notice the live preview showing a **+50 percentage-point (pp)** gain and status shifting to **"Mastered"**!
   - Click **"Save & Recalculate Gaps"**. The database automatically updates, marks the gap as **"Resolved"**, and recalculates mastery ledger.
8. **View Reports & Worksheets**:
   - Open `/reports` to view the **Parent-Friendly Summary**, print official progress reports, or export CSV data.

---

## 3. Technology Stack

* **Frontend**: Next.js 16 (App Router), React 19, TypeScript.
* **Styling & Design System**: Tailwind CSS v4, custom pedagogical tokens, accessible contrast, and print-friendly CSS (`@media print`).
* **Icons & Visualization**: Lucide React icons, Recharts for responsive bar and line charts.
* **Data Storage**: File-backed persistent SQLite/JSON store (`data/shikshasetu_store.json`) with atomic writes, surviving server restarts and page refreshes.
* **Engines**:
  - Deterministic Pedagogical Learning-Gap Detection Engine (`src/lib/engine/gapDetection.ts`).
  - Targeted Remedial Action Recommendation Engine (`src/lib/engine/remedialEngine.ts`).
  - Score & True Percentage-Point Calculation Engine (`src/lib/engine/calculations.ts`).
* **Test Runner**: Node test runner with `tsx` (`npm test`).
* **Offline-First & Privacy Conscious**: Works 100% offline with zero paid API keys required.

---

## 4. Installation & Startup Instructions

### Prerequisites:
- Node.js version 20+ (Node 24 supported)
- npm version 10+

### Steps:

1. **Clone or Open the Repository**:
   ```bash
   cd "SFIC PS-60"
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run Unit Tests**:
   ```bash
   npm test
   ```
   *Expected Output: 16 passing unit tests across 4 test suites.*

4. **Build Production Bundle**:
   ```bash
   npm run build
   ```

5. **Start Development Server**:
   ```bash
   npm run dev
   ```

6. **Open in Browser**:
   Open [http://localhost:3000](http://localhost:3000)

---

## 5. Application Routes & Architecture

| Route | Purpose |
|---|---|
| `/` | Landing page, problem statement overview, and 1-click demo case launcher. |
| `/login` | Authentication page with 1-click **Demo Teacher** and **Demo Admin** roles. |
| `/dashboard` | Teacher Overview: 5 metric cards, Recharts visualizations, attention list, quick actions. |
| `/students` | Student management directory with class filters, search, CSV import, and CSV export. |
| `/students/[id]` | Comprehensive student profile: concept mastery, assessment history, gaps, practice quiz launcher, reassessment recording. |
| `/assessments` | Assessment registry with subject filters and concept mappings. |
| `/assessments/new` | Assessment creator with interactive multi-student score entry grid and instant gap recalculation. |
| `/learning-gaps` | Learning-gap detection view with transparent reasoning, priority filters, and 1-click remedial plan generator. |
| `/remedial-plans` | Remedial plans management: step-by-step curriculum, materials list, status workflow (Suggested → Approved → In Progress → Completed). |
| `/activities` | Curated practice bank (Math, English, Gujarati, EVS) with interactive player and printable paper worksheets. |
| `/progress` | Progress dashboard: before-and-after bar charts, percentage-point (pp) delta audit ledger. |
| `/reports` | Printable official report cards, parent-friendly summaries, and CSV data export. |
| `/settings` | Configurable operational thresholds (80% / 60%), language preferences, privacy standards, and demo reset. |

---

## 6. Testing & Quality Verification

All 16 unit tests were executed and passed successfully:
```
> shikshasetu-ai@0.1.0 test
> tsx --test "src/**/*.test.ts"

▶ Database & Learning Gap Integration Flow
  ✔ loads seeded classrooms, students, and learning gaps
  ✔ executes the end-to-end reassessment workflow: Aarav improves from 35% to 85%
  ✔ resets to pristine demo state upon confirmation
✔ Database & Learning Gap Integration Flow

▶ Calculations Engine
  ✔ calculates percentage accurately with rounding
  ✔ handles invalid or zero maximum marks gracefully
  ✔ calculates true percentage point delta (Latest % - Initial %)
  ✔ validates assessment marks correctly
  ✔ determines trends with clear explainability and handles insufficient data
  ✔ calculates average safely
✔ Calculations Engine

▶ Learning Gap Detection Engine
  ✔ detects High Priority 'Needs Support' for repeated low performance (Aarav Division case)
  ✔ detects 'Developing' with Medium priority when student is between 60% and 79%
  ✔ detects Mastered and records positive percentage-point improvement upon reassessment
  ✔ identifies single observation limitation responsibly
  ✔ respects custom administrative thresholds
✔ Learning Gap Detection Engine

▶ Remedial Action Recommendation Engine
  ✔ generates a complete, structured remedial plan for Division Basics (Aarav case)
  ✔ provides fallback template for any undefined concept smoothly
✔ Remedial Action Recommendation Engine

ℹ tests 16
ℹ pass 16
ℹ fail 0
```

---

## 7. Child Privacy & Ethical Design

- **Zero Sensitive Data**: Does not collect biometric data, facial recognition, home addresses, or parental financial status.
- **Supportive Phrasing**: Students are never labeled as "weak" or "incapable." Phrasing strictly uses constructive educational terms like *"Needs Support,"* *"Developing,"* and *"Ready for the Next Step."*
- **No Public Shaming**: Class rank ladders or public score boards are strictly avoided.
- **Offline Telemetry**: All data remains on the local institution server without unauthorized external AI transmission.

---

## 8. Reset Demo Data

Judges can restore the demonstration database back to its pristine 15-student seed state at any time:
- In the application sidebar or `/settings`, click **"Reset Demo Data"** and confirm.
- Or send an HTTP POST request to `/api/reset-demo`.

---

## 9. Known Limitations & Future Roadmap

- **Audio/Speech Reading Support**: Adding Gujarati and English voice synthesis for early Class 1-2 students who cannot yet read instructions.
- **Optical Mark Recognition (OMR)**: Mobile camera scanning for physical paper assessment sheets in remote rural schools with zero device availability.
- **Multi-School Cluster Sync**: Automatic synchronization from offline school instances to District Primary Education Office (DPEO) servers when internet connectivity is intermittently available.
