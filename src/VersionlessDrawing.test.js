import { VersionlessDrawing } from './VersionlessDrawing';

describe('`class VersionlessDrawing`', () => {
  test('`get outerXML()`', () => {
    var drawing = new VersionlessDrawing({});
    expect(() => drawing.outerXML).toThrow();

    var drawing = new VersionlessDrawing({ outerXML: '316478264817264817264' });
    expect(drawing.outerXML).toBe('316478264817264817264');

    var drawing = new VersionlessDrawing({ svg: '8993871498274819724' });
    expect(drawing.outerXML).toBe('8993871498274819724');
  });

  test('`get bases()`', () => {
    var drawing = new VersionlessDrawing({});

    expect(drawing.bases).toStrictEqual([]);

    let bases = [1, 2, 3, 4, 5, 6, 7, 8].map(() => new ElementMock());

    var drawing = new VersionlessDrawing({ bases });

    expect(drawing.bases).toStrictEqual(bases);

    var drawing = new VersionlessDrawing({
      sequences: [{ bases: bases.slice(0, 3)}, { bases: bases.slice(3, 5) }, { bases: bases.slice(5) }],
    });

    expect(drawing.bases).toStrictEqual(bases);
  });

  test('`get outlines()`', () => {
    var drawing = new VersionlessDrawing({});

    expect(drawing.outlines).toStrictEqual([]);

    let outlines = [1, 2, 3, 4, 5, 6].map(() => new ElementMock());

    var drawing = new VersionlessDrawing({ outlines });

    expect(drawing.outlines).toStrictEqual(outlines);

    var drawing = new VersionlessDrawing({ baseOutlines: outlines });

    expect(drawing.outlines).toStrictEqual(outlines);

    let ownerIDs = outlines.map(() => `${Math.random()}`);

    var drawing = new VersionlessDrawing({
      bases: outlines.map((o, i) => ({ outline: o, id: ownerIDs[i] })),
    });

    expect(drawing.outlines).toStrictEqual(outlines.map((o, i) => ({ ...o, ownerID: ownerIDs[i] })));
  });

  test('`get numberings()`', () => {
    var drawing = new VersionlessDrawing({});

    expect(drawing.numberings).toStrictEqual([]);

    let numberings = [1, 2, 3, 4, 5, 6, 7, 8].map(() => new ElementMock());

    var drawing = new VersionlessDrawing({ numberings });

    expect(drawing.numberings).toStrictEqual(numberings);

    var drawing = new VersionlessDrawing({ baseNumberings: numberings });

    expect(drawing.numberings).toStrictEqual(numberings);

    let ownerIDs = numberings.map(() => `${Math.random()}`);

    var drawing = new VersionlessDrawing({
      bases: numberings.map((n, i) => ({ numbering: n, textId: ownerIDs[i] })),
    });

    expect(drawing.numberings).toStrictEqual(numberings.map((n, i) => ({ ...n, ownerID: ownerIDs[i] })));
  });

  test('`get numberingLines()`', () => {
    var drawing = new VersionlessDrawing({});

    expect(drawing.numberingLines).toStrictEqual([]);

    let numberingLines = [1, 2, 3, 4, 5, 6].map(() => new ElementMock());

    var drawing = new VersionlessDrawing({ numberingLines });

    expect(drawing.numberingLines).toStrictEqual(numberingLines);

    var drawing = new VersionlessDrawing({ baseNumberingLines: numberingLines });

    expect(drawing.numberingLines).toStrictEqual(numberingLines);

    var drawing = new VersionlessDrawing({ bases: numberingLines.map(line => ({ numbering: line })) });

    expect(drawing.numberingLines).toStrictEqual(numberingLines);
  });

  test('`get primaryBonds()`', () => {
    var drawing = new VersionlessDrawing({});

    expect(drawing.primaryBonds).toStrictEqual([]);

    let primaryBonds = [1, 2, 3, 4, 5].map(() => new ElementMock());

    var drawing = new VersionlessDrawing({ primaryBonds });

    expect(drawing.primaryBonds).toStrictEqual(primaryBonds);
  });

  test('`get secondaryBonds()`', () => {
    var drawing = new VersionlessDrawing({});

    expect(drawing.secondaryBonds).toStrictEqual([]);

    let secondaryBonds = [1, 2, 3, 4, 5, 6].map(() => new ElementMock());

    var drawing = new VersionlessDrawing({ secondaryBonds });

    expect(drawing.secondaryBonds).toStrictEqual(secondaryBonds);
  });
});

class ElementMock {
  // make each element unique in some way
  id = Math.random();
}
