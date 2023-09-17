# Lab03 - Academics

![Estimated completion time](https://img.shields.io/badge/Estimated%20Time-6%20hours-7FFF7F)
&nbsp;
![Overall Difficulty](https://img.shields.io/badge/Overall%20Difficulty-⭐%20⭐%20⭐-3498DB)
&nbsp;
![Code Assessed](https://img.shields.io/badge/Code%20Assessed-yes-darkgreen)
&nbsp;
![Eslint Assessed](https://img.shields.io/badge/Style%20Assessed-no-FFC0CB)
&nbsp;
![Test Quality Assessed](https://img.shields.io/badge/Test%20Quality%20Assessed-yes-FEDC56)
&nbsp;

[TOC]

## Due Date

Week 4 Monday 5:00 pm [Sydney Local Time](https://www.timeanddate.com/worldclock/australia/sydney)

## Background

### Rationale

As a software engineer, it is important to quickly adapt to changing requirements. Seeing your success from lab01, the university has reached out again for help with redesigning its entire academic-course system.

You were presented with a new set of requirements, including the admission of new academics and courses to the system. Any design decisions and inner workings of your software are left to your professional judgement - the university is only interested in the input/output from the interface.

However, being the brilliant engineer that you are, you will of course ensure that your software is robust and flexible for future changes.

### Getting Started

- If you are working on a CSE machine (e.g. via VLAB), ensure that you've run the command `1531 setup`. You only need to do this once at the beginning of the course.
- Please make sure you have completed `lab03_password` prior.
- Copy the SSH clone link from Gitlab and clone this repository on either VLAB or your local machine. 
- In your terminal, change your directory (using the `cd` command) into the newly cloned lab. To check if you have done this correctly, type `ls` in this new directory to see if you can see the relevant files (including [academics.js](academics.js)).

### Package Installation

1. Open [package.json](package.json) and look under the key `"devDependencies"`. We have added these development packages from `lab03_password` for you:
    ```json
    "devDependencies": {
      "@babel/preset-env": "^7.17.10",
      "jest": "^28.1.0"
    }
    ```

1. Use the command below to install all `"devDependencies"` (and also `"dependencies"`, although none is needed in this lab):
    ```shell
    $ npm install # shortcut: npm i
    ```

1. Under `"scripts"`, make the following changes: 
    ```json
    "scripts": {
        "test": "jest"
    }
    ```

1. Use git status, add, commit and push your [package.json](package.json) and [package-lock.json](package-lock.json).

### Interface: Functions

- The functions from lab01_academics are no longer a part of the interface. However, you are welcome to copy and repurpose them in your code if you wish.
- For many functions below, the first parameter, `academicId`, is only used for verifying that the academic
that is calling the function exists. You may not need to use this for any other purpose, and this is fine!
- For error cases, you can
    ```javascript
    return { error: 'a relevant error message of your choice.' }
    ```

<table>
  <tr>
    <th>Name & Description</th>
    <th>Parameters</th>
    <th>Return Type (Object)</th>
    <th>Errors</th>
  </tr>
  <tr>
    <td>
        <code>academicCreate</code><br /><br />
        Creates a new academic, returning an object containing a unique academic id.
        <br/><br/><b>Difficulty</b>: ⭐
    </td>
    <td>
        <code>(name, hobby)</code>
    </td>
    <td>
        <code>{academicId}</code>
    </td>
    <td>
        Return <code>{error}</code> if:
        <ul>
            <li>The <code>name</code> is an empty string, <code>""</code></li>
            <li>The <code>hobby</code> is an empty string, <code>""</code></li>
        </ul>
    </td>
  </tr>
  <tr>
    <td>
        <code>courseCreate</code><br /><br />
        Creates a new course, returning an object containing a unique course id. The academic who created the course is both a staff and a member.
        <br/><br/><b>Difficulty</b>: ⭐
    </td>
    <td>
        <code>(academicId, name, description)</code>
    </td>
    <td>
        <code>{courseId}</code>
    </td>
    <td>
        Return <code>{error}</code> if:
        <ul>
            <li><code>academicId</code> does not refer to an existing academic</li>
            <li><code>name</code> of the course is not 4 uppercase letters followed by 4 single-digit integers, e.g. "COMP1531"</li>
        </ul>
    </td>
  </tr>

  <tr>
    <td>
        <code>academicDetails</code><br /><br />
        Return an object containing details about the academicToView. Please carefully observe the stub return value before replacing it with your implementation.
        <br/><br/><b>Difficulty</b>: ⭐
    </td>
    <td>
        <code>(academicId, academicToViewId)</code>
    </td>
    <td>
        <code>{academic}</code>
    </td>
    <td>
        Return <code>{error}</code> if:
        <ul>
            <li><code>academicId</code> does not refer to an existing academic</li>
            <li><code>academicToViewId</code> does not refer to an existing academic</li>
        </ul>
    </td>

  <tr>
    <td>
        <code>courseDetails</code><br /><br />
        Return an object containing details about a course.
        <br/><br/><b>Difficulty</b>: ⭐⭐⭐
    </td>
    <td>
        <code>(academicId, courseId)</code>
    </td>
    <td>
        <code>{course}</code>
    </td>
    <td>
        Return <code>{error}</code> if:
        <ul>
            <li><code>academicId</code> does not refer to an existing academic</li>
            <li><code>courseId</code> does not refer to an existing course</li>
            <li><code>academicId</code> refers to an academic that is not a member of the course</li>
        </ul>
    </td>
  </tr>

  <tr>
    <td>
        <code>academicsList</code><br /><br />
        Return an object containing brief details about ALL academics.
        <br/><br/><b>Difficulty</b>: ⭐
    </td>
    <td>
        <code>(academicId)</code>
    </td>
    <td>
        <code>{academics}</code>
    </td>
    <td>
        Return <code>{error}</code> if
        <ul>
            <li><code>academicId</code> does not refer to an existing academic</li>
        </ul>
    </td>
  </tr>

  <tr>
    <td>
        <code>coursesList</code><br /><br />
        Return an object containing brief details about ALL courses.
        <br/><br/><b>Difficulty</b>: ⭐⭐
    </td>
    <td>
        <code>(academicId)</code>
    </td>
    <td>
        <code>{courses}</code>
    </td>
    <td>
        Return <code>{error}</code> if
        <ul>
            <li><code>academicId</code> does not refer to an existing academic</li>
        </ul>
    </td>
  </tr>

  <tr>
    <td>
        <code>courseEnrol</code><br /><br />
        Adds an academic to a course.<br /><br />
        The academic member can also be a staff member depending on the isStaff boolean.<br /><br />
        Existing members that are not staff cannot be re-enrolled to be staff, and vice versa - see error column.
        <br/><br/><b>Difficulty</b>: ⭐⭐⭐
    </td>
    <td>
        <code>(academicId, courseId, isStaff)</code>
    </td>
    <td>
        <code>{}</code>
    </td>
    <td>
        Return <code>{error}</code> if
        <ul>
            <li><code>academicId</code> does not refer to an existing academic</li>
            <li><code>courseId</code> does not refer to an existing course</li>
            <li><code>academicId</code> refers to an existing staff or member in the course</li>
        </ul>
    </td>
  </tr>

  <tr>
    <td>
        <code>clear</code><br /><br />
        Reset the database to the initial (empty) state and returns an empty object.
        <br/><br/><b>Difficulty</b>: ⭐
    </td>
    <td>
        <code>()</code>
    </td>
    <td>
        <code>{}</code>
    </td>
    <td>
        N/A
    </td>
  </tr>
</table>

### Interface: Data Types

This is only regarding the input/output of the functions in the [Interface: Functions](#interface-functions) and has no relation to the data object (implementation). Sometimes the implementation data types will very closely align, but there is no expectation they do.

The variable names below are case-insensitive, i.e. `"name"` and `"Name"` are the same.

<table>
  <tr>
    <th>Variable name</th>
    <th>Type</th>
  </tr>
  <tr>
    <td>named exactly <b>error</b></td>
    <td><code>string</code>, with the value being a relevant error message of your choice</td>
  </tr>
  <tr>
    <td>contains suffix <b>Id</b></td>
    <td><code>number</code>, specifically integer</td>
  </tr>
  <tr>
    <td>contains prefix <b>num</b></td>
    <td><code>number</code>, specifically integer</td>
  </tr>
  <tr>
    <td>contains prefix <b>is</b></td>
    <td><code>boolean</code></td>
  </tr>
  <tr>
    <td>contains the substring <b>name</b></td>
    <td><code>string</code></td>
  </tr>
  <tr>
    <td>named exactly <b>hobby</b></td>
    <td><code>string</code></td>
  </tr>
  <tr>
    <td>named exactly <b>description</b></td>
    <td><code>string</code></td>
  </tr>
  <tr>
    <td>(outputs only) named exactly <b>academic</b></td>
    <td><code>Object</code> containing keys <code>{academicId, name, hobby}</code></td>
  </tr>
  <tr>
    <td>(outputs only) contains suffix <b>Members</b></td>
    <td><code>Array</code> of objects, where each <code>Object</code> is of type <code>academic</code></td>
  </tr>
  <tr>
    <td>(outputs only) named exactly <b>course</b></td>
    <td><code>Object</code> containing keys <code>{courseId, name, description, allMembers, staffMembers}</code></td>
  </tr>
  <tr>
    <td>(outputs only) named exactly <b>academics</b></td>
    <td>Array of objects, where each object contains the keys <code>{academicId, academicName}</code></td>
  </tr>
  <tr>
    <td>(outputs only) named exactly <b>courses</b></td>
    <td>Array of objects, where each object contains the keys <code>{courseId, courseName}</code></td>
  </tr>
</table>

#### Data Types Note
- Some objects have been added or updated from lab01_academics. Pay close attention to the keys as well.
- All arrays of objects can have items in any order. Your tests need to account for this (see [Tips](#tips)).

## Task

### Testing

- This should be done before designing your database or implementing your functions.
- In the file [academic.test.js](academic.test.js), write tests for all functions in [Interface: Functions](#interface-functions).
You should expect most of your tests to fail on your implementation initially!

**IMPORTANT**: Your tests should **not** make assumptions about:
- how data is stored
- how IDs are generated. For example,
    - one student's implementation could have the `academicId` begin at id -1000 and decrease by 5 for each new academic, i.e. -1000, -1005,-1010, etc.
    - another student could randomise the ID (while still ensuring uniqueness).
    - hint: look into `expect.any`.
- which helper functions (i.e. not in the [Interface: Functions](#interface-functions)) are available.

In your tests, you should only be importing functions from [Interface: Functions](#interface-functions) and write your tests using only the knowledge of the input parameters, return values and the description of the function.

#### Tips

1. Each test should be independent of the other. To achieve this, you can use the `clear` function at the beginning of every test. Consider using [Setup and Teardown](https://jestjs.io/docs/setup-teardown) to streamline your code.
1. When testing/comparing arrays of objects, since we don't know which order they will be in, we could:
    - sort both arrays by IDs before comparing, or
    - convert each array into a [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) before comparing, as order won't matter in sets. The side effect is that duplicated elements are lost, although array objects in this lab exercise are unique by ID so this is fine.
    - (complex) install + set up [jest-extended](https://jest-extended.jestcommunity.dev/docs/) and use the matcher [`.toIncludeSameMembers`](https://jest-extended.jestcommunity.dev/docs/matchers/array/#toincludesamemembersmembers).

### Database

The database is now black-boxed to us - you can design it however you like! We will have zero knowledge of your data structure when auto-marking. See more details in the [Testing](#testing) section.

However, you may want to design your database such that the same information isn't stored/duplicated in multiple places. Consider the case where an academic may want to change their name in the future:
- will this be easily achieved by changing one data entry (e.g. the value of an object key) in your code, or will you have to find and change their name in multiple places?

### Implementation

1. Open the file [academics.js](./academics.js) in your preferred text editor. The stub code for each function has been provided for you.

1. Complete each function in [Interface: Functions](#interface-functions).

1. Test your code with your previously-written tests with
    ```shell
    $ npm test academics.test.js
    ```

1. Fix up any errors in your implementation.

#### Recommendation

You are encouraged to use Javascript built-in features (e.g. `for-of` loop) rather than traditional c-style loops using indices. Other array features such as `.find()`, `.filter()` and `.reduce()` are also encouraged and will be explored in further details in later weeks.

While this is not worth any marks (as labs are auto-marked for correctness only), it will help to simplify your code and is good practice for your group project. 

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
  "name": "lab03_academics",
  "version": "1.0.0",
  "description": "[TOC]",
  "type": "module",
  "main": "academics.js",
  "scripts": {
    "test": "jest"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@babel/preset-env": "^7.17.10",
    "jest": "^28.1.0"
  }
}
```

</details>
