import type { OwnedElement } from './OwnedElement';

import { ElementsDrawing } from './ElementsDrawing';

export class OwnedElementsDrawing<T extends OwnedElement> {
  #elementsDrawing: ElementsDrawing<T>;

  #removalObserver: MutationObserver;

  constructor(readonly domNode: SVGSVGElement) {
    this.#elementsDrawing = new ElementsDrawing(domNode, []);

    this.#removalObserver = new MutationObserver(() => {
      this.elements.forEach(ele => {
        if (!this.domNode.contains(ele.owner.domNode)) {
          ele.domNode.remove();
        }
      });
    });

    this.#removalObserver.observe(domNode, { childList: true, subtree: true });
  }

  get elements() {
    return this.#elementsDrawing.elements;
  }

  set elements(elements) {
    this.#elementsDrawing.elements = elements;
  }
}
