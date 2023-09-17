# Lab03 Holidays

![Estimated completion time](https://img.shields.io/badge/Estimated%20Time-2%20hours-7FFF7F)
&nbsp;
![Overall Difficulty](https://img.shields.io/badge/Overall%20Difficulty-⭐%20⭐-3498DB)
&nbsp;
![Code Assessed](https://img.shields.io/badge/Code%20Assessed-yes-darkgreen)
&nbsp;
![Eslint Assessed](https://img.shields.io/badge/Style%20Assessed-no-FFC0CB)
&nbsp;
![Test Quality Assessed](https://img.shields.io/badge/Test%20Quality%20Assessed-no-FEDC56)
&nbsp;

[TOC]

## Due Date

Week 4 Monday 5:00 pm [Sydney Local Time](https://www.timeanddate.com/worldclock/australia/sydney)

## Background

### Rationale

Everybody loves holidays, and your client is no exception!

You have been approached with a problem - your client wishes to know which day of the week Christmas, Easter and Valentine's day would fall on in a particular year, regardless of whether it is in the past, present or future.

Being a clever and efficient software engineer, you knew that writing a date-time library yourself could only bring forth pain and suffering. Fortunately, the wheels do not need to be re-invented for you have recently acquired infinite wisdom through the [Node Package Manager (npm)](https://docs.npmjs.com/about-npm).

### Getting Started

- If you are working on a CSE machine (e.g. via VLAB), ensure that you've run the command `1531 setup`. You only need to do this once at the beginning of the course.
- Please make sure you have completed `lab03_password` prior.
- Copy the SSH clone link from Gitlab and clone this repository on either VLAB or your local machine.
- In your terminal, change your directory (using the `cd` command) into the newly cloned lab. To check if you have done this correctly, type `ls` in this new directory to see if you can see the relevant files (including [holidays.js](holidays.js)).

### Package Installation

1. Open [package.json](package.json) and look under the key `"devDependencies"`. We have added these development packages from `lab03_password` for you.

1. Quickly install the packages with the command:

   ```shell
   $ npm install # shortcut: npm i
   ```

1. Under `"scripts"`, make the following changes:
   ```json
   "scripts": {
       "test": "jest",
   }
   ```

For this exercise, we will be using the following libraries:

- [date-fns](https://www.npmjs.com/package/date-fns) for parsing dates
- [date-fns-holiday-us](https://www.npmjs.com/package/date-fns-holiday-us) for useful holiday functions
- [prompt-sync](https://www.npmjs.com/package/prompt-sync) for reading user input from the command line

1. You can install all three packages in one command with:

   ```shell
   $ npm i date-fns date-fns-holiday-us@0.2.1 prompt-sync
   ```

   Note that for date-fns-holiday-us, we are installing the specific version 0.2.1.

1. Open [package.json](package.json) and ensure that these packages appear under the key `"dependencies"`, e.g
   ```json
   // Note: Your version number may differ
   "dependencies": {
     "date-fns": "^2.28.0",
     "date-fns-holiday-us": "^0.2.1",
     "prompt-sync": "^4.2.0"
   }
   ```
1. Use git status, add, commit and push your [package.json](package.json) and [package-lock.json](package-lock.json).

### Interface: Functions

#### Note:
The return type `holidaysArray` is an array itself (`[...]`), rather than an object with this key (i.e. not`{ holidaysArray }`).

<table>
  <tr>
    <th>Name & Description</th>
    <th>Parameters</th>
    <th>Return Type</th>
    <th>Errors</th>
  </tr>
  <tr>
    <td>
        <code>holidaysInRange</code><br /><br />
        Given a starting year and an ending year:
        <ul>
            <li>If <code>start</code> is not at least 325, return an empty array.</li>
            <li>If <code>start</code> is strictly greater than <code>end</code>, return an empty array.</li>
            <li>Otherwise, return an array of objects containing information about the Valentine,
          Easter and Christmas date strings in the given (inclusive) range.</li>
        </ul>
        <b>Difficulty</b>: ⭐⭐⭐
    </td>
    <td>
        (start, end)
    </td>
    <td>
        <code>holidaysArray</code>
    </td>
    <td>
        N/A
    </td>
  </tr>
  <tr>
    <td>
        <code>main</code><br /><br />
        Reads a starting year and an ending year from the user and displays (with <code>console.log</code>) the
        values returned by the <code>holidaysInRange</code> function above.
        <br/><br/>
        Note:
        <ul>
            <li>
                See further below for some expected behaviour of the main function.
            </li>
        </ul>
        <b>Difficulty</b>: ⭐
    </td>
    <td>
        (start, end)
    </td>
    <td>
        <code>undefined</code>
    </td>
    <td>
        N/A
    </td>
</table>

### Interface: Data Types

| Variable Name | Type                                                                                          |
| ------------- | --------------------------------------------------------------------------------------------- |
| start         | `number`, specifically integer                                                                |
| end           | `number`, specifically integer                                                                |
| valentinesDay | `string`, e.g. "Sunday, 14.02.1971"                                                           |
| easter        | `string`, e.g. "Sunday, 11.04.1971"                                                           |
| christmas     | `string`, e.g. "Saturday, 25.12.1971"                                                         |
| holidaysArray | `Array` of objects, where each object contains the keys `{valentinesDay, easter, christmas}` |
| undefined | This means you do not need to return anything! |

The month and day should be 0-padded to 2 digits, and the year should be 0-padded to have a minimum of 4 digits (yyyy). For example, if the following years are within the range, the expected year format is:

- 325 => 0325
- 2000 => 2000
- 20000 => 20000

## Task

### Writing Tests (optional)

For this lab, testing has been made optional (not assessed). However, you are still advised to write them to gain confidence that your code behaves as expected.

In [holidays.test.js](holidays.js), complete a test suite for `holidaysInRange`. You should aim to cover _different_ cases for the function.

You do not need to write tests for the `main` function (beyond the scope of this course).

You may find the following resource useful:

- https://www.calendar-365.com/holidays/1970.html
- Try changing `1970` to a different year in the link above
- Note: The site does not support years before 1000 - however, similar to your implementation, our automarking will rely solely on the [date-fns-holiday-us](https://www.npmjs.com/package/date-fns-holiday-us) package so these cases are not a cause for concern.

### Implementation

In [holidays.js](holidays.js), implement the function `holidaysInRange` according to its documentation.

This exercise is difficult to complete without using the libraries provided. You may want to spend some time reading the documentation for
[date-fns](https://www.npmjs.com/package/date-fns) and [date-fns-holiday-us](https://www.npmjs.com/package/date-fns-holiday-us) before starting.

Ensure that your code passes all of the written tests before submitting it.

### Main - Reading Inputs from Commandline

In the `main` function, use [prompt-sync](https://www.npmjs.com/package/prompt-sync) to read the `start` and `end` year from the user and print the output of `holidaysInRange` to `stdout`. This function is imported and called in [main.js](main.js).

Note that [prompt-sync](https://www.npmjs.com/package/prompt-sync) reads inputs as strings, so you will need to use convert them to integers using `parseInt()`!

Below is an example of how [prompt-sync](https://www.npmjs.com/package/prompt-sync) can be used to read a string and print it out to stdout:

<details close>
<summary>click to view</summary>

```js
import promptSync from "prompt-sync";

function main() {
  const prompt = promptSync();
  const string = prompt("Enter a message: "); // has type "string"
  console.log(string);
}

// Note: This is already done for you in main.js.
// You should NOT call the main function inside holidays.js, otherwise your tests
// will not run to completion when importing from holidays.js
main();
```

</details>

Here are a few examples (it is fine if your output differs by white space):

```shell
$ node main.js
Enter start: 1970                # NOTE: user enters 1970
Enter end: 1972                  # NOTE: user enters 1972
[
  {
    valentinesDay: 'Saturday, 14.02.1970',
    easter: 'Sunday, 29.03.1970',
    christmas: 'Friday, 25.12.1970'
  },
  {
    valentinesDay: 'Sunday, 14.02.1971',
    easter: 'Sunday, 11.04.1971',
    christmas: 'Saturday, 25.12.1971'
  },
  {
    valentinesDay: 'Monday, 14.02.1972',
    easter: 'Sunday, 02.04.1972',
    christmas: 'Monday, 25.12.1972'
  }
]
```

`Start` is less than 325:

```shell
$ node main.js
Enter start: 324
Enter end: 325
[]
```

## Tips

1. Avoid manually parsing the date string format yourself - use the provided libraries!
1. You may not use any libraries other than the ones listed unless mentioned otherwise by our course staff.

## Submission

- Use `git` to `add`, `commit`, and `push` your changes on your master branch.
- Check that your code has been uploaded to your Gitlab repository on this website (you may need to refresh the page).

**If you have pushed your latest changes to master on Gitlab no further action is required! At the due date and time, we automatically collect your work from what's on your master branch on Gitlab.**

Afterwards, assuming you are working on a CSE machine (e.g. via VLAB), we strongly recommend that you remove your `node_modules` directory with the command:
```shell
$ rm -rf node_modules
```
This is because CSE machines only allow each user to have a maximum of 2GB, so you will eventually run out of storage space. It is always possible to `npm install` your packages again!


## Additional Information

### Sample package.json

<details>

<summary>Click to view our sample package.json</summary><br/>

**Note**:

1. The main keys to pay attention to are `"scripts"`, `"dependencies"` and `"devDependencies"`.
1. It is fine if the versions of your packages are newer.

```json
{
  "name": "lab03_holidays",
  "version": "1.0.0",
  "description": "[TOC]",
  "type": "module",
  "main": "holidays.js",
  "scripts": {
    "test": "jest"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@babel/preset-env": "^7.17.10",
    "jest": "^28.1.0"
  },
  "dependencies": {
    "date-fns": "^2.28.0",
    "date-fns-holiday-us": "^0.2.1",
    "prompt-sync": "^4.2.0"
  }
}
```

</details>
