/**
 * @see list_exercises
 * @module list_exercises.test
 */

import { reverseList, minimum, sumList } from './list_exercises';

/**
 * You can remove or replace these with your own tests.
 * TIP: you may want to explore "test.each" to reduce test repetition.
 */
describe('Reverse list tests', () => {
  test('Reverse empty list', () => {
    expect(reverseList([])).toBe([]);
  });

  // TODO: Add more tests here
});

describe('Get minimum of list tests', () => {
  test('Get minimum of positive numbers', () => {
    expect(minimum([1, 2, 10, 4])).toBe(1);
  });

  // TODO: Add more tests here
});

describe('Get sum of list tests', () => {
  test('Get sum of positive numbers', () => {
    expect(sumList([1, 2, 10, 4])).toBe(17);
  });

  // TODO: Add more tests here
});
