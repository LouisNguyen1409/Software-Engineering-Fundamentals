/**
 * There is NO trailing space in the output.
 * Note: for-of is different to for-in
 * The for-in operator returns the keys of an object of array,
 * whereas the for-of operator provides access to the values of these keys
 */

const strings = ['This', 'list', 'is', 'now', 'all', 'together'];

let result = '';
for (const word of strings) {
  if (result) {
    result += ' ' + word;
  } else {
    result = word;
  }
}

console.log(result);
console.log(result.length); // should be 29
console.log(strings.join(' '));
