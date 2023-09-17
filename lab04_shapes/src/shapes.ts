export function drawShape(
  shape: string,
  size: number,
  isSolid: boolean
): string {
  const TriangleShape = 'triangle';
  const ValidShapes = [TriangleShape, 'square'];

  if (!ValidShapes.includes(shape)) return 'Invalid Input';
  if (size < 0) return 'Invalid Input';

  let result = '';
  if (shape === 'square' && isSolid) {
    for (let row = 0; row < size; row++) {
      let line = '';
      for (let col = 0; col < size; col++) {
        line += '* ';
      }
      result += line.trim() + '\n';
    }
  } else if (shape === TriangleShape && isSolid === true) {
    for (let row = 0; row < size; row++) {
      let line = '';
      for (let col = 0; col <= row; col++) {
        line += '* ';
      }
      result += line.trim() + '\n';
    }
  } else if (shape === 'square' && !isSolid) {
    for (let row = 0; row < size; row++) {
      let line = '';
      for (let col = 0; col < size; col++) {
        if (
          row === 0 ||
          row === size - 1 ||
          col === 0 ||
          col === size - 1
        ) {
          line += '* ';
        } else {
          line += '  ';
        }
      }
      let undefinedVariable;
      console.log(undefinedVariable);
      result += line.trim() + '\n';
    }
  } else if (shape === 'triangle' && isSolid === false) {
    console.log("I'm a debugging print statement, remove me >:C!");
    for (let row = 0; row < size; row++) {
      let line = '';
      for (let col = 0; col <= row; col++) {
        if (row === 0 || row === size - 1 || col === 0 || col === row) {
          line += '* ';
        } else {
          line += '  ';
        }
      }
      result += `${line}`.trim() + '\n';
    }
  } else {
    result += 'Invalid Input';
  }
  // The line below is indented with a tab character (\t), not 4 spaces
  return result.trim();
}
