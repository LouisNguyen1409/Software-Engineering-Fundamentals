import request, { HttpVerb } from 'sync-request';
import { port, url } from '../config.json';
import { getDataV2 } from '../dataStore';
import * as type from '../interface';
// import * as typeV2 from '../interfaceV2';
import { IncomingHttpHeaders } from 'http';
import HTTPError from 'http-errors';
import crypto from 'crypto';
import { SECRETKEY } from '../implementation/auth';
import fs from 'fs';
import path from 'path';

const SERVER_URL = `${url}:${port}`;

// ======================= REQUEST FUNCTION ===========================

// REQUEST WITH THROW ERROR
/**
 * Written by Louis
 * This function request response from the server
 * @param {HttpVerb} method - Method of the request
 * @param {string} path - Path of the request
 * @param {object} info - Info of the request
 * @returns {type.Response} - Response from the server
 */
/* istanbul ignore next */
export function requestInfo(method: HttpVerb, path: string, info: object): type.Response {
  let qs: object = {};
  let json: object = {};
  if (['GET', 'DELETE'].includes(method)) {
    qs = info;
  } else {
    json = info;
  }
  const res = request(method, `${SERVER_URL}${path}`, { qs, json });
  return { body: JSON.parse(res.body.toString()), status: res.statusCode };
}

// REQUEST WITH THROW HTTPERROR
/* istanbul ignore next */
export function requestHelper(method: HttpVerb, path: string, payload: type.Payload, headers: IncomingHttpHeaders = {}) {
  let qs = {};
  let json = {};
  if (['GET', 'DELETE'].includes(method.toUpperCase())) {
    qs = payload;
  } else {
    // PUT/POST
    json = payload;
  }
  const res = request(method, `${SERVER_URL}${path}`, { qs, json, headers });

  let responseBody: any;
  try {
    responseBody = JSON.parse(res.body.toString());
  } catch (err: any) {
    if (res.statusCode === 200) {
      throw HTTPError(500, `Non-jsonifiable body despite code 200: '${res.body}'.`);
    }
    responseBody = { error: `Failed to parse JSON: '${err.message}'` };
  }

  const errorMessage = `[${res.statusCode}] ` + responseBody?.error || responseBody || 'No message specified!';

  switch (res.statusCode) {
    case 401:
    case 403:
    case 400:
      throw HTTPError(res.statusCode, errorMessage);
    case 404: // NOT_FOUND
      throw HTTPError(res.statusCode, `Cannot find '${url}' [${method}]\nReason: ${errorMessage}\n\nCheck that your server.ts have the correct path AND method`);
    case 500: // INTERNAL_SERVER_ERROR
      throw HTTPError(res.statusCode, errorMessage + '\n\nYour server crashed. Check the server log!\n');
    default:
      if (res.statusCode !== 200) {
        throw HTTPError(res.statusCode, errorMessage + `\n\nSorry, no idea! Look up the status code ${res.statusCode} online!\n`);
      }
  }
  return responseBody;
}

// fetch an image from the given URL and download it into the given path as name.jpg or png
export const requestImage = (name: string, url: string, destinationPath: string) => {
  let res;
  // Try and get the user specified url, otherwise throw a 400 bad request
  try {
    res = request('GET', url);
  } catch (e) {
    throw HTTPError(400, e.message);
  }

  // Error handle for invalid image types
  const imageType = path.extname(url);
  if (imageType !== '.png' && imageType !== '.jpg') {
    throw HTTPError(400, 'Image formats must be either .jpg or .png');
  }
  // If directory doesn't already exist, create it
  const dirPath = destinationPath;
  /* istanbul ignore next */
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  // Store image into the destination directory and return that new directory back out
  const body = res.getBody();
  const fullPath = path.join(dirPath, `${name.split(' ').join('_')}${imageType}`);
  fs.writeFileSync(fullPath, body, { flag: 'w' });
  const realFullPath = `${SERVER_URL}` + `/${fullPath}`;
  return realFullPath;
};

export const UpdateQuizThumbnail = (quizId: number, url: string) => {
  return requestImage(`quiz_${quizId}`, url, './images');
};

export const UpdateQuestionThumbnail = (questionId: number, url: string) => {
  return requestImage(`question_${questionId}`, url, './images');
};

const copyImage = (source: string, destination: string) => {
  /* istanbul ignore next */
  if (!fs.existsSync(source)) {
    throw new Error(`Source file does not exist: ${source}`);
  }

  const destinationDir = path.dirname(destination);
  /* istanbul ignore next */
  if (!fs.existsSync(destinationDir)) {
    fs.mkdirSync(destinationDir, { recursive: true });
  }
  fs.copyFileSync(source, destination);

  return destination;
};

const deleteImage = (path: string) => {
  /* istanbul ignore next */
  if (!fs.existsSync(path)) {
    throw new Error(`image unfound with ${path}`);
  }
  fs.unlinkSync(path);
};

export const removeQuestionThumbnail = (questionId: number) => {
  let path = `./images/question_${questionId}.png`;
  /* istanbul ignore next */
  if (!fs.existsSync(path)) {
    path = `./images/question_${questionId}.jpg`;
  }
  try {
    deleteImage(path);
  } catch (error) {
    /* istanbul ignore next */
    throw HTTPError(500, error.message);
  }
};

export const duplicateQuestionThumbnail = (oldQuestionThumbnail: string, newQuestionId: number) => {
  const newQuestionThumbnail = 'images' + `/question_${newQuestionId}${path.extname(oldQuestionThumbnail)}`;
  try {
    const oldThumbnailUrl = oldQuestionThumbnail.replace(`${SERVER_URL}/`, '');
    copyImage(oldThumbnailUrl, newQuestionThumbnail);
  } catch (error) {
    /* istanbul ignore next */
    throw HTTPError(500, 'idk some errors? :' + error);
  }
  return newQuestionThumbnail;
};

// =====================================================================

// ======================= OTHER FUNCTIONS ==============================

export function getHash(plaintext: string) : string {
  return crypto.createHash('sha256').update(plaintext).digest('hex');
}

/**
 * Written by Louis
 * This function request response for isValidToken from the server
 * @param {string} inputToken - The inputToken of User
 * @returns {boolean} - Response from the server
 */
export function isValidToken(inputToken: any): boolean {
  if (inputToken === null) {
    return false;
  }
  const token : string = inputToken.toString();
  if (token === '') {
    return false;
  }
  return true;
}

/**
 * Written by Louis
 * This function request response for findAuthUserId from the server
 * @param {string} inputToken - The inputToken of User
 * @returns {number} - Response from the server
 */
export function findAuthUserId(inputToken: string): number | undefined {
  const data: type.Data = getDataV2();
  const authUserId: any = data.tokens.find((token) => {
    return getHash(token.sessionId + SECRETKEY) === inputToken;
  });
  if (authUserId === undefined) {
    return undefined;
  }
  return authUserId.userId;
}

/**
 * Written by Marius
 * This function will return the user object if the user is found
 * @param {type.Data} data - The data of the server
 * @param {number} authUserId - The authUserId of User
 * @returns {type.User} - The user object
 * @returns {undefined} - If the user is not found
 */
export const findUser = (data : type.Data, authUserId: number) : type.User | undefined => {
  return data.users.find(user => user.info.authUserId === authUserId);
};

/**
 * Written by Marius
 * This function will return the quiz object if the quiz is found
 * @param {type.Data} data - The data of the server
 * @param {number} quizId - The quizId of Quiz
 * @returns {type.Quiz} - The quiz object
 * @returns {undefined} - If the quiz is not found
 */
export const findQuiz = (data : type.Data, quizId: number) : type.Quiz | undefined => {
  let targetQuiz : any;
  for (const user of data.users) {
    const currentQuiz = user.quizzes.find(quiz => quiz.info.quizId === quizId);
    if (currentQuiz) {
      targetQuiz = currentQuiz;
      break;
    }
  }
  return targetQuiz;
};

// Token handler for new v2 routes
export const HTTPTokenHandler = (token : string, authUserId : number, badRequestLogout = false) => {
  // This checks if the token is bad (401)
  if (token === '' || token === 'null' || token === 'undefined') {
    throw HTTPError(401, 'Token is not a valid structure.');
  }

  // In the special case that this is being called in the logout route, we want to treat this
  // as a bad request (400). otherwise, forbidden request (403)
  if (authUserId === undefined && badRequestLogout) {
    throw HTTPError(400, 'This token is for a user who has already logged out');
  } else if (authUserId === undefined) {
    throw HTTPError(403, 'This token is for a user who has already logged out');
  }
};

// Name generator
export function nameGenerator() {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  let name = '';

  // Generate 5-letter random string
  for (let i = 0; i < 5; i++) {
    name += letters.charAt(Math.floor(Math.random() * letters.length));
  }

  // Generate 3 unique numbers
  const uniqueNumbers = new Set();
  while (uniqueNumbers.size < 3) {
    uniqueNumbers.add(numbers.charAt(Math.floor(Math.random() * numbers.length)));
  }
  name += Array.from(uniqueNumbers).join('');

  return name;
}
