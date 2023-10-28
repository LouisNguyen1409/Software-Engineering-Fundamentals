// import * as auth from '../server/helperfunction';
import * as auth from '../server/route';
import * as type from '../interface';
// import HTTPError from 'http-errors';

const ERROR = { error: expect.any(String) };

beforeEach(() => {
  auth.clear();
});

afterEach(() => {
  auth.clear();
});

/**
 * Written by Louis
 * Testing for adminAuthRegister in auth.ts
 */
describe('adminAuthRegister', () => {
  test('Email address is used by another user', () => {
    auth.adminAuthRegister('louis@gmail.com', 'a1bcd234', 'Louis', 'Nguyen');
    const response: type.Response = auth.adminAuthRegister('louis@gmail.com', 'rjfgrt7373', 'Marshall', 'Vuitton');
    expect(response.body).toStrictEqual(ERROR);
    expect(response.status).toStrictEqual(400);
  });

  test('Email address is not valid', () => {
    const response: type.Response = auth.adminAuthRegister('abcdef', 'rjfgrt7373', 'Louis', 'Vuitton');
    expect(response.body).toStrictEqual(ERROR);
    expect(response.status).toStrictEqual(400);
  });

  test('NameFirst is not valid characters', () => {
    const response: type.Response = auth.adminAuthRegister('louis@gmail.com', 'rjfgrt7373', 'Louis<>', 'Vuitton');
    expect(response.body).toStrictEqual(ERROR);
    expect(response.status).toStrictEqual(400);
  });

  test('NameFirst is not valid length too long', () => {
    const response: type.Response = auth.adminAuthRegister('louis@gmail.com', 'rjfgrt7373', 'asdfghjkliuytregdffhjr', 'Vuitton');
    expect(response.body).toStrictEqual(ERROR);
    expect(response.status).toStrictEqual(400);
  });

  test('NameFirst is not valid length too short', () => {
    const response: type.Response = auth.adminAuthRegister('louis@gmail.com', 'rjfgrt7373', 'H', 'Vuitton');
    expect(response.body).toStrictEqual(ERROR);
    expect(response.status).toStrictEqual(400);
  });

  test('NameLast is not valid characters', () => {
    const response: type.Response = auth.adminAuthRegister('louis@gmail.com', 'rjfgrt7373', 'Louis', 'Vuitton?~');
    expect(response.body).toStrictEqual(ERROR);
    expect(response.status).toStrictEqual(400);
  });

  test('NameLast is not valid length too long', () => {
    const response: type.Response = auth.adminAuthRegister('louis@gmail.com', 'rjfgrt7373', 'Louis', 'qwertyuiopasdfghjklzxcv');
    expect(response.body).toStrictEqual(ERROR);
    expect(response.status).toStrictEqual(400);
  });

  test('NameLast is not valid length too short', () => {
    const response: type.Response = auth.adminAuthRegister('louis@gmail.com', 'rjfgrt7373', 'Louis', 'F');
    expect(response.body).toStrictEqual(ERROR);
    expect(response.status).toStrictEqual(400);
  });

  test('Password is not valid length', () => {
    const response: type.Response = auth.adminAuthRegister('louis@gmail.com', '82ue', 'Louis', 'Vuitton');
    expect(response.body).toStrictEqual(ERROR);
    expect(response.status).toStrictEqual(400);
  });

  test('Password is not valid with only number', () => {
    const response: type.Response = auth.adminAuthRegister('louis@gmail.com', '123456789', 'Louis', 'Vuitton');
    expect(response.body).toStrictEqual(ERROR);
    expect(response.status).toStrictEqual(400);
  });

  test('Password is not valid with only letter', () => {
    const response: type.Response = auth.adminAuthRegister('louis@gmail.com', 'qwertyuiop', 'Louis', 'Vuitton');
    expect(response.body).toStrictEqual(ERROR);
    expect(response.status).toStrictEqual(400);
  });

  test('Successful Registration: Names that are spaces but Success', () => {
    const response: type.Response = auth.adminAuthRegister('louis1@gmail.com', 'qwertyuiop1', '      ', '     ');
    expect(response.body).toStrictEqual({ token: expect.any(String) });
    expect(response.status).toStrictEqual(200);
  });

  test('Successful Registration', () => {
    const response: type.Response = auth.adminAuthRegister('louis2@gmail.com', 'qwertyuiop2', 'Louis', 'Vuitton');
    expect(response.body).toStrictEqual({ token: expect.any(String) });
    expect(response.status).toStrictEqual(200);
  });
});

/**
 * Written by Louis
 * Testing for adminAuthLogin in auth.ts
 */
describe('adminAuthLogin', () => {
  test('Email address does not exist', () => {
    const response: type.Response = auth.adminAuthLogin('nonexistentemail@gmail.com', 'nonexistentpassword');
    expect(response.body).toStrictEqual(ERROR);
    expect(response.status).toStrictEqual(400);
  });

  test('Password is incorrect', () => {
    const user1: any = auth.adminAuthRegister('marius@gmail.com', 'A2816a27', 'Marius', 'Edmonds').body;
    const response: type.Response = auth.adminAuthLogin('marius@gmail.com', '42816427');
    expect(response.body).toStrictEqual(ERROR);
    expect(response.status).toStrictEqual(400);

    const failedLogin1: number = auth.adminUserDetails(user1.token).body.user.numFailedPasswordsSinceLastLogin;
    const response2: type.Response = auth.adminAuthLogin('marius@gmail.com', '42816427');
    expect(response2.body).toStrictEqual(ERROR);
    expect(response2.status).toStrictEqual(400);
    const failedLogin2: number = auth.adminUserDetails(user1.token).body.user.numFailedPasswordsSinceLastLogin;
    expect(failedLogin2 - failedLogin1).toStrictEqual(1);
  });

  test('Email exists and password is correct', () => {
    const user1: type.Response = auth.adminAuthRegister('marius@gmail.com', 'A2816a27', 'Marius', 'Edmonds');
    const response: type.Response = auth.adminAuthLogin('marius@gmail.com', '42816427');
    expect(response.body).toStrictEqual(ERROR);
    expect(response.status).toStrictEqual(400);
    let failedLogin1 = auth.adminUserDetails(user1.body.token).body.user.numFailedPasswordsSinceLastLogin;
    const response2: type.Response = auth.adminAuthLogin('marius@gmail.com', 'A2816a27');
    expect(response2.body).toStrictEqual({
      token: expect.any(String),
    });
    expect(response2.status).toStrictEqual(200);

    const successfulLogin1: number = auth.adminUserDetails(user1.body.token).body.user.numSuccessfulLogins;
    const response3: type.Response = auth.adminAuthLogin('marius@gmail.com', 'A2816a27');
    expect(response3.body).toStrictEqual({
      token: expect.any(String),
    });
    expect(response3.status).toStrictEqual(200);
    const successfulLogin2: number = auth.adminUserDetails(user1.body.token).body.user.numSuccessfulLogins;
    expect(successfulLogin2 - successfulLogin1).toStrictEqual(1);
    failedLogin1 = auth.adminUserDetails(user1.body.token).body.user.numFailedPasswordsSinceLastLogin;
    expect(failedLogin1).toStrictEqual(0);
  });
});

/**
 * Written by Louis
 * Testing for adminUserDetails in auth.ts
 */
describe('adminUserDetails', () => {
  let user1: any;

  beforeEach(() => {
    user1 = auth.adminAuthRegister('marius@gmail.com', 'A2816a27', 'Marius', 'Edmonds').body;
  });

  test('Provided token is valid structure, but is not for a currently logged in session', () => {
    auth.adminAuthLogout(user1.token);
    const response: type.Response = auth.adminUserDetails(user1.token);
    expect(response.body).toStrictEqual(ERROR);
    expect(response.status).toStrictEqual(403);
  });

  test('Token is not a valid structure', () => {
    const response: type.Response = auth.adminUserDetails('');
    expect(response.body).toStrictEqual(ERROR);
    expect(response.status).toStrictEqual(401);
  });

  test('Token is not a valid structure', () => {
    const response: type.Response = auth.adminUserDetails(null);
    expect(response.body).toStrictEqual(ERROR);
    expect(response.status).toStrictEqual(401);
  });

  test('Successfully returned user details', () => {
    const response: type.Response = auth.adminUserDetails(user1.token);
    expect(response.body).toStrictEqual({
      user: {
        userId: expect.any(Number),
        name: 'Marius Edmonds',
        email: 'marius@gmail.com',
        numSuccessfulLogins: expect.any(Number),
        numFailedPasswordsSinceLastLogin: expect.any(Number),
      }
    });
    expect(response.status).toStrictEqual(200);
  });
});

/**
 * Written by Louis
 * Testing for adminAuthLogout in auth.ts
 */
describe('adminAuthLogout', () => {
  let user1: any;

  beforeEach(() => {
    user1 = auth.adminAuthRegister('louis@gmail.com', 'qwertyuiop2', 'Louis', 'Nguyen').body;
  });

  test('Successfully logged out', () => {
    const response: type.Response = auth.adminAuthLogout(user1.token);
    expect(response.body).toStrictEqual({});
    expect(response.status).toStrictEqual(200);
    expect(auth.adminUserDetails(user1.token).body).toStrictEqual(ERROR);
  });

  test('Token is not a valid structure 1', () => {
    const response: type.Response = auth.adminAuthLogout('');
    expect(response.body).toStrictEqual(ERROR);
    expect(response.status).toStrictEqual(401);
  });

  test('Token is not a valid structure 2', () => {
    const response: type.Response = auth.adminAuthLogout(null);
    expect(response.body).toStrictEqual(ERROR);
    expect(response.status).toStrictEqual(401);
  });

  test('This token is for a user who has already logged out', () => {
    auth.adminAuthLogout(user1.token);
    const response: type.Response = auth.adminAuthLogout(user1.token);
    expect(response.body).toStrictEqual(ERROR);
    expect(response.status).toStrictEqual(400);
  });
});

/**
 * Written by Louis
 * Testing for adminUserDetailsUpdate in auth.ts
 */
describe('adminUserDetailsUpdate', () => {
  let user1: any;

  beforeEach(() => {
    user1 = auth.adminAuthRegister('louis@gmail.com', 'qwertyuiop2', 'Louis', 'Nguyen').body;
  });

  test('Token is not a valid structure 1', () => {
    const response: type.Response = auth.adminUserDetailsUpdate('', 'Louis', 'Nguyen', 'example@gmail.com');
    expect(response.body).toStrictEqual(ERROR);
    expect(response.status).toStrictEqual(401);
  });

  test('Token is not a valid structure 2', () => {
    const response: type.Response = auth.adminUserDetailsUpdate(null, 'Louis', 'Nguyen', 'example@gmail.com');
    expect(response.body).toStrictEqual(ERROR);
    expect(response.status).toStrictEqual(401);
  });

  test('Provided token is valid structure, but is not for a currently logged in session', () => {
    auth.adminAuthLogout(user1.token);
    const response: type.Response = auth.adminUserDetailsUpdate(user1.token, 'example@gmail.com', 'Louis', 'Nguyen');
    expect(response.body).toStrictEqual(ERROR);
    expect(response.status).toStrictEqual(403);
  });

  test('NameFirst is not valid characters', () => {
    const response: type.Response = auth.adminUserDetailsUpdate(user1.token, 'example@gmail.com', 'Louis<>', 'Nguyen');
    expect(response.body).toStrictEqual(ERROR);
    expect(response.status).toStrictEqual(400);
  });

  test('NameFirst is not valid length too long', () => {
    const response: type.Response = auth.adminUserDetailsUpdate(user1.token, 'example@gmail.com', 'asdfghjkliuytregdffhjr', 'Nguyen');
    expect(response.body).toStrictEqual(ERROR);
    expect(response.status).toStrictEqual(400);
  });

  test('NameFirst is not valid length too short', () => {
    const response: type.Response = auth.adminUserDetailsUpdate(user1.token, 'example@gmail.com', 'H', 'Nguyen');
    expect(response.body).toStrictEqual(ERROR);
    expect(response.status).toStrictEqual(400);
  });

  test('NameLast is not valid characters', () => {
    const response: type.Response = auth.adminUserDetailsUpdate(user1.token, 'example@gmail.com', 'Louis', 'Nguyen?~');
    expect(response.body).toStrictEqual(ERROR);
    expect(response.status).toStrictEqual(400);
  });

  test('NameLast is not valid length too long', () => {
    const response: type.Response = auth.adminUserDetailsUpdate(user1.token, 'example@gmail.com', 'Louis', 'qwertyuiopasdfghjklzxcv');
    expect(response.body).toStrictEqual(ERROR);
    expect(response.status).toStrictEqual(400);
  });

  test('NameLast is not valid length too short', () => {
    const response: type.Response = auth.adminUserDetailsUpdate(user1.token, 'example@gmail.com', 'Louis', 'F');
    expect(response.body).toStrictEqual(ERROR);
    expect(response.status).toStrictEqual(400);
  });

  test('Email address is used by another user', () => {
    auth.adminAuthRegister('example@gmail.com', 'a1bcd234', 'Louis', 'Nguyen');
    const response: type.Response = auth.adminUserDetailsUpdate(user1.token, 'example@gmail.com', 'Louis', 'Nguyen');
    expect(response.body).toStrictEqual(ERROR);
    expect(response.status).toStrictEqual(400);
  });

  test('Email address is not valid', () => {
    const response: type.Response = auth.adminUserDetailsUpdate(user1.token, 'abcdef', 'Louis', 'Nguyen');
    expect(response.body).toStrictEqual(ERROR);
    expect(response.status).toStrictEqual(400);
  });

  test('Successfully updated user details', () => {
    const response: type.Response = auth.adminUserDetailsUpdate(user1.token, 'example@gmail.com', 'Louis', 'Nguyen');
    expect(response.body).toStrictEqual({});
    expect(response.status).toStrictEqual(200);
    expect(auth.adminUserDetails(user1.token).body).toStrictEqual({
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

/**
 * Written by Louis
 * Testing for adminUserPasswordUpdate in auth.ts
 */
describe('adminUserPasswordUpdate', () => {
  let user1: any;

  beforeEach(() => {
    user1 = auth.adminAuthRegister('louis@gmail.com', 'qwertyuiop2', 'Louis', 'Nguyen').body;
  });

  test('Token is not a valid structure 1', () => {
    const response: type.Response = auth.adminUserPasswordUpdate('', 'qwertyuiop2', 'qwertyuiop3');
    expect(response.body).toStrictEqual(ERROR);
    expect(response.status).toStrictEqual(401);
  });

  test('Token is not a valid structure 2', () => {
    const response: type.Response = auth.adminUserPasswordUpdate(null, 'qwertyuiop2', 'qwertyuiop3');
    expect(response.body).toStrictEqual(ERROR);
    expect(response.status).toStrictEqual(401);
  });

  test('Provided token is valid structure, but is not for a currently logged in session', () => {
    auth.adminAuthLogout(user1.token);
    const response: type.Response = auth.adminUserPasswordUpdate(user1.token, 'qwertyuiop2', 'qwertyuiop3');
    expect(response.body).toStrictEqual(ERROR);
    expect(response.status).toStrictEqual(403);
  });

  test('Password is not valid length', () => {
    const response: type.Response = auth.adminUserPasswordUpdate(user1.token, 'qwertyuiop2', 'qwerty');
    expect(response.body).toStrictEqual(ERROR);
    expect(response.status).toStrictEqual(400);
  });

  test('Password is not valid with only number', () => {
    const response: type.Response = auth.adminUserPasswordUpdate(user1.token, 'qwertyuiop2', '123456789');
    expect(response.body).toStrictEqual(ERROR);
    expect(response.status).toStrictEqual(400);
  });

  test('Password is not valid with only letter', () => {
    const response: type.Response = auth.adminUserPasswordUpdate(user1.token, 'qwertyuiop2', 'qwertyuiop');
    expect(response.body).toStrictEqual(ERROR);
    expect(response.status).toStrictEqual(400);
  });

  test('Successfully updated user password', () => {
    const response: type.Response = auth.adminUserPasswordUpdate(user1.token, 'qwertyuiop2', 'qwertyuiop3');
    expect(response.body).toStrictEqual({});
    expect(response.status).toStrictEqual(200);
    let loginResponse = auth.adminAuthLogin('louis@gmail.com', 'qwertyuiop3');
    expect(loginResponse.status).toStrictEqual(200);
    expect(loginResponse.body).toStrictEqual({ token: expect.any(String) });

    // cant login with old password
    loginResponse = auth.adminAuthLogin('louis@gmail.com', 'qwertyuiop2');
    expect(loginResponse.status).toStrictEqual(400);
    expect(loginResponse.body).toStrictEqual(ERROR);
  });

  test('Incorrect old password', () => {
    let response: type.Response = auth.adminUserPasswordUpdate(user1.token, 'qwertyuiop1', 'qwertyuiop');
    expect(response.body).toStrictEqual(ERROR);
    expect(response.status).toStrictEqual(400);
    auth.adminUserPasswordUpdate(user1.token, 'qwertyuiop2', 'qwertyuiop4');
    response = auth.adminUserPasswordUpdate(user1.token, 'qwertyuiop2', 'qwertyuiop4');
    expect(response.body).toStrictEqual(ERROR);
    expect(response.status).toStrictEqual(400);
  });

  test('Password is used before', () => {
    auth.adminUserPasswordUpdate(user1.token, 'qwertyuiop2', 'qwertyuiop3');
    let response: type.Response = auth.adminUserPasswordUpdate(user1.token, 'qwertyuiop3', 'qwertyuiop2');
    expect(response.body).toStrictEqual(ERROR);
    expect(response.status).toStrictEqual(400);
    response = auth.adminUserPasswordUpdate(user1.token, 'qwertyuiop3', 'qwertyuiop4');
    expect(response.body).toStrictEqual({});
    expect(response.status).toStrictEqual(200);
    response = auth.adminUserPasswordUpdate(user1.token, 'qwertyuiop4', 'qwertyuiop2');
    expect(response.body).toStrictEqual(ERROR);
    expect(response.status).toStrictEqual(400);
    response = auth.adminUserPasswordUpdate(user1.token, 'qwertyuiop4', 'qwertyuiop3');
    expect(response.body).toStrictEqual(ERROR);
    expect(response.status).toStrictEqual(400);
  });
});
