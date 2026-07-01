/**
 * @jest-environment jsdom
 */

import { TertiaryBondsDrawing } from './TertiaryBondsDrawing';

import { CurvedBond } from '@rnacanvas/draw.bases.bonds';

import { Nucleobase } from '@rnacanvas/draw.bases';

beforeAll(() => {
  if (!SVGElement.prototype.getBBox) {
    SVGElement.prototype.getBBox = () => ({ x: 0, y: 0, width: 0, height: 0 });
  }
});

describe('`class TertiaryBondsDrawing`', () => {
  test('`constructor()`', () => {
    var domNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    var drawing = new TertiaryBondsDrawing(domNode);

    // stores DOM node reference
    expect(drawing.domNode).toBe(domNode);

    expect(domNode).toBeTruthy();
  });

  test('`get tertiaryBonds()`', () => {
    var domNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    var drawing = new TertiaryBondsDrawing(domNode);

    var bases = [...'1234567890'].map(() => Nucleobase.create('A'));
    bases.forEach(b => domNode.append(b.domNode));

    [[0, 3], [7, 2], [8, 9]].map(indices => drawing.addTertiaryBond(...indices.map(i => bases[i])));

    let tbs = drawing.tertiaryBonds;

    expect(tbs.length).toBe(3);

    expect(tbs.map(tb => [bases.indexOf(tb.base1), bases.indexOf(tb.base2)])).toStrictEqual([[0, 3], [7, 2], [8, 9]]);
  });

  test('`set tertiaryBonds()`', () => {
    var domNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    var drawing = new TertiaryBondsDrawing(domNode);

    var bases = [...'1234567890'].map(() => Nucleobase.create('A'));
    bases.forEach(b => domNode.append(b.domNode));

    [[0, 3], [7, 2], [8, 9]].map(indices => drawing.addTertiaryBond(...indices.map(i => bases[i])));

    expect(drawing.tertiaryBonds.length).toBe(3);

    var tbs = [CurvedBond.between(bases[0], bases[1])];

    drawing.tertiaryBonds = tbs;

    expect(drawing.tertiaryBonds.length).toBe(1);

    expect(drawing.tertiaryBonds[0]).toBe(tbs[0]);
  });

  test('`addTertiaryBond()`', () => {
    var domNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    var drawing = new TertiaryBondsDrawing(domNode);

    var base1 = Nucleobase.create('A');
    var base2 = Nucleobase.create('U');

    domNode.append(base1.domNode, base2.domNode);

    var tb = drawing.addTertiaryBond(base1, base2);

    expect(tb.base1).toBe(base1);
    expect(tb.base2).toBe(base2);

    expect(domNode.contains(tb.domNode)).toBeTruthy();
  });
});
