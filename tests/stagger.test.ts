import { describe, expect, it } from "vitest";
import {
  STAGGER_MAX_STEPS,
  STAGGER_STEP_MS,
  columnCount,
  isOffsetColumn,
  parallaxOffset,
  staggerDelay,
} from "@/lib/stagger";

describe("columnCount", () => {
  it("counts the tracks of a computed grid-template-columns value", () => {
    expect(columnCount("380px 380px 380px")).toBe(3);
    expect(columnCount("1fr")).toBe(1);
  });

  it("treats non-grids as a single column", () => {
    expect(columnCount("none")).toBe(1);
    expect(columnCount("")).toBe(1);
    expect(columnCount(undefined)).toBe(1);
  });

  it("ignores named grid lines", () => {
    expect(columnCount("[start] 200px [mid] 200px [end]")).toBe(2);
  });
});

describe("staggerDelay", () => {
  it("delays each item in a plain sequence by one step", () => {
    expect([0, 1, 2].map((i) => staggerDelay(i, 1))).toEqual([0, STAGGER_STEP_MS, STAGGER_STEP_MS * 2]);
  });

  it("restarts the cascade on every row of a multi-column grid", () => {
    // 3 columns: items 0-2 are row one, items 3-5 are row two
    expect([0, 1, 2, 3, 4, 5].map((i) => staggerDelay(i, 3))).toEqual([0, 90, 180, 0, 90, 180]);
  });

  it("never exceeds the cap, however long the list is", () => {
    expect(staggerDelay(500, 1)).toBe(STAGGER_MAX_STEPS * STAGGER_STEP_MS);
  });
});

describe("isOffsetColumn", () => {
  it("offsets the middle column of a three-column grid", () => {
    expect([0, 1, 2, 3, 4, 5].map((i) => isOffsetColumn(i, 3))).toEqual([false, true, false, false, true, false]);
  });

  it("never offsets a single column", () => {
    expect(isOffsetColumn(1, 1)).toBe(false);
  });
});

describe("parallaxOffset", () => {
  it("is zero when the element is centred in the viewport", () => {
    expect(parallaxOffset(400, 800, 0.05)).toBeCloseTo(0);
  });

  it("moves with the scroll for a positive speed and against it for a negative one", () => {
    expect(parallaxOffset(600, 800, 0.05)).toBeGreaterThan(0);
    expect(parallaxOffset(600, 800, -0.05)).toBeLessThan(0);
  });

  it("is clamped so the image never slides out of its frame", () => {
    expect(parallaxOffset(100000, 800, 0.5)).toBe(28);
    expect(parallaxOffset(-100000, 800, 0.5)).toBe(-28);
  });
});
