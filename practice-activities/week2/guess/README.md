## Guess

Open `guess.js`.

Write a program in `guess.js` that asks the user to think of a number between 1 and 100 (inclusive). The **program** should then repeatedly guess a number, and then prompt the **user** to state whether the computers' guess is too low, too high or correct. It repeats this until the right guess happens.

The behaviour of the output is described below:

Example:

```bash
Pick a number between 1 and 100 (inclusive)
My guess is: 50
Is my guess too low (L), too high (H), or correct (C)?
L
My guess is: 75
Is my guess too low (L), too high (H), or correct (C)?
H
My guess is: 62
Is my guess too low (L), too high (H), or correct (C)?
C
Got it!
```

This program had the following standard input passed to it
```bash
L
H
C
```

You can use [Math.random](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random) to generate the first number.
