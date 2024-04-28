import { StraightBond } from '@rnacanvas/draw.bonds';

import { Nucleobase } from '@rnacanvas/draw.bases';

import { BondsDrawing } from './BondsDrawing';

/**
 * Currently is just a straight bond between two nucleobases.
 */
export type PrimaryBond = StraightBond<Nucleobase>;

/**
 * A drawing of primary bonds.
 */
export class PrimaryBondsDrawing {
  /**
   * Default values for new primary bonds created by instances of this class
   * (e.g., when adding a primary bond between a pair of bases).
   */
  public primaryBondDefaults = {
    attributes: {
      'stroke': '#808080',
      'stroke-width': '1',
    },
    basePadding1: 6,
    basePadding2: 6,
  };

  /**
   * Instances of this class wrap a bonds drawing.
   */
  private bondsDrawing: BondsDrawing<PrimaryBond>;

  /**
   * @param svgDoc The SVG document that is the drawing.
   * @param primaryBonds The primary bonds in the drawing.
   */
  constructor(private svgDoc: SVGSVGElement, primaryBonds: PrimaryBond[]) {
    this.bondsDrawing = new BondsDrawing(svgDoc, primaryBonds);
  }

  /**
   * The primary bonds in the drawing.
   *
   * The ordering of primary bonds in the returned array is the ordering of primary bonds in the drawing.
   *
   * The returned array can be directly edited to change the order of primary bonds in the drawing
   * and/or register/unregister primary bonds.
   */
  get primaryBonds(): PrimaryBond[] {
    return this.bondsDrawing.bonds;
  }

  set primaryBonds(primaryBonds: PrimaryBond[]) {
    this.bondsDrawing.bonds = primaryBonds;
  }

  /**
   * Appends the primary bond to the SVG document that is the drawing
   * and to the drawing's array of primary bonds.
   */
  append(primaryBond: PrimaryBond): void {
    primaryBond.appendTo(this.svgDoc);
    this.primaryBonds.push(primaryBond);
  }

  /**
   * Creates a new primary bond between the two bases and appends it to the drawing.
   *
   * Returns the newly added primary bond.
   */
  add(base1: Nucleobase, base2: Nucleobase): PrimaryBond {
    let pb = StraightBond.between(base1, base2);
    pb.set(this.primaryBondDefaults);

    this.append(pb);

    return pb;
  }
}
