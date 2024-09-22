import type { Nucleobase } from '@rnacanvas/draw.bases';

import type { BaseOutline as GenericBaseOutline } from '@rnacanvas/draw.bases.outlines';

/**
 * The base outline type used in drawings.
 *
 * Currently, base outline DOM nodes can only be SVG circle elements,
 * but this might change in the future
 * (e.g., SVG rect and polygon elements might also be allowed).
 */
export type BaseOutline = GenericBaseOutline<SVGCircleElement, Nucleobase>;
