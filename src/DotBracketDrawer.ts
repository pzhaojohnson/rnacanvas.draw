import type { Drawing } from './Drawing';

import { parseDotBracket } from '@rnacanvas/base-pairs';

import { consecutivePairs } from '@rnacanvas/base-pairs';

import { untangle } from '@rnacanvas/bases-layout';

import { mean } from '@rnacanvas/math';

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
  draw(seq: string, dotBracket: string): void {
    let bases = [...seq].map(character => this.targetDrawing.addBase(character));

    consecutivePairs(bases).forEach(bp => this.targetDrawing.addPrimaryBond(...bp));

    let basePairs = [...parseDotBracket(bases, dotBracket)];

    basePairs.forEach(bp => this.targetDrawing.addSecondaryBond(...bp));

    // place all bases on top of all primary and secondary bonds
    bases.forEach(b => b.bringToFront());

    // adjust multiplying factor as desired
    let spacing = 1.87 * mean(bases.map(b => b.bbox.height));

    untangle(bases, basePairs, { spacing, basePairSpacing: spacing / 2, hairpinLoopSpacing: spacing / 2 });
  }
}
