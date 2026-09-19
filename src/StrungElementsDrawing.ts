import type { StrungElement } from './StrungElement';

import { StrungText, StrungCircle, StrungRectangle, StrungTriangle } from '@rnacanvas/draw.floating';

import type { Bond } from './Bond';

import { OwnedElementsDrawing } from './OwnedElementsDrawing';

export class StrungElementsDrawing {
  /**
   * Wrapped owned elements drawing.
   */
  readonly #ownedElementsDrawing;

  constructor(domNode: SVGSVGElement) {
    this.#ownedElementsDrawing = new OwnedElementsDrawing<StrungElement>(domNode);
  }

  get domNode() {
    return this.#ownedElementsDrawing.domNode;
  }

  get strungElements(): StrungElement[] {
    return this.#ownedElementsDrawing.elements;
  }

  set strungElements(strungElements) {
    this.#ownedElementsDrawing.elements = strungElements;
  }

  /**
   * Recognized types include: "text", "circle", "rectangle" and "triangle".
   *
   * This method throws for unrecognized types.
   */
  add(type: string, owner: Bond): StrungElement | never {
    // do some input sanitation
    type = type.trim();
    type = type.toLowerCase();

     let strungElement: StrungElement;

    if (type == 'text') {
      strungElement = StrungText.on(owner);
    } else if (type == 'circle') {
      strungElement = StrungCircle.on(owner);
    } else if (type == 'rectangle') {
      strungElement = StrungRectangle.on(owner);
    } else if (type == 'triangle') {
      strungElement = StrungTriangle.on(owner);
    } else {
      throw new Error(`Unrecognized strung element type: ${type}.`);
    }

    // don't forget to add to the drawing
    this.domNode.append(strungElement.domNode);

    // position the strung element (after being added to the document body, which is necessary for text)
    strungElement.lineX += 1;
    strungElement.lineX -= 1;

    // register the created element so it's tracked by the drawing
    this.#ownedElementsDrawing.elements.push(strungElement);

    return strungElement;
  }
}
