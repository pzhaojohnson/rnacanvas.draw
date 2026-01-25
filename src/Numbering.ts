import type { Nucleobase } from '@rnacanvas/draw.bases';

import type { Numbering as GenericNumbering } from '@rnacanvas/draw.bases.numberings';

import type { NumberingLine as GenericNumberingLine } from '@rnacanvas/draw.bases.numberings';

export type Numbering = GenericNumbering<Nucleobase>;

export type NumberingLine = GenericNumberingLine<Nucleobase>;
