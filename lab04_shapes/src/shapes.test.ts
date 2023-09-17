import { drawShape } from './shapes';

const testData = [
  {
    size: 0,
    solidSquare: '',
    solidTriangle: '',
    hollowSquare: '',
    hollowTriangle: '',
  },
  {
    size: 1,
    solidSquare: '*',
    solidTriangle: '*',
    hollowSquare: '*',
    hollowTriangle: '*',
  },
  {
    size: 2,
    solidSquare: '* *\n* *',
    solidTriangle: '*\n* *',
    hollowSquare: '* *\n* *',
    hollowTriangle: '*\n* *',
  },
  {
    size: 3,
    solidSquare: '* * *\n* * *\n* * *',
    solidTriangle: '*\n* *\n* * *',
    hollowSquare: '* * *\n*   *\n* * *',
    hollowTriangle: '*\n* *\n* * *',
  },
  {
    size: 4,
    solidSquare: '* * * *\n* * * *\n* * * *\n* * * *',
    solidTriangle: '*\n* *\n* * *\n* * * *',
    hollowSquare: '* * * *\n*     *\n*     *\n* * * *',
    hollowTriangle: '*\n* *\n*   *\n* * * *',
  },
  {
    size: 5,
    solidSquare: '* * * * *\n* * * * *\n* * * * *\n* * * * *\n* * * * *',
    solidTriangle: '*\n* *\n* * *\n* * * *\n* * * * *',
    hollowSquare: '* * * * *\n*       *\n*       *\n*       *\n* * * * *',
    hollowTriangle: '*\n* *\n*   *\n*     *\n* * * * *',
  },
];

describe('Error', () => {
  test('invalid shape', () => {
    expect(drawShape('invalid', 5, true)).toEqual('Invalid Input');
  });

  test('negative size', () => {
    expect(drawShape('square', -1, true)).toEqual('Invalid Input');
  });
});

describe('isSolid', () => {
  describe('square', () => {
    test.each(testData)('of size $size', ({ size, solidSquare }) => {
      expect(drawShape('square', size, true)).toEqual(solidSquare);
    });
  });
  describe('triangle', () => {
    test.each(testData)('of size $size', ({ size, solidTriangle }) => {
      expect(drawShape('triangle', size, true)).toEqual(solidTriangle);
    });
  });
});

describe('Hollow', () => {
  describe('square', () => {
    test.each(testData)('of size $size', ({ size, hollowSquare }) => {
      expect(drawShape('square', size, false)).toEqual(hollowSquare);
    });
  });
  describe('triangle', () => {
    test.each(testData)('of size $size', ({ size, hollowTriangle }) => {
      expect(drawShape('triangle', size, false)).toEqual(hollowTriangle);
    });
  });
});
