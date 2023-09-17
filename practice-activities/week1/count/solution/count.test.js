import { countChar } from './count';

describe('Count Testing', () => {
  test('Hello', () => {
    expect(countChar('HelloOo!')).toStrictEqual({ H: 1, e: 1, l: 2, o: 2, O: 1, '!': 1 });
  });
  test('abc', () => {
    expect(countChar('abc')).toStrictEqual({ a: 1, b: 1, c: 1 });
  });
  test('Empty', () => {
    expect(countChar('')).toStrictEqual({});
  });
  test('aa', () => {
    expect(countChar('aa')).toStrictEqual({ a: 2 });
  });
  test('A small sentence', () => {
    expect(countChar('A small sentence')).toEqual({ A: 1, ' ': 2, s: 2, m: 1, a: 1, l: 2, e: 3, n: 2, t: 1, c: 1 });
  });
});
