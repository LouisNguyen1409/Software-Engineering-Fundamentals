// Returns the wondrous sequence for a given number.
function wondrous(start) {
  let current = start;
  const sequence = [];

  while (current !== 1) {
    sequence.push(current);
    if (current % 2 === 0) {
      current /= 2;
    } else {
      current = (current * 3) + 1;
    }
  }
  return sequence;
}

export {
  wondrous,
};
