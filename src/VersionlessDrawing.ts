import { NonNullObject, isNonNullObject } from '@rnacanvas/value-check';

import { isString } from '@rnacanvas/value-check';

import { isArray } from '@rnacanvas/value-check';

/**
 * For working with saved drawings, which might possibly use old, legacy formats.
 */
export class VersionlessDrawing {
  #savedDrawing;

  constructor(savedDrawing: unknown) {
    if (!isNonNullObject(savedDrawing)) {
      throw new Error('Saved drawings must be non-null objects.');
    }

    this.#savedDrawing = savedDrawing;
  }

  /**
   * Throws if unable to find the outer XML of the saved drawing.
   */
  get outerXML(): string | never {
    if (isString(this.#savedDrawing.outerXML)) {
      return this.#savedDrawing.outerXML;
    }

    // used to be saved under `svg`
    if (isString(this.#savedDrawing.svg)) {
      return this.#savedDrawing.svg;
    }

    throw new Error('Unable to find the outer XML of the saved drawing.');
  }

  /**
   * Throws if unable to find the bases in the saved drawing.
   */
  get bases(): NonNullObject[] | never {
    if (isArray(this.#savedDrawing.bases)) {
      if (!this.#savedDrawing.bases.every(isNonNullObject)) {
        throw new Error('Saved bases must be non-null objects.');
      }

      return this.#savedDrawing.bases;
    }

    // used to be saved within sequence objects
    if (isArray(this.#savedDrawing.sequences)) {
      if (!this.#savedDrawing.sequences.every(isNonNullObject)) {
        throw new Error('Saved sequences must be non-null objects.');
      }

      let bases = this.#savedDrawing.sequences.flatMap(seq => seq.bases);

      if (!bases.every(isNonNullObject)) {
        throw new Error('Saved bases must be non-null objects.');
      }

      return bases;
    }

    return [];
  }

  /**
   * Throws if unable to retrieve the outlines in the saved drawing.
   */
  get outlines(): unknown[] | never {
    if (isArray(this.#savedDrawing.outlines)) {
      return this.#savedDrawing.outlines;
    }

    // used to be saved under `baseOutlines`
    if (isArray(this.#savedDrawing.baseOutlines)) {
      return this.#savedDrawing.baseOutlines;
    }

    // used to be saved within nucleobase objects themselves
    try {
      let bases = this.bases;

      if (bases.some(b => b.outline)) {
        return bases.filter(b => b.outline).map(b => {
          if (!isNonNullObject(b.outline)) {
            throw new Error('Saved outlines must be non-null objects.');
          }

          return { ...b.outline, ownerID: b.textId };
        });
      }
    } catch {}

    return [];
  }

  /**
   * Throws if unable to retrieve the numberings in the saved drawing.
   */
  get numberings(): unknown[] | never {
    if (isArray(this.#savedDrawing.numberings)) {
      return this.#savedDrawing.numberings;
    }

    // used to be saved under `baseNumberings`
    if (isArray(this.#savedDrawing.baseNumberings)) {
      return this.#savedDrawing.baseNumberings;
    }

    // used to be saved within nucleobase objects themselves
    try {
      let bases = this.bases;

      if (bases.some(b => b.numbering)) {
        return bases.filter(b => b.numbering).map(b => {
          if (!isNonNullObject(b.numbering)) {
            throw new Error('Saved numberings must be non-null objects.');
          }

          return { ...b.numbering, ownerID: b.textId };
        });
      }
    } catch {}

    return [];
  }

  /**
   * Throws if unable to retrieve the numbering lines in the saved drawing.
   */
  get numberingLines(): unknown[] | never {
    if (isArray(this.#savedDrawing.numberingLines)) {
      return this.#savedDrawing.numberingLines;
    }

    // used to be saved under `baseNumberingLines`
    if (isArray(this.#savedDrawing.baseNumberingLines)) {
      return this.#savedDrawing.baseNumberingLines;
    }

    // used to be saved within nucleobase objects themselves
    try {
      let bases = this.bases;

      if (bases.some(b => b.numbering)) {
        // the `textId` of the numbering is the owner ID of the numbering line
        return bases.filter(b => b.numbering).map(b => b.numbering);
      }
    } catch {}

    return [];
  }

  /**
   * Throws if unable to retrieve the primary bonds in the saved drawing.
   */
  get primaryBonds(): unknown[] | never {
    if (isArray(this.#savedDrawing.primaryBonds)) {
      return this.#savedDrawing.primaryBonds;
    }

    return [];
  }

  /**
   * Throws if unable to retrieve the secondary bonds in the saved drawing.
   */
  get secondaryBonds(): unknown[] | never {
    if (isArray(this.#savedDrawing.secondaryBonds)) {
      return this.#savedDrawing.secondaryBonds;
    }

    return [];
  }
}
