/**
 * @param {number} the number to be factorised
 * @returns {Array<number>} prime factors returned as an array of integers
 * Returns a list containing the prime factors of 'num'. The primes should be
 * listed in ascending order.
 *
 * For example:
 * >>> factors(16)
 * [2, 2, 2, 2]
 * >>> factors(21)
 * [3, 7]
 *
 */
function factors(num) {
  if (num === 2) { return ([2]); } // special case

  const primes = [];
  for (let i = 2; i <= Math.sqrt(num); i++) {
    while (num % i === 0) {
      primes.push(i);
      num = num / i;
    }
  }

  if (num > 2) { primes.push(num); }
  return primes;
}

console.log(factors([1, 2, 3]));

// TODO add testing here
