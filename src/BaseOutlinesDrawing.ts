import type { Nucleobase } from '@rnacanvas/draw.bases';

import type { BaseOutline } from './BaseOutline';

import { BaseOutline as GenericBaseOutline } from '@rnacanvas/draw.bases.outlines';

import { OwnedElementsDrawing } from './OwnedElementsDrawing';

/**
 * A drawing of base outlines.
 */
export class BaseOutlinesDrawing {
  #ownedElementsDrawing: OwnedElementsDrawing<BaseOutline>;

  constructor(readonly domNode: SVGSVGElement) {
    this.#ownedElementsDrawing = new OwnedElementsDrawing(domNode);
  }

  /**
   * The base outlines in the base outlines drawing.
   */
  get baseOutlines() {
    return this.#ownedElementsDrawing.elements;
  }

  append(bo: BaseOutline) {
    this.domNode.append(bo.domNode);

    this.baseOutlines.push(bo);
  }

  /**
   * The base to be outlined is assumed to be present in the SVG document
   * corresponding to the drawing.
   */
  outline(b: Nucleobase): BaseOutline {
    let bo = GenericBaseOutline.outlining(b);

    b.domNode.insertAdjacentElement('beforebegin', bo.domNode);

    this.baseOutlines.push(bo);

    return bo;
  }
}
