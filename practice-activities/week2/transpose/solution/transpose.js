/*
Given a matrix, calculate its transpose. Transposing a matrix swaps its rows
with its columns, so the element at position [i, j] of the matrix is now at
position [j, i].

Params:
    matrix (type: number[][]): A matrix represented as a 2D array, where each inner
    array is of the same length.

Returns:
    number[][]: The transposed matrix, represented as a lists of lists where
    each inner list is the same length.

Returns
    null: If the inner lists of the argument are not all of the same
    length.
*/
export function transpose(matrix) {
  const allLengths = new Set(matrix.map(r => r.length));
  if (allLengths.size > 1) {
    return null;
  }

  if (matrix.length === 0 || matrix[0].length === 0) {
    return [];
  }

  return matrix[0].map((r, c) => matrix.map(row => row[c]));
}
