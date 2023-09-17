/**
 * @see list_exercises
 * @module list_exercises.test
 */

import { reverseList, minimum, sumList } from './list_exercises';

/**
 * You can remove or replace these with your own tests.
 * TIP: you may want to explore 'test.each' to reduce test repetition.
 */
describe('Reverse list tests', () => {
  test('Empty list', () => {
    let list = [];
    reverseList(list);
    expect(list).toEqual([]);
  });

  test('Even number of elements', () => {
    let list = [1, 2, 3, 4];
    reverseList(list);
    expect(list).toEqual([4, 3, 2, 1]);
  });

  test('Odd number of elements', () => {
    let list = [1, 2, 3, 4, 5];
    reverseList(list);
    expect(list).toEqual([5, 4, 3, 2, 1]);
  });

  test('Reverse different elements', () => {
    let list = ['string', 2, 'word', 4.12, 5];
    reverseList(list);
    expect(list).toEqual([5, 4.12, 'word', 2, 'string']);
  });
});

describe('Get minimum of list tests', () => {
  // Explanation of construction of a test case
  const testListInput = [1, 2, 10, 4];
  const expectedMinOutput = 1;
  const testCase = [testListInput, expectedMinOutput];

  // Aggregated test cases for minimum()
  const minListCases = [
    testCase,
    [[-10, -5, -15, 0], -15],
    [[-4, 0, -100, 3, 1], -100],
  ];

  // Use test.each to run multiple tests
  // Read more here: https://jestjs.io/docs/api#testeachtablename-fn-timeout
  test.each(minListCases)(
    'Given test list %p returns min %p',
    (testList, expectedResult) => {
      expect(minimum(testList)).toBe(expectedResult);
    }
  );
});

describe('Get sum of list tests', () => {
  const sumListCases = [
    [[], 0],
    [[1], 1],
    [[1, 2, 10, 4], 17],
    [[-2, -5, 0, 10, 3], -5],
  ];
  test.each(sumListCases)(
    'Given test list %p returns sum %i',
    (testList, expectedSum) => {
      expect(sumList([1, 2, 10, 4])).toBe(17);
    }
  );
});
