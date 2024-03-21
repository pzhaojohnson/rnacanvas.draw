/**
 * @jest-environment jsdom
 */

import { Drawing } from './Drawing';

import { Nucleobase } from '@rnacanvas/draw.bases';

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
});
