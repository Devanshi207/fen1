/** How many of `total` words should be lit for a scroll progress between 0 and 1. */
export function litWords(progress: number, total: number): number {
  if (total <= 0) return 0;
  const clamped = Math.min(Math.max(progress, 0), 1);
  return Math.round(clamped * total);
}
