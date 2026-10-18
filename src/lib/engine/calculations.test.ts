import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  calculatePercentage,
  calculatePercentagePointDelta,
  determineTrend,
  validateAssessmentMarks,
  calculateAverage,
} from "./calculations";

describe("Calculations Engine", () => {
  it("calculates percentage accurately with rounding", () => {
    assert.equal(calculatePercentage(7, 20), 35);
    assert.equal(calculatePercentage(15, 20), 75);
    assert.equal(calculatePercentage(0, 50), 0);
    assert.equal(calculatePercentage(50, 50), 100);
  });

  it("handles invalid or zero maximum marks gracefully", () => {
    assert.equal(calculatePercentage(10, 0), 0);
    assert.equal(calculatePercentage(10, -5), 0);
    assert.equal(calculatePercentage(-5, 20), 0);
  });

  it("calculates true percentage point delta (Latest % - Initial %)", () => {
    // 35% to 75% is +40 percentage points
    const delta1 = calculatePercentagePointDelta(75, 35);
    assert.equal(delta1, 40);

    // 60% down to 45% is -15 percentage points
    const delta2 = calculatePercentagePointDelta(45, 60);
    assert.equal(delta2, -15);

    // No change
    assert.equal(calculatePercentagePointDelta(80, 80), 0);
  });

  it("validates assessment marks correctly", () => {
    // Valid
    assert.equal(validateAssessmentMarks(18, 20).isValid, true);
    assert.equal(validateAssessmentMarks(0, 20).isValid, true);

    // Negative obtained
    const neg = validateAssessmentMarks(-1, 20);
    assert.equal(neg.isValid, false);
    assert.match(neg.error || "", /negative/i);

    // Exceeding maximum
    const exceed = validateAssessmentMarks(25, 20);
    assert.equal(exceed.isValid, false);
    assert.match(exceed.error || "", /cannot exceed/i);

    // Zero or negative max
    const zeroMax = validateAssessmentMarks(5, 0);
    assert.equal(zeroMax.isValid, false);

    // NaN / invalid type
    const nanVal = validateAssessmentMarks(NaN, 20);
    assert.equal(nanVal.isValid, false);
  });

  it("determines trends with clear explainability and handles insufficient data", () => {
    // Single observation cannot establish historical trend
    const single = determineTrend([35]);
    assert.equal(single.trend, "insufficient_data");
    assert.equal(single.deltaPercentagePoints, null);

    // Clear improvement
    const improving = determineTrend([35, 50, 75]);
    assert.equal(improving.trend, "improving");
    assert.equal(improving.deltaPercentagePoints, 40);

    // Clear decline
    const declining = determineTrend([80, 60, 45]);
    assert.equal(declining.trend, "declining");
    assert.equal(declining.deltaPercentagePoints, -35);

    // Stable
    const stable = determineTrend([70, 72]);
    assert.equal(stable.trend, "stable");
    assert.equal(stable.deltaPercentagePoints, 2);
  });

  it("calculates average safely", () => {
    assert.equal(calculateAverage([]), 0);
    assert.equal(calculateAverage([40, 60, 80]), 60);
    assert.equal(calculateAverage([35, 75]), 55);
  });
});
