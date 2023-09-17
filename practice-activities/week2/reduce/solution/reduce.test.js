/**
 * @see list_exercises
 * @module list_exercises.test
 */

import { reduce } from './reduce';

const sum = (a, b) => a + b;
const product = (a, b) => a * b;

test('Empty list', () => {
  expect(reduce(sum, [])).toStrictEqual(null);
});

test('One element', () => {
  expect(reduce(sum, [1])).toStrictEqual(1);
});

test('Sum list', () => {
  expect(reduce(sum, [1, 2, 3, 4])).toStrictEqual(10);
});

test('Product list', () => {
  expect(reduce(product, [1, 2, 3, 4])).toStrictEqual(24);
});

test('Sum list with a zero element', () => {
  expect(reduce(sum, [0, 1, 2, 3, 4])).toStrictEqual(10);
});

test('Product list with a zero element', () => {
  expect(reduce(product, [0, 1, 2, 3, 4])).toStrictEqual(0);
});

test('Sum string list', () => {
  expect(reduce(sum, 'hello')).toStrictEqual('hello');
});
