# Lab01 - Leap

![Estimated completion time](https://img.shields.io/badge/Estimated%20Time-1%20hours-7FFF7F)
&nbsp;
![Overall Difficulty](https://img.shields.io/badge/Overall%20Difficulty-⭐-3498DB)
&nbsp;
![Code Assessed](https://img.shields.io/badge/Code%20Assessed-yes-darkgreen)
&nbsp;
![Eslint Assessed](https://img.shields.io/badge/Style%20Assessed-no-FFC0CB)
&nbsp;
![Test Quality Assessed](https://img.shields.io/badge/Test%20Quality%20Assessed-no-FEDC56)
&nbsp;

**Note**: Week 1 labs are worth 0% of your final grade. However, we will still automark this lab for you and provide you with a score out of 1 to give you a feel of the process. Please see our guide on Webcms3 for further details.

[TOC]

## Due Date

Week 2 Monday 5:00 pm [Sydney Local Time](https://www.timeanddate.com/worldclock/australia/sydney)

## Background

### Rationale

One misconception about leap years is that they occur every 4 years and aligns
with the Summer Olympic Games - this isn't true!  For example, in 1900, the
Summer Olympics occurred in a non-leap year, despite 1900 being divisible by 4!

In this lab, you are tasked with the heavy burden of deducing which
year is a leap and which isn't, using the algorithm provided by [Wikipedia](https://en.wikipedia.org/w/index.php?title=Leap_year&oldid=1130382965#Algorithm_for_Gregorian_leap_year).
Being able to accurately determine leap years is an important skill that will
save you the embarrassment of wrongly celebrating your friend's 29-Feb birthday every century or so.

### Setup

- If you are working on a CSE machine (e.g. via VLAB), ensure that you've run the command `1531 setup`. You only need to do this once at the beginning of the course.
- Please make sure you have completed `lab01_git` prior.
- If you have yet to set up `node` on your machine (check with the command `node --version`), see our **Getting Started** guide on Webcms3!
- Copy the SSH clone link from Gitlab and clone this repository on either VLAB or your local machine. 
- In your terminal, change your directory (using the `cd` command) into the newly cloned lab. To check if you have done this correctly, type `ls` in this new directory to see if you can see the relevant files (including [leap.js](leap.js)).

### Interface: Functions

An **interface** describes the characteristics of functions without concern for how they are implemented.

Below is an interface for the functions inside [leap.js](leap.js). Each function has:
* A function name in the source code
* A list of parameters that they take in
* A return value
* Specific behaviour in cases where invalid input is provided

| Name & Description | Parameters | Return Type         | Errors |
|------------------|----------|--------------------|------|
|`isLeap` <br/><br/>Given a strictly positive year, return true if it is a [leap year](https://en.wikipedia.org/w/index.php?title=Leap_year&oldid=1130382965#Algorithm_for_Gregorian_leap_year) and false otherwise. <br/><br/>**Difficulty**: ⭐ | (year) | `boolean` | N/A |
|`countLeaps` <br/><br/>Given an array of strictly positive years, return the number of leap years present in the array. <br/><br/>**Difficulty**: ⭐ | (yearArray) | `number` | N/A |
|`getNextLeap` <br/><br/>Given a strictly positive year, return the closest leap year **AFTER** the given year. <br/><br/>**Difficulty**: ⭐ | (year) | `number` | N/A |


### Interface: Data Types
| If the variable name | It is of type |
| --- | --- |
| is **year** | `number` |
| is **yearArray** | `number[]` (which is the same as `Array<number>`)


## Task

Your task is to **implement the interface functions as per the details set out in the Interface**.

### Implementation

Open the file [leap.js](./leap.js) in your preferred text editor. The stub code (a fake temporary implementation) for each function has been provided for you.

Complete all functions in [Interface: Functions](#interface-functions).

### Run & Test

You can run and test your code by typing the following in a terminal opened at the directory (folder) for this lab:
```shell
$ node leap.js
```
This executes the code in [leap.js](leap.js), including the `console.assert` and `console.log` at the bottom of [leap.js](leap.js).

## Submission

- Use `git` to `add`, `commit`, and `push` your changes on your master branch.
- Check that your code has been uploaded to your Gitlab repository on this website (you may need to refresh the page).

**If you have pushed your latest changes to master on Gitlab no further action is required! At the due date and time, we automatically collect your work from what's on your master branch on Gitlab.**


## Notes
- We will only be testing things that are explicitly mentioned in the interface. 
    - For example, in the `isLeap` function, there is no defined behaviour for a non-positive year. 
    - Therefore, **this case will not be tested**.
    - It is up to you how you want to logically account for this behaviour. This is called making an assumption.
- Passing the given tests is a good indication of correctness but does not guarantee that you will receive the full mark for the lab.
- You are advised to do further testing. For this lab, you can add more `console.log` or `console.assert` at the bottom of [leap.js](leap.js).
- You are not allowed to use any external libraries/modules in this exercise.
