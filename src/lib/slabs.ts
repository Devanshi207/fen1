const clamp01 = (n: number) => Math.min(Math.max(n, 0), 1);

/** 0 while a slab is still below the screen, 1 once it has reached the top: how far it has "arrived". */
export function arrival(top: number, viewportHeight: number): number {
  if (viewportHeight <= 0) return 1;
  return 1 - clamp01(top / viewportHeight);
}

/** 0 until the next slab starts sliding over this one, 1 once it fully covers it. */
export function cover(nextTop: number | null, viewportHeight: number): number {
  if (nextTop === null || viewportHeight <= 0) return 0;
  return 1 - clamp01(nextTop / viewportHeight);
}
