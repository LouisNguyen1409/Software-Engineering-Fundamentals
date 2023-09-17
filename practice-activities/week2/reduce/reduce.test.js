/**
 * @see list_exercises
 * @module list_exercises.test
 */

import { reduce } from './reduce';

const sum = (a, b) => a + b;

test('Empty list', () => {
  expect(reduce(sum, [])).toStrictEqual(null);
});

// TODO: write more tests
