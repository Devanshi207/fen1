import { describe, expect, it } from "vitest";
import { countEase, flyTransform, lockupBox, readProgress, resolveHome, subProgress } from "@/lib/studio";

describe("resolveHome", () => {
  it("is the normal home page unless asked for the studio one", () => {
    expect(resolveHome(null, null)).toBe("default");
    expect(resolveHome(null, "default")).toBe("default");
  });

  it("follows the link parameter, which beats what the tab remembers", () => {
    expect(resolveHome("studio", null)).toBe("studio");
    expect(resolveHome("default", "studio")).toBe("default");
  });

  it("keeps the studio page when coming back to it in the same tab", () => {
    expect(resolveHome(null, "studio")).toBe("studio");
  });

  it("ignores values it does not know, including the sideways layout's", () => {
    expect(resolveHome("horizontal", null)).toBe("default");
    expect(resolveHome(null, "horizontal")).toBe("default");
  });
});

describe("readProgress", () => {
  it("runs from 0 to 1 as a section crosses the screen", () => {
    expect(readProgress(800, 1000, 800)).toBe(0);
    expect(readProgress(-1000, 1000, 800)).toBe(1);
    expect(readProgress(-100, 1000, 800)).toBeCloseTo(0.5);
  });

  it("stays in range and copes with nothing to measure", () => {
    expect(readProgress(5000, 1000, 800)).toBe(0);
    expect(readProgress(-9000, 1000, 800)).toBe(1);
    expect(readProgress(0, 0, 0)).toBe(0);
  });
});

describe("countEase", () => {
  it("starts at 0, ends at 1 and never leaves that range", () => {
    expect(countEase(0)).toBe(0);
    expect(countEase(1)).toBe(1);
    expect(countEase(-3)).toBe(0);
    expect(countEase(4)).toBe(1);
  });

  it("is slow at the ends and passes half way at half time", () => {
    expect(countEase(0.1)).toBeLessThan(0.1);
    expect(countEase(0.9)).toBeGreaterThan(0.9);
    expect(countEase(0.5)).toBeCloseTo(0.5);
  });
});

describe("subProgress", () => {
  it("is 0 before its window, 1 after it, and eased inside it", () => {
    expect(subProgress(0.1, 0.2, 0.6)).toBe(0);
    expect(subProgress(0.9, 0.2, 0.6)).toBe(1);
    const mid = subProgress(0.4, 0.2, 0.6);
    expect(mid).toBeGreaterThan(0.5);
    expect(mid).toBeLessThan(1);
  });
});

describe("flyTransform", () => {
  it("finds the lockup inside a frame of the animation", () => {
    const box = lockupBox({ left: 0, top: 0, width: 1200, height: 675 });
    expect(box).toEqual({ left: 324, top: 229, width: 536, height: 199 });
  });

  it("moves the lockup's centre onto the target's and scales it to the target's width", () => {
    const frame = { left: 0, top: 0, width: 1200, height: 675 };
    const from = lockupBox(frame);
    const to = { left: 20, top: 100, width: 1072, height: 398 };
    const { origin, transform } = flyTransform(frame, from, to);
    expect(origin).toBe("592px 328.5px");
    expect(transform).toBe("translate(-36px, -29.5px) scale(2)");
  });
});
