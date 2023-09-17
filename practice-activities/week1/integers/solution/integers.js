/*
 * Note: for-of is different to for-in
 * The for-in operator returns the keys of an object of array,
 * whereas the for-of operator provides access to the values of these keys
 */

const integers = [1, 2, 3, 4, 5];
integers.push(6);

let sum = 0;
for (const num of integers) {
  sum += num;
}

/* An alternative would be:
let sum = 0;
for (let i = 0; i < integers.length; i++) {
  sum += integers[i];
}
*/

console.log(sum);
