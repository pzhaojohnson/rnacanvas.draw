import * as SVG from '@svgdotjs/svg.js';

import { Scaling } from '@rnacanvas/draw.svg';

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

  /**
   * Sets the horizontal and vertical scaling of the drawing
   * (as determined by the view box and width and height attributes of its SVG document)
   * to the specified scaling factor.
   */
  setScaling(scaling: number) {
    (new Scaling(this.svgDoc)).set(scaling);
  }
}
