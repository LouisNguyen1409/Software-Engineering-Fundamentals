NOTE: I think we should turn this into an express server with a POST endpoint, a GET endpoint, and a DELELTE endpoint.

Worth tying exceptions into it, too.


## Lab04 - Primes

[TOC]

## Background

### Rationale
In this task we will complete a function function `factors` in `primes.js` that factorises a number into its prime factors.
The prime factors of a number are all of the prime numbers that together multiply to the original number.

<img src='https://www.mathsisfun.com/numbers/images/factor-tree-48.svg' />

For example, the number `10` has prime factors `[2, 5]` as `2 * 5 = 10`. The number 12 has prime factors `[3, 2, 2]` as `3 * 2 * 2 = 12`.

See the [documentation](https://en.wikipedia.org/wiki/Table_of_prime_factors) for more details.

### Setup
- Please make sure you have completed `lab01_git` prior.
- Copy the SSH clone link from Gitlab and clone this repository on either VLAB or your local machine. 
- In your terminal, change directory (using the `cd` command) into the newly cloned lab. To check if you have done this correctly, type `ls` in this new directory to see if you can see the relevant files (including [primes.js](primes.js)).

### Instructions
Firstly, write a series of failing tests for your `factors` function in a file `primes_test.js`. Ensure your tests have 100% coverage. Then implement the function. 

Edge cases:
* `factors(1) == factors(0) == []`
