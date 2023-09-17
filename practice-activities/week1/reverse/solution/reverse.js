function reverseWords(strings) {
  const result = [];
  for (const s of strings) {
    const w = s.split(' ');
    result.push(w.reverse().join(' '));
  }
  return result;
}

function reverseAlternative(strings) {
  return strings.map(s => s.split(' ').reverse().join(' '));
}

console.log(reverseWords(['hello world', 'goodbye world']));
console.log(reverseAlternative(['hello world', 'goodbye world']));
