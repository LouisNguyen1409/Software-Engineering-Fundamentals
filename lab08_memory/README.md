# Lab08 - Memory

![Estimated completion time](https://img.shields.io/badge/Estimated%20Time-3%20hours-7FFF7F)
&nbsp;
![Overall Difficulty](https://img.shields.io/badge/Overall%20Difficulty-⭐%20⭐-3498DB)
&nbsp;
![Code Assessed](https://img.shields.io/badge/Code%20Assessed-yes-darkgreen)
&nbsp;
![Eslint Assessed](https://img.shields.io/badge/Style%20Assessed-yes-FFC0CB)
&nbsp;
![Test Quality Assessed](https://img.shields.io/badge/Test%20Quality%20Assessed-yes-FEDC56)
&nbsp;

[TOC]

## Due Date

Week 9 Monday 5:00 pm [Sydney Local Time](https://www.timeanddate.com/worldclock/australia/sydney)


## Background

### Rationale

In a workplace environment, what should you do when you encounter a problem that
you don't want to deal with? That's right, you throw it up to the next person in
the chain and hope that they'll catch and deal with it for you!

... Bad advice, but this is similar to how Exceptions are generally used to
communicate a disruption to the normal flow of a program from one layer to the next.

In this lab, you will be building the underlying code for a memory game (in
[src/memory.ts](src/memory.ts)) which will involve throwing errors under certain conditions.
We will try to catch these in our already-completed [src/game.ts](src/lgame.ts).

Moreover, with how unreliable our memory can be, you will also explore how
objects can be saved to, or loaded from, a `JSON` file. This is an
application of data persistence.

### Getting Started
- Copy the SSH clone link from Gitlab and clone this repository on either VLAB or your local machine. 
- In your terminal, change your directory (using the `cd` command) into the newly cloned lab.

### Package Installation

1. Open [package.json](package.json) and look at existing packages in `"dependencies"` and `"devDependencies"`. Install them with:
    ```shell
    $ npm install # shortcut: npm i
    ```

1. Open [package.json](package.json) and add the following scripts:
    ```json
    "scripts": {
        "start": "ts-node src/game.ts",
        "test": "jest",
        "tsc": "tsc --noEmit",
        "ts-node": "ts-node",
        "lint": "eslint src/**.ts"
    }
    ```

1. Use `git` to `add`, `commit` and `push` your [package.json](package.json) and [package-lock.json](package-lock.json).

1. (Optional) Update [.gitlab-ci.yml](.gitlab-ci.yml) with testing and linting.

1. That's it, you're all set ^_^!

### The Game
This is a memory game that continuously generates English words and prompts the user to choose either
1. Add the word to the dictionary, assuming it doesn't exist
1. Remove the word from the dictionary, assuming it does exist

The user is allowed 3 mistakes before the game is over. They also have 3 clues, which allow them to view the current words available in the dictionary.

In [src/memory.ts](src/memory.ts), we have provided the example game structure:
```javascript
const currentGame = {
    score: 0,
    mistakesRemaining: 3,
    cluesRemaining: 3,
    dictionary: [],
};
```
representing the initial state of the game.

While not necessary, you are allowed to modify the structure or define the variable with `let` if you wish, but
the default state (0 score, 3 mistakes, 3 clues, empty dictionary) should remain the same when the information is requested via [Interface: Functions](#interface-functions) after the game is reset.

The current game is considered active if `mistakesRemaining > 0`, and inactive (or "over")
if there are no `mistakesRemaining`.

For inactive games, the values of the score, mistakesRemaining, cluesRemaining and the words inside the dictionary **will not be affected by any actions other than a *reset* or if a different game is loaded**.

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
        <code>getGameInfo</code>
        <br/><br/>
        Returns an object containing some information about the current game.
        <br/><br/><b>Difficulty</b>: ⭐
    </td>
    <td>
        ()
    </td>
    <td>
        <code>{score: number, mistakesRemaining: number, cluesRemaining: number}</code>
    </td>
    <td>
        N/A
    </td>
  </tr>
  <tr>
    <td>
        <code>addWord</code>
        <br/><br/>
        Attempts to add a word to the current game's dictionary and increase the score if successful. Otherwise, for active games, decrement mistakesRemaining.
        <br/><br/><b>Difficulty</b>: ⭐⭐
    </td>
    <td>
        (word: string)
    </td>
    <td>
        <code>undefined</code>
    </td>
    <td>
        Throw <code>Error</code> if
        <ul>
            <li>The game is inactive</li>
            <li>The given word already exists in the current game's dictionary</li>
        </ul>
    </td>
  </tr>
  <tr>
    <td>
        <code>removeWord</code>
        <br/><br/>
        Attempts to remove a word from the current game's dictionary and increase the score if successful. Otherwise, for active games, decrement the mistakesRemaining.
        <br/><br/><b>Difficulty</b>: ⭐⭐
    </td>
    <td>
        (word: string)
    </td>
    <td>
        <code>undefined</code>
    </td>
    <td>
        Throw <code>Error</code> if
        <ul>
            <li>The game is inactive</li>
            <li>The given word does not exist in the current game's dictionary</li>
        </ul>
    </td>
  </tr>
  <tr>
    <td>
        <code>viewDictionary</code>
        <br/><br/>
        Return the dictionary containing words for the current game, in chronological order. For example, if <code>'one'</code>, <code>'two'</code> and <code>'three'</code> are added, the returned order should be:
        <br/>
        <code>['one', 'two', 'three']</code>.
        <br/><br/>
        For active games, a clue will be used.
        <br/><br/><b>Difficulty</b>: ⭐⭐
    </td>
    <td>
        ()
    </td>
    <td>
        <code>dictionary: string[]</code>
    </td>
    <td>
        Throw <code>Error</code> if there are no clues remaining <b>during</b>
        an active game.
        <br/><br/>
        No error should be thrown if the game is inactive.
    </td>
  </tr>
  <tr>
    <td>
        <code>resetGame</code>
        <br/><br/>
        Reset the current game to the initial state.
        <br/><br/><b>Difficulty</b>: ⭐
    </td>
    <td>
        ()
    </td>
    <td>
        <code>undefined</code>
    </td>
    <td>
        N/A
    </td>
  </tr>
  <tr>
    <td>
        <code>saveGame</code>
        <br/><br/>
        Given a <code>name</code>, save the current game to a file with the
        added prefix <code>memory_</code> and extension <code>.json</code>.
        <br/><br/><b>Difficulty</b>: ⭐⭐⭐
    </td>
    <td>
        (name: string)
    </td>
    <td>
        <code>undefined</code>
    </td>
    <td>
        Throw <code>Error</code> if
        <ul>
            <li>The name given is an empty string, <code>''</code></li>
            <li>The name given is not alphanumeric (only letters and numbers)</li>
            <li>A game of this name is already saved</li>
        </ul>
    </td>
  </tr>
  <tr>
    <td>
        <code>loadGame</code>
        <br/><br/>
        Given a <code>name</code>, load a saved game from a file with the
        added prefix <code>memory_</code> and extension <code>.json</code>.
        <br/><br/><b>Difficulty</b>: ⭐⭐⭐
    </td>
    <td>
        (name: string)
    </td>
    <td>
        <code>undefined</code>
    </td>
    <td>
        Throw <code>Error</code> if
        <ul>
            <li>The name given is an empty string, <code>''</code></li>
            <li>The name given is not alphanumeric (only letters and numbers)</li>
            <li>No saved games correspond to the given name</li>
        </ul>
    </td>
  </tr>
</table>

#### Notes and Assumptions:

1. `undefined` means the function does not need to return anything.
1. You can assume that `addWord` and `removeWord` will always be given a valid English
word with at least 2 characters.
1. Files should be saved in the current (root) directory of the lab, **not** in `src`.
1. When it comes to testing the saving/loading of games, you can assume that the
only `memory_[name].json` files in the current directory are the ones you have created.

## Task

### Testing

Same with previous lab exercises, you are to write tests for the functions defined in the [Interface: Functions](#interface-functions).

See [src/memory.test.ts](src/memory.test.ts) for an example of how you can test for errors being raised in your functions.

You may find the Jest documentation for [expect.toThrow(Error)](https://jestjs.io/docs/expect#tothrowerror) useful.

### Implementation

Implement the functions in [Interface: Functions](#interface-functions) and ensure that they pass your tests.

Note that you should **not** need to write any try/catch blocks in [src/memory.test.ts](src/memory.test.ts)

#### Tips

1. For loading and saving files, consider `fs.readFileSync`, `fs.writeFileSync` and `fs.existsSync`.
1. To pretty-print an object, specify a space or indent of `2` when converting it into a string. This will make the `JSON` easier to read (e.g. when saving to a file). For example, try running the code:
    ```javascript
    const myObject = {
      key1: 0,
      key2: "string",
      key3: true,
    }
    console.log("Regular:");
    console.log(JSON.stringify(myObject));
    console.log();
    console.log("Pretty (with 2-space indentation):");
    console.log(JSON.stringify(myObject, null, 2));
    ```

### Playing The Game

This is optional. To play the game, you first need to install the following two dependencies:
```shell
$ npm install prompt-sync random-words@1.3.0
```
and their types as development dependencies:
```shell
$ npm install --save-dev @types/prompt-sync @types/random-words@1.1.2
```

The code for the game has already been written for you in [game.js](game.js). Once you have
implemented your [Interface: Functions](#interface-functions), you can play the game with
the command:
```shell
$ npm start
```

#### Game Example Outputs

Below are example outpus of two game sessions demonstrating some of the features. Click
on the dropdown to view them.

The error messages in your program **do not need to match the examples below**. We
will only assess whether an error is thrown or not, so you can decide on your
own error message.

<details close>

<summary><b>Example 1</b> - playing and saving to <code>memory_example.json</code>.</summary>

```text
$ npm start
^_^ Welcome to Memory 101! ^_^
Type 'help' to see the list of available commands!

[^_^] Add 'do' to dictionary?
>>> command: i
{ score: 0, mistakesRemaining: 3, cluesRemaining: 3 }

[^_^] Add 'do' to dictionary?
>>> command: y

[^_^] Add 'can' to dictionary?
>>> command: i
{ score: 1, mistakesRemaining: 3, cluesRemaining: 3 }

[^_^] Add 'can' to dictionary?
>>> command: n
Failed to remove 'can': Word 'can' is not in the dictionary!

[^_^] Add 'tin' to dictionary?
>>> command: i
{ score: 1, mistakesRemaining: 2, cluesRemaining: 3 }

[^_^] Add 'tin' to dictionary?
>>> command: v
[ 'do' ]

[^_^] Add 'tin' to dictionary?
>>> command: i
{ score: 1, mistakesRemaining: 2, cluesRemaining: 2 }

[^_^] Add 'tin' to dictionary?
>>> command: s example
Saving file memory_example.json

[^_^] Add 'tin' to dictionary?
>>> command: s example
Failed to save game example: File 'memory_example.json' already exits!

[^_^] Add 'tin' to dictionary?
>>> command: q
... Exiting. Thanks for playing!
```

</details>

<details close>

<summary><b>Example 2</b> - starting the program again and loading <code>memory_example.json</code>.</summary>

```
$ npm start
^_^ Welcome to Memory 101! ^_^
Type 'help' to see the list of available commands!

[^_^] Add 'gas' to dictionary?
>>> command: i
{ score: 0, mistakesRemaining: 3, cluesRemaining: 3 }

[^_^] Add 'gas' to dictionary?
>>> command: l example
Loading file memory_example.json

[^_^] Add 'gas' to dictionary?
>>> command: i
{ score: 1, mistakesRemaining: 2, cluesRemaining: 2 }

[^_^] Add 'gas' to dictionary?
>>> command: v
[ 'do' ]

[^_^] Add 'gas' to dictionary?
>>> command: v
[ 'do' ]

[^_^] Add 'gas' to dictionary?
>>> command: v
Failed to view dictionary: No clues remaining in this active game.

[^_^] Add 'gas' to dictionary?
>>> command: i
{ score: 1, mistakesRemaining: 2, cluesRemaining: 0 }

[^_^] Add 'gas' to dictionary?
>>> command: n
Failed to remove 'gas': Word 'gas' is not in the dictionary!

[^_^] Add 'was' to dictionary?
>>> command: n
Failed to remove 'was': Word 'was' is not in the dictionary!

[T_T] Add 'box' to dictionary?
>>> command: n
Failed to remove 'box': Game is over.

[T_T] Add 'saw' to dictionary?
>>> command: i
{ score: 1, mistakesRemaining: 0, cluesRemaining: 0 }

[T_T] Add 'saw' to dictionary?
>>> command: v
[ 'do' ]

[T_T] Add 'saw' to dictionary?
>>> command: q
... Exiting. Thanks for playing!
```

</details>

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
1. For this lab, you will only need [prompt-sync](https://www.npmjs.com/package/prompt-sync), [random-words](https://www.npmjs.com/package/random-words), [@types/prompt-sync](https://www.npmjs.com/package/@types/prompt-sync) and [@types/random-words](https://www.npmjs.com/package/@types/random-words) if you've chosen to play the game :).

```json
{
  "name": "lab08_memory",
  "version": "1.0.0",
  "description": "",
  "main": "src/game.ts",
  "scripts": {
    "start": "ts-node src/game.ts",
    "test": "jest",
    "tsc": "tsc --noEmit",
    "ts-node": "ts-node",
    "lint": "eslint src/**.ts"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "prompt-sync": "^4.2.0",
    "random-words": "^1.1.2"
  },
  "devDependencies": {
    "@types/jest": "^27.5.0",
    "@types/prompt-sync": "^4.1.1",
    "@types/random-words": "^1.1.2",
    "@typescript-eslint/eslint-plugin": "^5.23.0",
    "@typescript-eslint/parser": "^5.23.0",
    "eslint": "^8.15.0",
    "eslint-plugin-jest": "^26.1.5",
    "jest": "^28.1.0",
    "ts-jest": "^28.0.2",
    "ts-node": "^10.7.0",
    "typescript": "^4.6.4"
  }
}
```

</details>
