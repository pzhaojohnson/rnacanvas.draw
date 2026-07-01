import { CurvedBond } from '@rnacanvas/draw.bases.bonds';

import type { Nucleobase } from '@rnacanvas/draw.bases';

import { BondsDrawing } from './BondsDrawing';

export class TertiaryBondsDrawing {
  /**
   * Wrapped bonds drawing.
   */
  readonly #bondsDrawing;

  constructor(readonly domNode: SVGSVGElement) {
    this.#bondsDrawing = new BondsDrawing<TertiaryBond>(domNode, []);
  }

  get tertiaryBonds() {
    return this.#bondsDrawing.bonds;
  }

  set tertiaryBonds(tertiaryBonds) {
    this.#bondsDrawing.bonds = tertiaryBonds;
  }

  /**
   * Adds a tertiary bond between the two bases.
   */
  addTertiaryBond(base1: Nucleobase, base2: Nucleobase): TertiaryBond {
    let tb = CurvedBond.between(base1, base2);

    this.domNode.append(tb.domNode);

    this.tertiaryBonds.push(tb);

    return tb;
  }
}

export type TertiaryBond = CurvedBond;
