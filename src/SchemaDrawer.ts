import type { Drawing } from './Drawing';

import { Numbering, NumberingLine } from '@rnacanvas/draw.bases.numberings';

import { mean } from '@rnacanvas/math';

import { consecutivePairs } from '@rnacanvas/base-pairs';

import { isNonNullObject } from '@rnacanvas/value-check';

import { isArray } from '@rnacanvas/value-check';

import { isNullish } from '@rnacanvas/value-check';

type Nucleobase = ReturnType<Drawing['addBase']>;

/**
 * How a schema should be formatted.
 */
type Schema = {
  classes?: SchemaClass[],

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

  labels?: Label[] | unknown;
};

type Residue = {
  classes?: string[];

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
  classes?: string[];

  residueIndex1: number;
  residueIndex2: number;
};

type Label = {
  residueIndex: number;

  'label-content'?: {
    label?: string;
  }
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
    // include hard-coded classes
    schema = {
      ...schema,
      classes: [...hardCodedClasses, ...schema.classes ?? []],
    };

    schema.rnaComplexes.forEach(complex => {
      complex.rnaMolecules.forEach(molecule => {
        let bs = molecule.sequence.map(r => this.#drawResidue(r, schema));

        let meanBaseHeight = mean(bs.map(b => b.bbox.height));

        this.#targetDrawing.defaultValues.primaryBonds.attributes['stroke-width'] = `${0.125 * meanBaseHeight}`;
        this.#targetDrawing.defaultValues.primaryBonds.basePadding1 = 0.75 * meanBaseHeight;
        this.#targetDrawing.defaultValues.primaryBonds.basePadding2 = 0.75 * meanBaseHeight;

        consecutivePairs(bs).forEach(bp => this.#targetDrawing.addPrimaryBond(...bp));

        this.#targetDrawing.defaultValues.secondaryBonds.attributes['stroke-width'] = `${0.15 * meanBaseHeight}`;
        this.#targetDrawing.defaultValues.secondaryBonds.basePadding1 = 0.6 * meanBaseHeight;
        this.#targetDrawing.defaultValues.secondaryBonds.basePadding2 = 0.6 * meanBaseHeight;

        // omit duplicate base-pairs
        // (R2DT has a bug that duplicates all base-pairs in generated schemas)
        let basePairJSONStrings = new Set(molecule.basePairs.map(bp => JSON.stringify(bp)));

        basePairJSONStrings.forEach(jsonString => this.#drawBasePair(JSON.parse(jsonString), bs, schema));

        Numbering.defaultValues.attributes['font-family'] = 'Helvetica';
        Numbering.defaultValues.attributes['font-size'] = `${0.97 * meanBaseHeight}`;
        Numbering.defaultValues.attributes['font-weight'] = '700';
        Numbering.defaultValues.attributes['fill'] = '#cccccc';

        NumberingLine.defaultValues.attributes['stroke'] = '#cccccc';
        NumberingLine.defaultValues.attributes['stroke-width'] = `${0.125 * meanBaseHeight}`;
        NumberingLine.defaultValues.basePadding = 0.75 * meanBaseHeight;
        NumberingLine.defaultValues.textPadding = 0.25 * meanBaseHeight;

        if (isArray(molecule.labels)) {
          molecule.labels.forEach(label => this.#drawLabel(label, bs));
        }
      });
    });
  }

  #drawResidue(residue: Residue, parentSchema: Schema) {
    let b = this.#targetDrawing.addBase(residue.residueName);

    let fontClass = parentSchema.classes?.find(c => c.name == 'font');

    // apply font class by default (even if not listed in residue class list)
    fontClass ? b.setAttributes({ ...fontClass, name: undefined }) : {};

    residue.classes?.forEach(className => {
      (parentSchema.classes ?? [])
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

    basePair.classes?.forEach(className => {
      (parentSchema.classes ?? [])
        .filter(c => c.name == className)
        .forEach(c => sb.setAttributes({ ...c, name: undefined }));
    });

    return sb;
  }

  /**
   * Draws a label for a base in a sequence.
   */
  #drawLabel(label: Label | unknown, sequence: Nucleobase[]): void {
    if (!isNonNullObject(label)) {
      console.error(`Label schema is not an object: ${label}.`);
      return;
    }

    if (typeof label.residueIndex != 'number') {
      console.error(`Label residue index is not a number: ${label.residueIndex}.`);
      return;
    } else if (label.residueIndex < 0) {
      console.error(`Label residue index is negative: ${label.residueIndex}.`);
      return;
    } else if (label.residueIndex >= sequence.length) {
      console.error(`Label residue index is out-of-bounds: ${label.residueIndex}.`);
      return;
    } else if (!Number.isInteger(label.residueIndex)) {
      console.error(`Label residue index is not an integer: ${label.residueIndex}.`);
      return;
    }

    let b = sequence[label.residueIndex];

    let sequencePosition = label.residueIndex + 1;

    let labelContent = label['label-content'];

    if (!isNonNullObject(labelContent)) {
      console.error(`Label content schema is not an object: ${labelContent}.`);
    }

    // default to sequence position
    let textContent: string = (
      isNonNullObject(labelContent)
      && !isNullish(labelContent.label)
      && !isEmptyString(labelContent.label)
    ) ? (
      `${labelContent.label}`
    ) : (
      `${sequencePosition}`
    );

    // initialize with sequence position (just initially)
    let [numbering, line] = this.#targetDrawing.number(b, sequencePosition);

    // cache line direction
    let lineDirection = line.direction;

    numbering.textContent = textContent;

    // set line length after setting text content (to help make line length non-zero)
    line.length = 1.03 * b.domNode.getBBox().height;

    // restore line direction
    line.direction = lineDirection;
  }
}

const hardCodedClasses = [
  {
    name: 'text-black',
    fill: '#000000',
  },
  {
    name: 'text-green',
    fill: '#00ff00',
  },
  {
    name: 'text-red',
    fill: '#ff00ff',
  },
  {
    name: 'text-blue',
    fill: '#0000ff',
  },
];

function isEmptyString(value: unknown): value is string {
  return value === '';
}
