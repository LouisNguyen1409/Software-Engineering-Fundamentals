const rewire = require('rewire');
const process = require('process');
const p = rewire(process.cwd() + '/primes');
const factors = p.__get__('factors');

describe('tests for factor', () => {
  test('zero and one', () => {
    expect(factors(0)).toEqual([]);
    expect(factors(1)).toEqual([]);
  });

  test('documentation', () => {
    expect(factors(16)).toEqual([2, 2, 2, 2]);
    expect(factors(21)).toEqual([3, 7]);
  });

  test('basic assortment', () => {
    expect(factors(2)).toEqual([2]);
    expect(factors(4)).toEqual([2, 2]);
    expect(factors(6)).toEqual([2, 3]);
    expect(factors(9)).toEqual([3, 3]);
    expect(factors(8)).toEqual([2, 2, 2]);
    expect(factors(10)).toEqual([2, 5]);
    expect(factors(11)).toEqual([11]);
    expect(factors(12)).toEqual([2, 2, 3]);
    expect(factors(18)).toEqual([2, 3, 3]);
    expect(factors(20)).toEqual([2, 2, 5]);
  });

  test('large pair', () => {
    expect(factors(481)).toEqual([13, 37]);
  });

  test('large prime', () => {
    expect(factors(2490)).toEqual([2, 3, 5, 83]);
  });

  test('prime numbers', () => {
    expect(factors(23)).toEqual([23]);
    expect(factors(31)).toEqual([31]);
    expect(factors(67)).toEqual([67]);
    expect(factors(89)).toEqual([89]);
  });
});
