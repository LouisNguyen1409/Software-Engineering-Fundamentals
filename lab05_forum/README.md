# Lab05 - Forum

![Estimated completion time](https://img.shields.io/badge/Estimated%20Time-8%20hours-7FFF7F)
&nbsp;
![Overall Difficulty](https://img.shields.io/badge/Overall%20Difficulty-⭐%20⭐%20⭐-3498DB)
&nbsp;
![Code Assessed](https://img.shields.io/badge/Code%20Assessed-yes-darkgreen)
&nbsp;
![Eslint Assessed](https://img.shields.io/badge/Style%20Assessed-yes-FFC0CB)
&nbsp;
![Test Quality Assessed](https://img.shields.io/badge/Test%20Quality%20Assessed-yes-FEDC56)
&nbsp;

[TOC]

## Due Date

Week 5 Saturday 10:00 pm [Sydney Local Time](https://www.timeanddate.com/worldclock/australia/sydney)

## Background

### Rationale

Forums are online discussion boards where people can post questions, share their experiences and discuss ideas and topics with others who have similar interests.

A client has reached out to you with a problem - they want a platform where they can publicly *express* their thoughts and allow others to comment and critique them. In this lab, you are to build a backend server for a simple forum design.

### Getting Started
- Copy the SSH clone link from Gitlab and clone this repository on either VLAB or your local machine. 
- In your terminal, change your directory (using the `cd` command) into the newly cloned lab.

Before starting, **please make sure that you've seen last week's lectures (week 4)**!

You may also find the following projects helpful:
- tutorial 5 a.express exercise, or if this is before your tutorial:
- Week 5 Server Example
    - https://nw-syd-gitlab.cseunsw.tech/COMP1531/23T2/week5-server-example


### Express Installation

*[Express](https://expressjs.com/) is a fast, unopinionated minimalist web framework for Node.js*. To get started,

1. Open [package.json](package.json) and look at existing packages in `"dependencies"` and `"devDependencies"`. Install them with:
    ```shell
    $ npm install
    ```

1. Install [express](https://www.npmjs.com/package/express), along with the middlewares 
    - [cors](https://www.npmjs.com/package/cors) to allow access from other domains (needed for frontend to connect)
    - [morgan](https://www.npmjs.com/package/morgan) (OPTIONAL) to log (print to terminal) incoming HTTP requests. 
    ```shell
    $ npm install express cors morgan
    ```

1. Install the type definitions for the dependencies above as development dependencies:
    ```shell
    $ npm install --save-dev @types/express @types/cors @types/morgan
    ```

1. Finally, we will install
    - [ts-node-dev](https://www.npmjs.com/package/ts-node-dev) (OPTIONAL)
        - to run our server in debug mode
        - automatically restart the server when changes are made to the code
    - [sync-request](https://www.npmjs.com/package/sync-request)
        - for testing purposes
        - we will use this to send HTTP requests to our server
    ```shell
    $ npm install --save-dev ts-node-dev sync-request
    ```

1. Open your [package.json](package.json) and add the following scripts:
    ```json
    "scripts": {
        "test": "jest",
        "posttest":  "pkill -f 'node_modules/sync-rpc/lib/worker.js' > /dev/null 2>&1",
        "ts-node": "ts-node",
        "ts-node-dev": "ts-node-dev",
        "tsc": "tsc --noEmit",
        "lint": "eslint src/**.ts"
        // Any other scripts you want here
    }
    ```

1. Tip: For convenience, you may also add `ts-node` in a `start` script to run [src/server.ts](src/server.ts):
    ```json
    "start": "ts-node src/server.ts",
    "start-dev": "ts-node-dev src/server.ts",
    ```
    Similar to `test`, `start` is a special value in `npm`. Thus, either of the below will work:
    ```shell
    $ npm run start
    $ npm start
    ```

1. To check that you have completed the steps correctly, compare your [package.json](package.json) with our sample package.json in the [Additional Information](#additional-information) section.

1. Use `git` to `add`, `commit` and `push` your [package.json](package.json) and [package-lock.json](package-lock.json).

1. (Optional) Update [.gitlab-ci.yml](.gitlab-ci.yml) with testing and linting.

### Interface: Routes

#### Note

- `postid` are given in lower-case for `params`, but when returned, it is expected to be `postId` (capital 'I').

<table>
  <tr>
    <th>Name & Description</th>
    <th>HTTP Method</th>
    <th>Data Types</th>
    <th>Errors</th>
  </tr>
  <tr>
    <td>
        <code>/</code><br /><br />
        This is an example route that we will implement for you.
        <br/><br/>
        Display a message when the root URL of the server is accessed directly.
        <br/><br/><b>Difficulty</b>: N/A
    </td>
    <td>
        GET
    </td>
    <td>
        <b>Query Parameters</b><br/>
        <code>{}</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{message}</code>
    </td>
    <td>
        N/A
    </td>
  </tr>
  <tr>
    <td>
        <code>/echo/echo</code><br /><br />
        This is an example route that we will implement for you.
        <br/><br/>
        Echoes the given message back to the caller.
        <br/><br/><b>Difficulty</b>: N/A
    </td>
    <td>
        GET
    </td>
    <td>
        <b>Query Parameters</b><br/>
        <code>{message}</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{message}</code>
    </td>
    <td>
        Return <code>{error}</code> with status code 400 when any of:
        <ul>
            <li>when the message passed in is exactly <code>echo</code>.</li>
        </ul>
    </td>
  </tr>
  <tr>
    <td>
        <code>/post/create</code><br /><br />
        Adds a new post to our forum.
        <br/><br/><b>Difficulty</b>: ⭐⭐
    </td>
    <td>
        POST
    </td>
    <td>
        <b>Body Parameters</b><br/>
        <code>{sender, title, content}</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{postId}</code>
    </td>
    <td>
        Return <code>{error}</code> with status code 400 when any of:
        <ul>
            <li>sender is an empty string, <code>""</code></li>
            <li>title is an empty string, <code>""</code></li>
            <li>content is an empty string, <code>""</code></li>
        </ul>
    </td>
  </tr>
  <tr>
    <td>
        <code>/post/:postid/comment</code><br /><br />
        Adds a new comment to a forum post.
        <br/><br/><b>Difficulty</b>: ⭐⭐
    </td>
    <td>
        POST
    </td>
    <td>
        <b>Body Parameters</b><br/>
        <code>{sender, comment}</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{commentId}</code>
    </td>
    <td>
        Return <code>{error}</code> with status code 400 when any of:
        <ul>
            <li>postid does not refer to a valid post</li>
            <li>sender is an empty string, <code>""</code></li>
            <li>comment is an empty string, <code>""</code></li>
        </ul>
    </td>
  </tr>
  <tr>
    <td>
        <code>/post/:postid</code><br /><br />
        Fetch all details about a single forum post.
        <br /><br />
        Comments in the post are sorted such that the most recent comment will
        appear at index 0. For example, if three comments are made in the order
        <code>c1</code>, <code>c2</code> and <code>c3</code>, the returned list
        will contain <code>[c3, c2, c1]</code>.
        <br/><br/><b>Difficulty</b>: ⭐⭐⭐
    </td>
    <td>
        GET
    </td>
    <td>
        <b>Query Parameters</b><br/>
        <code>{}</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{post}</code>
    </td>
    <td>
        Return <code>{error}</code> with status code 400 when 
        <ul>
            <li>postid does not refer to a valid post.</li>
        </ul>
    </td>
  </tr>
  <tr>
    <td>
        <code>/post/:postid</code><br /><br />
        Edits a single forum post. Note that the timeSent for this post remains unchanged.
        <br /><br />
        <br/><br/><b>Difficulty</b>: ⭐⭐
    </td>
    <td>
        PUT
    </td>
    <td>
        <b>Body Parameters</b><br/>
        <code>{sender, title, content}</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{}</code>
    </td>
    <td>
        Return <code>{error}</code> with status code 400 when
        <ul>
            <li>postid does not refer to a valid post</code></li>
            <li>sender is an empty string, <code>""</code></li>
            <li>title is an empty string, <code>""</code></li>
            <li>content is an empty string, <code>""</code></li>
        </ul>
    </td>
  </tr>
  <tr>
    <td>
        <code>/posts/list</code><br /><br />
        Fetch brief details about all forum posts.
        <br /><br />
        Posts are sorted such that the most recent post will
        appear at index 0. For example, if three posts are made in the order
        <code>p1</code>, <code>p2</code> and <code>p3</code>, the returned list
        will contain <code>[p3, p2, p1]</code>.
        <br/><br/><b>Difficulty</b>: ⭐⭐
    </td>
    <td>
        GET
    </td>
    <td>
        <b>Query Parameters</b><br/>
        <code>{}</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{posts}</code>
    </td>
    <td>
        N/A
    </td>
  </tr>
  <tr>
    <td>
        <code>/clear</code><br /><br />
        Clear all data and returns an empty object.
        <br/><br/><b>Difficulty</b>: ⭐
    </td>
    <td>
        DELETE
    </td>
    <td>
        <b>Query Parameters</b><br/>
        <code>{}</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{}</code>
    </td>
    <td>
        N/A
    </td>
  </tr>
</table>

### Interface: Data Types
| Variable Name | Type |
| --- | --- |
| is exactly **error** | `string`, with the value being a relevant error message of your choice |
| contains suffix **Id** | `number`, specifically integer |
| is exactly **message** | `string` |
| is exactly **sender** | `string` |
| is exactly **title** | `string` |
| is exactly **content** | `string` |
| is exactly **comment** | `string` |
| contains the prefix **time** | `number`, specifically an [**integer UNIX timestamp**](https://flaviocopes.com/how-to-get-timestamp-javascript/) in **seconds** (not milliseconds!). |
| is exactly **comments** | `Array` of objects, where each `object` contains the keys `{commentId, sender, comment, timeSent}` |
| is exactly **post** | `object` containing keys `{postId, sender, title, timeSent, content, comments}` |
| is exactly **posts** | `Array` of objects, where each `object` contains the keys `{postId, sender, title, timeSent}` |

## Task

### Testing

See [src/root.test.ts](src/root.test.ts) and [src/echo.test.ts](src/echo.test.ts) for examples of how you can write HTTP tests with [sync-request](https://www.npmjs.com/package/sync-request). **Make sure to remove the redundant tests and uncomment the correct ones**.

You can create as many test files or directories as you like. The quality of your tests will be assessed, so aim to cover as many different cases as possible.

You should **only be testing the HTTP layer**. This is done by sending requests to the server and checking the responses using the [Interface: Routes](#interface-routes). Any "functions" or "data store" that you introduce are considered implementation details and should not be imported or tested directly in any test file. Your test should work for another student's implementation of the server.

To test your code, you will need to use two different terminals:

<table>
    <tr>
        <th><b>Terminal 1 - Server</b></th>
        <th><b>Terminal 2 - Test</b></th>
    </tr>
    <tr>
        <td>
            <code>$ npm run ts-node src/server.ts</code>
        </td>
        <td>
            <code>$ npm test</code>
        </td>
    </tr>
</table>

### Implementation

This lab is similar to lab03_academics, with the difference being that a server is being wrapped on top of existing functions. Please revisit lab03_academics or view the solutions in the solution branch before attempting this lab.

We recommend keeping your routes in [src/server.ts](src/server.ts) as wrappers around other functions.
For example, for the route `/echo/echo` in [src/server.ts](src/server.ts), the implementation is abstracted away into the `echo` function
which is imported from [src/echo.ts](src/echo.ts).

You can create as many files and subdirectories as you want. For example, [src/dataStore.ts](src/dataStore.ts) and [src/forum.ts](src/forum.ts) have been created for you, which you may choose to edit and use if you wish.

Note that data persistence is **not** a requirement in this lab (your data can simply live in memory), although you are free to implement this if you wish.

### Swagger API (optional)

A [swagger.yaml](swagger.yaml) file is also available in this repository. This is simply for your convenience and may contain mistakes. 

Please let us know on the course forum if you can identify any inconsistency with the specification :D.

If you wish to use the "Try it out" button to send requests to your server directly, click on the dropdown to open the instructions below.

<details close>

<summary>Instructions for adding dynamic swagger route</summary>

1. Install the necessary dependencies

    ```shell
    $ npm i yamljs swagger-ui-express
    $ npm i -D @types/yamljs @types/swagger-ui-express
    ```

1. Add the following imports at the top of [src/server.ts](src/server.ts):
    ```typescript
    import YAML from 'yamljs';
    import swaggerUi from 'swagger-ui-express';
    ```

1. Add the following lines directly below the definition of your `app` (i.e. below the line `const app = express()`) in [src/server.ts](src/server.ts):

    ```typescript
    const swaggerDocument = YAML.load('./swagger.yaml');
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    ```

1. Access your server from the browser and follow the `/api-docs` path. For example, assuming your server is running on port `49152`, this would be:

    ```
    http://127.0.0.1:49152/api-docs/
    ```

</details>

### API Clients (optional)

If you are using an API Client such as ARC, Insomnia or POSTMAN, be mindful that to send a valid body for PUT/POST requests, you should:
1. Check that the `"Body content type"` is set as `"application/json"`
1. Your `JSON` string uses double quotes (`""`) for both keys and values

On VLAB (and **not** VSCode SSH-FS, which isn't supported),

1. ARC can be run with:
    ```shell
    $ 1531 arc
    ```
1. Insomnia can be run with
    ```shell
    $ 1531 insomnia
    ```
1. Postman can be run with
    ```shell
    $ 1531 postman
    ```
    
If you are working locally and wish to use these tools, you are advised to look up the instructions specific to your environment.

### Frontend (optional)

A prototype frontend for the forum application is hosted at:
- https://comp1531frontend.gitlab.io/forum

To use the frontend, simply paste your backend URL (e.g. http://127.0.0.1:49152) into the input box.

While additional error checking has been built into the frontend, it is not uncommon to encounter a blank/white screen. This is usually attributed to having an incorrect return type in one of the routes from your backend, most commonly from `GET` requests such as `post/:postid (GET)` or `posts/list`.

If you are running your backend server in VLAB, you must also open a browser from within VLAB to have access to localhost or 127.0.0.1. Likewise, if your server is started locally (e.g. through WSL), you can use your local browser.

The frontend will not support any backend server running through VSCode SSH-FS. Please only use VLAB if you wish to connect your backend to the frontend on CSE.

### Tips, Hints and Common Mistakes

1. Sometimes you will need to store more information in the data store than given in the input parameter for the "create" routes, as they will be needed later upon retrieval. For example, a timestamp for posts and comments.

1. When testing UNIX timestamps, you should try to account for delays between requests. One approach could be:
    ```javascript
    const expectedTimeSent = 1652454539;

    const timeSent = ... // get value from a post or comment's timeSent
    expect(timeSent).toBeGreaterThanOrEqual(expectedTimeSent);
    // Allow for 2 second delay
    expect(timeSent).toBeLessThanOrEqual(expectedTimeSent + 2);
    ```
    Another approach that may be cleaner (although requires a potentially complex initial setup) is [jest-extended](https://jest-extended.jestcommunity.dev/docs/)'s matcher [`.toBeWithin`](https://jest-extended.jestcommunity.dev/docs/matchers/Number#tobewithinstart-end).


1. If you see the error `ECONNREFUSED` in your tests, this could mean two things:
    1. The tests are not sending requests to a valid server. One common mistake is forgetting to add a leading slash, e.g. `echo` instead of the correct `/echo`. If this is the case, Jest would also be showing that port `80` is used instead of the value in your [config.json](config.json), i.e. `"connect ECONNREFUSED 127.0.0.1:80"`
    1. Your server has not been started successfully. Check the output of the terminal running your server to see why.

1. When starting your server, if you see an error message equivalent to `Error: listen EADDRINUSE: address already in use :::49152`, it is likely that:
    1. You are working on a CSE machine (e.g. through VLAB) and another student is using this port
    1. You have another terminal running a server on the same port (e.g. 49152)

    Try changing the port number in the file `config.json` to a different value and try again.

1. If your server encounters the error `ERR_HTTP_HEADERS_SENT`, this could mean that you are using `res.json()` more than once in your `server.ts`.
    - Note that, unlike `return`, this does not terminate the route and it is not possible to send a response twice for a single request.
    - This is why we recommend you abstract your code into a function in another file (which uses `return`), then simply use `res.json()` once in `server.ts` and treat the routes as "wrappers". Another workaround is:
        <details close>
        <summary>click to view</summary>

        ```js
        if (somethingCondition) {
            res.json({});
            return;
        }
        res.json();
        ```
        or more simply,
        ```js
        if (somethingCondition) {
            return res.json({});
        }
        res.json();
        ```

        </details>

1. If you receive an error with the code `404`, it means that the route you're requesting in your test cannot be found on your server. This is likely due to:
    - You not having implemented the route
    - There is a typo in either your test or server, e.g. `/post/view` in one and, incorrectly, `/posts/view` in the other.
    - You are using `ts-node` (instead of `ts-node-dev` which automatically reloads on change) to start your server and have forgotten to manually restart the server to load the new changes.
    
1. If you receive an error with the code `500`, this means that your server has crashed while handling a request. The best place to look for why this occurred would be the server log (the output of the terminal that you're running the server on) 

1. For a more detailed explanation of the "test-wrapper-functions" approach in [src/echo.test.ts](src/echo.test.ts), refer to [tips/lab05_forum_test_wrapper_tips.png](tips/lab05_forum_test_wrapper_tips.png):
    <details close>
    <summary>click to view</summary>

    ![Lab05 Forum Test Wrapper Tips](tips/lab05_forum_test_wrapper_tips.png)

    </details>


### Asking for Help on the Course Forum

As this is a difficult lab, don't hesitate to reach out to our staff on the forum :). However, before doing so, please follow the guideline below, otherwise you may find yourself being redirected to this section!

When making a forum post, please ensure that you 

1. Have read through through the [Tips, Hints and Common Mistakes](#tips-hints-and-common-mistakes) section.

1. State your working environment (e.g. VLAB, VSCode SSH-FS, WSL, Windows, MacOs, Linux, etc)

1. The output of the following commands:
    ```shell
    $ which node npm
    $ npm version
    ```

1. Select exactly one test to reproduce/demonstrate your issue. Use `test.only(...)` in your test file for this test and run the command
    ```shell
    $ npm t NAME_OF_YOUR_TEST_FILE.test.ts
    ```
    Please **also** include the following information from running your single selected test:

    1. The <u>full</u> output, not snippets, from both your server log (the terminal running your server)
    1. The <u>full</u> output, not snippets, from your tests (the terminal you run `npm t` on)

1. Other relevant information, e.g. results from Swagger/API Clients/Frontend

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
  "name": "lab05_forum",
  "version": "1.0.0",
  "description": "[TOC]",
  "main": "src/server.ts",
  "scripts": {
    "start": "ts-node-dev src/server.ts",
    "test": "jest",
    "posttest":  "pkill -f 'node_modules/sync-rpc/lib/worker.js' > /dev/null 2>&1",
    "ts-node": "ts-node",
    "tsc": "tsc --noEmit",
    "lint": "eslint src/**.ts"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@types/cors": "^2.8.12",
    "@types/express": "^4.17.13",
    "@types/jest": "^27.5.1",
    "@types/morgan": "^1.9.3",
    "@typescript-eslint/eslint-plugin": "^5.23.0",
    "@typescript-eslint/parser": "^5.23.0",
    "eslint": "^8.15.0",
    "eslint-plugin-jest": "^26.2.1",
    "jest": "^28.1.0",
    "ts-node-dev": "^2.0.0",
    "sync-request": "^6.1.0",
    "ts-jest": "^28.0.2",
    "typescript": "^4.6.4"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.18.1",
    "morgan": "^1.10.0",
    "ts-node": "^10.7.0"
  }
}
```

</details>

### Miscellaneous

<details>

<summary>Other information that is not core to the course</summary><br/>

1. You may have noticed that [jest.config.js](jest.config.js) is slightly different from lab04_encanto - it has the added key `maxWorkers: 1`.
    - This is so that test files run one at a time (i.e. synchronously, as opposed to asynchronously), otherwise we will run into issues with sync-request.
    - Async is beyond the scope of COMP1531 :).
1. For the `posttest` script in package.json
    - This script will always run after the `test` script - for more information on pre/post scripts, see [here](https://docs.npmjs.com/cli/v8/using-npm/scripts#pre--post-scripts).
    - The command `pkill -f 'node_modules/sync-rpc/lib/worker.js' > /dev/null 2>&1` is a hacky way to clean up the subprocess generated by [sync-request](https://www.npmjs.com/package/sync-request) when used in Jest. More on this issue [here](https://github.com/ForbesLindesay/sync-rpc/issues/10).

</details>
