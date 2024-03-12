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
});
