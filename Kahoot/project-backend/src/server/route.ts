import { requestInfo, requestHelper } from './helperfunction';
import * as typeV2 from '../interfaceV2';
import * as type from '../interface';
// ====================================================================

// ======================= PROTECTED ROUTES ===========================

// ITERATION 1 FUNCTIONS
/**
 * Written by Louis
 * This function request response for adminAuthRegister from the server
 * @param {string} email - The email of User
 * @param {string} password - The password of User
 * @param {string} nameFirst - The nameFirst of User
 * @param {string} nameLast - The nameLast of User
 * @returns {type.Response} - Response from the server
 */
export function adminAuthRegister(email: string, password: string, nameFirst: string, nameLast: string): type.Response {
  return requestInfo('POST', '/v1/admin/auth/register', {
    email: email,
    password: password,
    nameFirst: nameFirst,
    nameLast: nameLast,
  });
}

/**
 * Written by Louis
 * This function request response for adminAuthLogin from the server
 * @param {string} email - The email of User
 * @param {string} password - The password of User
 * @returns {type.Response} - Response from the server
 */
export function adminAuthLogin(email: string, password: string): type.Response {
  return requestInfo('POST', '/v1/admin/auth/login', {
    email: email,
    password: password,
  });
}

/**
 * Written by Louis
 * This function request response for adminUserDetails from the server
 * @param {string} token - The token of User
 * @returns {type.Response} - Response from the server
 */
export function adminUserDetails(token: string): type.Response {
  return requestInfo('GET', '/v1/admin/user/details', {
    token: token,
  });
}

/**
 * Written by Louis
 * This function request response for adminQuizList from the server
 * @param {string} token - The token of User
 * @returns {type.Response} - Response from the server
 */
export function adminQuizList(token: string): type.Response {
  return requestInfo('GET', '/v1/admin/quiz/list', {
    token: token,
  });
}

/**
 * Written by Louis
 * This function request response for adminQuizCreate from the server
 * @param {string} token - The token of User
 * @param {string} name - The name of Quiz
 * @param {string} description - The description of Quiz
 * @returns {type.Response} - Response from the server
 */
export function adminQuizCreate(token: string, name: string, description: string): type.Response {
  return requestInfo('POST', '/v1/admin/quiz', {
    token: token,
    name: name,
    description: description,
  });
}

/**
 * Written by Louis
 * This function request response for adminQuizRemove from the server
 * @param {string} token - The token of User
 * @param {number} quizId - The quizId of Quiz
 * @returns {type.Response} - Response from the server
 */
export function adminQuizRemove(token: string, quizId: number): type.Response {
  return requestInfo('DELETE', `/v1/admin/quiz/${quizId}`, {
    token: token,
  });
}

/**
 * Written by Louis
 * This function request response for adminQuizInfo from the server
 * @param {string} token - The token of User
 * @param {number} quizId - The quizId of Quiz
 * @returns {type.Response} - Response from the server
 */
export function adminQuizInfo(token: string, quizId: number): type.Response {
  return requestInfo('GET', `/v1/admin/quiz/${quizId}`, {
    token: token,
  });
}

/**
 * Written by Louis
 * This function request response for adminQuizNameUpdate from the server
 * @param {string} token - The token of User
 * @param {number} quizId - The quizId of Quiz
 * @param {string} name - The name of Quiz
 * @param {string} description - The description of Quiz
 * @returns {type.Response} - Response from the server
 */
export function adminQuizNameUpdate(token: string, quizId: number, name: string): type.Response {
  return requestInfo('PUT', `/v1/admin/quiz/${quizId}/name`, {
    token: token,
    name: name,
  });
}

/**
 * Written by Louis
 * This function request response for adminQuizDescriptionUpdate from the server
 * @param {string} token - The token of User
 * @param {number} quizId - The quizId of Quiz
 * @param {string} description - The description of Quiz
 * @returns {type.Response} - Response from the server
 */
export function adminQuizDescriptionUpdate(token: string, quizId: number, description: string): type.Response {
  return requestInfo('PUT', `/v1/admin/quiz/${quizId}/description`, {
    token: token,
    description: description,
  });
}

/**
 * Written by Louis
 * This function request response for clear from the server
 * @param {} - None
 * @returns {type.Response} - Response from the server
 */
export function clear(): type.Response {
  return requestInfo('DELETE', '/v1/clear', {});
}

// ITERATION 2 FUNCTIONS OLD
/**
 * Written by Louis
 * This function request response for adminAuthLogout from the server
 * @param {string} token - The token of User
 * @returns {type.Response} - Response from the server
 */
export function adminAuthLogout(token: string): type.Response {
  return requestInfo('POST', '/v1/admin/auth/logout', {
    token: token,
  });
}

/**
 * Written by Louis
 * This function request response for adminUserDetailsUpdate from the server
 * @param {string} token - The token of User
 * @param {string} email - The email of User
 * @param {string} nameFirst - The nameFirst of User
 * @param {string} nameLast - The nameLast of User
 * @returns {type.Response} - Response from the server
 */
export function adminUserDetailsUpdate(token: string, email: string, nameFirst: string, nameLast: string): type.Response {
  return requestInfo('PUT', '/v1/admin/user/details', {
    token: token,
    email: email,
    nameFirst: nameFirst,
    nameLast: nameLast,
  });
}

/**
 * Written by Louis
 * This function request response for adminUserPasswordUpdate from the server
 * @param {string} token - The token of User
 * @param {string} oldPassword - The oldPassword of User
 * @param {string} newPassword - The newPassword of User
 * @returns {type.Response} - Response from the server
 */
export function adminUserPasswordUpdate(token: string, oldPassword: string, newPassword: string): type.Response {
  return requestInfo('PUT', '/v1/admin/user/password', {
    token: token,
    oldPassword: oldPassword,
    newPassword: newPassword,
  });
}

/**
 * Written by Louis
 * This function request response for adminQuizTrash from the server
 * @param {string} token - The token of User
 * @returns {type.Response} - Response from the server
 */
export function adminQuizTrash(token: string): type.Response {
  return requestInfo('GET', '/v1/admin/quiz/trash', {
    token: token,
  });
}

/**
 * Written by Louis
 * This function request response for adminQuizRestore from the server
 * @param {string} token - The token of User
 * @param {number} quizId - The quizId of Quiz
 * @returns {type.Response} - Response from the server
 */
export function adminQuizRestore(token: string, quizId: number): type.Response {
  return requestInfo('POST', `/v1/admin/quiz/${quizId}/restore`, {
    token: token,
  });
}

/**
 * Written by Louis
 * This function request response for adminQuizEmptyTrash from the server
 * @param {string} token - The token of User
 * @returns {type.Response} - Response from the server
*/
export function adminQuizEmptyTrash(token: string, quizIds: number[]): type.Response {
  return requestInfo('DELETE', '/v1/admin/quiz/trash/empty', {
    token: token,
    quizIds: JSON.stringify(quizIds)
  });
}

/**
 * Written by Louis
 * This function request response for adminQuizTransfer from the server
 * @param {string} token - The token of User
 * @param {number} quizId - The quizId of Quiz
 * @param {string} email - The email of User
 * @returns {type.Response} - Response from the server
 */
export function adminQuizTransfer(token: string, quizId: number, email: string): type.Response {
  return requestInfo('POST', `/v1/admin/quiz/${quizId}/transfer`, {
    token: token,
    userEmail: email,
  });
}

/**
 * Written by Louis
 * This function request response for adminQuizQuestionCreate from the server
 * @param {number} quizid - The quizid of Quiz
 * @param {string} token - The token of User
 * @param {string} question - The question of Question
 * @param {number} duration - The duration of Question
 * @param {number} points - The points of Question
 * @param {object[]} answers - The answers of Question
 * @returns {type.Response} - Response from the server
 */
export function adminQuizQuestionCreate(quizid: number, token: string, question: string, duration: number, points: number, answers: object[]): type.Response {
  return requestInfo('POST', `/v1/admin/quiz/${quizid}/question`, {
    token: token,
    questionBody: {
      question: question,
      duration: duration,
      points: points,
      answers: answers,
    }
  });
}

/**
  * Written by Yepeng
  * This function request response for adminQuestionCreate from the server
  * @param {string} token - The token of User
  * @param {number} quizid - The quizid of Quiz
  * @param {object} questionBody - The questionBody of Question
  * @returns {type.Response} - Response from the server
 */
export function adminQuestionCreate(token: string, quizid: number, questionBody: type.QuestionBody): type.Response {
  return requestInfo('POST', `/v1/admin/quiz/${quizid}/question`, {
    token: token,
    questionBody: questionBody
  });
}

export function adminQuestionCreateV2(token: string, quizid: number, questionBody: typeV2.QuestionBody): any {
  return requestHelper('POST', `/v2/admin/quiz/${quizid}/question`, {
    questionBody: questionBody,
  }, { token: token });
}

/**
 * Written by Louis
 * This function request response for adminQuizQuestionUpdate from the server
 * @param {number} questionId - The questionId of Question
 * @param {number} quizid - The quizid of Quiz
 * @param {string} token - The token of User
 * @param {string} question - The question of Question
 * @param {number} duration - The duration of Question
 * @param {number} points - The points of Question
 * @param {object[]} answers - The answers of Question
 * @returns {type.Response} - Response from the server
 */
export function adminQuizQuestionUpdate(token: string, quizid: number, questionId: number, questionBody: type.QuestionBody): type.Response {
  return requestInfo('PUT', `/v1/admin/quiz/${quizid}/question/${questionId}`, {
    token: token,
    questionBody: questionBody
  });
}

/**
 * Written by Louis
 * This function request response for adminQuizQuestionRemove from the server
 * @param {number} quizId - The quizId of Quiz
 * @param {number} questionId - The questionId of Question
 * @param {string} token - The token of User
 * @returns {type.Response} - Response from the server
 */
export function adminQuizQuestionRemove(token: string, quizId: number, questionId: number): type.Response {
  return requestInfo('DELETE', `/v1/admin/quiz/${quizId}/question/${questionId}`, {
    token: token,
  });
}

/**
 * Written by Louis
 * This function request response for adminQuizQuestionMove from the server
 * @param {string} token - The token of User
 * @param {number} quizId - The quizId of Quiz
 * @param {number} questionId - The questionId of Question
 * @param {number} newPosition - The newPosition of Question
 * @returns {type.Response} - Response from the server
 */
export function adminQuizQuestionMove(token: string, quizId: number, questionId: number, newPosition: number): type.Response {
  return requestInfo('PUT', `/v1/admin/quiz/${quizId}/question/${questionId}/move`, {
    token: token,
    newPosition: newPosition,
  });
}

/**
 * Written by Louis
 * This function request response for adminQuizQuestionDuplicate from the server
 * @param {string} token - The token of User
 * @param {number} quizId - The quizId of Quiz
 * @param {number} questionId - The questionId of Question
 * @returns {type.Response} - Response from the server
 */
export function adminQuizQuestionDuplicate(token: string, quizId: number, questionId: number): type.Response {
  return requestInfo('POST', `/v1/admin/quiz/${quizId}/question/${questionId}/duplicate`, {
    token: token,
  });
}

// ITERATION 2 FUNCTIONS NEW
/**
 * Written by Louis
 * This function request response for adminAuthLogout from the server
 * @param {string} token - The token of User
 * @returns {type.Response} - Response from the server
 */
export function adminAuthLogoutV2(token: string): any {
  return requestHelper('POST', '/v2/admin/auth/logout', {}, { token: token });
}

/**
 * Written by Louis
 * This function request response for adminUserDetails from the server
 * @param {string} token - The token of User
 * @returns {type.Response} - Response from the server
 */
export function adminUserDetailsV2(token: string): any {
  return requestHelper('GET', '/v2/admin/user/details', {}, { token: token });
}

/**
 * Written by Louis
 * This function request response for adminUserDetailsUpdate from the server
 * @param {string} token - The token of User
 * @param {string} email - The email of User
 * @param {string} nameFirst - The nameFirst of User
 * @param {string} nameLast - The nameLast of User
 * @returns {type.Response} - Response from the server
 */
export function adminUserDetailsUpdateV2(token: string, email: string, nameFirst: string, nameLast: string): any {
  return requestHelper('PUT', '/v2/admin/user/details', { email: email, nameFirst: nameFirst, nameLast: nameLast }, { token: token });
}

/**
 * Written by Louis
 * This function request response for adminUserPasswordUpdate from the server
 * @param {string} token - The token of User
 * @param {string} oldPassword - The oldPassword of User
 * @param {string} newPassword - The newPassword of User
 * @returns {type.Response} - Response from the server
 */
export function adminUserPasswordUpdateV2(token: string, oldPassword: string, newPassword: string): any {
  return requestHelper('PUT', '/v2/admin/user/password', { oldPassword: oldPassword, newPassword: newPassword }, { token: token });
}

/**
 * Written by Louis
 * This function request response for adminQuizList from the server
 * @param {string} token - The token of User
 * @returns {type.Response} - Response from the server
 */
export function adminQuizListV2(token: string): any {
  return requestHelper('GET', '/v2/admin/quiz/list', {}, { token: token });
}

/**
 * Written by Louis
 * This function request response for adminQuizCreate from the server
 * @param {string} token - The token of User
 * @param {string} name - The name of Quiz
 * @param {string} description - The description of Quiz
 * @returns {type.Response} - Response from the server
 */
export function adminQuizCreateV2(token: string, name: string, description: string): any {
  return requestHelper('POST', '/v2/admin/quiz', { name: name, description: description }, { token: token });
}

/**
 * Written by Louis
 * This function request response for adminQuizRemove from the server
 * @param {string} token - The token of User
 * @param {number} quizId - The quizId of Quiz
 * @returns {type.Response} - Response from the server
 */
export function adminQuizRemoveV2(token: string, quizId: number): any {
  return requestHelper('DELETE', `/v2/admin/quiz/${quizId}`, {}, { token: token });
}

/**
 * Written by Louis
 * This function request response for adminQuizInfo from the server
 * @param {string} token - The token of User
 * @param {number} quizId - The quizId of Quiz
 * @returns {type.Response} - Response from the server
 */
export function adminQuizInfoV2(token: string, quizId: number): any {
  return requestHelper('GET', `/v2/admin/quiz/${quizId}`, {}, { token: token });
}

/**
 * Written by Louis
 * This function request response for adminQuizNameUpdate from the server
 * @param {string} token - The token of User
 * @param {number} quizId - The quizId of Quiz
 * @param {string} name - The name of Quiz
 * @param {string} description - The description of Quiz
 * @returns {type.Response} - Response from the server
 */
export function adminQuizNameUpdateV2(token: string, quizId: number, name: string): any {
  return requestHelper('PUT', `/v2/admin/quiz/${quizId}/name`, { name: name }, { token: token });
}

/**
 * Written by Louis
 * This function request response for adminQuizDescriptionUpdate from the server
 * @param {string} token - The token of User
 * @param {number} quizId - The quizId of Quiz
 * @param {string} description - The description of Quiz
 * @returns {type.Response} - Response from the server
 */
export function adminQuizDescriptionUpdateV2(token: string, quizId: number, description: string): any {
  return requestHelper('PUT', `/v2/admin/quiz/${quizId}/description`, { description: description }, { token: token });
}

/**
 * Written by Louis
 * This function request response for adminQuizTrash from the server
 * @param {string} token - The token of User
 * @returns {type.Response} - Response from the server
 */
export function adminQuizTrashV2(token: string): any {
  return requestHelper('GET', '/v2/admin/quiz/trash', {}, { token: token });
}

/**
 * Written by Louis
 * This function request response for adminQuizRestore from the server
 * @param {string} token - The token of User
 * @param {number} quizId - The quizId of Quiz
 * @returns {type.Response} - Response from the server
 */
export function adminQuizRestoreV2(token: string, quizId: number): any {
  return requestHelper('POST', `/v2/admin/quiz/${quizId}/restore`, {}, { token: token });
}

/**
 * Written by Louis
 * This function request response for adminQuizEmptyTrash from the server
 * @param {string} token - The token of User
 * @returns {type.Response} - Response from the server
*/
export function adminQuizEmptyTrashV2(token: string, quizIds: number[]): any {
  return requestHelper('DELETE', '/v2/admin/quiz/trash/empty', { quizIds: JSON.stringify(quizIds) }, { token: token });
}

/**
 * Written by Louis
 * This function request response for adminQuizTransfer from the server
 * @param {string} token - The token of User
 * @param {number} quizId - The quizId of Quiz
 * @param {string} email - The email of User
 * @returns {type.Response} - Response from the server
 */
export function adminQuizTransferV2(token: string, quizId: number, email: string): any {
  return requestHelper('POST', `/v2/admin/quiz/${quizId}/transfer`, { userEmail: email }, { token: token });
}

/**
 * Written by Louis
 * This function request response for adminQuizQuestionCreate from the server
 * @param {number} quizid - The quizid of Quiz
 * @param {string} token - The token of User
 * @param {string} question - The question of Question
 * @param {number} duration - The duration of Question
 * @param {number} points - The points of Question
 * @param {object[]} answers - The answers of Question
 * @returns {type.Response} - Response from the server
 */
export function adminQuizQuestionCreateV2(quizid: number, token: string, question: string, duration: number, points: number, answers: object[], thumbnailUrl: string): any {
  return requestHelper('POST', `/v2/admin/quiz/${quizid}/question`, {
    questionBody: {
      question: question,
      duration: duration,
      points: points,
      answers: answers,
      thumbnailUrl: thumbnailUrl,
    }
  }, { token: token });
}

/**
 * Written by Louis
 * This function request response for adminQuizQuestionUpdate from the server
 * @param {number} questionId - The questionId of Question
 * @param {number} quizid - The quizid of Quiz
 * @param {string} token - The token of User
 * @param {string} question - The question of Question
 * @param {number} duration - The duration of Question
 * @param {number} points - The points of Question
 * @param {object[]} answers - The answers of Question
 * @returns {type.Response} - Response from the server
 */

export function adminQuizQuestionUpdateV2(token: string, quizid: number, questionId: number, questionBody: typeV2.QuestionBody): any {
  return requestHelper('PUT', `/v2/admin/quiz/${quizid}/question/${questionId}`, {
    questionBody: questionBody,
  }, { token: token });
}

/**
 * Written by Louis
 * This function request response for adminQuizQuestionRemove from the server
 * @param {number} quizId - The quizId of Quiz
 * @param {number} questionId - The questionId of Question
 * @param {string} token - The token of User
 * @returns {type.Response} - Response from the server
 */
export function adminQuizQuestionRemoveV2(token: string, quizId: number, questionId: number): any {
  return requestHelper('DELETE', `/v2/admin/quiz/${quizId}/question/${questionId}`, {}, { token: token });
}

/**
 * Written by Louis
 * This function request response for adminQuizQuestionMove from the server
 * @param {string} token - The token of User
 * @param {number} quizId - The quizId of Quiz
 * @param {number} questionId - The questionId of Question
 * @param {number} newPosition - The newPosition of Question
 * @returns {type.Response} - Response from the server
 */
export function adminQuizQuestionMoveV2(token: string, quizId: number, questionId: number, newPosition: number): any {
  return requestHelper('PUT', `/v2/admin/quiz/${quizId}/question/${questionId}/move`, { newPosition: newPosition }, { token: token });
}

/**
 * Written by Louis
 * This function request response for adminQuizQuestionDuplicate from the server
 * @param {string} token - The token of User
 * @param {number} quizId - The quizId of Quiz
 * @param {number} questionId - The questionId of Question
 * @returns {type.Response} - Response from the server
 */
export function adminQuizQuestionDuplicateV2(token: string, quizId: number, questionId: number): any {
  return requestHelper('POST', `/v2/admin/quiz/${quizId}/question/${questionId}/duplicate`, {}, { token: token });
}
// ITERATION 3 FUNCTIONS

export function adminQuizThumbnailUpdate(token: string, quizId: number, imgUrl: string): any {
  return requestHelper('PUT', `/v1/admin/quiz/${quizId}/thumbnail`, { imgUrl: imgUrl }, { token: token });
}

export function adminQuizViewSessions(token: string, quizId: number) {
  return requestHelper('GET', `/v1/admin/quiz/${quizId}/sessions`, {}, { token: token });
}

export function adminQuizSessionStart(token: string, quizId: number, autoStartNum: number): any {
  return requestHelper('POST', `/v1/admin/quiz/${quizId}/session/start`, { autoStartNum: autoStartNum }, { token: token });
}

export function adminQuizSessionUpdate(quizId: number, sessionId: number, token: string, action: string): any {
  return requestHelper('PUT', `/v1/admin/quiz/${quizId}/session/${sessionId}`, { action: action }, { token: token });
}

export function adminQuizSessionStatus(quizId: number, sessionId: number, token: string): any {
  return requestHelper('GET', `/v1/admin/quiz/${quizId}/session/${sessionId}`, {}, { token: token });
}

export function adminQuizSessionResults(quizId: number, sessionId: number, token: string): any {
  return requestHelper('GET', `/v1/admin/quiz/${quizId}/session/${sessionId}/results`, {}, { token: token });
}

export function adminQuizSessionResultsCSV(quizId: number, sessionId: number, token: string): any {
  return requestHelper('GET', `/v1/admin/quiz/${quizId}/session/${sessionId}/results/csv`, {}, { token: token });
}

export function playerJoin(sessionId: number, name: string): any {
  return requestHelper('POST', '/v1/player/join', { sessionId: sessionId, name: name }, {});
}

export function playerStatus(playerId: number): any {
  return requestHelper('GET', `/v1/player/${playerId}`, {}, {});
}

export function playerQuestion(playerId: number, questionposition: number): any {
  return requestHelper('GET', `/v1/player/${playerId}/question/${questionposition}`, {}, {});
}

export function playerAnswer(playerId: number, questionposition: number, answer: number[]): any {
  return requestHelper('PUT', `/v1/player/${playerId}/question/${questionposition}/answer`, { answerIds: answer }, {});
}

export function playerQuestionResult(playerId: number, questionposition: number): any {
  return requestHelper('GET', `/v1/player/${playerId}/question/${questionposition}/results`, {}, {});
}

export function playerSessionResult(playerId: number): any {
  return requestHelper('GET', `/v1/player/${playerId}/results`, {}, {});
}

export function playerSessionChat(playerId: number): any {
  return requestHelper('GET', `/v1/player/${playerId}/chat`, {}, {});
}

export function playerSessionSendChat(playerId: number, message: type.Message): any {
  return requestHelper('POST', `/v1/player/${playerId}/chat`, { message: message }, {});
}
