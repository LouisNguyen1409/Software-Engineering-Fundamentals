# Lab04 - Shapes

![Estimated completion time](https://img.shields.io/badge/Estimated%20Time-10%20minutes-7FFF7F)
&nbsp;
![Overall Difficulty](https://img.shields.io/badge/Overall%20Difficulty-⭐-3498DB)
&nbsp;
![Code Assessed](https://img.shields.io/badge/Code%20Assessed-yes-darkgreen)
&nbsp;
![Eslint Assessed](https://img.shields.io/badge/Style%20Assessed-yes-FFC0CB)
&nbsp;
![Test Quality Assessed](https://img.shields.io/badge/Test%20Quality%20Assessed-no-FEDC56)
&nbsp;

[TOC]

## Due Date

Week 5 Monday 5:00 pm [Sydney Local Time](https://www.timeanddate.com/worldclock/australia/sydney)

## Background

### Note

**Linting will be assessed in this lab and future labs from this point onwards**.

### Rationale

Rules are meant to be broken... except for the ones we set in COMP1531! In this
lab, you are tasked with fixing the style of a pre-written piece of software
that is currently in pretty bad... shape. 

By this, we mean that while the code is executable by machines, it is hardly
readable by us humans. With your personal assistant `ESLint`, improve the style
of the code while adhering to our linting rules and set of requirements.

### Getting Started
- Please ensure that you have completed `lab04_encanto` prior.
- Copy the SSH clone link from Gitlab and clone this repository on either VLAB
or your local machine.
- In your terminal, change your directory (using the `cd` command) into the newly
cloned lab.

### ESLint Installation

*[ESLint](https://eslint.org/) is a static code analysis tool for identifying problematic patterns found in JavaScript code*. To get started,

1. Open [package.json](package.json) and look at existing packages in `"dependencies"` and `"devDependencies"`. Install them with:
    ```shell
    $ npm install # shortcut: npm i
    ```
1. Install [eslint](https://www.npmjs.com/package/eslint)
    ```shell
    $ npm install --save-dev eslint # shortcut: npm i -D eslint
    ```
1. Install a few more plugins necessary for eslint to work with typescript and jest:
    ```shell
    $ npm install --save-dev eslint-plugin-jest @typescript-eslint/parser @typescript-eslint/eslint-plugin
    ```
1. Open [package.json](package.json) and modify your scripts while noting the key `"lint"`.
    ```json
    "scripts": {
        "test": "jest",
        "tsc": "tsc --noEmit",
        "ts-node": "ts-node",
        "lint": "eslint src/**.ts",
        "lint-fix": "eslint --fix src/**.ts"
    }
    ```
1. Usually, ESLint will need to be configured (initialised) for each new project. However, we have already provided the configuration file [.eslintrc.json](.eslintrc.json) in your repository, so this step won't be necessary.
1. Use `git` to `add`, `commit` and `push` your [package.json](package.json) and [package-lock.json](package-lock.json).

### Interface: Functions

<table>
  <tr>
    <th>Name & Description</th>
    <th>Parameters</th>
    <th>Return Type</th>
    <th>Errors</th>
  </tr>
  <tr>
    <td>
        <code>drawShape</code>
        <br/><br/>
        Return a string representing a particular shape based on the given size and isSolid property.
        <br/><br/>
        The only valid strings for the shape argument are:
        <ul>
            <li>triangle</li>
            <li>square</li>
        </ul>
        both of which can either be solid or hollow (not solid).
        <br/><br/><b>Difficulty</b>: ⭐
    </td>
    <td>
        (shape, size, isSolid)
    </td>
    <td>
        <code>string</code>
    </td>
    <td>
        Return <code>"Invalid Input"</code> if the
        <ul>
            <li>shape is not "square" or "triangle"</li>
            <li>size is a negative integer</li>
        </ul>
    </td>
  </tr>
</table>

### Interface: Data Types
| Variable Name | Type |
| --- | --- |
| `shape` | `string` |
| `size` | `number`, specifically integer |
| `isSolid` | `boolean` |

## Task

### Testing

The tests for `drawShape` are already provided in [src/shapes.test.js](src/shapes.test.js).
You do not need to modify the test file or write any additional tests for this lab.

### Implementation

The function `drawShape` has been implemented for you. However, the code style used
is currently not ESLint-compliant.

Modify [src/shape.ts](src/shape.js) to fix all linting errors. Once done,
the commands
```shell
$ npm run lint
```
and
```shell
$ npm test
```
should not display any error.

If you wish, you could also refactor the code (for example by introducing
helper functions to reduce repeated code). However, we will only assess whether
your modified code passes both the linter and test.

#### Tip:

In the set-up instructions, we have added a script called `lint-fix`. Running
```shell
$ npm run lint-fix
```
will thus fix all the auto-fixable linting errors. You may also be to auto-fix most linting errors
from your IDE.

### Continuous Integration

Similar to `lab04_encanto`, we want our pipeline to run `npm install` and `npm test`. However, the challenge this time is to also add a linting element with the `npm run lint` command.

Open [.gitlab-ci.yml](.gitlab-ci.yml) and update your pipeline accordingly!

You are recommended to do this for future labs and use the pipeline as a quick sanity check since it is not uncommon to forget about linting our code before submission :).

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
  "name": "lab04_shapes",
  "version": "1.0.0",
  "description": "[TOC]",
  "main": "src/main.ts",
  "scripts": {
    "test": "jest",
    "tsc": "tsc --noEmit",
    "ts-node": "ts-node",
    "lint": "eslint src/**.ts",
    "lint-fix": "eslint --fix src/**.ts"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@types/jest": "^27.5.1",
    "@typescript-eslint/eslint-plugin": "^5.23.0",
    "@typescript-eslint/parser": "^5.23.0",
    "eslint": "^8.15.0",
    "eslint-plugin-jest": "^26.2.1",
    "jest": "^28.1.0",
    "ts-jest": "^28.0.2",
    "ts-node": "^10.7.0",
    "typescript": "^4.6.4"
  }
}
```

</details>

### IDE Linting

<details>

<summary>Test file issues</summary><br/>

If your IDE, e.g. VSCode, displays linting issues in the test file for `describe`, `test`, `expect`, etc, but the command
```shell
$ npm run lint
```

behaves as expected, try creating an empty file called `jsconfig.json` in
the root folder of this repository. One way would be:
```shell
$ touch jsconfig.json
```

</details>

### Miscellaneous

<details>

<summary>Other information that is not core to the course</summary><br/>

**The files below can be safely ignored - we will always provide them for you if necessary**:

In addition to the new files introduced from lab04_encanto:
- [.eslintrc.json](.eslintrc.json) - COMP1531 linting rules. Fun fact, comments are not possible in standard JSON files, but ESLint allows it.

</details>
