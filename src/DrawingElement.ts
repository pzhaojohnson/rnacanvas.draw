/**
 * The basic interface that an object must fulfill
 * to be included as an element in a drawing.
 */
export interface DrawingElement {
  /**
   * The DOM node corresponding to the drawing element.
   */
  domNode: SVGElement;
}
