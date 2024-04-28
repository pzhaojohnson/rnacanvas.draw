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

  constructor(private svgDoc: SVGSVGElement, public bonds: T[]) {
    this.elementsDrawing = new ElementsDrawing(svgDoc, bonds);

    let removalObserver = new MutationObserver(() => {
      this.bonds.forEach(bond => {
        if (!bond.base1.isIn(this.svgDoc) || !bond.base2.isIn(this.svgDoc)) {
          bond.remove();
        }
      });
    });

    removalObserver.observe(svgDoc, { childList: true, subtree: true });
  }
}
