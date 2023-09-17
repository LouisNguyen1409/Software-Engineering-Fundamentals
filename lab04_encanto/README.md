# Lab04 - Encanto

![Estimated completion time](https://img.shields.io/badge/Estimated%20Time-3%20hours-7FFF7F)
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

Week 5 Monday 5:00 pm [Sydney Local Time](https://www.timeanddate.com/worldclock/australia/sydney)

## Background

### Rationale

Welcome to the Family Madrigal, where all the people are fantastical and magical! 

Disney's film [Encanto](https://en.wikipedia.org/wiki/Encanto_(film)) features an extraordinary family where every child is blessed with a unique gift - every child except our poor protagonist, Mirabel. Through the magic of static typing, you must move the mountains, make the flowers bloom and prove that Mirabel is indeed the most special Madrigal of all!

To assist you with this lab and the remainder of the term, COMP1531 will bestow upon you our greatest gift - the miracle of TypeScript! This is JavaScript, but more fantastical and magical!
Also, here is a [playlist](https://www.youtube.com/watch?v=iLP_CMVLfVc&list=PLKPn7hqvUwgx-ddMdUbOTIHshyg-iQCIa) that you can listen to while completing this lab.

### Getting Started
- Copy the SSH clone link from Gitlab and clone this repository on either VLAB
or your local machine.
- In your terminal, change your directory (using the `cd` command) into the newly
cloned lab. 

### TypeScript Installation

*[Typescript](https://www.typescriptlang.org/) is a strongly typed programming language that builds on Javascript, giving you better tooling at any scale*. To get started,

1. Open [package.json](package.json) and look at existing packages in `"dependencies"` and `"devDependencies"`. Install them with:
    ```shell
    $ npm install # shortcut: npm i
    ```
1. Install [typescript](https://www.npmjs.com/package/typescript) and [ts-node](https://www.npmjs.com/package/ts-node) as development dependencies so we can use the `tsc` and `ts-node` commands:
    ```shell
    $ npm install --save-dev typescript ts-node # shortcut: npm i -D typescript ts-node
    ```
1. Install [ts-jest](https://www.npmjs.com/package/ts-jest) to use jest on typescript code:
    ```shell
    $ npm install --save-dev ts-jest @types/jest # shortcut: npm i -D ts-jest @types/jest
    ```
1. Open your [package.json](package.json) and add the scripts below. Notice the `--noEmit` option for `"tsc"` - this means that `tsc` will only be used for type-checking, and typescript files will not be compiled to javascript files.
    ```json
    "scripts": {
      "test": "jest",
      "tsc": "tsc --noEmit",
      "ts-node": "ts-node"
    }
    ```
1. To check that you have completed the steps correctly, compare your [package.json](package.json) with our sample package.json in the [Additional Information](#additional-information) section.
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
        <code>createMadrigal</code>
        <br/><br/>
        Given a name, an age and an <b>optional</b> gift, create and return a Madrigal member.
        <br/><br/><b>Difficulty</b>: ⭐⭐
    </td>
    <td>
<pre>(
  name: string,
  age: number,
  gift?: string
)</pre>
    </td>
    <td>
        <code>Madrigal</code>
    </td>
    <td>
      N/A
    </td>
  </tr>
  <tr>
    <td>
        <code>createSong</code>
        <br/><br/>
        Given a name and either a string or array of strings denoting the singers, create and return a Song.
        <br/><br/>
        You are guaranteed that if singers is an array of strings, it will contain at least 2 strings.
        <br/><br/><b>Difficulty</b>: ⭐
    </td>
    <td>
<pre>(
  name: string,
  singers: string | string[]
)</pre>
    </td>
    <td>
        <code>Song</code>
    </td>
    <td>
      N/A
    </td>
  </tr>
  <tr>
    <td>
        <code>extractNamesMixed</code>
        <br/><br/>
        Given a list that may contain a mixture of Madrigal and Song items, return the name of these items in the order they were given in.
        <br/><br/><b>Difficulty</b>: ⭐
    </td>
    <td>
<pre>(
  array: (Madrigal | Song)[]
)</pre>
    </td>
    <td>
        <code>string[]</code>
    </td>
    <td>
      N/A
    </td>
  </tr>
  <tr>
    <td>
        <code>extractNamesPure</code>
        <br/><br/>
        Given a list only Madrigal items or only Song items, return the name of these items in the order they were given in.
        <br/><br/><b>Difficulty</b>: ⭐
    </td>
    <td>
<pre>(
  array: Madrigal[] | Song[]
)</pre>
    </td>
    <td>
        <code>string[]</code>
    </td>
    <td>
      N/A
    </td>
  </tr>
  <tr>
    <td>
        <code>madrigalIsSinger</code>
        <br/><br/>
        Check if the given madrigal is one of the singers in the given song.
        <br/><br/>
        <b>Madrigal property</b>: since all Madrigals are fantastically unique,
        you are guaranteed that no two Madrigals will have their names be a
        substring of the other.
        <br/><br/>
        For example, if there is a Madrigal named "Mirabel", there will not
        be another madrigal named "Mira", "ira", "bel", etc
        (you don't need to consider these cases).
        <br/><br/><b>Difficulty</b>: ⭐
    </td>
    <td>
<pre>(
  madrigal: Madrigal,
  song: Song
)</pre>
    </td>
    <td>
        <code>boolean</code>
    </td>
    <td>
      N/A
    </td>
  </tr>
  <tr>
    <td>
        <code>sortedMadrigals</code>
        <br/><br/>
        Return a new sorted array of madrigals based on:
        <ol>
          <li>age, in ascending order, and if equal then</li>
          <li>name, in lexicographical order (case-insensitive)</li>
        </ol>
        For example, the items below are correctly sorted:
        <ul>
          <li>
            Mirabel (age 15)
          </li>
          <li>
            Dolores (age 22)
          </li>
          <li>
            Isabella (age 22)
          </li>
        </ul>
        since Mirabel is the youngest, and 'D' is before 'I' between Dolores and Isabella.
        <br/><br/><b>Difficulty</b>: ⭐⭐
    </td>
    <td>
<pre>(
  madrigals: Madrigal[],
)</pre>
    </td>
    <td>
        <code>Madrigal[]</code>
    </td>
    <td>
      N/A
    </td>
  </tr>
  <tr>
    <td>
        <code>filterSongsWithMadrigals</code>
        <br/><br/>
        Given an array of madrigals and an array of songs, return all songs that contain any of the madrigals as a singer.
        <br/><br/><b>Difficulty</b>: ⭐⭐
    </td>
    <td>
<pre>(
  madrigals: Madrigal[],
  songs: Song[]
)</pre>
    </td>
    <td>
        <code>Song[]</code>
    </td>
    <td>
      N/A
    </td>
  </tr>
  <tr>
    <td>
        <code>getMostSpecialMadrigal</code>
        <br/><br/>
        Given an array of madrigals and an array of songs, return the madrigal that sang the most songs, for they are <i>clearly</i> the most special. 
        <br/><br/>
        If two madrigals have the same number of songs sung, the one that appeared first in the array will be returned.
        <br/><br/>
        You do not need to worry about the case where the list of madrigals is empty (this will not be tested).
        <br/><br/><b>Difficulty</b>: ⭐⭐⭐
    </td>
    <td>
<pre>(
  madrigals: Madrigal[],
  songs: Song[]
)</pre>
    </td>
    <td>
        <code>Madrigal</code>
    </td>
    <td>
      N/A
    </td>
  </tr>
</table>

#### Tips

1. When creating a Madrigal, if a `gift` is not specified, the key `gift` should not exist in the returned object.
1. Names are case-sensitive, i.e. "Bruno", "bruNo" an "bRunO" are all different people. The only exception is that when sorting, names are case-insensitive - you can follow the order of the `.localeCompare()` method for strings.
1. Challenge: in the `madrigalIsSinger` function, it is fine to use if-conditions to check whether the key `singers` is a string or an array. However, it is also possible to implement this function in 1 line by taking advantage of the **Madrigal Property** and a common method for both strings and arrays.
1. All functions in this lab are [pure functions](https://en.wikipedia.org/wiki/Pure_function). You should NOT need to introduce a "dataStore" or use any global variables.


### Interface: Data Types

| Interface | Structure |
| --- | --- |
| `Madrigal` | Object containing keys `{name: string, age: number, gift?: string}` |
| `Song` | Object containing keys `{name: string, singers: string \| string[]}` |

Note: 
- `gift?` denotes that the gift is optional.
  - i.e. both `{name: 'Luisa', age: 19}` and `{name: 'Luisa', age: 19, gift: 'Super Strength'}` are valid.
- `string | string[]` is a union between a string and an array of strings.
  - i.e. both `'Mirable'` and `['Mirabel', 'Isabella']` are valid.

## Task

### Testing

#### Using jest

Tests have already been written for you in [src/madrigal.test.ts](src/madrigal.test.ts). However, they are currently
commented out and you will need to uncomment them. Afterwards, you can run the tests with:
```shell
$ npm t
```
You do not need to write any additional tests.

#### Type-checking with tsc

Moreover, in [src/main.ts](src/main.ts), we have provided code that calls the [Interface: Functions](#interface-functions) with both valid and invalid arguments.

To type-check your code, use the command
```shell
$ npm run tsc
```
The file [src/main.ts](src/main.ts) will display errors if your type annotations in [src/madrigal.ts](src/madrigal.ts) do not conform with the Interface.

#### Running ts-node 

You can also run this file directly with ts-node (which will also do what tsc does behind the scene).
From the root directory of this lab:
```shell
$ npm run ts-node src/main.ts
```

The expected output (potentially with different white spaces) is
```text
{ name: 'Mirabel', age: 15 }
{ name: 'Isabella', age: 22, gift: 'Flower Creation' }
[ 'Mirabel', 'Isabella' ]
[ 'Waiting on a Miracle', 'What Else Can I Do?' ]
[ 'Mirabel', 'Waiting on a Miracle', 'Isabella', 'What Else Can I Do?' ]
true
false
[ { name: 'Mirabel', age: 15 }, { name: 'Isabella', age: 22, gift: 'Flower Creation' } ]
[ { name: 'What Else Can I Do?', singers: [ 'Isabella', 'Mirabel' ] } ]
{ name: 'Mirabel', age: 15 }
```

### Implementation

In [src/madrigal.ts](src/madrigal.ts), implement the functions in [Interface: Functions](#interface-functions) with type annotations following [Interface: Data Types](#interface-data-types).


### Continuous Integration

You may have noticed from previous labs that there is a green tick (✅) on commits in the marking branch - pretty cool, huh?

This is thanks to the file [.gitlab-ci.yml](.gitlab-ci.yml) in our Gitlab repository, which defines a set of commands (i.e. a script) for our Gitlab runner to execute. Attend week 4 lectures to find out more!

Also, if you're interested, here is more documentation from Gitlab:
  - https://docs.gitlab.com/ee/ci/quick_start/index.html
  - https://docs.gitlab.com/ee/ci/yaml/

For our purposes though, the task is simple. We want our pipeline to run `npm install` and `npm test` every time we push to the master branch. Have a look through [.gitlab-ci.yml](.gitlab-ci.yml) and think about how this can be achieved, then modify the file accordingly.

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
  "name": "lab04_encanto",
  "version": "1.0.0",
  "description": "Where everything is fantastical and magical",
  "main": "src/madrigal.ts",
  "scripts": {
    "test": "jest",
    "tsc": "tsc --noEmit",
    "ts-node": "ts-node"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@types/jest": "^27.5.1",
    "jest": "^28.1.0",
    "ts-jest": "^28.0.2",
    "ts-node": "^10.7.0",
    "typescript": "^4.6.4"
  }
}
```

</details>

### Miscellaneous

<details>

<summary>Other information that is not core to the course</summary><br/>

1. While *compile* is the umbrella term used in this lab, it is more technical to say that TypeScript *transpiles* into JavaScript. See [here](https://stackoverflow.com/questions/44931479/compiling-vs-transpiling) for further details about their differences.

1. **The files below can be safely ignored - we will always provide them for you if necessary**:
    - [tsconfig.json](tsconfig.json) - configuration file for typescript compilation. Note that when using `tsc` with a file argument, `tsconfig.json` will (oddly) be ignored.
    - [jest.config.js](jest.config.js) - configuration file for jest to use ts-jest, generated with `npx ts-jest config:init`.
    - [.gitignore](.gitignore) - tells git which files/patterns to ignore while committing.

1. Also, you may have noticed that [@babel/preset-env](https://www.npmjs.com/package/@babel/preset-env) is no longer used in this lab. 
    - This is because we have transitioned to [typescript](https://www.npmjs.com/package/typescript) and [ts-jest](https://www.npmjs.com/package/ts-jest).
    - [jest.config.js](jest.config.js) has been updated from lab03 accordingly.

1. Finally, notice that [@types/jest](https://www.npmjs.com/package/@types/jest) is in our [package.json](package.json)'s `"devDependencies"`.
    - This is the type definition for jest
    - Generally, to use a *library* with TypeScript, you may want to also install @types/*library*.

</details>
