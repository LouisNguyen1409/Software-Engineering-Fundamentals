// program which returns a list of n fibonacci numbers
// https://www.programiz.com/javascript/examples/fibonacci-series
function fib(n) {
    let a = 0, b = 1, next;
    let sequence = [];
    for (let i = 1; i <= n; i++) {
        sequence.push(a);
        next = a + b;
        a = b;
        b = next;
    }
    return sequence;
}

// recursive version
// f(n) = f(n-1) + f(n-2)
function fibRec(n) {
    if (n == 0) {
        return [0];
    } else if (n == 1) {
        return [0, 1];
    }
    let fibs = fib(n - 1);
    fibs.push(fibs[n - 2] + fibs[n - 3]);
    return fibs;
}

export { fibRec };