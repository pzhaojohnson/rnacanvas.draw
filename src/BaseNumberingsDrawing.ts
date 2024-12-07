import type { Nucleobase } from '@rnacanvas/draw.bases';

import type { BaseNumbering, BaseNumberingLine } from './BaseNumbering';

import { BaseNumbering as GenericBaseNumbering, BaseNumberingLine as GenericBaseNumberingLine } from '@rnacanvas/draw.bases.numberings';

import { OwnedElementsDrawing } from './OwnedElementsDrawing';

export class BaseNumberingsDrawing {
  #ownedElementsDrawing: OwnedElementsDrawing<BaseNumbering>;

  constructor(readonly domNode: SVGSVGElement) {
    this.#ownedElementsDrawing = new OwnedElementsDrawing(domNode);
  }

  get baseNumberings() {
    return this.#ownedElementsDrawing.elements;
  }

  set baseNumberings(baseNumberings) {
    this.#ownedElementsDrawing.elements = baseNumberings;
  }

  number(b: Nucleobase, n: number): BaseNumbering {
    let bn = GenericBaseNumbering.numbering(b, n);

    this.domNode.insertBefore(bn.domNode, b.domNode);

    this.#ownedElementsDrawing.elements.push(bn);

    return bn;
  }
}

export class BaseNumberingLinesDrawing {
  #ownedElementsDrawing: OwnedElementsDrawing<BaseNumberingLine>;

  constructor(readonly domNode: SVGSVGElement) {
    this.#ownedElementsDrawing = new OwnedElementsDrawing(domNode);
  }

  get baseNumberingLines() {
    return this.#ownedElementsDrawing.elements;
  }

  set baseNumberingLines(baseNumberingLines) {
    this.#ownedElementsDrawing.elements = baseNumberingLines;
  }

  connect(bn: BaseNumbering): BaseNumberingLine {
    let line = GenericBaseNumberingLine.connecting(bn);

    this.domNode.insertBefore(line.domNode, bn.domNode);

    this.#ownedElementsDrawing.elements.push(line);

    return line;
  }
}
