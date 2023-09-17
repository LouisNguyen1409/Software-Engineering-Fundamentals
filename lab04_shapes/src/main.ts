import { drawShape } from './shapes';

console.log('Solid Square of Size 5');
console.log(drawShape('square', 5, true));
console.log();

console.log('Solid Triangle of Size 5');
console.log(drawShape('triangle', 5, true));
console.log();

console.log('Hollow Square of Size 5');
console.log(drawShape('square', 5, false));
console.log();

console.log('Hollow Triangle of Size 5');
console.log(drawShape('triangle', 5, false));
