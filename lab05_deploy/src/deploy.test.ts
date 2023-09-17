import request from 'sync-request';
import { DEPLOYED_URL } from './deploy';




function requestEcho(message: string) {
  const res = request(
    'GET',
    DEPLOYED_URL + '/echo/echo',
    {
      // Note that for PUT/POST requests, you should
      // use the key 'json' instead of the query string 'qs'
      qs: {
        message
      },
      timeout: 20000,
    },
  );
  switch(res.statusCode) {
    case 200:
    case 400:
      return JSON.parse(res.body.toString());
    default:
      return {
        comp1531ErrorHint: `/echo/echo should not return a status code other than 200/400. Body: ${res.body.toString()}`
      }
  }
}

test('Deployed Server Sanity check', () => {
  const zIDs = (DEPLOYED_URL.match(/z[0-9]{7}/g) || []);

  // URL Sanity test
  expect(zIDs.length).toEqual(1);
  expect(DEPLOYED_URL.startsWith('http')).toBe(true);
  expect(DEPLOYED_URL.endsWith('/')).toBe(false);

  if (process.env.GITLAB_USER_LOGIN) {
    // Pipeline CI test
    expect(zIDs[0]).toEqual(process.env.GITLAB_USER_LOGIN);
  }

  // Root test
  const res = request('GET', DEPLOYED_URL + '/', { qs: {}, timeout: 20000 });
  const data = JSON.parse(res.body.toString());
  expect(data).toStrictEqual({ message: expect.any(String) });

  // Echo tests
  expect(requestEcho('wrapper')).toStrictEqual({ message: 'wrapper' });
  expect(requestEcho('echo')).toStrictEqual({ error: expect.any(String) });
});


