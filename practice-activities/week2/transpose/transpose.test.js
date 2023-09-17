import fs from 'fs';
import path from 'path';
import { transpose } from './transpose';

describe('check banned words', () => {
  const content = fs.readFileSync(path.resolve(__dirname, 'transpose.js'), 'utf-8').toLowerCase();

  test.each([
    'import',
    'while',
    'for',
    'bruno',
  ])("Solution contains banned word: '%s'", (bannedWord) => {
    expect(content).not.toContain(bannedWord);
  });
});

describe('matrix', () => {
  test.each([
    { matrix: [], transposedMatrix: [] },
    { matrix: [[]], transposedMatrix: [] },
    { matrix: [[], [1]], transposedMatrix: null },
    { matrix: [[2, 3], [1]], transposedMatrix: null },
    { matrix: [[1]], transposedMatrix: [[1]] },
    { matrix: [[1, 2]], transposedMatrix: [[1], [2]] },
    { matrix: [[1, 2], [3, 4]], transposedMatrix: [[1, 3], [2, 4]] },
    { matrix: [[1, 2], [3, 4], [5, 6]], transposedMatrix: [[1, 3, 5], [2, 4, 6]] },
    { matrix: [[1, 2, 3], [4, 5, 6], [7, 8, 9]], transposedMatrix: [[1, 4, 7], [2, 5, 8], [3, 6, 9]] },
  ].map(t => (
    { ...t, matrixDisplay: JSON.stringify(t.matrix), transposedDisplay: JSON.stringify(t.transposedMatrix) }
  )))('transpose($matrixDisplay) => $transposedDisplay', ({ matrix, transposedMatrix }) => {
    expect(transpose(matrix)).toStrictEqual(transposedMatrix);
  });
});
