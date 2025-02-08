import type { Drawing } from './Drawing';

import { parseCT } from '@rnacanvas/ct';

import { consecutivePairs } from '@rnacanvas/base-pairs';

import { basePairs } from '@rnacanvas/position-pairs';

import { untangle } from '@rnacanvas/layout';

import { mean } from '@rnacanvas/math';

export class CTDrawer {
  #targetDrawing;

  constructor(targetDrawing: Drawing) {
    this.#targetDrawing = targetDrawing;
  }

  /**
   * Draws the structure specified by the provided CT string in the target drawing.
   *
   * Throws if unable to parse the CT string.
   */
  draw(ctString: string): void | never {
    let ct = parseCT(ctString);

    let seq = [...ct.sequence].map(c => this.#targetDrawing.addBase(c));

    consecutivePairs(seq).forEach(bp => this.#targetDrawing.addPrimaryBond(...bp));

    let bps = basePairs(seq, ct.positionPairs);

    bps.forEach(bp => this.#targetDrawing.addSecondaryBond(...bp));

    // adjust multiplying factor as desired
    let spacing = 1.87 * mean(seq.map(b => b.bbox.height));

    untangle(seq, bps, { spacing, basePairSpacing: spacing / 2, hairpinLoopSpacing: spacing / 2 });

    // number bases after arranging their layout
    // (so that numberings are oriented correctly)
    seq.length > 0 ? this.#targetDrawing.number(seq[0], 1 + ct.numberingOffset) : {};

    let numberingIncrement = 20;

    seq.slice(0, -numberingIncrement).forEach((b, i) => {
      // the position of the base
      let p = i + 1;

      p % numberingIncrement == 0 ? this.#targetDrawing.number(b, p + ct.numberingOffset) : {};
    });

    seq.length > 0 ? this.#targetDrawing.number(seq[seq.length - 1], seq.length + ct.numberingOffset) : {};

    // place bases on top of everything else
    seq.forEach(b => b.bringToFront());
  }
}
