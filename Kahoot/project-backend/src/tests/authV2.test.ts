
// import * as auth from '../server/helperfunction';
import * as auth from '../server/route';
import HTTPError from 'http-errors';

const ERROR = { error: expect.any(String) };

beforeEach(() => {
  auth.clear();
});

afterEach(() => {
  auth.clear();
});

describe('adminAuthLogout', () => {
  let user1: any;

  beforeEach(() => {
    user1 = auth.adminAuthRegister('louis@gmail.com', 'qwertyuiop2', 'Louis', 'Nguyen').body;
  });

  test('Successfully logged out', () => {
    expect(auth.adminAuthLogoutV2(user1.token)).toStrictEqual({});
  });

  test('Token is not a valid structure 1', () => {
    expect(() => auth.adminAuthLogoutV2('')).toThrow(HTTPError[401]);
  });

  test('Token is not a valid structure 2', () => {
    expect(() => auth.adminAuthLogoutV2(null)).toThrow(HTTPError[401]);
  });

  test('This token is for a user who has already logged out', () => {
    auth.adminAuthLogoutV2(user1.token);
    expect(() => auth.adminAuthLogoutV2(user1.token)).toThrow(HTTPError[400]);
  });
});

describe('adminUserDetails', () => {
  let user1: any;

  beforeEach(() => {
    user1 = auth.adminAuthRegister('marius@gmail.com', 'A2816a27', 'Marius', 'Edmonds').body;
  });

  test('Provided token is valid structure, but is not for a currently logged in session', () => {
    auth.adminAuthLogoutV2(user1.token);
    expect(() => auth.adminUserDetailsV2(user1.token)).toThrow(HTTPError[403]);
  });

  test('Token is not a valid structure', () => {
    expect(() => auth.adminUserDetailsV2('')).toThrow(HTTPError[401]);
  });

  test('Token is not a valid structure', () => {
    expect(() => auth.adminUserDetailsV2(null)).toThrow(HTTPError[401]);
  });

  test('Successfully returned user details', () => {
    const response: any = auth.adminUserDetailsV2(user1.token);
    expect(response).toStrictEqual({
      user: {
        userId: expect.any(Number),
        name: 'Marius Edmonds',
        email: 'marius@gmail.com',
        numSuccessfulLogins: expect.any(Number),
        numFailedPasswordsSinceLastLogin: expect.any(Number),
      }
    });
  });
});

describe('adminUserDetailsUpdate', () => {
  let user1: any;

  beforeEach(() => {
    user1 = auth.adminAuthRegister('louis@gmail.com', 'qwertyuiop2', 'Louis', 'Nguyen').body;
  });

  test('Token is not a valid structure 1', () => {
    expect(() => auth.adminUserDetailsUpdateV2('', 'Louis', 'Nguyen', 'example@gmail.com')).toThrow(HTTPError[401]);
  });

  test('Token is not a valid structure 2', () => {
    expect(() => auth.adminUserDetailsUpdateV2(null, 'Louis', 'Nguyen', 'example@gmail.com')).toThrow(HTTPError[401]);
  });

  test('Provided token is valid structure, but is not for a currently logged in session', () => {
    auth.adminAuthLogoutV2(user1.token);
    expect(() => auth.adminUserDetailsUpdateV2(user1.token, 'example@gmail.com', 'Louis', 'Nguyen')).toThrow(HTTPError[403]);
  });

  test('NameFirst is not valid characters', () => {
    expect(() => auth.adminUserDetailsUpdateV2(user1.token, 'example@gmail.com', 'Louis<>', 'Nguyen')).toThrow(HTTPError[400]);
  });

  test('NameFirst is not valid length too long', () => {
    expect(() => auth.adminUserDetailsUpdateV2(user1.token, 'example@gmail.com', 'asdfghjkliuytregdffhjr', 'Nguyen')).toThrow(HTTPError[400]);
  });

  test('NameFirst is not valid length too short', () => {
    expect(() => auth.adminUserDetailsUpdateV2(user1.token, 'example@gmail.com', 'H', 'Nguyen')).toThrow(HTTPError[400]);
  });

  test('NameLast is not valid characters', () => {
    expect(() => auth.adminUserDetailsUpdateV2(user1.token, 'example@gmail.com', 'Louis', 'Nguyen?~')).toThrow(HTTPError[400]);
  });

  test('NameLast is not valid length too long', () => {
    expect(() => auth.adminUserDetailsUpdateV2(user1.token, 'example@gmail.com', 'Louis', 'qwertyuiopasdfghjklzxcv')).toThrow(HTTPError[400]);
  });

  test('NameLast is not valid length too short', () => {
    expect(() => auth.adminUserDetailsUpdateV2(user1.token, 'example@gmail.com', 'Louis', 'F')).toThrow(HTTPError[400]);
  });

  test('Email address is used by another user', () => {
    auth.adminAuthRegister('example@gmail.com', 'a1bcd234', 'Louis', 'Nguyen');
    expect(() => auth.adminUserDetailsUpdateV2(user1.token, 'example@gmail.com', 'Louis', 'Nguyen')).toThrow(HTTPError[400]);
  });

  test('Email address is not valid', () => {
    expect(() => auth.adminUserDetailsUpdateV2(user1.token, 'abcdef', 'Louis', 'Nguyen')).toThrow(HTTPError[400]);
  });

  test('Successfully updated user details', () => {
    const response: any = auth.adminUserDetailsUpdateV2(user1.token, 'example@gmail.com', 'Louis', 'Nguyen');
    expect(response).toStrictEqual({});
    expect(auth.adminUserDetailsV2(user1.token)).toStrictEqual({
      user: {
        userId: expect.any(Number),
        name: 'Louis Nguyen',
        email: 'example@gmail.com',
        numSuccessfulLogins: expect.any(Number),
        numFailedPasswordsSinceLastLogin: expect.any(Number),
      }
    });
  });
});

describe('adminUserPasswordUpdate', () => {
  let user1: any;

  beforeEach(() => {
    user1 = auth.adminAuthRegister('louis@gmail.com', 'qwertyuiop2', 'Louis', 'Nguyen').body;
  });

  test('Token is not a valid structure 1', () => {
    expect(() => auth.adminUserPasswordUpdateV2('', 'qwertyuiop2', 'qwertyuiop3')).toThrow(HTTPError[401]);
  });

  test('Token is not a valid structure 2', () => {
    expect(() => auth.adminUserPasswordUpdateV2(null, 'qwertyuiop2', 'qwertyuiop3')).toThrow(HTTPError[401]);
  });

  test('Provided token is valid structure, but is not for a currently logged in session', () => {
    auth.adminAuthLogout(user1.token);
    expect(() => auth.adminUserPasswordUpdateV2(user1.token, 'qwertyuiop2', 'qwertyuiop3')).toThrow(HTTPError[403]);
  });

  test('Password is not valid length', () => {
    expect(() => auth.adminUserPasswordUpdateV2(user1.token, 'qwertyuiop2', 'qwerty')).toThrow(HTTPError[400]);
  });

  test('Password is not valid with only number', () => {
    expect(() => auth.adminUserPasswordUpdateV2(user1.token, 'qwertyuiop2', '123456789')).toThrow(HTTPError[400]);
  });

  test('Password is not valid with only letter', () => {
    expect(() => auth.adminUserPasswordUpdateV2(user1.token, 'qwertyuiop2', 'qwertyuiop')).toThrow(HTTPError[400]);
  });

  test('Successfully updated user password', () => {
    expect(auth.adminUserPasswordUpdateV2(user1.token, 'qwertyuiop2', 'qwertyuiop3')).toStrictEqual({});
    let loginResponse = auth.adminAuthLogin('louis@gmail.com', 'qwertyuiop3');
    expect(loginResponse.status).toStrictEqual(200);
    expect(loginResponse.body).toStrictEqual({ token: expect.any(String) });

    // cant login with old password
    loginResponse = auth.adminAuthLogin('louis@gmail.com', 'qwertyuiop2');
    expect(loginResponse.status).toStrictEqual(400);
    expect(loginResponse.body).toStrictEqual(ERROR);
  });

  test('Incorrect old password', () => {
    expect(() => auth.adminUserPasswordUpdateV2(user1.token, 'qwertyuiop1', 'qwertyuiop')).toThrow(HTTPError[400]);
    expect(auth.adminUserPasswordUpdateV2(user1.token, 'qwertyuiop2', 'qwertyuiop4')).toStrictEqual({});
    expect(() => auth.adminUserPasswordUpdateV2(user1.token, 'qwertyuiop2', 'qwertyuiop4')).toThrow(HTTPError[400]);
  });

  test('Password is used before', () => {
    expect(auth.adminUserPasswordUpdateV2(user1.token, 'qwertyuiop2', 'qwertyuiop3')).toStrictEqual({});
    expect(() => auth.adminUserPasswordUpdateV2(user1.token, 'qwertyuiop3', 'qwertyuiop2')).toThrow(HTTPError[400]);
    expect(auth.adminUserPasswordUpdateV2(user1.token, 'qwertyuiop3', 'qwertyuiop4')).toStrictEqual({});
    expect(() => auth.adminUserPasswordUpdateV2(user1.token, 'qwertyuiop4', 'qwertyuiop2')).toThrow(HTTPError[400]);
    expect(() => auth.adminUserPasswordUpdateV2(user1.token, 'qwertyuiop4', 'qwertyuiop3')).toThrow(HTTPError[400]);
  });
});
