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
});
