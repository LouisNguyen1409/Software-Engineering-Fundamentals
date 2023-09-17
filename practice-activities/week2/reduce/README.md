## Reduce

### Setup
1. Please make sure you have completed `lab01_git` prior.
1. Copy the SSH clone link from Gitlab and clone this repository on either VLAB or your local machine. 
2. In your terminal, change your directory (using the `cd` command) into the newly cloned lab. To check if you have done this correctly, type `ls` in this new directory to see if you can see the relevant files (including [reduce.js](reduce.js), [reduce.test.js](reduce.test.js)).
3. To proceed with this lab, you will need [nodejs](https://nodejs.org/en/). It is available on the CSE machines through the `node` command, although you are encouraged to also [install nodejs](https://nodejs.org/en/download/) on your local machine.

### Task
Implement the `reduce` function in `reduce.js`.

The `reduce` function takes a function and a list and applies the function over the list:

`reduce(fn, ls)` takes the first two values from the list `ls`, and uses it as the parameters to call the function `fn`. It feeds the return value from the function `fn` and the next value from the list back in to the function `fn` and repeats until the list `ls` is empty. If the list only has one element then it returns the first element. If the list is empty then it returns `null`. The original list passed in should not be modified.

```bash
reduce(fn, [1,2,3,4,5])                  -> fn(fn(fn(fn(1,2),3),4),5)
reduce(fn, [])                           -> None
reduce(fn, [1])                          -> 1

reduce((x, y) => x + y, [1,2,3,4,5]) -> 15
reduce((x, y) => x + y, 'abcdefg')   -> 'abcdefg'
reduce((x, y) => x + y, [1,2,3,4,5]) -> 120
```

Write tests for your reduce function in `reduce.test.js` and ensure they have 100% *branch* coverage.
```bash
$ npx jest --coverage
```

Ensure your code is `eslint` compliant.
```
npx eslint
```
You may need to `npm install` the relevant packages if the above commands are failing.

You may not use the `reduce` method from the global `Array` object. 
