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
   * Sets the minimum X coordinate of the view box of the SVG document that is the drawing.
   *
   * Maintains maximum X coordinate by adjusting the width of the view box.
   *
   * Also maintains the horizontal scaling of the drawing
   * by adjusting the width attribute of the SVG document that is the drawing.
   */
  set minX(minX) {
    let maxX = this.maxX;

    // the new width
    let width = maxX - minX;

    // cache
    let horizontalScaling = this.horizontalScaling;

    this.domNode.setAttribute('viewBox', `${minX} ${this.minY} ${width} ${this.height}`);

    // restore horizontal scaling
    this.domNode.setAttribute('width', (horizontalScaling * width).toString());
  }

  /**
   * The maximum X coordinate in the coordinate system of the drawing.
   *
   * Is the same as the maximum X coordinate of the view box of the SVG document that is the drawing.
   */
  get maxX(): number {
    return this.minX + this.width;
  }

  /**
   * Adjusts the width of the view box of the SVG document that is the drawing
   * to change its maximum X coordinate.
   *
   * Maintains the view box minimum X coordinate.
   *
   * Also maintains the horizontal scaling of the drawing.
   */
  set maxX(maxX) {
    // the new width
    let width = maxX - this.minX;

    // cache
    let horizontalScaling = this.horizontalScaling;

    this.domNode.setAttribute('viewBox', `${this.minX} ${this.minY} ${width} ${this.height}`);

    // restore horizontal scaling
    this.domNode.setAttribute('width', (horizontalScaling * width).toString());
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
   * Sets the minimum Y coordinate of the view box of the SVG document that is the drawing.
   *
   * Also adjusts the height of the view box to maintain its maximum Y coordinate.
   *
   * Also maintains the vertical scaling of the drawing
   * by adjusting the height attribute of the SVG document that is the drawing.
   */
  set minY(minY) {
    let maxY = this.maxY;

    // the new height
    let height = maxY - minY;

    // cache
    let verticalScaling = this.verticalScaling;

    this.domNode.setAttribute('viewBox', `${this.minX} ${minY} ${this.width} ${height}`);

    // restore vertical scaling
    this.domNode.setAttribute('height', (verticalScaling * height).toString());
  }

  /**
   * The maximum Y coordinate in the coordinate system of the drawing.
   *
   * Is the same as the maximum Y coordinate of the view box of the SVG document that is the drawing.
   */
  get maxY(): number {
    return this.minY + this.height;
  }

  /**
   * Adjusts the height of the view box of the SVG document that is the drawing
   * to change its maximum Y coordinate.
   *
   * Maintains view box minimum Y coordinate.
   *
   * Also maintains the vertical scaling of the drawing
   * by adjusting the height attribute of the SVG document that is the drawing.
   */
  set maxY(maxY) {
    // the new height
    let height = maxY - this.minY;

    // cache
    let verticalScaling = this.verticalScaling;

    this.domNode.setAttribute('viewBox', `${this.minX} ${this.minY} ${this.width} ${height}`);

    // restore vertical scaling
    this.domNode.setAttribute('height', (verticalScaling * height).toString());
  }

  /**
   * The width of the drawing in the coordinate system of the drawing
   * (i.e., the width of the view box of the SVG document that is the drawing).
   *
   * Note that this is different from the width attribute of the SVG document that is the drawing.
   */
  get width(): number {
    return this.domNode.viewBox.baseVal.width;
  }

  /**
   * Sets the width of the view box of the SVG document that is the drawing.
   *
   * Maintains view box minimum X coordinate while changing view box maximum X coordinate.
   *
   * Also maintains the horizontal scaling of the drawing
   * by adjusting the width attribute of the SVG document that is the drawing.
   */
  set width(width) {
    this.maxX = this.minX + width;
  }

  /**
   * The height of the drawing in the coordinate system of the drawing
   * (i.e., the height of the view box of the SVG document that is the drawing).
   *
   * Note that this is different from the height attribute of the SVG document that is the drawing.
   */
  get height(): number {
    return this.domNode.viewBox.baseVal.height;
  }

  /**
   * Sets the height of the view box of the SVG document that is the drawing.
   *
   * Maintains view box minimum Y coordinate while changing view box maximum Y coordinate.
   *
   * Also maintains the vertical scaling of the drawing
   * by adjusting the height attribute of the SVG document that is the drawing.
   */
  set height(height) {
    this.maxY = this.minY + height;
  }

  /**
   * The horizontal scaling factor of the drawing
   * (as determined by the width and view box width attributes of the SVG document that is the drawing).
   *
   * Might possibly return a nonfinite value (e.g., if view box width is zero).
   */
  get horizontalScaling(): number {
    let viewBoxWidth = this.width;
    let widthAttribute = this.domNode.width.baseVal.value;

    return widthAttribute / viewBoxWidth;
  }

  /**
   * Sets the horizontal scaling of the drawing
   * by adjusting the width attribute of the SVG document that is the drawing.
   *
   * Does not modify the view box of the drawing.
   */
  set horizontalScaling(horizontalScaling) {
    let viewBoxWidth = this.width;

    this.domNode.setAttribute('width', (horizontalScaling * viewBoxWidth).toString());
  }

  /**
   * The vertical scaling factor of the drawing
   * (as determined by the height and view box height attributes of the SVG document that is the drawing).
   *
   * Might possibly return a nonfinite value (e.g., if view box height is zero).
   */
  get verticalScaling(): number {
    let viewBoxHeight = this.height;
    let heightAttribute = this.domNode.height.baseVal.value;

    return heightAttribute / viewBoxHeight;
  }

  /**
   * Sets the vertical scaling of the drawing
   * by adjusting the height attribute of the SVG document that is the drawing.
   *
   * Does not modify the view box of the drawing.
   */
  set verticalScaling(verticalScaling) {
    let viewBoxHeight = this.height;

    this.domNode.setAttribute('height', (verticalScaling * viewBoxHeight).toString());
  }

  /**
   * Sets the horizontal and vertical scaling of the drawing
   * (as determined by the view box and width and height attributes of the SVG document that is the drawing)
   * to the specified scaling factor.
   */
  setScaling(scaling: number) {
    this.horizontalScaling = scaling;
    this.verticalScaling = scaling;
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
