/**
 * @jest-environment jsdom
 */

import { DotBracketDrawer } from './DotBracketDrawer';

import { Drawing } from './Drawing';

if (!SVGElement.prototype.x) {
  SVGElement.prototype.x = { baseVal: [{ value: 0 }] };
}

if (!SVGElement.prototype.y) {
  SVGElement.prototype.y = { baseVal: [{ value: 0 }] };
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

describe('`class DotBracketDrawer`', () => {
  test('`draw()`', () => {
    var targetDrawing = new Drawing();

    var drawer = new DotBracketDrawer(targetDrawing);

    var { bases } = drawer.draw(
      'AAGGGGAAAAAGGGGAA',
      '..((((.....))))..',
    );

    // returns drawn bases
    expect([...bases].map(b => b.domNode.textContent).join('')).toBe('AAGGGGAAAAAGGGGAA');
  });
});
