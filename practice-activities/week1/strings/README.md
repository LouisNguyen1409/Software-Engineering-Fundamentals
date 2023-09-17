TODO NOTES

- splicing and negative indicies aren't supported, updated the README

## Lab01 - Strings

[TOC]

## Background

### Rationale
Unlike a C string, a string in Javascript is not merely a pointer to a block of NULL-terminated characters (Javascript does not have pointers), but rather a built-in datatype. They also have a lot of in built functionality like concatenation (appending one string to another).

The file `strings.js` has a list of strings that you will need to print out space separated. The **expected output** is:

> This list is now all together

Note that there is **NO** trailing space in the output.

### Setup
- Please make sure you have completed `lab01_git` prior.
- Copy the SSH clone link from Gitlab and clone this repository on either VLAB or your local machine. 
- In your terminal, change directory (using the `cd` command) into the newly cloned lab. To check if you have done this correctly, type `ls` in this new directory to see if you can see the relevant files (including [strings.js](strings.js)).

### Instructions

1. Open the `strings.js` file
2. Use a `for` loop to join all of the strings, separated by a space.
3. Print the new string such that the output matches the above (no trailing space in output).

At this point you should commit and push your changes to Gitlab. However, for this exercise your repo has been given a *Continuous Integration pipeline*. You will learn what this is and how it works as you progress through the course, but for now the important fact is that every time you push to your Gitlab repo, some checks will be performed on your code. For this lab, the only check is that your `strings.js` has the correct output.

You can see the status of your pipeline by looking at the top left of this page in Gitlab. It will say either:

* ![passed](pipeline-passed.svg) if the contents of the master branch passed the checks.
* ![failed](pipeline-failed.svg) if the contents of the master branch failed the checks.
* ![running](pipeline-running.svg) if the checks are still running.

Currently, it says "failed", but that's because you need to push your completed code. Once you push, it should change to running (or possibly "pending", if a lot of other people are running pipelines at the same time), then, shortly afterward, to "passed". Note that you may have to refresh the page to see it.

If it doesn't change to "passed", you will get an email telling you that your pipeline has failed. Double check that you're program is producing the correct output. There should be no additional lines of output, nor any extra space at the end of the line.

### Improving the code

Concatenating a list of strings seems like something that people would want to do often. So, as you may suspect after the previous exercise, there is an in-built function to do this for you.

Comment out your old code, and beneath it add the following line:

```javascript
console.log(strings.join(' '));
```

Make sure it works by running your code.

When you push this new change to your repo, make sure that your pipeline is still "passed". The purpose of pipelines is to ensure that new changes to code do not break any existing behaviour. In general, if you do not have a "passed" pipeline for a lab task then you have not completed it satisfactorily and will lose marks. 
