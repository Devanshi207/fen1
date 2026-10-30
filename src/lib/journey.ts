/** Share of each page's scroll spent standing still on it (before and after the turn), so every page is read before the next comes in. */
const DWELL = 0.18;

/**
 * Where the sideways track is, in whole pages, for a scroll progress between 0 and 1 over `count` pages: 0 is the first
 * page in view, count - 1 the last. Between pages it eases across and rests on each one for a while.
 */
export function journeyOffset(progress: number, count: number): number {
  if (count <= 1) return 0;
  const u = Math.min(Math.max(progress, 0), 1) * (count - 1);
  const page = Math.min(Math.floor(u), count - 1);
  const t = Math.min(Math.max((u - page - DWELL) / (1 - 2 * DWELL), 0), 1);
  return page + t * t * (3 - 2 * t);
}

/** The scroll progress (0 to 1) at which page `index` sits exactly in view. */
export function progressForPanel(index: number, count: number): number {
  if (count <= 1) return 0;
  return Math.min(Math.max(index, 0), count - 1) / (count - 1);
}

/** Ease in and out: slow start, quick middle, slow finish. 0 to 1 in, 0 to 1 out. */
export function easeInOutCubic(t: number): number {
  const c = Math.min(Math.max(t, 0), 1);
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
}

/** How long a page turn takes, in ms: a single page is slow and easy to follow, a long jump a little longer (but never dragging). */
export function turnDuration(pages: number): number {
  const n = Math.abs(pages);
  return n === 0 ? 0 : Math.min(2600 + (n - 1) * 350, 3400);
}

/** A place the plane rests: its centre and its size. */
export interface Spot {
  x: number;
  y: number;
  size: number;
}

/** How the plane gets from one spot to the next: a loop-the-loop partway along, or a zig-zag across the line between them. */
export type HopStyle = "loop" | "zigzag";

/** The plane part way along a hop: where it is, the direction it is travelling in (degrees), and how big it has swollen. */
export interface Flight {
  x: number;
  y: number;
  angle: number;
  size: number;
}

/** The artwork's nose points 33 degrees up from its drawn orientation, so a rotation of (travel angle + 33) points it along the path. */
export const NOSE_TILT = 33;

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

/** A point on the hop from `a` to `b`, `t` from 0 to 1. Both ends land exactly on the spots. */
function pointOnHop(a: Spot, b: Spot, t: number, style: HopStyle) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const length = Math.hypot(dx, dy) || 1;
  const ux = dx / length;
  const uy = dy / length;
  // "up" from the line of travel: to the left of it
  const px = uy;
  const py = -ux;
  const n = clamp(t, 0, 1);
  let along = length * n;
  let across = 0;
  if (style === "loop") {
    // one full circle traced over the middle of the hop while the plane carries on forward: it doubles back on itself and
    // goes on. The angle eases in and out (smoothstep), so the plane's speed and direction change smoothly, with no jerk.
    const radius = clamp(length * 0.15, 38, 110);
    const w = clamp((n - 0.2) / 0.6, 0, 1);
    const theta = 2 * Math.PI * (w * w * (3 - 2 * w) - 0.5);
    along -= radius * Math.sin(theta);
    across = radius * (1 + Math.cos(theta));
  } else {
    // two swings out to one side and back to the other
    const swing = clamp(length * 0.12, 26, 70);
    across = swing * Math.sin(3 * Math.PI * n);
  }
  return { x: a.x + ux * along + px * across, y: a.y + uy * along + py * across };
}

/** The plane `t` (0 to 1) of the way along a hop, facing the way it is travelling and swelling a little in the middle. */
export function flightAt(a: Spot, b: Spot, t: number, style: HopStyle): Flight {
  const n = clamp(t, 0, 1);
  const e = 0.004;
  const before = pointOnHop(a, b, clamp(n - e, 0, 1 - 2 * e), style);
  const after = pointOnHop(a, b, clamp(n + e, 2 * e, 1), style);
  const here = pointOnHop(a, b, n, style);
  return {
    x: here.x,
    y: here.y,
    angle: (Math.atan2(after.y - before.y, after.x - before.x) * 180) / Math.PI,
    size: (a.size + (b.size - a.size) * n) * (1 + 0.35 * Math.sin(Math.PI * n)),
  };
}

/** The dotted trail behind the plane: the last stretch of the hop up to `t`, as an SVG path. */
export function trailPath(a: Spot, b: Spot, t: number, style: HopStyle, length = 0.3, steps = 28): string {
  const start = Math.max(0, t - length);
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const p = pointOnHop(a, b, start + ((t - start) * i) / steps, style);
    d += `${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
  }
  return d;
}

/** The style of the hop between page `index` and the next: loops and zig-zags in turn, starting with a loop. */
export function hopStyle(index: number): HopStyle {
  return index % 2 === 0 ? "loop" : "zigzag";
}

/**
 * Which page to settle on when scrolling stops. `startOffset` is where the track was when the scroll began and `offset` where
 * it is now (both in pages). A tiny wobble stays on the page it began on; a short push in one direction carries on to the next
 * page that way (so one notch of the wheel turns a page, and going back works too); a long scroll lands on the nearest page.
 */
export function snapTarget(startOffset: number, offset: number, last: number): number {
  const delta = offset - startOffset;
  const move = Math.abs(delta);
  let target: number;
  if (move <= 0.06) target = Math.round(startOffset);
  else if (move < 0.5) target = delta > 0 ? Math.ceil(offset - 0.001) : Math.floor(offset + 0.001);
  else target = Math.round(offset);
  return Math.min(Math.max(target, 0), last);
}
