## Lab05 - Exercise - Img Sneak (Choice - 3 points)

Setup an express server `imgsneak.py` that serves any png at a path `/email/img.png?code=ABCDEFG`

Where `ABCDEFG` is a unique code that can be anything.

You may copy a static folder serving the image into the `/build` folder once you have run `npm run tsc` to ensure the file can be found by your transpiled code.

When this route is accessed (via GET method), the unique code should be printed to terminal.

During the lab demonstration, send an email (via any email account on the CSE machine) to yourself. The email should be a raw email with the following code:

```html
<img src="http://127.0.0.1/email/img.png?code=yourname" />
```

When you open the email, your running express server should print out the code.
