import request from 'sync-request';

import { port, url } from './config.json';
const SERVER_URL = `${url}:${port}`;

// We're only importing the SERVER_URL from config.
// No functions that you've written should be imported,
// as all tests should be done through HTTP requests.

// We can write a test that sends a request directly
test('success direct', () => {
  const res = request(
    'GET',
    SERVER_URL + '/echo/echo',
    {
      // Note that for PUT/POST requests, you should
      // use the key 'json' instead of the query string 'qs'
      qs: {
        message: 'direct',
      }
    }
  );
  const data = JSON.parse(res.body.toString());
  expect(data).toStrictEqual({ message: 'direct' });
});

// Alternatively, we can define wrapper functions to help us
// send requests to the echo route:
function requestEcho(message: string) {
  const res = request(
    'GET',
    SERVER_URL + '/echo/echo',
    {
      // Note that for PUT/POST requests, you should
      // use the key 'json' instead of the query string 'qs'
      qs: {
        message
      }
    }
  );
  // NOTE: information about status code can also be checked/returned
  // if necessary, through res.statusCode
  return JSON.parse(res.body.toString());
}

// Then use our wrapper as follow:
test('success wrapper', () => {
  expect(requestEcho('wrapper')).toStrictEqual({ message: 'wrapper' });
});

test('failure, echo echo', () => {
  expect(requestEcho('echo')).toStrictEqual({ error: expect.any(String) });
});

// It may also be possible to extend these helper/wrapper functions to work
// for different methods, routes, etc.
