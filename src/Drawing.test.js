/**
 * @jest-environment jsdom
 */

import { Drawing } from './Drawing';

import { Nucleobase } from '@rnacanvas/draw.bases';

import { StraightBond } from '@rnacanvas/draw.bonds';

if (!SVGElement.prototype.getBBox) {
  SVGElement.prototype.getBBox = () => ({ x: 0, y: 0, width: 0, height: 0, top: 0, right: 0, bottom: 0, left: 0 });
}

if (!SVGElement.prototype.getTotalLength) {
  SVGElement.prototype.getTotalLength = () => 0;
}

if (!SVGElement.prototype.getPointAtLength) {
  SVGElement.prototype.getPointAtLength = () => ({ x: 0, y: 0 });
}

describe('Drawing class', () => {
  test('appendTo method', () => {
    let drawing = new Drawing();
    let container = document.createElement('div');

    expect(container.contains(drawing.domNode)).toBeFalsy();
    drawing.appendTo(container);
    expect(container.contains(drawing.domNode)).toBeTruthy();
  });

  test('remove method', () => {
    let drawing = new Drawing();

    let container = document.createElement('div');
    drawing.appendTo(container);

    expect(container.contains(drawing.domNode)).toBeTruthy();
    drawing.remove();
    expect(container.contains(drawing.domNode)).toBeFalsy();
  });

  test('minX getter', () => {
    let drawing = new Drawing();

    drawing.domNode.viewBox = { baseVal: { x: 180.2753 } };

    expect(drawing.minX).toBe(180.2753);
  });

  test('maxX getter', () => {
    let drawing = new Drawing();

    drawing.domNode.viewBox = { baseVal: { x: -18.39104, width: 555.38194 } };

    expect(drawing.maxX).toBeCloseTo((-18.39104) + 555.38194);
  });

  test('minY getter', () => {
    let drawing = new Drawing();

    drawing.domNode.viewBox = { baseVal: { y: -23.09613 } };

    expect(drawing.minY).toBe(-23.09613);
  });

  test('maxY getter', () => {
    let drawing = new Drawing();

    drawing.domNode.viewBox = { baseVal: { y: 23.293138, height: 199.4824 } };

    expect(drawing.maxY).toBeCloseTo(23.293138 + 199.4824);
  });

  test('width getter', () => {
    let drawing = new Drawing();

    drawing.domNode.viewBox = { baseVal: { width: 1902.340826 } };

    expect(drawing.width).toBe(1902.340826);
  });

  test('height getter', () => {
    let drawing = new Drawing();

    drawing.domNode.viewBox = { baseVal: { height: 3214.889701 } };

    expect(drawing.height).toBe(3214.889701);
  });

  test('horizontalScaling getter', () => {
    let drawing = new Drawing();

    drawing.domNode.viewBox = { baseVal: { width: 1603.472 } };
    drawing.domNode.width = { baseVal: { value: 1288.4278 } };

    expect(drawing.horizontalScaling).toBeCloseTo(1288.4278 / 1603.472);
  });

  test('horizontalScaling setter', () => {
    let drawing = new Drawing();

    drawing.domNode.viewBox = { baseVal: { width: 2133.02 } };

    drawing.horizontalScaling = 2.3;

    expect(drawing.domNode.getAttribute('width')).toBe((2.3 * 2133.02).toString());
  });

  test('verticalScaling getter', () => {
    let drawing = new Drawing();

    drawing.domNode.viewBox = { baseVal: { height: 2101.9983 } };
    drawing.domNode.height = { baseVal: { value: 2560.88 } };

    expect(drawing.verticalScaling).toBeCloseTo(2560.88 / 2101.9983);
  });

  test('verticalScaling setter', () => {
    let drawing = new Drawing();

    drawing.domNode.viewBox = { baseVal: { height: 2482.087 } };

    drawing.verticalScaling = 0.782;

    expect(drawing.domNode.getAttribute('height')).toBe((0.782 * 2482.087).toString());
  });

  test('setScaling method', () => {
    let drawing = new Drawing();

    drawing.domNode.viewBox = { baseVal: { x: 0, y: 0, width: 729, height: 1102 } };

    drawing.setScaling(2.18);

    expect(drawing.domNode.getAttribute('width')).toBe((2.18 * 729).toString());
    expect(drawing.domNode.getAttribute('height')).toBe((2.18 * 1102).toString());
  });

  test('horizontalClientScaling getter', () => {
    let drawing = new Drawing();

    drawing.domNode.viewBox = { baseVal: { x: 0, y: 0, width: 1812, height: 900 } };

    drawing.domNode.getBoundingClientRect = () => ({ width: 1693 });

    expect(drawing.horizontalClientScaling).toBeCloseTo(1693 / 1812);
  });

  test('verticalClientScaling getter', () => {
    let drawing = new Drawing();

    drawing.domNode.viewBox = { baseVal: { x: 0, y: 0, width: 600, height: 907 } };

    drawing.domNode.getBoundingClientRect = () => ({ height: 1184 });

    expect(drawing.verticalClientScaling).toBeCloseTo(1184 / 907);
  });

  test('appendBase method', () => {
    let drawing = new Drawing();

    // add some bases to append after
    drawing.appendBase(Nucleobase.create('A'));
    drawing.appendBase(Nucleobase.create('C'));
    drawing.appendBase(Nucleobase.create('G'));

    let b = Nucleobase.create('b');

    expect(drawing.allBasesSorted.includes(b)).toBeFalsy();
    expect(drawing.domNode.contains(b.domNode)).toBeFalsy();

    drawing.appendBase(b);

    expect(drawing.allBasesSorted[3]).toBe(b);
    expect(drawing.domNode.childNodes[3]).toBe(b.domNode);
  });

  test('appendPrimaryBond method', () => {
    let drawing = new Drawing();

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

    expect(drawing.allPrimaryBonds.includes(pb)).toBeFalsy();
    expect(drawing.domNode.contains(pb.domNode)).toBeFalsy();

    drawing.appendPrimaryBond(pb);

    expect(drawing.allPrimaryBonds[3]).toBe(pb);
    expect(drawing.domNode.childNodes[6]).toBe(pb.domNode);
  });

  test('appendSecondaryBond method', () => {
    let drawing = new Drawing();

    let bs = [1, 2, 3, 4, 5, 6, 7, 8].map(() => Nucleobase.create('g'));
    expect(bs.length).toBe(8);

    // add some elements to append after
    drawing.appendSecondaryBond(StraightBond.between(bs[0], bs[3]));
    drawing.appendSecondaryBond(StraightBond.between(bs[0], bs[5]));
    drawing.appendBase(Nucleobase.create('G'));
    drawing.appendBase(Nucleobase.create('b'));
    drawing.appendPrimaryBond(StraightBond.between(bs[2], bs[3]));

    let sb = StraightBond.between(bs[6], bs[3]);

    expect(drawing.allSecondaryBonds.includes(sb)).toBeFalsy();
    expect(drawing.domNode.contains(sb.domNode)).toBeFalsy();

    drawing.appendSecondaryBond(sb);

    expect(drawing.allSecondaryBonds[2]).toBe(sb);
    expect(drawing.domNode.childNodes[5]).toBe(sb.domNode);
  });
});
