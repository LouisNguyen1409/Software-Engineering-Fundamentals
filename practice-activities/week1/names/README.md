TODO NOTES

- Is there an easier way of getting input?
- I avoided npm since this is lab1

## Lab01 - Names

[TOC]

## Background

### Rationale
**Printing multiple strings**
```Javascript
console.log("Harry" + "Potter");
HarryPotter
```

Notice that this doesn't add any extra spaces, you need to add them yourself if you want some. Additionally use the backtick in order to print out the values of variables. 

```Javascript
console.log("Harry" + " " + "Potter"); // => Harry Potter
console.log("Harry", "Potter") // => Harry Potter
const name = "Harry Potter"
console.log(`Hello, ${name}`) // => Hello, Harry Potter
```

### Setup
- Please make sure you have completed `lab01_git` prior.
- Copy the SSH clone link from Gitlab and clone this repository on either VLAB or your local machine. 
- In your terminal, change directory (using the `cd` command) into the newly cloned lab. To check if you have done this correctly, type `ls` in this new directory to see if you can see the relevant files (including [integers.js](integers.js)).

### Name
Task: Write a program that takes someone’s name as input and prints
“So you call yourself {name} huh?”

Example

```
Name: Jake
So you call yourself Jake huh?
```
