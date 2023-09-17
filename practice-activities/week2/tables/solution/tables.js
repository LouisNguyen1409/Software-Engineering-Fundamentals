import promptSync from 'prompt-sync';
const input = promptSync();

function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

const x = getRandomArbitrary(2, 12);
const y = getRandomArbitrary(2, 12);
const correct = x * y;

while (true) {
  const user = parseInt(input(`What is ${x} x ${y} ? `));
  if (user === correct) {
    console.log('Correct!');
    break;
  } else {
    console.log('Incorrect - try again.');
  }
}
