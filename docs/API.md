# ShikshaSetu AI - REST API Documentation (v1)

Base URL:
- Local Unified (Next.js): `http://localhost:3000/api/v1`
- Local Standalone (Express): `http://localhost:5000/api/v1`
- Production (Vercel): `https://shikshasetu-ai-iota.vercel.app/api/v1`

---

## 1. System Health

### `GET /api/v1/health`
Returns the operational health of the application, uptime, database adapter status, and configured AI provider.

**Response (200 OK):**
```json
{
  "success": true,
  "status": "healthy",
  "version": "1.0.0",
  "uptime": 124.5,
  "timestamp": "2026-10-19T12:00:00.000Z",
  "environment": "development",
  "database": {
    "status": "connected",
    "type": "json"
  },
  "ai": {
    "provider": "gemini",
    "model": "gemini-1.5-flash",
    "liveAiConfigured": true
  }
}
```

---

## 2. Authentication & Session

### `POST /api/v1/auth/login`
Authenticates a user or demo profile.

**Request Body:**
```json
{
  "email": "teacher@shikshasetu.edu.in",
  "role": "teacher"
}
```
**Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "id": "usr-teacher-01",
    "name": "Pooja Sharma",
    "email": "teacher@shikshasetu.edu.in",
    "role": "teacher",
    "schoolId": "sch-gn-01"
  }
}
```

### `POST /api/v1/auth/logout`
Terminates current session.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### `GET /api/v1/auth/me`
Retrieves current authenticated profile from request token.

---

## 3. Student Management

### `GET /api/v1/students`
Retrieves students list with optional filtering and search.

**Query Parameters:**
- `classroomId` (optional): Filter by classroom (e.g. `cls-4a`)
- `grade` (optional): Filter by grade (1 to 5)
- `search` (optional): Case-insensitive search on name or student code

**Response (200 OK):**
```json
{
  "success": true,
  "count": 15,
  "students": [
    {
      "id": "std-aarav",
      "studentCode": "MPS-26-401",
      "displayName": "Aarav Patel",
      "classroomId": "cls-4a",
      "grade": 4,
      "section": "A",
      "enrollmentStatus": "active",
      "notes": "Kinesthetic learner; benefits from physical manipulatives.",
      "createdAt": "2026-06-15T09:00:00Z"
    }
  ]
}
```

### `GET /api/v1/students/:id`
Retrieves a single student's complete profile.

### `POST /api/v1/students`
Enrolls a new student. Requires `teacher` or `admin` role.

### `PUT /api/v1/students/:id`
Updates student enrollment details or teacher notes.

### `DELETE /api/v1/students/:id`
Deletes a student record. Requires `admin` role.

---

## 4. Assessments & Marks Entry

### `GET /api/v1/assessments`
Lists formative assessments. Query parameters: `classroomId`, `subjectId`.

### `POST /api/v1/assessments`
Creates a new assessment with optional initial scores.
```json
{
  "classroomId": "cls-4a",
  "subjectId": "sub-math",
  "subjectCode": "MATH",
  "title": "Unit 2: Equal Sharing & Division",
  "assessmentDate": "2026-10-18T10:00:00.000Z",
  "maxMarks": 20,
  "conceptIds": ["c-div-01"]
}
```

### `POST /api/v1/assessments/results`
Submits student results or records a post-remediation reassessment. Automatically triggers learning-gap recalculation!
```json
{
  "results": [
    {
      "assessmentId": "asm-retest-01",
      "studentId": "std-aarav",
      "conceptId": "c-div-01",
      "marksObtained": 17,
      "maximumMarks": 20,
      "notes": "Post-remediation assessment after token sharing activity."
    }
  ]
}
```

---

## 5. Learning Gaps

### `GET /api/v1/learning-gaps`
Lists identified learning gaps across students. Query filters: `studentId`, `priority`, `status`.

### `GET /api/v1/students/:id/learning-gaps`
Returns all active and resolved learning gaps for a specific student.

### `POST /api/v1/learning-gaps/analyze`
Generates a pedagogical diagnostic report using deterministic metrics + generative AI explanation.
```json
{
  "studentId": "std-aarav",
  "studentName": "Aarav Patel",
  "studentClass": 4,
  "subject": "MATH",
  "conceptName": "Division Basics",
  "marksObtained": 7,
  "maximumMarks": 20,
  "teacherObservations": "Counts back by subtractions instead of equal sharing.",
  "language": "en"
}
```

---

## 6. Remedial Plans

### `GET /api/v1/remedial-plans`
Lists remedial intervention plans. Query filters: `studentId`, `status`.

### `GET /api/v1/students/:id/remedial-plans`
Retrieves intervention plans prescribed for a specific student.

### `POST /api/v1/remedial-plans/generate`
Synthesizes a 5-step concrete remedial action plan aligned to GCERT curriculum.
```json
{
  "studentId": "std-aarav",
  "studentName": "Aarav Patel",
  "conceptId": "c-div-01",
  "conceptName": "Division Basics & Equal Sharing",
  "subjectCode": "MATH",
  "latestPercentage": 35,
  "language": "en"
}
```

---

## 7. Worksheet Generator

### `POST /api/v1/worksheets/generate`
Generates a printable classroom worksheet with answer key and step-by-step explanations.
```json
{
  "grade": 4,
  "subject": "MATH",
  "concept": "Division Basics",
  "questionCount": 5,
  "difficulty": "Medium",
  "language": "en"
}
```

---

## 8. AI Tutor & Teacher Assistant

### `POST /api/v1/ai/tutor`
Pedagogical guide for teaching primary concepts with hands-on manipulative activities.
- Supports both **English** (`language: "en"`) and **Gujarati** (`language: "gu"`).
```json
{
  "query": "How to teach division as equal sharing using classroom items?",
  "grade": 4,
  "subject": "Mathematics",
  "language": "en"
}
```

### `POST /api/v1/ai/chat`
Conversational assistant providing classroom summaries and pedagogical strategies based on authorized school telemetry.
```json
{
  "message": "Summarize student learning gaps in Class 4",
  "language": "en",
  "userRole": "teacher"
}
```

---

## 9. Reports & Telemetry

### `GET /api/v1/reports/overview`
Returns school-wide / grade-level analytics:
- Student count, assessments count, active gaps count, resolved gaps count
- Mastery status breakdown (`Mastered`, `Developing`, `Needs Support`)
- Priority breakdown (`High`, `Medium`, `Low`)
- Subject-by-subject average scores and gap counts
