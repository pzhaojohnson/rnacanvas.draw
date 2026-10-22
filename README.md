# Installation

With `npm`:

```
npm install @rnacanvas/draw
```

# Usage

All exports of this package can be accessed as named imports.

```javascript
// an example import
import { Drawing } from '@rnacanvas/draw';
```

## `class Drawing`

A 2D nucleic acid structure drawing.

```javascript
var drawing = new Drawing();

// a drawing is just an SVG element
drawing.domNode instanceof SVGSVGElement; // true

// necessary for bounding box calculations to work
document.body.append(drawing.domNode);

var base1 = drawing.addBase('A');
var base2 = drawing.addBase('U');

base1.centerPoint.x = 0;
base1.centerPoint.y = 0;

base2.centerPoint.x = 20;
base2.centerPoint.y = 0;

var secondaryBond = drawing.addSecondaryBond(base1, base2);

// increase the size of the drawing to make everything visible
drawing.setPadding(100);
```

### `addTertiaryBond()`

Creates a new tertiary bond (e.g., a curved bond)
between the two specified bases,
adds it to the drawing
and returns it.

```javascript
var base1 = drawing.addBase('G');
var base2 = drawing.addBase('C');

var tertiaryBond = drawing.addTertiaryBond(base1, base2);

tertiaryBond.base1 === base1; // true
tertiaryBond.base2 === base2; // true
```

### `refreshIDs()`

Iterates through elements in the SVG document that is the drawing
(including all nested elements, as well as the SVG document node itself)
and assigns a new UUID to any element that previously had an ID assigned to it.

Elements without an ID are left unchanged.

```javascript
drawing.domNode.id = 'my-drawing';

drawing.refreshIDs();

drawing.domNode.id === 'my-drawing'; // false
```
