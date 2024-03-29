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

  test('setScaling method', () => {
    let drawing = new Drawing();

    drawing.domNode.viewBox = { baseVal: { x: 0, y: 0, width: 729, height: 1102 } };

    drawing.setScaling(2.18);

    expect(drawing.domNode.getAttribute('width')).toBe('1589.22px');
    expect(drawing.domNode.getAttribute('height')).toBe('2402.36px');
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
