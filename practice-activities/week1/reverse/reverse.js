function reverseWords(strings) {
  return [];
}

console.log('Test 0: reverseWords([])');
console.log('Expect: []');
console.log('Output:', reverseWords([]));
console.log();

console.log("Test 1: reverseWords([''])");
console.log("Expect: ['']");
console.log('Output:', reverseWords(['']));
console.log();

console.log("Test 2: reverseWords(['hello'])");
console.log("Expect: [ 'hello' ]");
console.log('Output:', reverseWords(['hello']));
console.log();

console.log("Test 3: reverseWords(['hello world', 'world hello'])");
console.log("Expect: [ 'world hello', 'hello world' ]");
console.log('Output:', reverseWords(['hello world', 'world hello']));
console.log();

console.log("Test 4: reverseWords(['Hello World', 'I am here'])");
console.log("Expect: [ 'here am I', 'World Hello' ]");
console.log('Output:', reverseWords(['Hello World', 'I am here']));
console.log();

console.log("Test 5: reverseWords(['one two three', 'four five six', 'seven eight nine'])");
console.log("Expect: [ 'three two one', 'six five four', 'nine eight seven' ]");
console.log('Output:', reverseWords(['one two three', 'four five six', 'seven eight nine']));
console.log();
