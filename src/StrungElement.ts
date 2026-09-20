import type { StrungText, StrungCircle, StrungRectangle, StrungTriangle } from '@rnacanvas/draw.floating';

import type { Text, Circle, Rectangle, Triangle } from '@rnacanvas/draw.floating';

import type { Bond } from './Bond';

export type StrungElement = (
  StrungText<Text, Bond>
  | StrungCircle<Circle, Bond>
  | StrungRectangle<Rectangle, Bond>
  | StrungTriangle<Triangle, Bond>
);
