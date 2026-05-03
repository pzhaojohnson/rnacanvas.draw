/**
 * @jest-environment jsdom
 */

import { CTDrawer } from './CTDrawer';

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

describe('`class CTDrawer`', () => {
  test('`draw()`', () => {
    var targetDrawing = new Drawing();

    var drawer = new CTDrawer(targetDrawing);

    var { bases } = drawer.draw(
      '5 dG=-10.0 kcal/mol\n'
      + '1 G 0 0 0 1\n'
      + '2 U 0 0 0 2\n'
      + '3 u 0 0 0 3\n'
      + '4 A 0 0 0 4\n'
      + '5 C 0 0 0 5'
    );

    // returns drawn bases
    expect([...bases].map(b => b.domNode.textContent).join('')).toBe('GUuAC');
  });
});
