import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { generateRemedialPlan } from "./remedialEngine";
import { detectLearningGap } from "./gapDetection";

describe("Remedial Action Recommendation Engine", () => {
  it("generates a complete, structured remedial plan for Division Basics (Aarav case)", () => {
    const gap = detectLearningGap("c-div-01", "Division Basics", [
      { marksObtained: 8, maximumMarks: 20, recordedAt: "2026-09-10" },
      { marksObtained: 7, maximumMarks: 20, recordedAt: "2026-09-24" },
    ]);

    const plan = generateRemedialPlan(
      "std-aarav",
      "Aarav Patel",
      "c-div-01",
      "Division Basics & Equal Sharing",
      "MATH",
      gap
    );

    assert.ok(plan.id.startsWith("plan-std-aarav"));
    assert.equal(plan.studentName, "Aarav Patel");
    assert.equal(plan.status, "Suggested");
    assert.equal(plan.estimatedMinutes, 20);
    assert.ok(plan.requiredMaterials.length > 0);
    assert.ok(plan.steps.length >= 4);
    assert.match(plan.learningObjective, /equal/i);
    assert.match(plan.teacherInstructions, /equal grouping/i);
    assert.match(plan.reassessmentCriteria, /80%/);
  });

  it("provides fallback template for any undefined concept smoothly", () => {
    const gap = detectLearningGap("c-custom-99", "Solar System Planets", [
      { marksObtained: 5, maximumMarks: 20, recordedAt: "2026-10-01" },
    ]);

    const plan = generateRemedialPlan(
      "std-meera",
      "Meera Shah",
      "c-custom-99",
      "Solar System Planets",
      "EVS",
      gap
    );

    assert.equal(plan.studentName, "Meera Shah");
    assert.equal(plan.conceptName, "Solar System Planets");
    assert.ok(plan.steps.length > 0);
    assert.equal(plan.difficulty, "Beginner");
  });
});
