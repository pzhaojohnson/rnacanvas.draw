/**
 * @jest-environment jsdom
 */

import { Drawing } from './Drawing';

import { Nucleobase } from '@rnacanvas/draw.bases';

import { StraightBond } from '@rnacanvas/draw.bonds';

/**
 * Returns true if the value is a string of a finite number and false otherwise.
 */
function isFiniteNumberString(value) {
  if (typeof value != 'string') {
    return false;
  }

  let n = Number.parseFloat(value);

  return Number.isFinite(n) && n.toString() === value;
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

function parseViewBox(viewBoxString) {
  expect(typeof viewBoxString).toBe('string');

  let values = viewBoxString.split(' ');
  expect(values.length).toBe(4);

  values.forEach(v => {
    expect(isFiniteNumberString(v)).toBeTruthy();
  });

  return {
    x: Number.parseFloat(values[0]),
    y: Number.parseFloat(values[1]),
    width: Number.parseFloat(values[2]),
    height: Number.parseFloat(values[3]),
  };
}

describe('Drawing class', () => {
  let drawing = null;

  beforeEach(() => {
    drawing = new Drawing();

    if (!drawing.domNode.viewBox) {
      Object.defineProperty(drawing.domNode, 'viewBox', {
        get: () => ({ baseVal: parseViewBox(drawing.domNode.getAttribute('viewBox')) }),
      });
    }

    if (!drawing.domNode.width) {
      Object.defineProperty(drawing.domNode, 'width', {
        get: () => {
          let width = drawing.domNode.getAttribute('width');
          expect(isFiniteNumberString(width)).toBeTruthy();
          return { baseVal: { value: Number.parseFloat(width) } };
        },
      });
    }

    if (!drawing.domNode.height) {
      Object.defineProperty(drawing.domNode, 'height', {
        get: () => {
          let height = drawing.domNode.getAttribute('height');
          expect(isFiniteNumberString(height)).toBeTruthy();
          return { baseVal: { value: Number.parseFloat(height) } };
        },
      });
    }
  });

  afterEach(() => {
    drawing.remove();
    drawing = null;
  });

  describe('constructor', () => {
    it('initializes the view box of the SVG document that is the drawing', () => {
      let drawing = new Drawing();
      expect(drawing.domNode.getAttribute('viewBox')).toBe('0 0 100 100');
    });

    it('explicitly initializes horizontal and vertical scaling to 1', () => {
      let drawing = new Drawing();

      expect(drawing.domNode.getAttribute('width')).toBe('100');
      expect(drawing.domNode.getAttribute('height')).toBe('100');
    });
  });

  test('outerHTML getter', () => {
    let drawing = new Drawing();

    Object.defineProperty(drawing.domNode, 'outerHTML', { value: 'Outer HTML string - 174182764826' });

    expect(drawing.outerHTML).toBe('Outer HTML string - 174182764826');
  });

  test('innerHTML getter', () => {
    let drawing = new Drawing();

    Object.defineProperty(drawing.domNode, 'innerHTML', { value: 'Inner HTML string - 987598173953' });

    expect(drawing.innerHTML).toBe('Inner HTML string - 987598173953');
  });

  test('appendTo method', () => {
    let container = document.createElement('div');
    expect(container.contains(drawing.domNode)).toBeFalsy();

    drawing.appendTo(container);
    expect(container.contains(drawing.domNode)).toBeTruthy();
  });

  test('remove method', () => {
    let container = document.createElement('div');

    drawing.appendTo(container);
    expect(container.contains(drawing.domNode)).toBeTruthy();

    drawing.remove();
    expect(container.contains(drawing.domNode)).toBeFalsy();
  });

  test('minX getter', () => {
    drawing.domNode.setAttribute('viewBox', '180.2753 5 10 200');

    expect(drawing.minX).toBe(180.2753);
  });

  test('minX setter', () => {
    drawing.domNode.setAttribute('viewBox', '0.59 1.22 8842 6503');
    drawing.domNode.setAttribute('width', '10228');

    drawing.minX = -6.21;

    // must change width as well to maintain maximum X coordinate
    expect(drawing.domNode.getAttribute('viewBox')).toBe('-6.21 1.22 8848.8 6503');

    // maintained horizontal scaling
    expect(drawing.domNode.getAttribute('width')).toBe('10235.865912689436');
  });

  test('maxX getter', () => {
    drawing.domNode.setAttribute('viewBox', '-18.39104 20 555.38194 42');

    expect(drawing.maxX).toBeCloseTo((-18.39104) + 555.38194);
  });

  test('maxX setter', () => {
    drawing.domNode.setAttribute('viewBox', '12.08 -18.4 8819 2369');
    drawing.domNode.setAttribute('width', '6607');

    drawing.maxX = 12005;

    expect(drawing.domNode.getAttribute('viewBox')).toBe('12.08 -18.4 11992.92 2369');

    // maintained horizontal scaling
    expect(drawing.domNode.getAttribute('width')).toBe('8984.830756321579');
  });

  test('minY getter', () => {
    drawing.domNode.setAttribute('viewBox', '15 -23.09613 27 84');

    expect(drawing.minY).toBe(-23.09613);
  });

  test('minY setter', () => {
    drawing.domNode.setAttribute('viewBox', '-8.05 -2.33 902 1282.3');
    drawing.domNode.setAttribute('height', '1108.4');

    drawing.minY = 8.12;

    expect(drawing.domNode.getAttribute('viewBox')).toBe('-8.05 8.12 902 1271.8500000000001');

    // maintained vertical scaling
    expect(drawing.domNode.getAttribute('height')).toBe('1099.3671839663107');
  });

  test('maxY getter', () => {
    drawing.domNode.setAttribute('viewBox', '12 23.293138 25 199.4824');

    expect(drawing.maxY).toBeCloseTo(23.293138 + 199.4824);
  });

  test('maxY setter', () => {
    drawing.domNode.setAttribute('viewBox', '12.08 -2.57 1522.1 1980.02');
    drawing.domNode.setAttribute('height', '1776.23');

    drawing.maxY = 2504.8;

    expect(drawing.domNode.getAttribute('viewBox')).toBe('12.08 -2.57 1522.1 2507.3700000000003');

    // maintained vertical scaling
    expect(drawing.domNode.getAttribute('height')).toBe('2249.3034490055657');
  });

  describe('setBoundaries method', () => {
    beforeEach(() => {
      drawing.domNode.setAttribute('viewBox', '-52.7 88.4 101.89 902.4');

      drawing.domNode.setAttribute('width', '82.11');
      drawing.domNode.setAttribute('height', '1257');

      drawing.setBoundaries({ minX: -13.4, maxX: 128.3, minY: 412, maxY: 1072.8 });
    });

    it('sets the minimum and maximum X and Y coordinates', () => {
      expect(drawing.minX).toBeCloseTo(-13.4);
      expect(drawing.maxX).toBeCloseTo(128.3);
      expect(drawing.minY).toBeCloseTo(412);
      expect(drawing.maxY).toBeCloseTo(1072.8);
    });

    it('maintains horizontal and vertical scalings', () => {
      expect(drawing.horizontalScaling).toBeCloseTo(82.11 / 101.89);
      expect(drawing.verticalScaling).toBeCloseTo(1257 / 902.4);
    });
  });

  test('width getter', () => {
    drawing.domNode.setAttribute('viewBox', '20 -12 1902.340826 57');

    expect(drawing.width).toBe(1902.340826);
  });

  test('width setter', () => {
    drawing.domNode.setAttribute('viewBox', '-12.5 2.28 991.2 1206');
    drawing.domNode.setAttribute('width', '1419');

    drawing.width = 1392;

    expect(drawing.domNode.getAttribute('viewBox')).toBe('-12.5 2.28 1392 1206');

    // maintained horizontal scaling
    expect(drawing.domNode.getAttribute('width')).toBe('1992.7845036319611');
  });

  test('height getter', () => {
    drawing.domNode.setAttribute('viewBox', '3 -9 24 3214.889701');

    expect(drawing.height).toBe(3214.889701);
  });

  test('height setter', () => {
    drawing.domNode.setAttribute('viewBox', '-12.83 2.85 2100.3 1892.1');
    drawing.domNode.setAttribute('height', '603.7');

    drawing.height = 2209.8;

    expect(drawing.domNode.getAttribute('viewBox')).toBe('-12.83 2.85 2100.3 2209.8');

    // maintained vertical scaling
    expect(drawing.domNode.getAttribute('height')).toBe('705.0664658316159');
  });

  test('horizontalScaling getter', () => {
    drawing.domNode.setAttribute('viewBox', '55 -24 1603.472 88');
    drawing.domNode.setAttribute('width', '1288.4278');

    expect(drawing.horizontalScaling).toBeCloseTo(1288.4278 / 1603.472);
  });

  test('horizontalScaling setter', () => {
    drawing.domNode.setAttribute('viewBox', '554 -228.1 2133.02 881');

    drawing.horizontalScaling = 2.3;

    expect(drawing.domNode.getAttribute('width')).toBe((2.3 * 2133.02).toString());
  });

  test('verticalScaling getter', () => {
    drawing.domNode.setAttribute('viewBox', '-21.4 552.3 1012.6 2101.9983');
    drawing.domNode.setAttribute('height', '2560.88');

    expect(drawing.verticalScaling).toBeCloseTo(2560.88 / 2101.9983);
  });

  test('verticalScaling setter', () => {
    drawing.domNode.setAttribute('viewBox', '22 -10 884.257 2482.087');

    drawing.verticalScaling = 0.782;

    expect(drawing.domNode.getAttribute('height')).toBe((0.782 * 2482.087).toString());
  });

  test('setScaling method', () => {
    drawing.domNode.setAttribute('viewBox', '0 0 729 1102');

    drawing.setScaling(2.18);

    expect(drawing.domNode.getAttribute('width')).toBe((2.18 * 729).toString());
    expect(drawing.domNode.getAttribute('height')).toBe((2.18 * 1102).toString());
  });

  test('horizontalClientScaling getter', () => {
    drawing.domNode.setAttribute('viewBox', '0 0 1812 900');

    drawing.domNode.getBoundingClientRect = () => ({ width: 1693 });

    expect(drawing.horizontalClientScaling).toBeCloseTo(1693 / 1812);
  });

  test('verticalClientScaling getter', () => {
    drawing.domNode.setAttribute('viewBox', '0 0 600 907');

    drawing.domNode.getBoundingClientRect = () => ({ height: 1184 });

    expect(drawing.verticalClientScaling).toBeCloseTo(1184 / 907);
  });

  test('appendBase method', () => {
    // add some bases to append after
    drawing.appendBase(Nucleobase.create('A'));
    drawing.appendBase(Nucleobase.create('C'));
    drawing.appendBase(Nucleobase.create('G'));

    let b = Nucleobase.create('b');

    expect([...drawing.bases].includes(b)).toBeFalsy();
    expect(drawing.domNode.contains(b.domNode)).toBeFalsy();

    drawing.appendBase(b);

    expect([...drawing.bases][3]).toBe(b);
    expect(drawing.domNode.childNodes[3]).toBe(b.domNode);
  });

  test('appendPrimaryBond method', () => {
    let bs = [1, 2, 3, 4, 5, 6, 7, 8].map(() => Nucleobase.create('C'));
    expect(bs.length).toBe(8);

    // add some elements to append after
    drawing.appendBase(bs[0]);
    drawing.appendPrimaryBond(StraightBond.between(bs[0], bs[1]));
    drawing.appendBase(bs[3]);
    drawing.appendPrimaryBond(StraightBond.between(bs[1], bs[2]));
    drawing.appendPrimaryBond(StraightBond.between(bs[5], bs[3]));
    drawing.appendBase(bs[5]);

    let pb = StraightBond.between(bs[2], bs[6]);

    expect([...drawing.primaryBonds].includes(pb)).toBeFalsy();
    expect(drawing.domNode.contains(pb.domNode)).toBeFalsy();

    drawing.appendPrimaryBond(pb);

    expect([...drawing.primaryBonds][3]).toBe(pb);
    expect(drawing.domNode.childNodes[6]).toBe(pb.domNode);
  });

  test('appendSecondaryBond method', () => {
    let bs = [1, 2, 3, 4, 5, 6, 7, 8].map(() => Nucleobase.create('g'));
    expect(bs.length).toBe(8);

    // add some elements to append after
    drawing.appendSecondaryBond(StraightBond.between(bs[0], bs[3]));
    drawing.appendSecondaryBond(StraightBond.between(bs[0], bs[5]));
    drawing.appendBase(Nucleobase.create('G'));
    drawing.appendBase(Nucleobase.create('b'));
    drawing.appendPrimaryBond(StraightBond.between(bs[2], bs[3]));

    let sb = StraightBond.between(bs[6], bs[3]);

    expect([...drawing.secondaryBonds].includes(sb)).toBeFalsy();
    expect(drawing.domNode.contains(sb.domNode)).toBeFalsy();

    drawing.appendSecondaryBond(sb);

    expect([...drawing.secondaryBonds][2]).toBe(sb);
    expect(drawing.domNode.childNodes[5]).toBe(sb.domNode);
  });

  test('contentBBox getter', () => {
    let drawing = new Drawing();

    drawing.domNode.getBBox = () => ({ x: 57, y: -112, width: 842, height: 2054 });

    expect(drawing.contentBBox).toStrictEqual({ x: 57, y: -112, width: 842, height: 2054 });
  });
});
