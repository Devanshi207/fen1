import { describe, expect, it } from "vitest";
import { panelAt, panelProgress, resolveLayout } from "@/lib/horizontal";

describe("resolveLayout", () => {
  it("is the normal layout unless asked for the horizontal one", () => {
    expect(resolveLayout(null, null)).toBe("default");
    expect(resolveLayout(null, "default")).toBe("default");
  });

  it("follows the link parameter, which beats what the tab remembers", () => {
    expect(resolveLayout("horizontal", null)).toBe("horizontal");
    expect(resolveLayout("default", "horizontal")).toBe("default");
  });

  it("keeps the horizontal layout while moving between pages", () => {
    expect(resolveLayout(null, "horizontal")).toBe("horizontal");
  });

  it("ignores values it does not know", () => {
    expect(resolveLayout("sideways", null)).toBe("default");
    expect(resolveLayout(null, "sideways")).toBe("default");
  });
});

describe("panelProgress", () => {
  it("is how far through the track a panel's left edge sits", () => {
    expect(panelProgress(0, 4000)).toBe(0);
    expect(panelProgress(1000, 4000)).toBe(0.25);
  });

  it("stays between 0 and 1, and is 0 when the track fits the screen", () => {
    expect(panelProgress(9000, 4000)).toBe(1);
    expect(panelProgress(-50, 4000)).toBe(0);
    expect(panelProgress(500, 0)).toBe(0);
  });
});

describe("panelAt", () => {
  const lefts = [0, 1280, 2176, 3914];

  it("picks the panel whose left edge is the last one at or before the point", () => {
    expect(panelAt(lefts, 0)).toBe(0);
    expect(panelAt(lefts, 1279)).toBe(0);
    expect(panelAt(lefts, 1280)).toBe(1);
    expect(panelAt(lefts, 3000)).toBe(2);
    expect(panelAt(lefts, 99999)).toBe(3);
  });

  it("falls back to the first panel", () => {
    expect(panelAt(lefts, -10)).toBe(0);
    expect(panelAt([], 500)).toBe(0);
  });
});
