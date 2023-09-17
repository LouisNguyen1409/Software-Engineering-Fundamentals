export function countChar(str) {
  // Counts the number of occurrences of each character in a string.
  // The result should be an associative array where the key is the
  // character and the value is its count.

  // For example,
  // console.log(countChar("HelloOo!"))
  // {H: 1, e: 1, l: 2, o: 2, O: 1, '!': 1}

  const counts = {};
  for (const s of str) {
    if (counts[s]) {
      counts[s]++;
    } else {
      counts[s] = 1;
    }
  }
  return counts;
}

console.log(countChar('HelloOo!'));
