## Times Tables Tester

Write a program in `tables.js` that tests the user's knowledge of the time tables.

The program picks two random integers between 2 and 12, and then asks the user to multiply them together in their head and then enter their answer.

If their result is correct it displays "Correct!", and if it's incorrect, it prompts them to try again (see sample interactions below).

```bash
$ node tables.js
What is 7 x 5? 34
Incorrect - try again.
What is 7 x 5? 33
Incorrect - try again.
What is 7 x 5? 35
Correct!
```

```bash
$ node tables.js
What is 3 x 3? 9
Correct!
```

The program will keep looping until they get the correct answer, and once they get the correct answer, the program will exit normally.
