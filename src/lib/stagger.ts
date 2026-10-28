export const STAGGER_STEP_MS = 90;
export const STAGGER_MAX_STEPS = 6;

/** How many columns a computed `grid-template-columns` value describes (1 when it is not a grid). */
export function columnCount(template: string | undefined | null): number {
  if (!template || template === "none") return 1;
  // Ignore line names such as `[full-start]`, count the track sizes that remain.
  const tracks = template.replace(/\[[^\]]*\]/g, " ").trim().split(/\s+/).filter(Boolean);
  return Math.max(1, tracks.length);
}

/**
 * Delay before the n-th item of a group animates in. In a multi-column grid the delay follows the column,
 * so a whole row cascades left to right and the next row starts fresh when it scrolls into view.
 * Elsewhere it follows the item's position among its siblings. Capped so long lists never feel slow.
 */
export function staggerDelay(index: number, columns: number): number {
  const position = columns > 1 ? index % columns : index;
  return Math.min(position, STAGGER_MAX_STEPS) * STAGGER_STEP_MS;
}

/** Alternate columns enter from a different distance, which gives a grid its staggered, offset look. */
export function isOffsetColumn(index: number, columns: number): boolean {
  return columns > 1 && index % columns % 2 === 1;
}
