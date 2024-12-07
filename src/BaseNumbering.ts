import type { Nucleobase } from '@rnacanvas/draw.bases';

import type { BaseNumbering as GenericBaseNumbering } from '@rnacanvas/draw.bases.numberings';

import type { BaseNumberingLine as GenericBaseNumberingLine } from '@rnacanvas/draw.bases.numberings';

export type BaseNumbering = GenericBaseNumbering<Nucleobase>;

export type BaseNumberingLine = GenericBaseNumberingLine<Nucleobase>;
