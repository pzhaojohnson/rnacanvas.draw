import type { Drawing } from './Drawing';

import { parseDotBracket } from '@rnacanvas/base-pairs';

import { consecutivePairs } from '@rnacanvas/base-pairs';

import { untangle } from '@rnacanvas/layout';

import { linearize } from '@rnacanvas/layout';

import { Direction } from '@rnacanvas/layout';

import { mean } from '@rnacanvas/math';

import { first, last } from '@rnacanvas/utilities';

/**
 * Draws structures expressed in dot-bracket notation on a target drawing.
 */
export class DotBracketDrawer {
  constructor(private targetDrawing: Drawing) {}

  /**
   * Draws the specified structure on the target drawing.
   *
   * A nucleobase will be added to the target drawing for each character in the sequence of the structure.
   *
   * A secondary bond will be added to the target drawing for each base-pair expressed in the dot-bracket notation
   * for the structure.
   *
   * Currently, this method is only able to handle simple dot-bracket notation
   * (i.e., that only contains the characters ".", "(", and ")").
   *
   * This method will also apply the RNAcanvas untangling algorithm to the drawn bases
   * and add a primary bond between each consecutive pair of bases.
   *
   * @param seq The sequence of the structure to draw.
   * @param dotBracket Dot-bracket notation of the base-pairs in the structure to draw.
   */
  draw(seq: string, dotBracket: string): Drawn | never {
    let bases = [...seq].map(character => this.targetDrawing.addBase(character));

    consecutivePairs(bases).forEach(bp => this.targetDrawing.addPrimaryBond(...bp));

    let basePairs = [...parseDotBracket(bases, dotBracket)];

    basePairs.forEach(bp => this.targetDrawing.addSecondaryBond(...bp));

    // place all bases on top of all primary and secondary bonds
    bases.forEach(b => b.bringToFront());

    // adjust multiplying factor as desired
    let spacing = 1.87 * mean(bases.map(b => b.bbox.height));

    // arrange bases before numbering them (to orient numberings correctly)
    if (basePairs.length > 0) {
      untangle(bases, basePairs, { spacing, basePairSpacing: spacing / 2, hairpinLoopSpacing: spacing / 2 });
    } else {
      linearize(bases, { spacing: spacing / 2 });

      // set explicitly (otherwise might be non-zero by default sometimes)
      (new Direction(bases)).set(0);
    }

    // only number bases when there's more than 10 being drawn
    if (bases.length > 10) {
      this.targetDrawing.number(first(bases), 1);
      this.targetDrawing.number(last(bases), bases.length);
    }

    let numberingIncrement = 20;

    // number intervening bases
    bases.slice(0, -3).forEach((b, i) => {
      // the position of the base
      let p = i + 1;

      p % numberingIncrement == 0 ? this.targetDrawing.number(b, p) : {};
    });

    // place bases on top of everything else
    bases.forEach(b => b.bringToFront());

    return {
      bases,
    };
  }
}

type Drawn = {
  /**
   * The drawn bases.
   */
  readonly bases: Iterable<ReturnType<InstanceType<typeof Drawing>['addBase']>>;
};
