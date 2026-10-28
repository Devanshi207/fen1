/**
 * Index of the chapter that holds the middle of the screen. When no chapter does (a gap between two), the nearest
 * one above wins; before the first chapter it is the first.
 */
export function currentChapter(rects: { top: number; bottom: number }[], middle: number): number {
  if (rects.length === 0) return 0;
  const inside = rects.findIndex((r) => r.top <= middle && r.bottom > middle);
  if (inside !== -1) return inside;
  let above = -1;
  rects.forEach((r, i) => {
    if (r.top <= middle) above = i;
  });
  return Math.max(above, 0);
}
