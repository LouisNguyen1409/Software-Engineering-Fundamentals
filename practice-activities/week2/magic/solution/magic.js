function magic(input) {
    let size = input.length
    let flatNumbers = new Set();
    let checkSum = 0;

    // check size and uniqueness valid first
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            flatNumbers.add(input[i][j]);
        }
    }
    if (flatNumbers.size != size**2) {
        return "Invalid data: missing or repeated number";
    }

    // sum rows
    for (let i = 0; i < size; i++) {
        let rowSum = 0;
        for (let j = 0; j < size; j++) {
            if (i == 0 || j == size - 1) {
                // row 1, last col
                checkSum = rowSum + input[i][j]
            }
            rowSum += input[i][j];
        }
        if (rowSum != checkSum) {
            return 'Not a magic square'
        }
    }

    // check column sum
    for (let i = 0; i < size; i++) {
        let colSum = 0;
        for (let j = 0; j < size; j++) {
            colSum += input[i][j];
        }
        if (colSum != checkSum) {
            return 'Not a magic square'
        }
    }
    // passed checks
    return "Magic square";
}

export { magic };