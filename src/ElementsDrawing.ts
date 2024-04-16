/**
 * An element in a drawing that is an SVG document.
 */
export interface DrawingElement {
  /**
   * Returns true if the element is currently present in the SVG document
   * (i.e., is a child of the SVG document) and returns false otherwise.
   */
  isIn(svgDoc: SVGSVGElement): boolean;
}

/**
 * A drawing of elements.
 *
 * The primary purpose of this class is to manage an array of elements,
 * removing elements from the array when they are removed from the SVG document that is the drawing.
 *
 * This class uses mutation observers to do so.
 */
export class ElementsDrawing {
  /**
   * This class will automatically remove elements from the elements array
   * when they are removed from the SVG document that is the drawing.
   *
   * @param svgDoc The SVG document that is the drawing.
   * @param elements The elements in the drawing.
   */
  constructor(private svgDoc: SVGSVGElement, public elements: DrawingElement[]) {
    let removalObserver = new MutationObserver(mutations => {
      if (mutations.some(mut => mut.removedNodes.length > 0)) {
        this.elements = this.elements.filter(ele => ele.isIn(this.svgDoc));
      }
    });

    removalObserver.observe(svgDoc, { childList: true, subtree: true });
  }
}
