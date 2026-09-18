import type { StraightBond, CurvedBond } from '@rnacanvas/draw.bases.bonds';

import type { Nucleobase } from '@rnacanvas/draw.bases';

export type Bond = StraightBond<Nucleobase> | CurvedBond<Nucleobase>;
