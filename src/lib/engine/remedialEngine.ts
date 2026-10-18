import type {
  RemedialPlan,
  RemedialStep,
  SubjectCode,
} from "../types";
import type { GapDetectionResult } from "./gapDetection";

export interface ConceptCurriculumTemplate {
  conceptId: string;
  conceptName: string;
  subjectCode: SubjectCode;
  grade: number;
  learningObjective: string;
  materials: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedMinutes: number;
  steps: RemedialStep[];
  teacherInstructions: string;
  reassessmentCriteria: string;
}

// Built-in deterministic pedagogical templates aligned with Gujarat primary curriculum
export const CURRICULUM_TEMPLATES: Record<string, ConceptCurriculumTemplate> = {
  "c-div-01": {
    conceptId: "c-div-01",
    conceptName: "Division Basics & Equal Sharing",
    subjectCode: "MATH",
    grade: 4,
    learningObjective:
      "Understand division as the inverse of multiplication, equal grouping, and repeated subtraction.",
    materials: [
      "20 physical counting tokens, pebbles, or bottle caps",
      "Equal grouping circular mats or drawing sheet",
      "Multiplication table 1-10 reference card",
    ],
    difficulty: "Beginner",
    estimatedMinutes: 20,
    steps: [
      {
        stepNumber: 1,
        title: "Review Multiplication Link",
        description:
          "Review times tables for 2, 3, 4, and 5. Demonstrate that 4 × 3 = 12 means 12 ÷ 3 = 4.",
        durationMinutes: 4,
        activityType: "discussion",
      },
      {
        stepNumber: 2,
        title: "Concrete Equal Sharing Demonstration",
        description:
          "Have the student physically distribute 12 counters into 3 equal cups or circles.",
        durationMinutes: 5,
        activityType: "hands_on",
      },
      {
        stepNumber: 3,
        title: "Guided Problem Solving",
        description:
          "Solve 3 basic division problems together on the board/notebook with step-by-step reasoning.",
        durationMinutes: 4,
        activityType: "guided_practice",
      },
      {
        stepNumber: 4,
        title: "Targeted Practice Worksheet",
        description:
          "Student independently completes 5 division questions using visual grouping diagrams.",
        durationMinutes: 5,
        activityType: "independent_practice",
      },
      {
        stepNumber: 5,
        title: "Mini Diagnostic Check",
        description:
          "Quick 2-question exit ticket to verify understanding before concluding the session.",
        durationMinutes: 2,
        activityType: "check_for_understanding",
      },
    ],
    teacherInstructions:
      "Avoid rushing to long-division algorithms immediately. Reinforce equal grouping and real-world sharing (e.g. sharing 15 laddus among 5 friends).",
    reassessmentCriteria:
      "Student must achieve at least 80% on a 5-question parallel assessment without teacher hints.",
  },
  "c-mult-01": {
    conceptId: "c-mult-01",
    conceptName: "Multiplication Tables (2 to 9)",
    subjectCode: "MATH",
    grade: 3,
    learningObjective:
      "Recall multiplication facts accurately and recognize multiplication as repeated addition.",
    materials: [
      "Multiplication grid chart (10x10)",
      "Flashcards for 6, 7, and 8 times tables",
      "Grid graph paper",
    ],
    difficulty: "Intermediate",
    estimatedMinutes: 15,
    steps: [
      {
        stepNumber: 1,
        title: "Pattern Recognition",
        description:
          "Identify patterns on the 10x10 grid (e.g. skip counting by 5s, even numbers in 2s and 4s).",
        durationMinutes: 3,
        activityType: "discussion",
      },
      {
        stepNumber: 2,
        title: "Array Visualization",
        description:
          "Draw rectangular arrays on grid paper to represent products (e.g., 3 rows of 4 dots).",
        durationMinutes: 4,
        activityType: "hands_on",
      },
      {
        stepNumber: 3,
        title: "Speed Flashcard Drill",
        description:
          "Rapid response flashcards focusing on frequently missed facts (7×8, 6×7, 9×6).",
        durationMinutes: 5,
        activityType: "interactive_drill",
      },
      {
        stepNumber: 4,
        title: "Formative Re-check",
        description: "10-question timed practice sheet with immediate encouraging review.",
        durationMinutes: 3,
        activityType: "check_for_understanding",
      },
    ],
    teacherInstructions:
      "Focus on commutative property (e.g. knowing 4×7 means you also know 7×4) to reduce memory burden.",
    reassessmentCriteria:
      "Correctly answer 8 out of 10 random single-digit multiplication prompts within 2 minutes.",
  },
  "c-place-01": {
    conceptId: "c-place-01",
    conceptName: "Place Value & 3-Digit Addition",
    subjectCode: "MATH",
    grade: 3,
    learningObjective:
      "Decompose 3-digit numbers into Hundreds, Tens, and Ones, and execute addition with regrouping.",
    materials: ["Base-10 block representations", "Place value chart", "Colored sketch pens"],
    difficulty: "Beginner",
    estimatedMinutes: 20,
    steps: [
      {
        stepNumber: 1,
        title: "Place Value Column Setup",
        description: "Write numbers in H-T-O columns and explain regrouping 10 tens into 1 hundred.",
        durationMinutes: 5,
        activityType: "instructional",
      },
      {
        stepNumber: 2,
        title: "Regrouping Modeling",
        description: "Work through 2 examples with explicit carry-over marks in colored ink.",
        durationMinutes: 5,
        activityType: "guided_practice",
      },
      {
        stepNumber: 3,
        title: "Independent Student Practice",
        description: "Student completes 4 regrouping problems at their own pace.",
        durationMinutes: 7,
        activityType: "independent_practice",
      },
      {
        stepNumber: 4,
        title: "Reflection",
        description: "Student explains one problem aloud to demonstrate conceptual clarity.",
        durationMinutes: 3,
        activityType: "verbal_explanation",
      },
    ],
    teacherInstructions:
      "Watch for students adding left-to-right or forgetting to add the carried-over digit.",
    reassessmentCriteria:
      "Accurately calculate 4 out of 5 three-digit addition problems with regrouping.",
  },
  "c-eng-blend-01": {
    conceptId: "c-eng-blend-01",
    conceptName: "Phonetic Blends (ch, sh, th, wh)",
    subjectCode: "ENG",
    grade: 2,
    learningObjective:
      "Identify and articulate consonant digraphs /ch/, /sh/, /th/, and /wh/ in spoken and written words.",
    materials: ["Phonics flashcards with pictures", "Small whiteboard or slate"],
    difficulty: "Beginner",
    estimatedMinutes: 15,
    steps: [
      {
        stepNumber: 1,
        title: "Sound Association",
        description: "Demonstrate mouth positions for 'sh' (quiet) and 'ch' (train sound).",
        durationMinutes: 3,
        activityType: "phonics_drill",
      },
      {
        stepNumber: 2,
        title: "Picture Word Matching",
        description: "Match pictures (ship, chair, thumb, whale) to their corresponding starting blend.",
        durationMinutes: 5,
        activityType: "matching_game",
      },
      {
        stepNumber: 3,
        title: "Blend Writing & Reading",
        description: "Write and read aloud 5 decodable sentences containing target blends.",
        durationMinutes: 5,
        activityType: "reading_practice",
      },
      {
        stepNumber: 4,
        title: "Sound Check",
        description: "Dictate 4 simple words for the child to write on their slate.",
        durationMinutes: 2,
        activityType: "dictation",
      },
    ],
    teacherInstructions:
      "Keep sessions lively and playful. Encourage exaggerated phonetic pronunciation.",
    reassessmentCriteria:
      "Student correctly reads 8 out of 10 words containing the target digraphs.",
  },
  "c-eng-comp-01": {
    conceptId: "c-eng-comp-01",
    conceptName: "Short Passage Reading Comprehension",
    subjectCode: "ENG",
    grade: 4,
    learningObjective:
      "Read an age-appropriate 60-word passage and locate explicit information to answer Who, What, Where questions.",
    materials: ["Illustrated short passage sheet", "Highlighter pen"],
    difficulty: "Intermediate",
    estimatedMinutes: 20,
    steps: [
      {
        stepNumber: 1,
        title: "Guided Pre-reading",
        description: "Look at the picture, read title together, and predict what the story is about.",
        durationMinutes: 3,
        activityType: "pre_reading",
      },
      {
        stepNumber: 2,
        title: "Choral Reading",
        description: "Teacher and student read the passage aloud once together, pausing at punctuation.",
        durationMinutes: 5,
        activityType: "guided_reading",
      },
      {
        stepNumber: 3,
        title: "Text Evidence Hunting",
        description: "Highlight keywords in the text that directly answer the comprehension questions.",
        durationMinutes: 7,
        activityType: "comprehension_exercise",
      },
      {
        stepNumber: 4,
        title: "Full Sentence Responses",
        description: "Frame short complete sentences for 3 comprehension questions.",
        durationMinutes: 5,
        activityType: "writing_practice",
      },
    ],
    teacherInstructions:
      "Teach the 'text-lookback' strategy so students understand they can refer back to the story.",
    reassessmentCriteria:
      "Correctly answer 3 out of 3 factual questions on a new short passage.",
  },
  "c-guj-matra-01": {
    conceptId: "c-guj-matra-01",
    conceptName: "ગુજરાતી કાનો-માત્રા અને દીર્ઘ-હ્રસ્વ સ્વર ચિહ્નો (Gujarati Matras)",
    subjectCode: "GUJ",
    grade: 3,
    learningObjective:
      "કાનો (ા), હ્રસ્વ ઇ (િ), દીર્ઘ ઈ (ી), અને માત્રા (ે) ના સાચા ઉચ્ચારણ અને લેખનનું જ્ઞાન મેળવવું.",
    materials: ["ગુજરાતી બાળપોથી ચાર્ટ", "માત્રા કાર્ડ્સ", "નોટબુક"],
    difficulty: "Beginner",
    estimatedMinutes: 18,
    steps: [
      {
        stepNumber: 1,
        title: "માત્રા ઉચ્ચારણ પરિચય",
        description: "ક + ા = કા, ક + િ = કિ, ક + ી = કી નો સ્પષ્ટ ઉચ્ચારણ ભેદ સમજાવવો.",
        durationMinutes: 4,
        activityType: "pronunciation",
      },
      {
        stepNumber: 2,
        title: "શબ્દ નિર્માણ રમત",
        description: "સામાન્ય શબ્દો (કાતર, દીવો, કેળું) માં વપરાયેલી માત્રાઓ ઓળખવી.",
        durationMinutes: 5,
        activityType: "word_building",
      },
      {
        stepNumber: 3,
        title: "ખાલી જગ્યા પૂરો",
        description: "વિદ્યાર્થી 5 શબ્દોમાં યોગ્ય માત્રા મૂકીને સાચો શબ્દ બનાવે.",
        durationMinutes: 5,
        activityType: "fill_in_the_blank",
      },
      {
        stepNumber: 4,
        title: "લેખન ચકાસણી",
        description: "3 સાદા વાક્યોનું સુંદર અક્ષરે શ્રુતલેખન કરાવવું.",
        durationMinutes: 4,
        activityType: "writing",
      },
    ],
    teacherInstructions:
      "હ્રસ્વ અને દીર્ઘ વચ્ચેનો સમય લંબાઈનો ભેદ બોલીને બતાવો. બાળકને ભૂલો પર ડરાવવાને બદલે પ્રોત્સાહિત કરો.",
    reassessmentCriteria:
      "વિદ્યાર્થી 10 શબ્દોમાંથી 8 શબ્દોમાં યોગ્ય માત્રા લખી અને વાંચી શકે.",
  },
  "c-evs-water-01": {
    conceptId: "c-evs-water-01",
    conceptName: "Water Cycle & Conservation",
    subjectCode: "EVS",
    grade: 4,
    learningObjective:
      "Understand evaporation, condensation, precipitation, and identify 3 daily water-saving habits.",
    materials: ["Water cycle diagram chart", "Clear cup with warm water and ice cubes on lid"],
    difficulty: "Beginner",
    estimatedMinutes: 18,
    steps: [
      {
        stepNumber: 1,
        title: "Mini Cloud Experiment",
        description: "Observe droplets forming under the lid with warm water to demonstrate condensation.",
        durationMinutes: 5,
        activityType: "demonstration",
      },
      {
        stepNumber: 2,
        title: "Diagram Labeling",
        description: "Label Sun, Evaporation, Cloud Formation, and Rain on a circular diagram.",
        durationMinutes: 4,
        activityType: "diagram_practice",
      },
      {
        stepNumber: 3,
        title: "Water Conservation Discussion",
        description: "List 3 ways we waste water at home/school and how to fix each one.",
        durationMinutes: 5,
        activityType: "discussion",
      },
      {
        stepNumber: 4,
        title: "Pledge & Exit Check",
        description: "Student writes 1 personal action pledge and answers 2 true/false questions.",
        durationMinutes: 4,
        activityType: "reflection",
      },
    ],
    teacherInstructions:
      "Connect science concepts directly to the child's village or city context and monsoon experiences.",
    reassessmentCriteria:
      "Accurately explain 3 stages of the water cycle and score >=80% on the concept quiz.",
  },
};

/**
 * Generates a targeted, actionable Remedial Plan for an identified student gap.
 * Works completely offline without paid API keys.
 */
export function generateRemedialPlan(
  studentId: string,
  studentName: string,
  conceptId: string,
  conceptName: string,
  subjectCode: SubjectCode,
  gapDetection: GapDetectionResult,
  customNotes?: string
): RemedialPlan {
  const template = CURRICULUM_TEMPLATES[conceptId] || {
    conceptId,
    conceptName,
    subjectCode,
    grade: 3,
    learningObjective: `Strengthen conceptual understanding and foundational mastery of ${conceptName}.`,
    materials: ["Classroom notebook", "Pencil and eraser", "Concept worksheet"],
    difficulty: gapDetection.latestPercentage < 45 ? "Beginner" : "Intermediate",
    estimatedMinutes: 20,
    steps: [
      {
        stepNumber: 1,
        title: "Foundational Diagnostic Review",
        description: `Review the prerequisite concepts and basic definitions of ${conceptName}.`,
        durationMinutes: 5,
      },
      {
        stepNumber: 2,
        title: "Teacher-Guided Example",
        description: `Work through 2 solved demonstrations with step-by-step reasoning.`,
        durationMinutes: 5,
      },
      {
        stepNumber: 3,
        title: "Scaffolded Practice",
        description: `Student attempts 4 targeted problems with gentle teacher hints when needed.`,
        durationMinutes: 6,
      },
      {
        stepNumber: 4,
        title: "Formative Re-assessment",
        description: `Quick 3-question evaluation to record immediate learning retention.`,
        durationMinutes: 4,
      },
    ],
    teacherInstructions: `Focus on why the student missed questions during previous assessment (${gapDetection.latestPercentage}%). Provide supportive, patient encouragement.`,
    reassessmentCriteria: `Student must achieve at least 80% on the reassessment assessment for ${conceptName}.`,
  };

  const id = `plan-${studentId}-${conceptId}-${Date.now()}`;
  const now = new Date().toISOString();
  // Review date 7 days from now
  const reviewDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  return {
    id,
    studentId,
    studentName,
    conceptId,
    conceptName,
    subjectCode,
    learningObjective: template.learningObjective,
    recommendationReason: gapDetection.reason,
    status: "Suggested",
    estimatedMinutes: template.estimatedMinutes,
    difficulty: template.difficulty,
    requiredMaterials: template.materials,
    steps: template.steps,
    practiceQuestionsSummary: `${template.steps.length} structured remedial steps with targeted practice exercises.`,
    reassessmentCriteria: template.reassessmentCriteria,
    teacherInstructions: template.teacherInstructions,
    teacherNotes: customNotes || "",
    createdAt: now,
    reviewDate,
  };
}
