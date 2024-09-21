import { ElementsDrawing, DrawingElement } from './ElementsDrawing';

/**
 * A bond between two bases.
 */
export interface Bond extends DrawingElement {
  base1: DrawingElement;
  base2: DrawingElement;

  remove(): void;
}

/**
 * A drawing of bonds.
 */
export class BondsDrawing<T extends Bond> {
  /**
   * This class wraps an elements drawing.
   */
  private elementsDrawing: ElementsDrawing<T>;

  constructor(private svgDoc: SVGSVGElement, bonds: T[]) {
    this.elementsDrawing = new ElementsDrawing(svgDoc, bonds);

    let removalObserver = new MutationObserver(() => {
      this.bonds.forEach(bond => {
        if (!this.svgDoc.contains(bond.base1.domNode) || !this.svgDoc.contains(bond.base2.domNode)) {
          bond.remove();
        }
      });
    });

    removalObserver.observe(svgDoc, { childList: true, subtree: true });
  }

  /**
   * The bonds in the drawing.
   *
   * The ordering of bonds in the returned array is the ordering of bonds in the drawing.
   *
   * The returned array can be directly edited to change the order of bonds and/or register/unregister bonds.
   */
  get bonds(): T[] {
    return this.elementsDrawing.elements;
  }

  set bonds(bonds) {
    this.elementsDrawing.elements = bonds;
  }
}
