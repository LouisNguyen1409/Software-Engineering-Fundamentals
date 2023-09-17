import prompt from 'prompt-sync';
const promptFn = prompt();

let lowerBound = 1;
let upperBound = 100;
let gotIt = false;

console.log('Think of a number between 1 and 100! The computer is about to try and guess!');

let guess = Math.floor(Math.random() * 100);
let numberGuesses = 0;
while (gotIt === false) {
  console.log('My guess is: ' + guess);
  const result = promptFn('Is the computer\'s guess too low (L), too high (H), or correct (C)? ');

  if (result === 'L') {
    lowerBound = guess + 1;
  } else if (result === 'H') {
    upperBound = guess - 1;
  } else if (result === 'C') {
    gotIt = true;
  }
  guess = Math.round((lowerBound + upperBound) / 2);
  numberGuesses += 1;
}

console.log(`Got it! That took them ${numberGuesses} guesses`);
