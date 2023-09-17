import { prefixSearch } from './solution/prefix';

test('exact', () => {
  expect(prefixSearch({ hello: 1 }, 'hello')).toStrictEqual({ hello: 1 });
});

test('example', () => {
  expect(prefixSearch({ ac: 1, ba: 2, ab: 3 }, 'a')).toStrictEqual({ ac: 1, ab: 3 });
});

test('error', () => {
  expect(prefixSearch({ ac: 1, ba: 2, ab: 3 }, 'd')).toStrictEqual({});
});
