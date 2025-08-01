/**
 * @jest-environment jsdom
 */

import { Drawing } from './Drawing';

import { Nucleobase } from '@rnacanvas/draw.bases';

import { StraightBond } from '@rnacanvas/draw.bases.bonds';

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
      expect(drawing.domNode.getAttribute('viewBox')).toBe('0 0 250 250');
    });

    it('explicitly initializes horizontal and vertical scaling to 1', () => {
      let drawing = new Drawing();

      expect(drawing.domNode.getAttribute('width')).toBe('250');
      expect(drawing.domNode.getAttribute('height')).toBe('250');
    });
  });

  test('outerXML getter', () => {
    let drawing = new Drawing();

    Object.defineProperty(drawing.domNode, 'outerHTML', { value: 'Outer XML string - 174182764826' });

    expect(drawing.outerXML).toBe('Outer XML string - 174182764826');
  });

  test('`set outerXML`', () => {
    let domNode = drawing.domNode;

    drawing.outerXML = '<svg><text>A</text><path d="M2 3 L50 60"></path></svg>';

    expect(drawing.domNode.outerHTML).toBe('<svg><text>A</text><path d="M2 3 L50 60"></path></svg>');

    // was edited in place
    expect(drawing.domNode).toBe(domNode);
  });

  test('innerXML getter', () => {
    let drawing = new Drawing();

    Object.defineProperty(drawing.domNode, 'innerHTML', { value: 'Inner XML string - 987598173953' });

    expect(drawing.innerXML).toBe('Inner XML string - 987598173953');
  });

  test('`set innerXML`', () => {
    drawing.innerXML = '<text>C</text><circle r="25.5"></circle><text>84</text>';

    expect(drawing.domNode.innerHTML).toBe('<text>C</text><circle r="25.5"></circle><text>84</text>');
  });

  test('`get name()`', () => {
    drawing.domNode.setAttribute('data-name', 'Drawing-182749');
    expect(drawing.name).toBe('Drawing-182749');

    drawing.domNode.removeAttribute('data-name');
    expect(drawing.name).toBeUndefined();
  });

  test('`set name()`', () => {
    drawing.name = 'Drawing-87918264912';
    expect(drawing.domNode.getAttribute('data-name')).toBe('Drawing-87918264912');

    drawing.name = undefined;
    expect(drawing.domNode.hasAttribute('data-name')).toBeFalsy();
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

  test('`set bases`', () => {
    for (let i = 0; i < 10; i++) { drawing.addBase(`${i}`); }
    let bases = [...drawing.bases];

    drawing.bases = [];
    expect([...drawing.bases].length).toBe(0);

    drawing.bases = bases;
    expect([...drawing.bases].length).toBe(10);

    [...drawing.bases].forEach((b, i) => expect(b).toBe(bases[i]));
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

  test('`set baseOutlines`', () => {
    for (let i = 0; i < 10; i++) { drawing.addBase(`${i}`); }
    let bases = [...drawing.bases];

    [2, 8, 4, 1].forEach(i => drawing.outlineBase(bases[i]));
    let baseOutlines = [...drawing.baseOutlines];

    drawing.baseOutlines = [];
    expect([...drawing.baseOutlines].length).toBe(0);

    drawing.baseOutlines = baseOutlines;
    expect([...drawing.baseOutlines].length).toBe(4);

    [...drawing.baseOutlines].forEach((bo, i) => expect(bo).toBe(baseOutlines[i]));
  });

  test('`get outlines()`', () => {
    for (let i = 0; i < 10; i++) { drawing.addBase(`${i}`); }
    let bases = [...drawing.bases];

    [2, 8, 4, 1].forEach(i => drawing.outline(bases[i]));

    expect([...drawing.outlines].length).toBe(4);

    expect([...drawing.outlines][0].owner.textContent).toBe('2');
    expect([...drawing.outlines][1].owner.textContent).toBe('8');
    expect([...drawing.outlines][2].owner.textContent).toBe('4');
    expect([...drawing.outlines][3].owner.textContent).toBe('1');
  });

  test('`outline()`', () => {
    for (let i = 0; i < 10; i++) { drawing.addBase(`${i}`); }
    let bases = [...drawing.bases];

    let outlines = [2, 8, 4, 1].map(i => drawing.outline(bases[i]));

    expect(outlines.map(o => o.owner.textContent).join('')).toBe('2841');
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

  describe('setPadding method', () => {
    beforeEach(() => {
      drawing.domNode.setAttribute('viewBox', '12.8 62 3012.4 2086');

      drawing.domNode.setAttribute('width', '4225');
      drawing.domNode.setAttribute('height', '2210');

      drawing.domNode.getBBox = () => ({ x: 30, y: 50, width: 2000, height: 4000 });

      drawing.setPadding(250.1);
    });

    it('adjusts the boundaries of the drawing', () => {
      expect(drawing.minX).toBeCloseTo(30 - 250.1);
      expect(drawing.maxX).toBeCloseTo(30 + 2000 + 250.1);
      expect(drawing.minY).toBeCloseTo(50 - 250.1);
      expect(drawing.maxY).toBeCloseTo(50 + 4000 + 250.1);
    });

    it('maintains the horizontal and vertical scalings of the drawing', () => {
      expect(drawing.horizontalScaling).toBeCloseTo(4225 / 3012.4);
      expect(drawing.verticalScaling).toBeCloseTo(2210 / 2086);
    });
  });

  test('`reset()`', () => {
    for (let i = 0; i < 15; i++) { drawing.addBase(`${i}`); }
    let bases = [...drawing.bases];

    [3, 5, 8].forEach(i => drawing.outlineBase(bases[i]));

    [[4, 1], [2, 3], [5, 6]].forEach(([i, j]) => drawing.addPrimaryBond(bases[i], bases[j]));

    [[12, 11], [3, 10], [6, 2]].forEach(([i, j]) => drawing.addSecondaryBond(bases[i], bases[j]));

    drawing.reset();

    // hard-coded to match default width and height values
    expect(drawing.outerXML).toBe('<svg viewBox="0 0 250 250" width="250" height="250"></svg>');

    expect([...drawing.bases]).toStrictEqual([]);
    expect([...drawing.baseOutlines]).toStrictEqual([]);
    expect([...drawing.primaryBonds]).toStrictEqual([]);
    expect([...drawing.secondaryBonds]).toStrictEqual([]);
  });

  test('`serialized()`', () => {
    for (let i = 0; i < 15; i++) { drawing.addBase(`${i}`); }
    let bases = [...drawing.bases];

    [7, 2, 1, 5].forEach(i => drawing.outlineBase(bases[i]));

    [[6, 2], [3, 4], [10, 11]].forEach(([i, j]) => drawing.addPrimaryBond(bases[i], bases[j]));

    [[12, 1], [2, 9], [7, 4], [1, 5]].forEach(([i, j]) => drawing.addSecondaryBond(bases[i], bases[j]));

    let serializedDrawing = drawing.serialized();

    expect(serializedDrawing.outerXML).toBe(drawing.outerXML);
    expect(drawing.outerXML).toBeTruthy();

    let elements = [...bases, ...drawing.baseOutlines, ...drawing.primaryBonds, ...drawing.secondaryBonds];

    let serializedElements = [
      ...serializedDrawing.bases, ...serializedDrawing.baseOutlines,
      ...serializedDrawing.primaryBonds, ...serializedDrawing.secondaryBonds,
    ];

    expect(serializedElements.length).toBe(elements.length);

    elements.forEach((ele, i) => expect(serializedElements[i].id).toBe(ele.id));
    elements.forEach(ele => expect(ele.id).toBeTruthy());

    // is JSON-serializable
    expect(() => JSON.stringify(serializedDrawing)).not.toThrow();
  });

  test('`static deserialized()`', () => {
    let drawing1 = new Drawing();

    for (let i = 0; i < 9; i++) { drawing1.addBase(`${i}`); }
    let bases = [...drawing1.bases];

    [2, 5, 3, 6, 1].forEach(i => drawing1.outlineBase(bases[i]));

    [[2, 3], [5, 4], [7, 6]].forEach(([i, j]) => drawing1.addPrimaryBond(bases[i], bases[j]));

    [[1, 8], [2, 8], [5, 3], [1, 7]].forEach(([i, j]) => drawing1.addSecondaryBond(bases[i], bases[j]));

    // JSDOM does not define these
    globalThis.SVGTextElement = SVGElement;
    globalThis.SVGCircleElement = SVGElement;
    globalThis.SVGLineElement = SVGElement;

    let drawing2 = Drawing.deserialized(drawing1.serialized());

    expect(drawing2.outerXML).toBe(drawing1.outerXML);
    expect(drawing1.outerXML).toBeTruthy();

    expect([...drawing2.bases].length).toBe(9);
    expect([...drawing2.baseOutlines].length).toBe(5);
    expect([...drawing2.primaryBonds].length).toBe(3);
    expect([...drawing2.secondaryBonds].length).toBe(4);

    // removes any container node used from the document body
    let n = document.body.childNodes.length;
    let drawing3 = Drawing.deserialized(drawing1.serialized());
    expect(document.body.childNodes.length).toBe(n);

    // removes the deserialized drawing from any container node used
    expect(drawing3.domNode.parentNode).toBeFalsy();
  });

  test('`restore()`', () => {
    let drawing1 = new Drawing();

    // attributes that will need to be preserved
    drawing1.domNode.setAttribute('width', '18492');
    drawing1.domNode.style.backgroundColor = '#712acd';

    for (let i = 0; i < 20; i++) { drawing1.addBase(`${i}`); }
    let bases = [...drawing1.bases];

    [4, 10, 2, 3, 8, 9].forEach(i => drawing1.outlineBase(bases[i]));

    [[3, 1], [12, 11], [8, 9], [7, 6]].forEach(([i, j]) => drawing1.addPrimaryBond(bases[i], bases[j]));

    [[2, 18], [3, 11], [12, 5]].forEach(([i, j]) => drawing1.addSecondaryBond(bases[i], bases[j]));

    let previousState = drawing1.serialized();
    expect(previousState).toBeTruthy();

    let drawing2 = new Drawing();

    // attributes that will need to be removed
    drawing2.domNode.setAttribute('fill', '#bb1287');
    drawing2.domNode.setAttribute('stroke', '#781fac');

    // elements that will need to be removed
    for (let i = 0; i < 10; i++) { drawing2.addBase(`${i}`); }
    [6, 2, 9, 2].forEach(i => drawing2.outlineBase([...drawing2.bases][i]));
    [[5, 2], [1, 2], [6, 8]].forEach(([i, j]) => drawing2.addPrimaryBond([...drawing2.bases][i], [...drawing2.bases][j]));

    drawing2.restore(previousState);
    expect(drawing2.serialized()).toStrictEqual(previousState);

    // make invalid
    previousState.bases[0].id = '';

    expect(() => drawing2.restore(previousState)).toThrow();

    // drawing 2 was not changed
    // (the `restore()` method should be atomic)
    expect(drawing2.serialized()).toStrictEqual(drawing1.serialized());
    expect(drawing1.serialized()).toBeTruthy();
  });
});
