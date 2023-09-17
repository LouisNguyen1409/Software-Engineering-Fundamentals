import { fib } from './fibonacci';

describe('Fibonacci Testing', () => {
  test('For length 3', () => {
    expect(fib(3)).toEqual([0, 1, 1]);
  });
});

