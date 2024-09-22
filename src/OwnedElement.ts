import type { DrawingElement } from './DrawingElement';

/**
 * An element that is owned by another element
 * (i.e., an element that should be removed from a drawing
 * when its owner is removed from a drawing).
 */
export interface OwnedElement {
  /**
   * The DOM node corresponding to the owned element.
   */
  domNode: SVGElement;

  /**
   * The element that owns the owned element.
   */
  owner: DrawingElement;
}
