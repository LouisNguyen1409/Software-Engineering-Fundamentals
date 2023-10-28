import { getDataV2, setDataV2 } from '../dataStore';
import validator from 'validator';
const isEmail = validator.isEmail;
import * as type from '../interfaceV2';
import * as help from '../server/helperfunction';

let sessionIdGolbal = 99;
export const MINIMUM_NAME_LENGTH = 2;
export const MAXIMUM_NAME_LENGTH = 20;
export const MINIMUM_PASSWORD_LENGTH = 8;
export const SECRETKEY = 'LDMINLELAL';

/**
 * Written by Louis
 * Register a new admin user
 * @param {string} email - The email of User
 * @param {string} password - The password of User
 * @param {string} nameFirst - The nameFirst of User
 * @param {string} nameLast - The nameLast of User
 * @returns {type.ReturnToken} - A new object containing token or
 * @returns {type.ErrorMsg}- A new object containing error
 */
export function adminAuthRegister (email: string, password: string, nameFirst: string, nameLast: string): type.ReturnToken | type.ErrorMsg {
  const data: type.Data = getDataV2();
  // check email is already used
  function checkEmail (userEntries: type.User) {
    return userEntries.info.email === email;
  }
  const checkEmailValid: any = data.users.find(checkEmail);
  if (checkEmailValid !== undefined) {
    return { error: 'Email address is used by another user' };
  }

  // check email is not valid
  const isEmailValid: any = isEmail(email);
  if (isEmailValid === false) {
    return { error: 'Email address is not valid' };
  }

  // check name valid length
  if (nameFirst.length < MINIMUM_NAME_LENGTH) {
    return { error: 'NameFirst is not valid length too short' };
  } else if (nameFirst.length > MAXIMUM_NAME_LENGTH) {
    return { error: 'NameFirst is not valid length too long' };
  }

  if (nameLast.length < MINIMUM_NAME_LENGTH) {
    return { error: 'NameLast is not valid length too short' };
  } else if (nameLast.length > MAXIMUM_NAME_LENGTH) {
    return { error: 'NameLast is not valid length too long' };
  }

  // check name valid characters
  function checkName (name: string) {
    const pattern: any = /^[a-zA-Z\s'-]+$/;
    return pattern.test(name);
  }

  if (checkName(nameFirst) === false) {
    return { error: 'NameFirst is not valid characters' };
  }

  if (checkName(nameLast) === false) {
    return { error: 'NameLast is not valid characters' };
  }

  // check password length
  if (password.length < MINIMUM_PASSWORD_LENGTH) {
    return { error: 'Password is not valid length' };
  }

  // check password require
  function checkPassword (password: string) {
    const hasNumber: any = /\d/.test(password);
    const hasLetter: any = /[a-zA-Z]/.test(password);
    return (hasNumber && hasLetter);
  }

  if (checkPassword(password) === false) {
    return { error: 'Password is not valid' };
  }

  sessionIdGolbal = sessionIdGolbal + 1;
  const sessionId: string = sessionIdGolbal.toString();
  const authUserId: number = data.users.length;
  // adding data
  const token: type.Token = {
    sessionId: sessionId,
    userId: authUserId,
  };
  data.users.push({
    info: {
      authUserId: authUserId,
      name: `${nameFirst} ${nameLast}`,
      email: email,
      password: help.getHash(password),
      passwordList: [help.getHash(password)],
      numSuccessfulLogins: 1,
      numFailedPasswordsSinceLastLogin: 0,
    },
    quizzes: [],
    trash: [],
  });
  data.tokens.push(token);
  setDataV2(data);
  return { token: help.getHash(sessionId + SECRETKEY) };
}

/**
 * Written by Louis.
 * Login an admin user
 * @param {string} email - The email of the user
 * @param {string} password - The password of the user
 * @returns {type.ReturnToken} - A new object containing token or
 * @returns {type.ErrorMsg} - A new object containing error
 */
export function adminAuthLogin(email: string, password: string): type.ReturnToken | type.ErrorMsg {
  const data: type.Data = getDataV2();

  // If email does not exist
  const targetUser: any = data.users.find((user: type.User) => user.info.email === email);
  if (targetUser === undefined) {
    return { error: 'Specified email does not exist.' };
  }

  // If email exists, but provided password is incorrect
  if (targetUser.info.password !== help.getHash(password)) {
    targetUser.info.numFailedPasswordsSinceLastLogin += 1;
    setDataV2(data);
    return { error: 'Specified password is incorrect.' };
  }

  // Email exists and password is correct
  targetUser.info.numFailedPasswordsSinceLastLogin = 0;
  targetUser.info.numSuccessfulLogins += 1;
  sessionIdGolbal = sessionIdGolbal + 1;
  const sessionId: string = sessionIdGolbal.toString();
  data.tokens.push({
    sessionId: sessionId,
    userId: targetUser.info.authUserId,
  });
  setDataV2(data);
  return {
    token: help.getHash(sessionId + SECRETKEY),
  };
}

/**
 * Written by Louis.
 * Get the details of an admin user.
 * @param {number} authUserId - The id of the user
 * @returns {type.UserDetails} - A new object containing the full details of the user or
 * @returns {type.ErrorMsg} - A new object containing error
 */
export function adminUserDetails (authUserId: number): type.UserDetails | type.ErrorMsg {
  const data: type.Data = getDataV2();

  const targetUser: any = data.users.find((user: type.User) => user.info.authUserId === authUserId);

  // Otherwise if it is valid
  const info: type.Info = targetUser.info;

  return {
    user: {
      userId: info.authUserId,
      name: info.name,
      email: info.email,
      numSuccessfulLogins: info.numSuccessfulLogins,
      numFailedPasswordsSinceLastLogin: info.numFailedPasswordsSinceLastLogin,
    }
  };
}

/**
 * Written by Louis.
 * Logs out an admin user who has an active session.
 * @param {number} authUserId - The id of the user
 * @returns {type.Empty} - A empty object or
 * @returns {type.ErrorMsg} - A new object containing error
 */
export function adminAuthLogout (token: string): type.Empty | type.ErrorMsg {
  const data: type.Data = getDataV2();
  data.tokens = data.tokens.filter((online : type.Token) => help.getHash(online.sessionId + SECRETKEY) !== token);
  setDataV2(data);
  return {};
}

/**
 * Written by Louis.
 * Update the details of an admin user (non-password).
 * @param {number} authUserId - The id of the user
 * @param {string} nameFirst - The nameFirst of the user
 * @param {string} nameLast - The nameLast of the user
 * @param {string} email - The email of the user
 * @returns {type.Empty} - A empty object or
 * @returns {type.ErrorMsg} - A new object containing error
 */
export function adminUserDetailsUpdate (authUserId: number, email: string, nameFirst: string, nameLast: string): type.Empty | type.ErrorMsg {
  const data: type.Data = getDataV2();
  const targetUser: any = data.users.find((user: type.User) => user.info.authUserId === authUserId);

  // Otherwise if it is valid
  const info: type.Info = targetUser.info;

  // check email is already used
  function checkEmail (userEntries: type.User) {
    return userEntries.info.email === email;
  }
  const checkEmailValid: any = data.users.find(checkEmail);
  if (checkEmailValid !== undefined && targetUser.info.email !== email) {
    return { error: 'Email address is used by another user' };
  }

  // check email is not valid
  const isEmailValid: any = isEmail(email);
  if (isEmailValid === false) {
    return { error: 'Email address is not valid' };
  }

  // check name valid length
  if (nameFirst.length < MINIMUM_NAME_LENGTH) {
    return { error: 'NameFirst is not valid length too short' };
  } else if (nameFirst.length > MAXIMUM_NAME_LENGTH) {
    return { error: 'NameFirst is not valid length too long' };
  }

  if (nameLast.length < MINIMUM_NAME_LENGTH) {
    return { error: 'NameLast is not valid length too short' };
  } else if (nameLast.length > MAXIMUM_NAME_LENGTH) {
    return { error: 'NameLast is not valid length too long' };
  }

  // check name valid characters
  function checkName (name: string) {
    const pattern: any = /^[a-zA-Z\s'-]+$/;
    return pattern.test(name);
  }

  if (checkName(nameFirst) === false) {
    return { error: 'NameFirst is not valid characters' };
  }

  if (checkName(nameLast) === false) {
    return { error: 'NameLast is not valid characters' };
  }

  info.name = `${nameFirst} ${nameLast}`;
  info.email = email;
  setDataV2(data);
  return {};
}

/**
 * Written by Louis.
 * Update the details of an admin user (non-password).
 * @param {number} authUserId - The id of the user
 * @param {string} oldPassword - The old password of the user
 * @param {string} newPassword - The new password of the user
 * @returns {type.Empty} - A empty object or
 * @returns {type.ErrorMsg} - A new object containing error
 */
export function adminUserPasswordUpdate(authUserId: number, oldPassword: string, newPassword: string): type.Empty | type.ErrorMsg {
  const data: type.Data = getDataV2();
  const targetUser: any = data.users.find((user: type.User) => user.info.authUserId === authUserId);

  // If old password is incorrect
  if (targetUser.info.password !== help.getHash(oldPassword)) {
    return { error: 'Old password is incorrect.' };
  }

  // If new password is the same as the old password
  const validPassword: any = targetUser.info.passwordList.find((password: string) => password === help.getHash(newPassword));
  if (validPassword !== undefined) {
    return { error: 'New Password has already been used before by this user.' };
  }

  // If new password is invalid
  if (newPassword.length < MINIMUM_PASSWORD_LENGTH) {
    return { error: 'New password is not valid length' };
  }

  // check password require
  function checkPassword (password: string) {
    const hasNumber: any = /\d/.test(password);
    const hasLetter: any = /[a-zA-Z]/.test(password);
    return (hasNumber && hasLetter);
  }

  if (checkPassword(newPassword) === false) {
    return { error: 'New password is not valid' };
  }

  // Otherwise if it is valid
  targetUser.info.password = help.getHash(newPassword);
  targetUser.info.passwordList.push(help.getHash(newPassword));
  setDataV2(data);
  return {};
}
