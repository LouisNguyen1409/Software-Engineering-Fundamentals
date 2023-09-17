/**
 * TODO: Complete this file by following the instructions in the lab exercise.
 * Hint: There are many ways of doing this, however the in-built readline module
 *       may be helpful.
 */
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

readline.question('What\'s your name? ', name => {
  console.log(`So you call yourself ${name} huh?`);
  readline.close();
});
