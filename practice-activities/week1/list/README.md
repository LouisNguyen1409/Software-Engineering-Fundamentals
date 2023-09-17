# List Exercises

## Table of Contents
- [List Exercises](#list-exercises)
  - [Table of Contents](#table-of-contents)
  - [Setup](#setup)
  - [Task](#task)
    - [Step 1 - Run the Failing Unit Tests](#step-1---run-the-failing-unit-tests)
    - [Step 2 - Implement the Code and Pass the Tests](#step-2---implement-the-code-and-pass-the-tests)
    - [Step 3 - Write More Tests](#step-3---write-more-tests)
    - [Final Step](#final-step)
  - [Resources](#resources)

## Setup

1. Please make sure you have completed `lab01_git` prior.
1. Copy the SSH clone link from Gitlab and clone this repository on either VLAB or your local machine. 
1. In your terminal, change your directory (using the `cd` command) into the newly cloned lab. To check if you have done this correctly, type `ls` in this new directory to see if you can see the relevant files (including [list_exercises.js](list_exercises.js), [list_exercises.test.js](list_exercises.test.js), [package.json](package.json)).
1. To proceed with this lab, you will need [nodejs](https://nodejs.org/en/). It is available on the CSE machines through the `node` command, although you are encouraged to also [install nodejs](https://nodejs.org/en/download/) on your local machine.

## Task

### Step 1 - Run the Failing Unit Tests

Open `list_exercises.test.js`. There are some basic test cases currently provided in `list_exercises_test.js` for the functions in `list_exercises.js`.

Run these tests using the command `npm test` (you may need to first run `npm install` inside the `week1/list` directory). You will see that the tests fail. This is because we haven't implemented the functions that we are testing yet.

### Step 2 - Implement the Code and Pass the Tests

Implement the function stubs using javascript.

<details>
<summary>Challenge</summary>
Can you think of a way to implement the function stubs using only **one** line of javascript?
</details>

Run these tests with `npm test` to ensure they pass. 

### Step 3 - Write More Tests

Now, in `test_list_exericses.js` add more to each test to make the test suite more exhaustive. Try to add at least two more tests for each test group (`describe`).

When writing a test, consider the following things:

* Do the expects I'm making in the test body match what the test name (function name) says I am testing?
* Does the name of my test provide specific detail to someone reading it?
* Is my function testing one thing, or several things which could be split into smaller tests?

When you've finished writing more tests, run `npm test` again to check your functions still pass.

### Final Step
Well done! Commit and push your code to the master branch of this repository.

## Resources
- [Testing with jest](https://jestjs.io/docs/getting-started)
- [JavaScript Array Methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)