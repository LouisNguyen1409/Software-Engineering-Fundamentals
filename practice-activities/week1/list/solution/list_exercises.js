/**
 * NOTE: Tests should be written first, before implementing the functions below.
 * @module list_exercises
 */

/**
 * Reverse the list (in-place). Do NOT return original list.
 * See in-place definition: https://en.wikipedia.org/wiki/In-place_algorithm
 */
export function reverseList(integers) {
  // Method 1: Use for loop and destructuring assignment to swap
  // We use Math.floor to remove decimals, but we could also use:
  // - Math.trunc(), parseInt(), Math.round(), toFixed()
  /*
  for (let idx = 0; idx < Math.floor(integers.length / 2); idx++) {
    let reverseIdx = integers.length - 1 - idx;
    [integers[idx], integers[reverseIdx]] = [integers[reverseIdx], integers[idx]]
  }
  */

  // Method 2: Use built-in Array.prototype.reverse() method
  integers.reverse();
}

/**
 * Find and return the lowest number in the list.
 */
export function minimum(integers) {
  // Method 1: Use for-of loop
  let min = Number.MAX_VALUE;
  for (const num of integers) {
    if (num < min) {
      min = num;
    }
  }
  // return min;

  // Method 2: Use in-built Math.min method
  return Math.min(...integers);
}

/**
 * Return the sum of all numbers in the list.
 */
export function sumList(integers) {
  // Method 0: Using a while loop
  /*
  let aggregate = 0;
  let j = 0;
  while (j < integers.length) {
    aggregate += integers[j];
    j++;
  }
  return aggregate;
  */

  // Method 1: Using a for-in loop
  /*
  let total = 0;
  for (let i = 0; i < integers.length; i++) {
    total += integers[i];
  }
  return total;
  */

  // Method 2: Using a for-of loop
  /*
  let sum = 0;
  for (const num of integers) {
    sum += num;
  }
  return sum;
  */

  // Method 3: Use of Array.prototype.reduce
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
  return integers.reduce((partialSum, nextNum) => partialSum + nextNum, 0);
}
