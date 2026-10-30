import { describe, expect, it } from "vitest";
import { easeInOutCubic, flightAt, hopStyle, journeyOffset, progressForPanel, snapTarget, trailPath, turnDuration, type Spot } from "@/lib/journey";

describe("journeyOffset", () => {
  it("starts on the first page and ends on the last", () => {
    expect(journeyOffset(0, 6)).toBe(0);
    expect(journeyOffset(1, 6)).toBe(5);
  });

  it("rests exactly on each page, with a stretch of scrolling that does not move it", () => {
    expect(journeyOffset(0.02, 6)).toBe(0); // inside the first page's rest
    expect(journeyOffset(0.2, 6)).toBe(1); // page 1 sits at 1/5 of the way
    expect(journeyOffset(0.2 + 0.02, 6)).toBe(1);
  });

  it("only ever moves forward as scroll increases, and stays in range", () => {
    let last = -1;
    for (let p = -0.2; p <= 1.2; p += 0.01) {
      const o = journeyOffset(p, 6);
      expect(o).toBeGreaterThanOrEqual(last);
      expect(o).toBeGreaterThanOrEqual(0);
      expect(o).toBeLessThanOrEqual(5);
      last = o;
    }
  });

  it("turns half way between two pages at the middle of the gap", () => {
    expect(journeyOffset(0.1, 6)).toBeCloseTo(0.5, 5);
    expect(journeyOffset(0.25, 3)).toBeCloseTo(0.5, 5);
  });

  it("copes with one page or none", () => {
    expect(journeyOffset(0.5, 1)).toBe(0);
    expect(journeyOffset(0.5, 0)).toBe(0);
  });
});

describe("progressForPanel", () => {
  it("is the scroll position where a page rests exactly in view", () => {
    expect(progressForPanel(0, 6)).toBe(0);
    expect(progressForPanel(5, 6)).toBe(1);
    expect(journeyOffset(progressForPanel(3, 6), 6)).toBe(3);
  });

  it("stays in range", () => {
    expect(progressForPanel(-2, 6)).toBe(0);
    expect(progressForPanel(99, 6)).toBe(1);
    expect(progressForPanel(2, 1)).toBe(0);
  });
});

describe("easeInOutCubic", () => {
  it("runs from 0 to 1 and is symmetric about the middle", () => {
    expect(easeInOutCubic(0)).toBe(0);
    expect(easeInOutCubic(1)).toBe(1);
    expect(easeInOutCubic(0.5)).toBeCloseTo(0.5, 10);
    expect(easeInOutCubic(0.25) + easeInOutCubic(0.75)).toBeCloseTo(1, 10);
  });

  it("starts and ends gently, and never goes backwards or out of range", () => {
    expect(easeInOutCubic(0.1)).toBeLessThan(0.01);
    expect(easeInOutCubic(0.9)).toBeGreaterThan(0.99);
    let last = 0;
    for (let t = -0.5; t <= 1.5; t += 0.01) {
      const v = easeInOutCubic(t);
      expect(v).toBeGreaterThanOrEqual(last);
      expect(v).toBeLessThanOrEqual(1);
      last = v;
    }
  });
});

describe("turnDuration", () => {
  it("takes a slow 2.6 seconds for one page and a bit longer for a jump, capped", () => {
    expect(turnDuration(0)).toBe(0);
    expect(turnDuration(1)).toBe(2600);
    expect(turnDuration(-1)).toBe(2600);
    expect(turnDuration(3)).toBe(3300);
    expect(turnDuration(10)).toBe(3400);
  });
});

describe("the plane's route", () => {
  const a: Spot = { x: 100, y: 480, size: 56 };
  const b: Spot = { x: 700, y: 110, size: 56 };

  /** total turning of the plane's direction along a hop, in degrees (a full loop is about 360) */
  function totalTurn(style: "loop" | "zigzag") {
    let turn = 0;
    let prev = flightAt(a, b, 0.001, style).angle;
    for (let i = 2; i <= 400; i++) {
      let next = flightAt(a, b, i / 400, style).angle;
      while (next - prev > 180) next -= 360;
      while (next - prev < -180) next += 360;
      turn += next - prev;
      prev = next;
    }
    return turn;
  }

  /** how many times the path crosses the straight line between the two spots */
  function crossings(style: "loop" | "zigzag") {
    const side = (t: number) => {
      const p = flightAt(a, b, t, style);
      return (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x);
    };
    let count = 0;
    let last = 0;
    for (let i = 1; i < 400; i++) {
      const v = side(i / 400);
      if (Math.abs(v) < 1e-6) continue;
      if (last !== 0 && Math.sign(v) !== last) count++;
      last = Math.sign(v);
    }
    return count;
  }

  it("starts exactly on one spot and ends exactly on the next, for both styles", () => {
    for (const style of ["loop", "zigzag"] as const) {
      const start = flightAt(a, b, 0, style);
      const end = flightAt(a, b, 1, style);
      expect(start.x).toBeCloseTo(a.x, 5);
      expect(start.y).toBeCloseTo(a.y, 5);
      expect(end.x).toBeCloseTo(b.x, 5);
      expect(end.y).toBeCloseTo(b.y, 5);
    }
  });

  it("a loop hop goes right round in a circle on the way", () => {
    expect(Math.abs(totalTurn("loop"))).toBeGreaterThan(300);
  });

  it("a zig-zag hop swings out and back across the line between the spots, without circling", () => {
    expect(crossings("zigzag")).toBeGreaterThanOrEqual(2);
    expect(Math.abs(totalTurn("zigzag"))).toBeLessThan(200);
  });

  it("goes from the lower left to the upper right overall", () => {
    const start = flightAt(a, b, 0, "loop");
    const end = flightAt(a, b, 1, "loop");
    expect(end.x).toBeGreaterThan(start.x);
    expect(end.y).toBeLessThan(start.y);
  });

  it("swells in the middle of a hop and is back to its own size at each spot", () => {
    expect(flightAt(a, b, 0.5, "loop").size).toBeGreaterThan(56 * 1.3);
    expect(flightAt(a, b, 0, "loop").size).toBeCloseTo(56, 5);
    expect(flightAt(a, b, 1, "zigzag").size).toBeCloseTo(56, 5);
  });

  it("is the same route every time, so going back retraces it", () => {
    expect(flightAt(a, b, 0.37, "loop")).toEqual(flightAt(a, b, 0.37, "loop"));
  });

  it("draws a dotted trail of the last stretch, ending at the plane", () => {
    const path = trailPath(a, b, 0.6, "loop");
    expect(path.startsWith("M")).toBe(true);
    expect((path.match(/L/g) ?? []).length).toBe(28);
    const here = flightAt(a, b, 0.6, "loop");
    expect(path.endsWith(`${here.x.toFixed(1)} ${here.y.toFixed(1)}`)).toBe(true);
  });

  it("alternates loops and zig-zags, starting with a loop", () => {
    expect([0, 1, 2, 3].map(hopStyle)).toEqual(["loop", "zigzag", "loop", "zigzag"]);
  });
});

describe("snapTarget", () => {
  it("stays put after a tiny wobble", () => {
    expect(snapTarget(1, 1.04, 4)).toBe(1);
    expect(snapTarget(2, 1.96, 4)).toBe(2);
  });

  it("carries a short push on to the next page in that direction, forward or back", () => {
    expect(snapTarget(1, 1.2, 4)).toBe(2);
    expect(snapTarget(1, 1.45, 4)).toBe(2);
    expect(snapTarget(2, 1.8, 4)).toBe(1);
    expect(snapTarget(2, 1.55, 4)).toBe(1);
  });

  it("lands on the nearest page after a long scroll, however fast it was", () => {
    expect(snapTarget(0, 2.3, 4)).toBe(2);
    expect(snapTarget(0, 2.7, 4)).toBe(3);
    expect(snapTarget(4, 1.2, 4)).toBe(1);
  });

  it("stays on the page when scrolling ends exactly on one", () => {
    expect(snapTarget(1, 2, 4)).toBe(2);
    expect(snapTarget(3, 2, 4)).toBe(2);
  });

  it("never goes past the first or last page", () => {
    expect(snapTarget(3.9, 4.6, 4)).toBe(4);
    expect(snapTarget(0.1, -0.5, 4)).toBe(0);
  });
});
