# Lab01 - Academics

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

**Note**: Week 1 labs are worth 0% of your final grade. However, we will still automark this lab for you and provide you with a score out of 1 to give you a feel of the process. Please see our guide on Webcms3 for further details.

[TOC]

## Due Date

Week 2 Monday 5:00 pm [Sydney Local Time](https://www.timeanddate.com/worldclock/australia/sydney)

## Background

### Rationale

Universities are made up of staff and students, each of whom is associated with one or more courses.
Many staff are also students themselves, formally or not, for we will always have something new to learn.

In this lab, students and staff will be referred to as *academics*.  Our goal is to follow an interface and complete a piece of software that allows academics to browse through an existing data store and discover their connections with other academics and courses. In our currently divided world, it is more important than ever to stay connected with those who share our interests.

### Setup

- If you are working on a CSE machine (e.g. via VLAB), ensure that you've run the command `1531 setup`. You only need to do this once at the beginning of the course.
- Please make sure you have completed both `lab01_git` and `lab01_leap` prior.
- Copy the SSH clone link from Gitlab and clone this repository on either VLAB or your local machine. 
- In your terminal, change your directory (using the `cd` command) to the newly cloned lab. To check if you have done this correctly, type `ls` in this new directory to see if you can see the relevant files (including [academics.js](academics.js)).

### Interface: Functions

An **interface** describes the characteristics of functions without concern for how they are implemented.

Below is an interface for the functions inside [academic.js](academics.js). Each function has:
 * A function name in the source code
 * A list of parameters that they take in
 * A return object
 * Specific behaviour in cases where invalid input is provided

<table>
  <tr>
    <th>Name & Description</th>
    <th>Parameters</th>
    <th>Return Type (Object)</th>
    <th>Errors</th>
  </tr>
  <tr>
    <td>
        <code>getNumAcademics</code><br /><br />
        Returns an object with information about the number of academics in the data store.
        <br/><br/><b>Difficulty</b>: ⭐
    </td>
    <td>
        <code>()</code>
    </td>
    <td>
        <code>{numAcademics}</code>
    </td>
    <td>
        N/A
    </td>
  </tr>
  <tr>
    <td>
        <code>getNumCourses</code><br /><br />
        Returns an object with information about the number of courses in the data store.
        <br/><br/><b>Difficulty</b>: ⭐
    </td>
    <td>
        <code>()</code>
    </td>
    <td>        
        <code>{numCourses}</code>
    </td>
    <td>
        N/A
    </td>
  </tr>
  <tr>
    <td>
        <code>getAcademicDetailsFromId</code><br /><br />
        Returns an academic object that corresponds to the given id.
        <br/><br/><b>Difficulty</b>: ⭐⭐
    </td>
    <td>
        <code>(academicId)</code>
    </td>
    <td>
        <code>{academic}</code>
    </td>
    <td>
        Return <code>{error}</code> when there are no academics with the given id
    </td>
  </tr>
  <tr>
    <td>
        <code>getCourseDetailsFromId</code><br /><br />
        Returns a course object that corresponds to the given id.
        <br/><br/><b>Difficulty</b>: ⭐⭐
    </td>
    <td>
        <code>(courseId)</code>
    </td>
    <td>
        <code>{course}</code>
    </td>
    <td>
        Return <code>{error}</code> when there are no courses with the given id
    </td>
  </tr>
  <tr>
    <td>
        <code>checkAcademicIsMember</code><br /><br />
        Returns an object that contains information about whether an academic is a member of the given course.
        <br/><br/><b>Difficulty</b>: ⭐⭐
    </td>
    <td>
        <code>(academicId, courseId)</code>
    </td>
    <td>
        <code>{isMember}</code>
    </td>
    <td>
        Return <code>{error}</code> when:
        <ul>
          <li>there are no academics with the given id</li>
          <li>there are no courses with the given id</li>
        </ul> 
    </td>
  </tr>
  <tr>
    <td>
        <code>checkAcademicIsStaff</code><br /><br />
        Returns an object that contains information about whether an academic is a staff of the given course.
        <br/><br/><b>Difficulty</b>: ⭐⭐
    </td>
    <td>
        <code>(academicId, courseId)</code>
    </td>
    <td>
        <code>{isStaff}</code>
    </td>
    <td>
        Return <code>{error}</code> when:
        <ul>
          <li>there are no academics with the given id</li>
          <li>there are no courses with the given id</li>
        </ul> 
    </td>
  </tr>
</table>

For example, the function `getAcademicDetailsFromId` would be called as follows:
```javascript
const academicId = 10;
const result = getAcademicDetailsById(academicId);
console.log(result);
```

Which would print to the terminal (with different white-space) an `object` with key `academic` as follows:
```text
{
  academic: {
    name: 'Ada',
    hobby: 'music'
  }
};
```

And if an invalid parameter was passed in, the returned result will be:
```text
{ error: 'a relevant error message of your choice' }
```

### Interface: Data Types

This is only regarding the input/output of the functions in the [Interface: Functions](#interface-functions) and has no relation to the data object (implementation). Sometimes the implementation data types will very closely align, but there is no expectation they do.

<table>
  <tr>
    <th>If a variable name...</th>
    <th>It is of type...</th>
  </tr>
  <tr>
    <td>named exactly <b>error</b></td>
    <td><code>string</code>, with the value being a relevant error message of your choice</td>
  </tr>
  <tr>
    <td>contains suffix <b>Id</b></td>
    <td><code>number</code>, specifically integer.<br/>Note: all ids of a category are unique for that category (e.g. there will not be a repeated <code>academicId</code>)</td>
  </tr>
  <tr>
    <td>contains prefix <b>num</b></td>
    <td><code>number</code>, specifically integer</td>
  </tr>
  <tr>
    <td>(outputs only) named exactly <b>academic</b></td>
    <td><code>object</code> containing keys <code>{name, hobby}</code></td>
  </tr>
  <tr>
    <td>(outputs only) named exactly <b>course</b></td>
    <td><code>object</code> containing keys <code>{name, description}</code></td>
  </tr>
  <tr>
    <td>named exactly <b>name</b></td>
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
    <td>contains prefix <b>is</b></td>
    <td><code>boolean</code></td>
  </tr>
</table>

### Implementation: Data Store

The simplest way to store data without using complex software is in a global variable.

In your major project, we will expect you to create this variable and decide how it is structured. **However, for simplicity, in this lab, we are forcing your implementation to work on a specific data structure**. We have populated the data store with information for you.

You can see in [academics.js](academics.js) that we've created a global variable called `dataStore`. The object contains multiple key-value pairs, where each value is itself an array of objects.

For this lab, the global variable `dataStore` is pre-populated with data.

```javascript
const dataStore = {
  academics: [
    {
      id: 10,
      name: 'Ada',
      hobby: 'music',
    },
    {
      id: 20,
      name: 'Ben',
      hobby: 'gym',
    },
    // ...
  ],

  courses: [
    {
      id: 1511,
      name: 'COMP1511',
      description: 'Programming Fundamentals',
      staffIds: [10, 20],
      memberIds: [10, 20, 30, 40, 50],
    },
    {
      id: 1531,
      name: 'COMP1531',
      description: 'Programming Fundamentals',
      staffIds: [10],
      memberIds: [10, 20, 30, 40, 50],
    },
    // ...
  ],
}
```

For this academic exercise, do **NOT** modify the fields in the data object (e.g. by adding new key/values). However, you can add/remove an academic or a course when self-testing - see the [Testing](#testing) section for further information.

In the current design, a `staff` in the course is a `member` of that course.

In **future** lab exercises, you can (and are encouraged to) modify any data structure as you see fit. Our auto-marking tests in **future** exercises will not rely on the underlying structure of the data store.

## Task

Your task is to **implement the functions in [Interface](#interface-functions)**.

### Implementation

Open the file [academics.js](./academics.js) in your preferred text editor. The stub code (interface with a fake temporary implementation) for each function has been provided for you.

Before replacing them with your implementation, pay close attention to the returned object and see how it aligns with the [Interface: Functions](#interface-fuctions) and [Interface: Data Types](#interface-data-types).

Complete the functions `getNumAcademics`, `getNumCourses`, `getAcademicDetailsFromId`, `getCourseDetailsFromId`, `checkAcademicIsMember`, `checkAcademicIsStaff`.

### Run & Test

You can run and test your code by typing the following in a terminal that is opened at the directory (folder) for this lab:
```shell
$ node academics.js
```
This executes the code in [academics.js](academics.js), including the `console.log` at the bottom of the file.

### Testing
In the auto-marking, we will replace the data store with other information. However, you are guaranteed that the structure will be identical (i.e keys/values), and only the number of academics and courses will change.

For example, we may add/remove an academic, add/remove a course, change an academic's name or id, change a course's name or id, or have an empty dataStore such as:
```javascript
const dataStore = {
  academics: [],
  courses: [],
}
```
You can assume that the types of all parameters will be consistent with the [Interface: Data Types](#interface-data-types) section.

## Submission

- Use `git` to `add`, `commit`, and `push` your changes on your master branch.
- Check that your code has been uploaded to your Gitlab repository on this website (you may need to refresh the page).

**If you have pushed your latest changes to master on Gitlab no further action is required! At the due date and time, we automatically collect your work from what's on your master branch on Gitlab.**

## Notes
- We will only test the behaviour explicitly defined in the specification. For cases that are not covered, you can make assumptions about how the relevant functions should behave.
- Passing the given tests is a good indication of correctness but does not guarantee that you will receive the full mark for the lab.
- You are advised to do further testing. In this lab, this can be done by adding more `console.log` at the bottom of [academics.js](academics.js)
- You are not allowed to use any external libraries/modules in this exercise.
