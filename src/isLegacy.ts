import { isNonNullObject } from '@rnacanvas/value-check'

/**
 * Returns `true` if the saved drawing is in a legacy format.
 *
 * Returns `false` otherwise.
 */
export function isLegacy(savedDrawing: unknown): boolean {
  // the outer XML of a drawing used to be saved under `svg`
  return isNonNullObject(savedDrawing) && 'svg' in savedDrawing;
}
