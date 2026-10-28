/** Which stage is showing for a given scroll progress (0 to 1) through the pinned roadmap. */
export function activeStage(progress: number, stages: number): number {
  if (stages <= 0) return 0;
  const clamped = Math.min(Math.max(progress, 0), 1);
  return Math.min(stages - 1, Math.floor(clamped * stages));
}

/**
 * How far down the section (in px, from its top) to scroll so that stage `index` is showing.
 * Aims for the middle of that stage's slice of the scroll travel, so the stage is comfortably inside its range.
 */
export function stageScrollTarget(index: number, stages: number, sectionHeight: number, viewportHeight: number): number {
  const travel = Math.max(sectionHeight - viewportHeight, 0);
  return ((index + 0.5) / stages) * travel;
}
