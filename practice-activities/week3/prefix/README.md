## Prefix

Open [prefix.js](prefix.js) and complete the function `prefixSearch` as follows:

Given an object called `dictionary` of type `Dictionary` (string for keys, number for values) and a string, returns a new object containing only the keys (and their corresponding values) for which the string is a prefix.

If the string is not a prefix for any key, `{}` is returned.

No need to consider cases involving empty strings.

For example,

```js
console.log(prefixSearch({ ac: 1, ba: 2, ab: 3 }, 'a'));
```
should output:
```js
{ 'ac': 1, 'ab': 3 }
```

Some tests have been added in `prefix.test.js`. Ensure your solution passes these tests. Feel free to also write tests of your own.