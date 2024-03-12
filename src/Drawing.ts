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
}
