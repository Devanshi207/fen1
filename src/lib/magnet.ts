/** Pull toward the pointer: how far (px) an element should shift while the mouse is over it. */
export function magnetShift(
  pointer: { x: number; y: number },
  rect: { left: number; top: number; width: number; height: number },
  strength = { x: 14, y: 10 }
): { x: number; y: number } {
  if (rect.width <= 0 || rect.height <= 0) return { x: 0, y: 0 };
  const dx = (pointer.x - (rect.left + rect.width / 2)) / rect.width;
  const dy = (pointer.y - (rect.top + rect.height / 2)) / rect.height;
  return { x: dx * strength.x, y: dy * strength.y };
}
