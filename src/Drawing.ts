import * as SVG from '@svgdotjs/svg.js';

import { Scaling } from '@rnacanvas/draw.svg';

import { HorizontalClientScaling, VerticalClientScaling } from '@rnacanvas/draw.svg';

import type { Nucleobase } from '@rnacanvas/draw.bases';

import type { StraightBond } from '@rnacanvas/draw.bonds';

/**
 * A two-dimensional nucleic acid structure drawing.
 */
export class Drawing {
  /**
   * The actual DOM node of the SVG document that is the drawing.
   *
   * Nucleic acid structures are to be drawn on this.
   */
  readonly domNode = (new SVG.Svg()).node;

  /**
   * Appends the SVG document that is the drawing to the container node.
   */
  appendTo(container: Node): void {
    container.appendChild(this.domNode);
  }

  /**
   * Removes the SVG document that is the drawing from its parent container node.
   *
   * Has no effect if the SVG document that is the drawing had no parent container node to begin with.
   */
  remove(): void {
    this.domNode.remove();
  }

  /**
   * The minimum X coordinate in the coordinate system of the drawing.
   *
   * Is the same as the minimum X coordinate of the view box of the SVG document that is the drawing.
   */
  get minX(): number {
    return this.domNode.viewBox.baseVal.x;
  }

  /**
   * The minimum Y coordinate in the coordinate system of the drawing.
   *
   * Is the same as the minimum Y coordinate of the view box of the SVG document that is the drawing.
   */
  get minY(): number {
    return this.domNode.viewBox.baseVal.y;
  }

  /**
   * Sets the horizontal and vertical scaling of the drawing
   * (as determined by the view box and width and height attributes of the SVG document that is the drawing)
   * to the specified scaling factor.
   */
  setScaling(scaling: number) {
    (new Scaling(this.domNode)).set(scaling);
  }

  /**
   * The horizontal scaling factor of the drawing
   * going from the coordinate system of the SVG document that is the drawing (as determined by its view box)
   * to the client coordinate system (i.e., the coordinate system used by methods such as `getBoundingClientRect`).
   */
  get horizontalClientScaling(): number {
    return (new HorizontalClientScaling(this.domNode)).get();
  }

  /**
   * The vertical scaling factor of the drawing
   * going from the coordinate system of the SVG document that is the drawing (as determined by its view box)
   * to the client coordinate system (i.e., the coordinate system used by methods such as `getBoundingClientRect`).
   */
  get verticalClientScaling(): number {
    return (new VerticalClientScaling(this.domNode)).get();
  }

  /**
   * All bases in the drawing.
   *
   * The ordering of bases in this array is the ordering of bases in the drawing itself.
   */
  allBasesSorted: Nucleobase[] = [];

  /**
   * Appends the base both to the SVG document that is the drawing
   * and to the drawing's (ordered) array of nucleobases.
   */
  appendBase(b: Nucleobase): void {
    b.appendTo(this.domNode);
    this.allBasesSorted.push(b);
  }

  /**
   * All primary bonds in the drawing.
   *
   * Primary bonds are intended to connect consecutive bases
   * and to convey the sequence of bases in the drawing.
   *
   * This array also effectively orders the primary bonds in the drawing.
   */
  allPrimaryBonds: StraightBond<Nucleobase>[] = [];

  /**
   * Appends the primary bond both to the SVG document that is the drawing
   * and to the drawing's array of all primary bonds.
   */
  appendPrimaryBond(pb: StraightBond<Nucleobase>): void {
    pb.appendTo(this.domNode);
    this.allPrimaryBonds.push(pb);
  }

  /**
   * All secondary bonds in the drawing.
   *
   * Secondary bonds are meant to convey base-pairs in the secondary structure of a drawing
   * and are expected to affect the layout of bases in the drawing.
   *
   * This array also effectively orders the secondary bonds in the drawing.
   */
  allSecondaryBonds: StraightBond<Nucleobase>[] = [];

  /**
   * Appends the secondary bond to both the SVG document that is the drawing
   * and to the drawing's array of all secondary bonds.
   */
  appendSecondaryBond(sb: StraightBond<Nucleobase>): void {
    sb.appendTo(this.domNode);
    this.allSecondaryBonds.push(sb);
  }
}
