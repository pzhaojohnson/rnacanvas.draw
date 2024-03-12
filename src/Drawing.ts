import * as SVG from '@svgdotjs/svg.js';

/**
 * A two-dimensional nucleic acid structure drawing.
 */
export class Drawing {
  /**
   * The SVG document of the drawing.
   *
   * Nucleic acid structures are to be drawn on this.
   */
  readonly svgDoc = new SVG.Svg();

  /**
   * The actual DOM node of the SVG document of the drawing.
   */
  get svgDocDOMNode() {
    return this.svgDoc.node;
  }

  /**
   * Appends the drawing to the container element.
   */
  appendTo(container: HTMLElement): void {
    this.svgDoc.addTo(container);
  }

  /**
   * Removes the drawing from its parent container node.
   */
  remove(): void {
    this.svgDoc.remove();
  }
}
