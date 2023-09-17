import { magic } from './magic';

describe('Magic Testing', () => {
  test('Valid', () => {
    expect(magic([[8, 1, 6], [3, 5, 7], [4, 9, 2]])).toEqual('Magic square');
    expect(magic([[2, 7, 6], [9, 5, 1], [4, 3, 8]])).toEqual('Magic square');
  });
  test('Invalid', () => {
    expect(magic([[1, 1, 1], [1, 1, 1], [1, 1, 1]]).toEqual('Invalid data: missing or repeated number'));
    expect(magic([[1, 2], [3, 4, 5], [6, 7, 8]])).toEqual('Invalid data: missing or repeated number');
  });
  test('Not magic', () => {
    expect(magic([[1, 2, 3], [4, 5, 6], [7, 8, 9]])).toEqual('Not a magic square');
  });
  test('4x4', () => {
    expect(magic([[116, 3, 2, 113], [5, 110, 111, 8], [9, 106, 107, 12], [104, 15, 14, 101]])).toEqual('Magic square');
  });
});
