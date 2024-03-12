/**
 * @jest-environment jsdom
 */

import { Drawing } from './Drawing';

describe('Drawing class', () => {
  test('svgDocDOMNode getter', () => {
    let drawing = new Drawing();

    expect(drawing.svgDocDOMNode).toBe(drawing.svgDoc.node);
    expect(drawing.svgDoc.node).toBeTruthy();
  });

  test('appendTo method', () => {
    let drawing = new Drawing();
    let container = document.createElement('div');

    expect(container.contains(drawing.svgDocDOMNode)).toBeFalsy();
    drawing.appendTo(container);
    expect(container.contains(drawing.svgDocDOMNode)).toBeTruthy();
  });

  test('remove method', () => {
    let drawing = new Drawing();

    let container = document.createElement('div');
    drawing.appendTo(container);

    expect(container.contains(drawing.svgDocDOMNode)).toBeTruthy();
    drawing.remove();
    expect(container.contains(drawing.svgDocDOMNode)).toBeFalsy();
  });

  test('setScaling method', () => {
    let drawing = new Drawing();

    drawing.svgDoc.viewbox(0, 0, 729, 1102);

    drawing.setScaling(2.18);

    expect(drawing.svgDoc.attr('width')).toBe('1589.22px');
    expect(drawing.svgDoc.attr('height')).toBe('2402.36px');
  });

  test('horizontalClientScaling getter', () => {
    let drawing = new Drawing();

    drawing.svgDoc.viewbox(0, 0, 1812, 900);

    Object.defineProperty(drawing.svgDocDOMNode, 'getBoundingClientRect', {
      value: () => ({ width: 1693 }),
      writable: true,
    });

    expect(drawing.horizontalClientScaling).toBeCloseTo(1693 / 1812);
  });

  test('verticalClientScaling getter', () => {
    let drawing = new Drawing();

    drawing.svgDoc.viewbox(0, 0, 600, 907);

    Object.defineProperty(drawing.svgDocDOMNode, 'getBoundingClientRect', {
      value: () => ({ height: 1184 }),
      writable: true,
    });

    expect(drawing.verticalClientScaling).toBeCloseTo(1184 / 907);
  });
});