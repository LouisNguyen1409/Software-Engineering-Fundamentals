import request from 'sync-request';

const body = (res) => JSON.parse(res.getBody() as string);

const clear = () => {
  request('DELETE', 'http://localhost:3001/names');
};

describe('Adding and removing one name', () => {
  beforeAll(clear);
  test('Check if initially names are empty', () => {
    const res = request('GET', 'http://localhost:3001/names');
    const { names } = body(res);
    expect(names).toEqual([]);
  });
  test('Add a name', () => {
    const res = request('POST', 'http://localhost:3001/names/add', {
      json: { name: 'Hayden' },
    });
    expect(body(res)).toEqual({});
  });
  test('Check if one name is now added', () => {
    const res = request('GET', 'http://localhost:3001/names');
    const { names } = body(res);
    expect(names).toEqual(['Hayden']);
  });
});

describe('Adding and removing one name', () => {
  beforeAll(clear);
  test('Check if initially names are empty', () => {
    const res = request('GET', 'http://localhost:3001/names');
    const { names } = body(res);
    expect(names).toEqual([]);
  });
  test('Add many names', () => {
    let res = request('POST', 'http://localhost:3001/names/add', {
      json: { name: 'Hayden' },
    });
    expect(body(res)).toEqual({});
    res = request('POST', 'http://localhost:3001/names/add', {
      json: { name: 'Tam' },
    });
    expect(body(res)).toEqual({});
    res = request('POST', 'http://localhost:3001/names/add', {
      json: { name: 'Rani' },
    });
    expect(body(res)).toEqual({});
  });
  test('Ensure all names are there', () => {
    const res = request('GET', 'http://localhost:3001/names');
    const { names } = body(res);
    expect(names).toEqual(['Hayden', 'Tam', 'Rani']);
  });
});

describe('Remove a name', () => {
  beforeAll(() => {
    request('DELETE', 'http://localhost:3001/names');
  });
  test('Check if initially names are empty', () => {
    const res = request('GET', 'http://localhost:3001/names');
    const { names } = body(res);
    expect(names).toEqual([]);
  });
  test('Add many names', () => {
    let res = request('POST', 'http://localhost:3001/names/add', {
      json: { name: 'Hayden' },
    });
    expect(body(res)).toEqual({});
    res = request('POST', 'http://localhost:3001/names/add', {
      json: { name: 'Tam' },
    });
    expect(body(res)).toEqual({});
    res = request('POST', 'http://localhost:3001/names/add', {
      json: { name: 'Rani' },
    });
    expect(body(res)).toEqual({});
  });
  test('Remove a name', () => {
    const res = request('POST', 'http://localhost:3001/names/remove', {
      json: { name: 'Tam' },
    });
    expect(body(res)).toEqual({});
  });
  test('Ensure only two names are left', () => {
    const res = request('GET', 'http://localhost:3001/names');
    const { names } = body(res);
    expect(names).toEqual(['Hayden', 'Rani']);
  });
});
