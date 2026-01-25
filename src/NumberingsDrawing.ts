import type { Nucleobase } from '@rnacanvas/draw.bases';

import type { Numbering, NumberingLine } from './Numbering';

import { Numbering as GenericNumbering, NumberingLine as GenericNumberingLine } from '@rnacanvas/draw.bases.numberings';

import { OwnedElementsDrawing } from './OwnedElementsDrawing';

export class NumberingsDrawing {
  #ownedElementsDrawing: OwnedElementsDrawing<Numbering>;

  constructor(readonly domNode: SVGSVGElement) {
    this.#ownedElementsDrawing = new OwnedElementsDrawing(domNode);
  }

  get numberings() {
    return this.#ownedElementsDrawing.elements;
  }

  set numberings(numberings) {
    this.#ownedElementsDrawing.elements = numberings;
  }

  number(b: Nucleobase, n: number): Numbering {
    let numbering = GenericNumbering.numbering(b, n);

    this.domNode.insertBefore(numbering.domNode, b.domNode);

    this.#ownedElementsDrawing.elements.push(numbering);

    return numbering;
  }
}

export class NumberingLinesDrawing {
  #ownedElementsDrawing: OwnedElementsDrawing<NumberingLine>;

  constructor(readonly domNode: SVGSVGElement) {
    this.#ownedElementsDrawing = new OwnedElementsDrawing(domNode);
  }

  get numberingLines() {
    return this.#ownedElementsDrawing.elements;
  }

  set numberingLines(numberingLines) {
    this.#ownedElementsDrawing.elements = numberingLines;
  }

  connect(n: Numbering): NumberingLine {
    let line = GenericNumberingLine.connecting(n);

    this.domNode.insertBefore(line.domNode, n.domNode);

    this.#ownedElementsDrawing.elements.push(line);

    return line;
  }
}
