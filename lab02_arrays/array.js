/**
 * Compute the sum of the integer array.
 * If the array is empty, the sum is 0.
 *
 * @param {Array<number>} array of integers
 * @returns {number} the sum of the array
 */
function arraySum(array) {
  let total = 0;
  for (const num of array) {
    total += num;
  }
  return total;
}

/**
 * Compute the product of the given integer array.
 * If the array is empty, the product is 1.
 *
 * @param {Array<number>} array of integers
 * @returns {number} the product of the array
 */
function arrayProduct(array) {
  // FIXME
  let product = 1;
  for (const num of array) {
    product *= num;
  }
  return product;
}

/**
 * Find the smallest number in the array
 *
 * @param {Array<number>} array of integers
 * @returns {number|null} the smallest number in the array, or
 * null if the array is empty
 */
function arrayMin(array) {
  // FIXME
  let min = null;
  if (array.length === 0) {
    return min;
  }

  min = array[0];
  for (const num of array) {
    if (min > num) {
      min = num;
    }
  }
  return min;
}

/**
 * Find the largest number in the array
 *
 * @param {Array<number>} array of integers
 * @returns {number|null} the largest number in the array, or
 * null if the array is empty
 */
function arrayMax(array) {
  // FIXME
  let max = null;
  if (array.length === 0) {
    return max;
  }
  for (const num of array) {
    if (max < num) {
      max = num;
    }
  }
  return max;
}

/**
 * Determine if the array contains a particular element.
 *
 * @param {Array<number>} array of integers
 * @param {number} item integer to check
 * @returns {boolean} whether the integer item is in the given array
 */
function arrayContains(array, item) {
  // FIXME: true or false instead of null
  const result = false;
  for (const num of array) {
    if (item === num) {
      return true;
    }
  }
  return result;
}

/**
 * Create an array that is the reversed of the original.
 *
 * WARNING: a reminder that the original(s) array must not be modified.
 * You can create new arrays if needed.
 *
 * @param {Array<number>} array of integers
 * @returns {Array<number>} a new reversed array
 */
function arrayReversed(array) {
  // FIXME
  const new_array = [];
  for (const index in array) {
    new_array[index] = array[array.length - 1 - index];
  }
  return new_array;
}

/**
 * Returns the first element in the array
 *
 * @param {Array<number>} array of integers
 * @returns {number|null} the first element in the array,
 * or null if the array is empty
 */
function arrayHead(array) {
  // FIXME
  if (array.length === 0) {
    return null;
  }
  return array[0];
}

/**
 * Return all elements in the array after the head.
 *
 * WARNING: a reminder that the original(s) array must not be modified.
 * You can create new arrays if needed.
 *
 * @param {Array<number>} array of integers
 * @returns {Array<number>|null} an array of elements excluding the head,
 * or null if the input array is empty
 */
function arrayTail(array) {
  // FIXME
  if (array.length === 0) {
    return null;
  }
  return array[array.length - 1];
}

/**
 * Given two arrays, multiply the elements at each index from arrays and store
 * the result in a third array. If the given two arrays differ in length,
 * excess elements of the larger array will be added on at the end.
 *
 * For example,
 *     [1, 3, 2]
 *   x [2, 4, 3, 5, 9]
 *   -----------------
 *   = [2, 12, 6, 5, 9]
 *
 * The result will be the same if array1 and array2 are swapped.
 *
 * @param {Array<number>} array1 of integers
 * @param {Array<number>} array2 of integers
 * @returns {Array<number>} array1 x array2 at each index
 */
function arraysMultiply(array1, array2) {
  // FIXME
  let new_array = [];
  let array = [];
  if (array1.length <= array2.length) {
    array = array1;
  } else if (array1.length >= array2.length) {
    array = array2;
  } 

  for (let index in array) {
    new_array.push(array1[index] * array2[index]);
  }

  if (array1 != array) {
    for (let i = array.length; i < array1.length; i++) {
      new_array.push(array1[i]);
    }
  } else if (array2 != array) {
    for (let i = array.length; i < array2.length; i++) {
      new_array.push(array2[i]);
    }
  }

  return new_array;
}

/**
 * Create a third array containing common elements between two arrays.
 *
 * Each element in the first array can map to at most one element
 * in the second array, and vice versa (one-to-one relationship).
 *
 * Duplicated elements in each array are treated as separate entities.
 *
 * The order is determined by the first array.
 *
 * A few examples,
 *   arraysCommon([1,1], [1,1,1]) gives [1,1]
 *   arraysCommon([1,1,1], [1,1]) gives [1,1]
 *   arraysCommon([1,2,3,2,1], [5,4,3,2,1]) gives [1,2,3]
 *   arraysCommon([1,2,3,2,1], [2,2,3,3,4]) gives [2,3,2]
 *   arraysCommon([1,4,1,1,5,9,2,7], [1,8,2,5,1]) gives [1,1,5,2]
 *
 * WARNING: a reminder that the original array(s) must not be modified.
 * You can create new arrays if needed.
 *
 * @param {Array<number>} array1 of integers
 * @param {Array<number>} array2 of integers
 * @returns {Array<number>} number of common elements between two arrays
 */
function arraysCommon(array1, array2) {
  // FIXME
  const new_array = [];
  const frequency_array1 = {};
  const frequency_array2 = {};
  
  for (let i = 0; i < array1.length; i++) {
    const num = array1[i];
    frequency_array1[num] = frequency_array1[num] ? frequency_array1[num] + 1 : 1;
  }

  for (let i = 0; i < array2.length; i++) {
    const num = array2[i];
    frequency_array2[num] = frequency_array2[num] ? frequency_array2[num] + 1 : 1;
  }


  for (let i = 0; i < array1.length; i++) {
    const num = array1[i];
    if (array2.includes(num) === true && frequency_array1[num] > 0 && frequency_array2[num] > 0) {
      new_array.push(num);
      frequency_array1[num] -= 1;
      frequency_array2[num] -= 1;
    }
  }

  return new_array;
}

// ========================================================================= //

/**
 * Debugging code
 */

console.assert(arraySum([1, 2, 3, 4]) === 10, "arraySum([1,2,3,4]) === 10");
console.assert(
  arrayProduct([1, 2, 3, 4]) === 24,
  "arrayProduct([1,2,3,4]) === 24"
);

/**
 * NOTE: you can't directly compare two arrays with `===`, so you may need
 * to come up with your own way of comparing arrays this week. For example, you
 * could use console.log() and observe the output manually.
 */
console.log();
console.log("Testing : arrayCommon([1,2,3,2,1], [2,2,3,3,4])");
console.log("Received:", arraysCommon([1, 2, 3, 2, 1], [2, 2, 3, 3, 4]));
console.log("Expected: [ 2, 3, 2 ]");
console.log();

// TODO: your own debugging here

// Debug arraySum
console.log();
console.log("Testing : arraySum([1, 2, 3, 4])");
console.log("Received:", arraySum([1, 2, 3, 4]));
console.log("Expected: 10");
console.log();

console.log();
console.log("Testing : arraySum([])");
console.log("Received:", arraySum([]));
console.log("Expected: 0");
console.log();

// Debug arrayProduct
console.log();
console.log("Testing : arrayProduct([1, 2, 3, 4])");
console.log("Received:", arrayProduct([1, 2, 3, 4]));
console.log("Expected: 24");
console.log();

console.log();
console.log("Testing : arrayProduct([])");
console.log("Received:", arrayProduct([]));
console.log("Expected: 1");
console.log();

// Debug arrayMin
console.log();
console.log("Testing : arrayMin([1, 2, 3, 4])");
console.log("Received:", arrayMin([1, 2, 3, 4]));
console.log("Expected: 1");
console.log();

console.log();
console.log("Testing : arrayMin([])");
console.log("Received:", arrayMin([]));
console.log("Expected: null");
console.log();

// Debug arrayMax
console.log();
console.log("Testing : arrayMax([1, 2, 3, 4])");
console.log("Received:", arrayMax([1, 2, 3, 4]));
console.log("Expected: 4");
console.log();

console.log();
console.log("Testing : arrayMax([])");
console.log("Received:", arrayMax([]));
console.log("Expected: null");
console.log();

// Debug arrayContains
console.log();
console.log("Testing : arrayContains([1, 2, 3, 4], 3)");
console.log("Received:", arrayContains([1, 2, 3, 4], 3));
console.log("Expected: true");
console.log();

console.log();
console.log("Testing : arrayContains([1, 2, 3, 4], 5)");
console.log("Received:", arrayContains([1, 2, 3, 4], 5));
console.log("Expected: false");
console.log();

// Debug arrayReversed
console.log();
console.log("Testing : arrayReversed([1, 2, 3, 4])");
console.log("Received:", arrayReversed([1, 2, 3, 4]));
console.log("Expected: [4, 3, 2, 1]");
console.log();

// Debug arrayHead
console.log();
console.log("Testing : arrayHead([1, 2, 3, 4])");
console.log("Received:", arrayHead([1, 2, 3, 4]));
console.log("Expected: 1");
console.log();

console.log();
console.log("Testing : arrayHead([])");
console.log("Received:", arrayHead([]));
console.log("Expected: null");
console.log();

// Debug arrayTail
console.log();
console.log("Testing : arrayTail([1, 2, 3, 4])");
console.log("Received:", arrayTail([1, 2, 3, 4]));
console.log("Expected: 4");
console.log();

console.log();
console.log("Testing : arrayTail([])");
console.log("Received:", arrayTail([]));
console.log("Expected: null");
console.log();

// Debug arraysMultiply
console.log();
console.log("Testing : arraysMultiply([1, 3, 2], [2, 4, 3, 5, 9])");
console.log("Received:", arraysMultiply([1, 3, 2], [2, 4, 3, 5, 9]));
console.log("Expected: [2, 12, 6, 5, 9]");
console.log();

console.log();
console.log("Testing : arraysCommon([1,1], [1,1,1])");
console.log("Received:", arraysCommon([1,1], [1,1,1]));
console.log("Expected: [1,1]");
console.log();

console.log();
console.log("Testing : arraysCommon([1,1,1], [1,1])");
console.log("Received:", arraysCommon([1,1,1], [1,1]));
console.log("Expected: [1,1]");
console.log();

console.log();
console.log("Testing : arraysCommon([1,2,3,2,1], [5,4,3,2,1])");
console.log("Received:", arraysCommon([1,2,3,2,1], [5,4,3,2,1]));
console.log("Expected: [1,2,3]");
console.log();

console.log();
console.log("Testing : arraysCommon([1,4,1,1,5,9,2,7], [1,8,2,5,1])");
console.log("Received:", arraysCommon([1,4,1,1,5,9,2,7], [1,8,2,5,1]));
console.log("Expected: [1,1,5,2]");
console.log();