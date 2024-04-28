import { Nucleobase } from '@rnacanvas/draw.bases';

import { ElementsDrawing } from './ElementsDrawing';

/**
 * A drawing of nucleobases.
 */
export class BasesDrawing {
  /**
   * This class wraps an elements drawing.
   */
  private elementsDrawing: ElementsDrawing<Nucleobase>;

  /**
   * @param svgDoc The SVG document that is the drawing.
   * @param bases The nucleobases in the drawing.
   */
  constructor(private svgDoc: SVGSVGElement, bases: Nucleobase[]) {
    this.elementsDrawing = new ElementsDrawing(svgDoc, bases);
  }

  /**
   * The nucleobases in the drawing.
   *
   * The ordering of nucleobases in this array is the ordering of nucleobases in the drawing.
   */
  get bases() {
    return this.elementsDrawing.elements;
  }

  /**
   * Appends the given nucleobase to the drawing
   * (i.e., appends it to the SVG document that is the drawing
   * and appends the nucleobase to the array of nucleobases).
   */
  append(b: Nucleobase): void {
    b.appendTo(this.svgDoc);
    this.bases.push(b);
  }

  /**
   * Creates and appends a nucleobase to the drawing with the specified text content.
   *
   * Returns the added nucleobase.
   */
  add(textContent: string): Nucleobase {
    let b = Nucleobase.create(textContent);

    this.append(b);

    return b;
  }
}
