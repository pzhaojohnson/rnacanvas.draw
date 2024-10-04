import type { Drawing } from './Drawing';

import { mean } from '@rnacanvas/math';

import { consecutivePairs } from '@rnacanvas/base-pairs';

type Nucleobase = ReturnType<Drawing['addBase']>;

/**
 * How a schema should be formatted.
 */
type Schema = {
  classes: SchemaClass[],

  rnaComplexes: RNAComplex[],
};

type SchemaClass = {
  name: string;

  /**
   * SVG attribute name/value mappings.
   */
  [attributeName: string]: unknown;
};

type RNAComplex = {
  rnaMolecules: RNAMolecule[];
};

type RNAMolecule = {
  name: string;

  sequence: Residue[];

  basePairs: BasePair[];
};

type Residue = {
  classes: string[];

  residueName: string;

  /**
   * Center X coordinate.
   */
  x: number;

  /**
   * Center Y coordinate.
   */
  y: number;
};

type BasePair = {
  classes: string[];

  residueIndex1: number;
  residueIndex2: number;
};

export class SchemaDrawer {
  #targetDrawing: Drawing;

  constructor(targetDrawing: Drawing) {
    this.#targetDrawing = targetDrawing;
  }

  /**
   * Draws the nucleic acid structure drawing
   * specified by the provided schema
   * (on top of whatever is currently present in the target drawing).
   *
   * Note that if this method were to fail (i.e., were to throw),
   * then it might leave the target drawing in a partially drawn state
   * (e.g., with only part of the schema having been drawn).
   */
  draw(schema: Schema): void | never {
    schema.rnaComplexes.forEach(complex => {
      complex.rnaMolecules.forEach(molecule => {
        let bs = molecule.sequence.map(r => this.#drawResidue(r, schema));

        let meanBaseHeight = mean(bs.map(b => b.bbox.height));

        this.#targetDrawing.defaultValues.primaryBonds.attributes['stroke-width'] = `${0.125 * meanBaseHeight}`;
        this.#targetDrawing.defaultValues.primaryBonds.basePadding1 = 0.6 * meanBaseHeight;
        this.#targetDrawing.defaultValues.primaryBonds.basePadding2 = 0.6 * meanBaseHeight;

        consecutivePairs(bs).forEach(bp => this.#targetDrawing.addPrimaryBond(...bp));

        this.#targetDrawing.defaultValues.secondaryBonds.attributes['stroke-width'] = `${0.15 * meanBaseHeight}`;
        this.#targetDrawing.defaultValues.secondaryBonds.basePadding1 = 0.5 * meanBaseHeight;
        this.#targetDrawing.defaultValues.secondaryBonds.basePadding2 = 0.5 * meanBaseHeight;

        // omit duplicate base-pairs
        // (R2DT has a bug that duplicates all base-pairs in generated schemas)
        let basePairJSONStrings = new Set(molecule.basePairs.map(bp => JSON.stringify(bp)));

        basePairJSONStrings.forEach(jsonString => this.#drawBasePair(JSON.parse(jsonString), bs, schema));
      });
    });
  }

  #drawResidue(residue: Residue, parentSchema: Schema) {
    let b = this.#targetDrawing.addBase(residue.residueName);

    residue.classes.forEach(className => {
      parentSchema.classes
        .filter(c => c.name == className)
        .forEach(c => b.setAttributes({ ...c, name: undefined }));
    });

    b.centerPoint.x = residue.x;
    b.centerPoint.y = residue.y;

    return b;
  }

  #drawBasePair(basePair: BasePair, parentSequence: Nucleobase[], parentSchema: Schema) {
    let base1 = parentSequence[basePair.residueIndex1];
    let base2 = parentSequence[basePair.residueIndex2];

    let sb = this.#targetDrawing.addSecondaryBond(base1, base2);

    basePair.classes.forEach(className => {
      parentSchema.classes
        .filter(c => c.name == className)
        .forEach(c => sb.setAttributes({ ...c, name: undefined }));
    });

    return sb;
  }
}
