/**
 * NOTE: Tests should be written first, before implementing the functions below.
 * @module reduce
 */

/**
 * Applies supplied function on each element of the array in order,
 * passing in return value of from calculation on preceding element,
 * resulting in a single value.
 *
 * @param {function} fn
 * @param {Object[]} ls
 * @returns {Object} and null on an empty list
 */
export function reduce(fn, ls) {
  if (ls.length === 0) {
    return null;
  }
  if (ls.length === 1) {
    return ls[0];
  }
  return fn(reduce(fn, ls.slice(0, ls.length - 1)), ls[ls.length - 1]);
}
