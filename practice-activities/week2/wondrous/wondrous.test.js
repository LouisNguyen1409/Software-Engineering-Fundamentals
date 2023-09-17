import { wondrous } from './wondrous';

describe('Wondrous Testing', () => {
  test('For number 3', () => {
    expect(wondrous(3)).toEqual([3, 10, 5, 16, 8, 4, 2, 1]);
  });
});
