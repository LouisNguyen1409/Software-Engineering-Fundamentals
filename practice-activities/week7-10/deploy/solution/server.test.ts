import request from 'sync-request';

const OK = 200;
// YOUR ALWAYSDATA URL WOULD GO HERE
const url = 'http://localhost:8080';

beforeEach(() => {
  request(
    'DELETE',
    `${url}/clear`,
    {}
  );
});

describe('NamesAges tests', () => {
  test('Test successful add name', () => {
    let res = request(
      'GET',
      `${url}/getnamesages`,
      {}
    );
    let bodyObj = JSON.parse(res.body as string);
    expect(res.statusCode).toBe(OK);
    expect(bodyObj).toEqual([]);

    res = request(
      'POST',
      `${url}/addnameage`,
      {
        json: { name: 'Rob', dob: 1000 }
      }
    );
    bodyObj = JSON.parse(res.body as string);
    expect(res.statusCode).toBe(OK);
    expect(bodyObj).toEqual({});
  });
  test('Test get names restrict', () => {
    let res = request(
      'POST',
      `${url}/addnameage`,
      {
        json: { name: 'Rob', dob: 1000 }
      }
    );
    res = request(
      'POST',
      `${url}/addnameage`,
      {
        json: { name: 'Hayden', dob: 10 ** 8 }
      }
    );
    res = request(
      'GET',
      `${url}/getnamesages`,
      {
        qs: {
          minAge: 50,
        }
      }
    );
    const bodyObj = JSON.parse(res.body as string);
    expect(res.statusCode).toBe(OK);
    expect(bodyObj).toEqual([{
      name: 'Rob', age: 52,
    }]);
  });
  test('Test edit names ages', () => {
    let res = request(
      'POST',
      `${url}/addnameage`,
      {
        json: { name: 'Rob', dob: 1000 }
      }
    );
    res = request(
      'PUT',
      `${url}/editnameage`,
      {
        json: { name: 'Rob', dob: 10 ** 8 }
      }
    );
    res = request(
      'GET',
      `${url}/getnamesages`,
      {}
    );
    const bodyObj = JSON.parse(res.body as string);
    expect(res.statusCode).toBe(OK);
    expect(bodyObj).toEqual([{
      name: 'Rob', age: 49,
    }]);
  });
});
