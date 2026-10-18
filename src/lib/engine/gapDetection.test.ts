import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { detectLearningGap, DEFAULT_THRESHOLDS } from "./gapDetection";

describe("Learning Gap Detection Engine", () => {
  it("detects High Priority 'Needs Support' for repeated low performance (Aarav Division case)", () => {
    const history = [
      { marksObtained: 8, maximumMarks: 20, recordedAt: "2026-09-10" }, // 40%
      { marksObtained: 7, maximumMarks: 20, recordedAt: "2026-09-24" }, // 35%
    ];

    const result = detectLearningGap("c-div-01", "Division Basics", history);

    assert.equal(result.masteryStatus, "Needs Support");
    assert.equal(result.priority, "High");
    assert.equal(result.latestPercentage, 35);
    assert.equal(result.previousPercentage, 40);
    assert.equal(result.deltaPercentagePoints, -5);
    assert.equal(result.attemptsCount, 2);
    assert.equal(result.requiresRemediation, true);
    // Explainable reasoning matches requirements
    assert.match(result.reason, /persistent difficulty|below the configured/i);
    assert.match(result.suggestedAction, /fundamentals/i);
  });

  it("detects 'Developing' with Medium priority when student is between 60% and 79%", () => {
    const history = [
      { marksObtained: 14, maximumMarks: 20, recordedAt: "2026-10-01" }, // 70%
    ];

    const result = detectLearningGap("c-mult-01", "Multiplication Tables", history);

    assert.equal(result.masteryStatus, "Developing");
    assert.equal(result.priority, "Medium");
    assert.equal(result.latestPercentage, 70);
    assert.equal(result.requiresRemediation, true);
    assert.match(result.reason, /core basics/i);
  });

  it("detects Mastered and records positive percentage-point improvement upon reassessment", () => {
    const history = [
      { marksObtained: 7, maximumMarks: 20, recordedAt: "2026-09-24" }, // 35% (Initial)
      { marksObtained: 17, maximumMarks: 20, recordedAt: "2026-10-15" }, // 85% (Reassessment)
    ];

    const result = detectLearningGap("c-div-01", "Division Basics", history);

    assert.equal(result.masteryStatus, "Mastered");
    assert.equal(result.priority, "Low");
    assert.equal(result.latestPercentage, 85);
    assert.equal(result.previousPercentage, 35);
    assert.equal(result.deltaPercentagePoints, 50); // +50 pp
    assert.equal(result.requiresRemediation, false);
    assert.match(result.reason, /successfully mastered/i);
    assert.match(result.suggestedAction, /ready for advanced|curriculum/i);
  });

  it("identifies single observation limitation responsibly", () => {
    const history = [
      { marksObtained: 18, maximumMarks: 20, recordedAt: "2026-10-05" }, // 90%
    ];

    const result = detectLearningGap("c-geom-01", "2D Shapes", history);

    assert.equal(result.isSingleObservation, true);
    assert.equal(result.attemptsCount, 1);
    assert.match(result.reason, /single recorded assessment/i);
  });

  it("respects custom administrative thresholds", () => {
    const history = [
      { marksObtained: 16, maximumMarks: 20, recordedAt: "2026-10-05" }, // 80%
    ];

    // Under default (80%), 80% is Mastered
    const defaultRes = detectLearningGap("c-1", "Concept", history, DEFAULT_THRESHOLDS);
    assert.equal(defaultRes.masteryStatus, "Mastered");

    // Under strict school setting (85% mastery, 65% developing), 80% is Developing
    const strictRes = detectLearningGap("c-1", "Concept", history, {
      mastery: 85,
      developing: 65,
    });
    assert.equal(strictRes.masteryStatus, "Developing");
  });
});
