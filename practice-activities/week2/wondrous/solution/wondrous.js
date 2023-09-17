// Returns the wondrous sequence for a given number.
function wondrous(start) {
  if (start === 1) {
    return [start];
  }

  let current = start;
  const sequence = [];

  while (current !== 1) {
    sequence.push(current);
    if (current % 2 === 0) {
      current = Math.floor(current / 2);
    } else {
      current = (current * 3) + 1;
    }
  }

  sequence.push(current);
  return sequence;
}

export {
  wondrous,
};
