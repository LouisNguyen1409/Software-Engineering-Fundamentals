import {
  Madrigal,
  Song,
  createMadrigal,
  createSong,
  extractNamesMixed,
  extractNamesPure,
  madrigalIsSinger,
  sortedMadrigals,
  filterSongsWithMadrigals,
  getMostSpecialMadrigal,
} from './madrigal';

// ========================================================================= //

/**
 * This is NOT a standard way of writing code. The purpose of
 * this function is to stop tsc/ts-node from compiling your code
 * if your type annotation is not consistent with the specification
 * by using comments that starts with "ts-expect-error".
 *
 * DO NOT COPY THIS IN YOUR MAJOR PROJECT OR ANY OTHER LABS.
 *
 * TLDR:
 * - It should compile if your type annotations are correct.
 * - Don't call directly, and don't copy!
 */
function _unusedTypecheck() {
  // @ts-expect-error invalid name type
  createMadrigal(false, 15, 'valid');
  // @ts-expect-error invalid age type
  createMadrigal('Mirabel', false, 'valid');
  // @ts-expect-error invalid gift type
  createMadrigal('Mirabel', 15, false);
  // @ts-expect-error extra argument
  createMadrigal('Mirabel', 15, 'valid', 'extra argument');
  // @ts-expect-error missing argument
  createMadrigal('Mirabel');

  // @ts-expect-error due to invalid name type
  createSong(false, 'Isabella');
  // @ts-expect-error due to invalid singers type
  createSong("We Don't Talk About Bruno", false);
  // @ts-expect-error missing argument
  createSong('Waiting on a Miracle');
  // @ts-expect-error extra argument
  createSong('Waiting on a Miracle', 'Mirabel', 'extra argument');

  // ========================================================================= //

  const luisa = createMadrigal('Luisa', 15, 'Super Strength');
  const surfacePressure = createSong('Surface Pressure', luisa.name);

  // @ts-expect-error invalid list
  extractNamesMixed([1, 2, 3]);
  // @ts-expect-error extra arguments
  extractNamesMixed([luisa], 'extra Argument');
  // @ts-expect-error missing arguments
  extractNamesMixed();

  // @ts-expect-error invalid list
  extractNamesPure([1, 2, 3]);
  // @ts-expect-error extra argument
  extractNamesPure([luisa], 'extra Argument');
  // @ts-expect-error missing arguments
  extractNamesPure();
  // @ts-expect-error mixed of songs and madrigrals
  extractNamesPure([luisa, surfacePressure]);

  // @ts-expect-error invalid madrigal
  madrigalIsSinger('invalid', surfacePressure);
  // @ts-expect-error invalid song
  madrigalIsSinger(luisa, 'invalid');
  // @ts-expect-error extra argument
  madrigalIsSinger(luisa, surfacePressure, 'extra argument');
  // @ts-expect-error missing arguments
  madrigalIsSinger(luisa);

  // @ts-expect-error invalid madrigal list
  sortedMadrigals([1, 2, 3]);
  // @ts-expect-error extra argument
  sortedMadrigals([luisa], 'extra argument');
  // @ts-expect-error missing arguments
  sortedMadrigals();

  // @ts-expect-error invalid madrigal list
  filterSongsWithMadrigals([1, 2, 3], [surfacePressure]);
  // @ts-expect-error invalid song list
  filterSongsWithMadrigals([luisa], [1, 2, 3]);
  // @ts-expect-error extra argument
  filterSongsWithMadrigals([luisa], [surfacePressure], 'extra argument');
  // @ts-expect-error missing arguments
  filterSongsWithMadrigals([luisa]);

  // @ts-expect-error invalid madrigal list
  getMostSpecialMadrigal([1, 2, 3], [surfacePressure]);
  // @ts-expect-error invalid song list
  getMostSpecialMadrigal([luisa], [1, 2, 3]);
  // @ts-expect-error extra argument
  getMostSpecialMadrigal([luisa], [surfacePressure], 'extra argument');
  // @ts-expect-error missing arguments
  getMostSpecialMadrigal([luisa]);
}

// Typescript is smart enough to infer type, so including ": Madrigal" is optional
const mirabel: Madrigal = createMadrigal('Mirabel', 15);
const isabella = createMadrigal('Isabella', 22, 'Flower Creation');

const waitingOnAMiracle: Song = createSong('Waiting on a Miracle', mirabel.name);
const whatElseCanIDo = createSong('What Else Can I Do?', [isabella.name, mirabel.name]);

/*
Sample Output (with different white-space) when using the command:

    $ npm run ts-node src/main.ts

from the root lab directory:
```
{ name: 'Mirabel', age: 15 }
{ name: 'Isabella', age: 22, gift: 'Flower Creation' }
[ 'Mirabel', 'Isabella' ]
[ 'Waiting on a Miracle', 'What Else Can I Do?' ]
[ 'Mirabel', 'Waiting on a Miracle', 'Isabella', 'What Else Can I Do?' ]
true
false
[ { name: 'Mirabel', age: 15 }, { name: 'Isabella', age: 22, gift: 'Flower Creation' } ]
[ { name: 'What Else Can I Do?', singers: [ 'Isabella', 'Mirabel' ] } ]
{ name: 'Mirabel', age: 15 }
```

Use `npm test` for a more comprehensive test suite (in madrigal.test.ts).
*/
console.log(mirabel);
console.log(isabella);
console.log(extractNamesPure([mirabel, isabella]));
console.log(extractNamesPure([waitingOnAMiracle, whatElseCanIDo]));
console.log(extractNamesMixed([mirabel, waitingOnAMiracle, isabella, whatElseCanIDo]));
console.log(madrigalIsSinger(isabella, whatElseCanIDo));
console.log(madrigalIsSinger(isabella, waitingOnAMiracle));
console.log(sortedMadrigals([isabella, mirabel]));
console.log(filterSongsWithMadrigals([isabella], [waitingOnAMiracle, whatElseCanIDo]));
console.log(getMostSpecialMadrigal([isabella, mirabel], [waitingOnAMiracle, whatElseCanIDo]));
