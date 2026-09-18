/**
 * @jest-environment jsdom
 */

import { StrungElementsDrawing } from './StrungElementsDrawing';

import { Drawing } from './Drawing';

import { Nucleobase } from '@rnacanvas/draw.bases';

beforeAll(() => {
  if (!SVGElement.prototype.x) {
    SVGElement.prototype.x = { baseVal: [{ value: 0 }] };
  }

  if (!SVGElement.prototype.y) {
    SVGElement.prototype.y = { baseVal: [{ value: 0 }] };
  }

  if (!SVGElement.prototype.cx) {
    SVGElement.prototype.cx = { baseVal: { value: 0 } };
  }

  if (!SVGElement.prototype.cy) {
    SVGElement.prototype.cy = { baseVal: { value: 0 } };
  }

  if (!SVGElement.prototype.getBBox) {
    SVGElement.prototype.getBBox = () => ({ x: 0, y: 0, width: 0, height: 0, top: 0, right: 0, bottom: 0, left: 0 });
  }

  if (!SVGElement.prototype.getTotalLength) {
    SVGElement.prototype.getTotalLength = () => 0;
  }

  if (!SVGElement.prototype.getPointAtLength) {
    SVGElement.prototype.getPointAtLength = () => ({ x: 0, y: 0 });
  }

  ['x1', 'y1', 'x2', 'y2'].forEach(coordinateName => {
    if (!SVGElement.prototype[coordinateName]) {
      Object.defineProperty(SVGElement.prototype, coordinateName, {
        value: { baseVal: { value: 0 } },
        writable: true,
      });
    }
  });
});

describe('`class StrungElementsDrawing`', () => {
  test('`domNode`', () => {
    const domNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    const strungElementsDrawing = new StrungElementsDrawing(domNode);

    expect(strungElementsDrawing.domNode).toBe(domNode);
  });

  test('`strungElements`', () => {
    const drawing = new Drawing();

    const strungElementsDrawing = new StrungElementsDrawing(drawing.domNode);

    expect(strungElementsDrawing.strungElements).toStrictEqual([]);

    const b1 = drawing.addBase('A');
    const b2 = drawing.addBase('C');

    const pb = drawing.addPrimaryBond(b1, b2);

    const ele = drawing.addStrungElement('text', pb);

    // unregister
    strungElementsDrawing.strungElements = [];
    expect(strungElementsDrawing.strungElements).toStrictEqual([]);

    // set via array
    strungElementsDrawing.strungElements = [ele];
    expect(strungElementsDrawing.strungElements).toStrictEqual([ele]);
  });

  test('`add()`', () => {
    const drawing = new Drawing();

    const strungElementsDrawing = new StrungElementsDrawing(drawing.domNode);

    const b1 = drawing.addBase('A');
    const b2 = drawing.addBase('C');

    const pb = drawing.addPrimaryBond(b1, b2);

    // test every recognized strung element type
    const strungElements = ['text', 'circle', 'rectangle', 'triangle'].map(type => strungElementsDrawing.add(type, pb));

    // returns added strung elements
    strungElements.forEach(ele => expect(ele).toBeTruthy());

    // adds strung elements to the underlying SVG element
    strungElements.forEach(ele => expect(strungElementsDrawing.domNode.contains(ele.domNode)).toBeTruthy());

    // registers added strung elements
    strungElements.forEach(ele => expect(strungElementsDrawing.strungElements.includes(ele)).toBeTruthy());

    // throws for unrecognized types
    expect(() => strungElementsDrawing.add('asdf', pb)).toThrow();
  });
});
