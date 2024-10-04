import * as SVG from '@svgdotjs/svg.js';

import { HorizontalClientScaling, VerticalClientScaling } from '@rnacanvas/draw.svg';

import type { Nucleobase } from '@rnacanvas/draw.bases';

import { BasesDrawing } from './BasesDrawing';

import type { BaseOutline } from './BaseOutline';

import { BaseOutlinesDrawing } from './BaseOutlinesDrawing';

import type { StraightBond } from '@rnacanvas/draw.bases.bonds';

import { PrimaryBondsDrawing, PrimaryBond } from './PrimaryBondsDrawing';

import { SecondaryBondsDrawing, SecondaryBond } from './SecondaryBondsDrawing';

/**
 * The minimum and maximum X and Y coordinates of a drawing.
 */
type Boundaries = {
  readonly minX: number;
  readonly maxX: number;
  readonly minY: number;
  readonly maxY: number;
};

/**
 * A two-dimensional nucleic acid structure drawing.
 */
export class Drawing {
  /**
   * The actual DOM node of the SVG document that is the drawing.
   *
   * Nucleic acid structures are to be drawn on this.
   */
  readonly domNode: SVGSVGElement;

  private basesDrawing: BasesDrawing;

  #baseOutlinesDrawing: BaseOutlinesDrawing;

  private primaryBondsDrawing: PrimaryBondsDrawing;

  private secondaryBondsDrawing: SecondaryBondsDrawing;

  constructor() {
    this.domNode = (new SVG.Svg()).node;

    // needs to be initialized for certain underlying web browser functionality to work
    this.domNode.setAttribute('viewBox', '0 0 250 250');

    // explicitly initialize horizontal and vertical scaling to 1
    this.domNode.setAttribute('width', '250');
    this.domNode.setAttribute('height', '250');

    this.basesDrawing = new BasesDrawing(this.domNode, []);

    this.#baseOutlinesDrawing = new BaseOutlinesDrawing(this.domNode);

    this.primaryBondsDrawing = new PrimaryBondsDrawing(this.domNode, []);

    this.secondaryBondsDrawing = new SecondaryBondsDrawing(this.domNode, []);
  }

  /**
   * Forwards the `outerHTML` property of the SVG document that is the drawing.
   */
  get outerXML() {
    return this.domNode.outerHTML;
  }

  /**
   * Forwards the `innerHTML` property of the SVG document that is the drawing.
   */
  get innerXML() {
    return this.domNode.innerHTML;
  }

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
   * Set the minimum and maximum X and Y coordinates of the drawing.
   *
   * Maintains the horizontal and vertical scalings of the drawing
   * by adjusting the width and height attributes of the SVG document that is the drawing.
   */
  setBoundaries({ minX, maxX, minY, maxY }: Boundaries) {
    this.minX = minX;
    this.maxX = maxX;
    this.minY = minY;
    this.maxY = maxY;
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
   * All the bases in the drawing.
   *
   * The ordering of bases in the returned iterable is the ordering of bases in the drawing.
   */
  get bases(): Iterable<Nucleobase> {
    return this.basesDrawing.bases;
  }

  /**
   * Appends the base both to the SVG document that is the drawing
   * and to the drawing's (ordered) array of nucleobases.
   */
  appendBase(b: Nucleobase): void {
    this.basesDrawing.append(b);
  }

  /**
   * Creates a new nucleobase with the specified text content and appends it to the drawing.
   *
   * Returns the newly added nucleobase.
   */
  addBase(textContent: string): Nucleobase {
    return this.basesDrawing.add(textContent);
  }

  /**
   * The base outlines in the drawing.
   */
  get baseOutlines(): Iterable<BaseOutline> {
    return this.#baseOutlinesDrawing.baseOutlines;
  }

  /**
   * Adds an outline for the base to the drawing
   * and returns the newly created base outline.
   */
  outlineBase(b: Nucleobase): BaseOutline {
    return this.#baseOutlinesDrawing.outline(b);
  }

  appendBaseOutline(bo: BaseOutline) {
    this.#baseOutlinesDrawing.append(bo);
  }

  /**
   * All primary bonds in the drawing.
   *
   * Primary bonds are intended to connect consecutive bases
   * and to convey the sequence of bases in the drawing.
   *
   * The returned iterable also specifies the order of primary bonds in the drawing.
   */
  get primaryBonds(): Iterable<PrimaryBond> {
    return this.primaryBondsDrawing.primaryBonds;
  }

  set primaryBonds(primaryBonds) {
    this.primaryBondsDrawing.primaryBonds = [...primaryBonds];
  }

  /**
   * Appends the primary bond both to the SVG document that is the drawing
   * and to the drawing's array of all primary bonds.
   */
  appendPrimaryBond(pb: PrimaryBond): void {
    this.primaryBondsDrawing.append(pb);
  }

  /**
   * Creates a new primary bond between the two bases and appends it to the drawing.
   *
   * Returns the newly added primary bond.
   */
  addPrimaryBond(base1: Nucleobase, base2: Nucleobase): PrimaryBond {
    return this.primaryBondsDrawing.add(base1, base2);
  }

  /**
   * All secondary bonds in the drawing.
   *
   * Secondary bonds are meant to convey base-pairs in the secondary structure of a drawing
   * and are expected to affect the layout of bases in the drawing.
   *
   * The returned iterable also specifies the order of secondary bonds in the drawing.
   */
  get secondaryBonds(): Iterable<SecondaryBond> {
    return this.secondaryBondsDrawing.secondaryBonds;
  }

  set secondaryBonds(secondaryBonds) {
    this.secondaryBondsDrawing.secondaryBonds = [...secondaryBonds];
  }

  /**
   * Appends the secondary bond to both the SVG document that is the drawing
   * and to the drawing's array of all secondary bonds.
   */
  appendSecondaryBond(sb: StraightBond<Nucleobase>): void {
    this.secondaryBondsDrawing.append(sb);
  }

  /**
   * Creates a new secondary bond between the two bases and appends it to the drawing.
   *
   * Returns the newly added secondary bond.
   */
  addSecondaryBond(base1: Nucleobase, base2: Nucleobase): SecondaryBond {
    return this.secondaryBondsDrawing.add(base1, base2);
  }

  /**
   * Default values for different drawing element types.
   */
  get defaultValues() {
    let primaryBondsDrawing = this.primaryBondsDrawing;
    let secondaryBondsDrawing = this.secondaryBondsDrawing;

    return {
      get primaryBonds() { return primaryBondsDrawing.defaultValues; },
      set primaryBonds(defaultValues) { primaryBondsDrawing.defaultValues = defaultValues; },

      get secondaryBonds() { return secondaryBondsDrawing.defaultValues; },
      set secondaryBonds(defaultValues) { secondaryBondsDrawing.defaultValues = defaultValues; }
    };
  }

  /**
   * The bounding box of the content of the drawing
   * (e.g., including all bases and bonds).
   *
   * Note that this is distinct from the boundaries of the drawing itself.
   *
   * The returned bounding box is expressed in drawing coordinates
   * (i.e., as defined by the view box of the SVG document that is the drawing).
   *
   * Essentially, this method just forwards the values returned by the `getBBox` method
   * of the SVG document that is the drawing.
   */
  get contentBBox(): { x: number, y: number, width: number, height: number } {
    return this.domNode.getBBox();
  }

  /**
   * Adjusts the boundaries of the drawing to set the padding on all four sides of the drawing.
   *
   * Padding is defined in reference to the bounding box of the content of the drawing
   * (see `contentBBox` getter).
   */
  setPadding(padding: number): void {
    let contentBBox = this.contentBBox;

    this.setBoundaries({
      minX: contentBBox.x - padding,
      maxX: contentBBox.x + contentBBox.width + padding,
      minY: contentBBox.y - padding,
      maxY: contentBBox.y + contentBBox.height + padding,
    });
  }
}
