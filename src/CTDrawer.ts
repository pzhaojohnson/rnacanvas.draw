import type { Drawing } from './Drawing';

import { parseCT } from '@rnacanvas/ct';

import { consecutivePairs } from '@rnacanvas/base-pairs';

import { basePairs } from '@rnacanvas/position-pairs';

import { untangle } from '@rnacanvas/layout';

import { linearize } from '@rnacanvas/layout';

import { Direction } from '@rnacanvas/layout';

import { mean } from '@rnacanvas/math';

import { first, last } from '@rnacanvas/utilities';

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
  draw(ctString: string): Drawn | never {
    let ct = parseCT(ctString);

    let seq = [...ct.sequence].map(c => this.#targetDrawing.addBase(c));

    consecutivePairs(seq).forEach(bp => this.#targetDrawing.addPrimaryBond(...bp));

    let bps = basePairs(seq, ct.positionPairs);

    bps.forEach(bp => this.#targetDrawing.addSecondaryBond(...bp));

    // adjust multiplying factor as desired
    let spacing = 1.87 * mean(seq.map(b => b.bbox.height));

    // arrange bases before numbering them (to orient numberings correctly)
    if (bps.length > 0) {
      untangle(seq, bps, { spacing, basePairSpacing: spacing / 2, hairpinLoopSpacing: spacing / 2 });
    } else {
      linearize(seq, { spacing: spacing / 2 });

      // set explicitly (otherwise might be non-zero by default sometimes)
      (new Direction(seq)).set(0);
    }

    // only number bases when there's more than 10 being drawn
    if (seq.length > 10) {
      this.#targetDrawing.number(first(seq), 1 + ct.numberingOffset);
      this.#targetDrawing.number(last(seq), seq.length + ct.numberingOffset);
    }

    let numberingIncrement = 20;

    // number intervening bases
    seq.slice(0, -numberingIncrement).forEach((b, i) => {
      // the position of the base
      let p = i + 1;

      p % numberingIncrement == 0 ? this.#targetDrawing.number(b, p + ct.numberingOffset) : {};
    });

    // place bases on top of everything else
    seq.forEach(b => b.bringToFront());

    return {
      bases: seq,
    };
  }
}

type Drawn = {
  /**
   * The drawn bases.
   */
  readonly bases: Iterable<ReturnType<InstanceType<typeof Drawing>['addBase']>>;
};
