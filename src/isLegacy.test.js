/**
 * @jest-environment jsdom
 */

import { isLegacy } from './isLegacy';

import { Drawing } from './Drawing';

test('`function isLegacy()`', () => {
  var drawing = new Drawing();

  // add some elements
  [...'AGUCGCUGAUCGAUGC'].forEach(letter => drawing.addBase(letter));

  var savedDrawing = drawing.serialized();

  expect(isLegacy(savedDrawing)).toBe(false);

  savedDrawing.svg = savedDrawing.outerXML;
  savedDrawing.outerXML = undefined;

  expect(isLegacy(savedDrawing)).toBe(true);

  // some random values
  expect(isLegacy(undefined)).toBe(false);
  expect(isLegacy(null)).toBe(false);
  expect(isLegacy(0)).toBe(false);
  expect(isLegacy('asdf')).toBe(false);
  expect(isLegacy([])).toBe(false);
  expect(isLegacy({})).toBe(false);
});
