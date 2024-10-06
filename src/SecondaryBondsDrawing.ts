import { StraightBond } from '@rnacanvas/draw.bases.bonds';

import { Nucleobase } from '@rnacanvas/draw.bases';

import { BondsDrawing } from './BondsDrawing';

/**
 * Currently is just a straight bond between two nucleobases.
 */
export type SecondaryBond = StraightBond<Nucleobase>;

/**
 * A drawing of secondary bonds.
 */
export class SecondaryBondsDrawing {
  /**
   * Default values for new secondary bonds created using the methods of this class
   * (e.g., the `add()` method).
   */
  public defaultValues = {
    attributes: {
      'stroke': '#000000',
      'stroke-width': '2',
    },
    basePadding1: 6,
    basePadding2: 6,
  };

  /**
   * Instances of this class wrap a bonds drawing.
   */
  private bondsDrawing: BondsDrawing<SecondaryBond>;

  /**
   * @param svgDoc The SVG document that is the drawing.
   * @param secondaryBonds The secondary bonds in the drawing.
   */
  constructor(private svgDoc: SVGSVGElement, secondaryBonds: SecondaryBond[]) {
    this.bondsDrawing = new BondsDrawing(svgDoc, secondaryBonds);
  }

  /**
   * The secondary bonds in the drawing.
   *
   * The ordering of secondary bonds in the returned array is the ordering of secondary bonds in the drawing.
   *
   * The returned array can be directly edited to change the order of secondary bonds in the drawing
   * and/or register/unregister secondary bonds.
   */
  get secondaryBonds(): SecondaryBond[] {
    return this.bondsDrawing.bonds;
  }

  set secondaryBonds(secondaryBonds: SecondaryBond[]) {
    this.bondsDrawing.bonds = secondaryBonds;
  }

  /**
   * Appends the secondary bond to the SVG document that is the drawing
   * and to the drawing's array of secondary bonds.
   */
  append(secondaryBond: SecondaryBond): void {
    secondaryBond.appendTo(this.svgDoc);
    this.secondaryBonds.push(secondaryBond);
  }

  /**
   * Creates a new secondary bond between the two bases and appends it to the drawing.
   *
   * Returns the newly added secondary bond.
   */
  add(base1: Nucleobase, base2: Nucleobase): SecondaryBond {
    let sb = StraightBond.between(base1, base2);

    this.append(sb);

    // safer to edit elements after adding them to the document body
    sb.set(this.defaultValues);

    return sb;
  }
}
