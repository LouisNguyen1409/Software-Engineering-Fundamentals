import { getDataV2, setDataV2 } from '../dataStore';
import validator from 'validator';
const isEmail = validator.isEmail;
import * as typeV2 from '../interfaceV2';
import * as help from '../server/helperfunction';
import { SECRETKEY, MINIMUM_NAME_LENGTH, MAXIMUM_NAME_LENGTH, MINIMUM_PASSWORD_LENGTH } from './auth';
import HTTPError from 'http-errors';

/**
 * Written by Louis.
 * Logs out an admin user who has an active session.
 * @param {number} authUserId - The id of the user
 * @returns {typeV2.Empty} - A empty object or
 * @returns {typeV2.ErrorMsg} - A new object containing error
 */
export function adminAuthLogoutV2 (token: string): typeV2.Empty | typeV2.ErrorMsg {
  const data: typeV2.Data = getDataV2();
  data.tokens = data.tokens.filter((online : typeV2.Token) => help.getHash(online.sessionId + SECRETKEY) !== token);
  setDataV2(data);
  return {};
}

/**
 * Written by Louis.
 * Get the details of an admin user.
 * @param {number} authUserId - The id of the user
 * @returns {typeV2.UserDetails} - A new object containing the full details of the user or
 * @returns {typeV2.ErrorMsg} - A new object containing error
 */
export function adminUserDetailsV2 (authUserId: number): typeV2.UserDetails | typeV2.ErrorMsg {
  const data: typeV2.Data = getDataV2();

  const targetUser: any = data.users.find((user: typeV2.User) => user.info.authUserId === authUserId);

  // Otherwise if it is valid
  const info: typeV2.Info = targetUser.info;

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
 * Update the details of an admin user (non-password).
 * @param {number} authUserId - The id of the user
 * @param {string} nameFirst - The nameFirst of the user
 * @param {string} nameLast - The nameLast of the user
 * @param {string} email - The email of the user
 * @returns {typeV2.Empty} - A empty object or
 * @returns {typeV2.ErrorMsg} - A new object containing error
 */
export function adminUserDetailsUpdateV2 (authUserId: number, email: string, nameFirst: string, nameLast: string): typeV2.Empty | typeV2.ErrorMsg {
  const data: typeV2.Data = getDataV2();
  const targetUser: any = data.users.find((user: typeV2.User) => user.info.authUserId === authUserId);

  // Otherwise if it is valid
  const info: typeV2.Info = targetUser.info;

  // check email is already used
  function checkEmail (userEntries: typeV2.User) {
    return userEntries.info.email === email;
  }
  const checkEmailValid: any = data.users.find(checkEmail);
  if (checkEmailValid !== undefined && targetUser.info.email !== email) {
    throw HTTPError(400, 'Email address is used by another user');
  }

  // check email is not valid
  const isEmailValid: any = isEmail(email);
  if (isEmailValid === false) {
    throw HTTPError(400, 'Email address is not valid');
  }

  // check name valid length
  if (nameFirst.length < MINIMUM_NAME_LENGTH) {
    throw HTTPError(400, 'NameFirst is not valid length too short');
  } else if (nameFirst.length > MAXIMUM_NAME_LENGTH) {
    throw HTTPError(400, 'NameFirst is not valid length too long');
  }

  if (nameLast.length < MINIMUM_NAME_LENGTH) {
    throw HTTPError(400, 'NameLast is not valid length too short');
  } else if (nameLast.length > MAXIMUM_NAME_LENGTH) {
    throw HTTPError(400, 'NameLast is not valid length too long');
  }

  // check name valid characters
  function checkName (name: string) {
    const pattern: any = /^[a-zA-Z\s'-]+$/;
    return pattern.test(name);
  }

  if (checkName(nameFirst) === false) {
    throw HTTPError(400, 'NameFirst is not valid characters');
  }

  if (checkName(nameLast) === false) {
    throw HTTPError(400, 'NameLast is not valid characters');
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
 * @returns {typeV2.Empty} - A empty object or
 * @returns {typeV2.ErrorMsg} - A new object containing error
 */
export function adminUserPasswordUpdateV2 (authUserId: number, oldPassword: string, newPassword: string): typeV2.Empty | typeV2.ErrorMsg {
  const data: typeV2.Data = getDataV2();
  const targetUser: any = data.users.find((user: typeV2.User) => user.info.authUserId === authUserId);
  // If old password is incorrect
  if (targetUser.info.password !== help.getHash(oldPassword)) {
    throw HTTPError(400, 'Old password is incorrect.');
  }

  // If new password is the same as the old password
  const validPassword: any = targetUser.info.passwordList.find((password: string) => password === help.getHash(newPassword));
  if (validPassword !== undefined) {
    throw HTTPError(400, 'New Password has already been used before by this user.');
  }

  // If new password is invalid
  if (newPassword.length < MINIMUM_PASSWORD_LENGTH) {
    throw HTTPError(400, 'New password is not valid length');
  }

  // check password require
  function checkPassword (password: string) {
    const hasNumber: any = /\d/.test(password);
    const hasLetter: any = /[a-zA-Z]/.test(password);
    return (hasNumber && hasLetter);
  }

  if (checkPassword(newPassword) === false) {
    throw HTTPError(400, 'New password is not valid');
  }

  // Otherwise if it is valid
  targetUser.info.password = help.getHash(newPassword);
  targetUser.info.passwordList.push(help.getHash(newPassword));
  setDataV2(data);
  return {};
}
