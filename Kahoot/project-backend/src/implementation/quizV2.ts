// import { errorMonitor } from 'events';
import { getDataV2, setDataV2 } from '../dataStore';
import * as typeV2 from '../interfaceV2';
import * as hf from '../server/helperfunction';
import HTTPError from 'http-errors';

const MINIMUM_NAME_LENGTH = 3;
const MAXIMUM_NAME_LENGTH = 30;
const MAXIMUM_DESCRIPTION_LENGTH = 100;
const MINIMUM_QUESTION_LENGTH = 5;
const MAXIMUM_QUESTION_LENGTH = 50;
const MINIMUM_QUIZ_ANSWER = 2;
const MAXIMUM_QUIZ_ANSWER = 6;
const MINIMUM_ANSWER_LENGTH = 1;
const MAXIMUM_ANSWER_LENGTH = 30;
const MINIMUM_DURATION = 0;
const MAXIMUM_DURATION = 180;
const MINIMUM_POINT = 1;
const MAXIMUM_POINT = 10;

/**
 * Written by Yepeng
 * Lists all user's quizzes
 * @param {number} authUserId -The user ID of the quiz creator
 * @returns {typeV2.QuizList} - A new object containing quizId and name or
 * @returns {typeV2.ErrorMsg} - A new object containing error
 */
export function adminQuizListV2(authUserId : number): typeV2.ErrorMsg | typeV2.QuizList {
  const data: typeV2.Data = getDataV2();
  let targetUser: typeV2.User;
  // find user
  for (const user of data.users) {
    if (user.info.authUserId === authUserId) {
      targetUser = user;
      break;
    }
  }

  const quizzes: typeV2.QuizDetails[] = targetUser.quizzes.map((quiz) => {
    return {
      quizId: quiz.info.quizId,
      name: quiz.info.name
    };
  });

  return { quizzes: quizzes };
}

/**
 * Written by Yepeng
 * Create a new quiz
 * @param {number} authUserId - The user ID of the quiz creator
 * @param {string} name - The user name of the quiz creator
 * @param {string} description -Description about the new quiz
 * @returns {typeV2.QuizId} - A new object containing quizId or
 * @returns {typeV2.ErrorMsg} - A new object containing error
 */
export function adminQuizCreateV2(authUserId : number, name : string, description : string): typeV2.ErrorMsg | typeV2.QuizId {
  const dataStore: typeV2.Data = getDataV2();
  let user: typeV2.User;
  // find user
  for (const currUser of dataStore.users) {
    if (currUser.info.authUserId === authUserId) {
      user = currUser;
      break;
    }
  }

  // check if name is length valid
  if (name.length < MINIMUM_NAME_LENGTH || name.length > MAXIMUM_NAME_LENGTH) {
    throw HTTPError(400, 'name must be at least 3 characters and at most 30 characters');
  }

  // check if name letter is valid
  let containAlphaNumeric = 0;
  for (const letter of name) {
    if (/^[a-z0-9]+$/i.test(letter)) {
      containAlphaNumeric = 1;
    }
    if (!(/^[a-z0-9]+$/i.test(letter) || letter === ' ')) {
      throw HTTPError(400, 'name must contain only alphanumeric characters');
    }
  }
  /* istanbul ignore next */
  if (!containAlphaNumeric) {
    throw HTTPError(400, 'name must not be only spaces');
  }

  // check if name is used
  for (const quiz of user.quizzes) {
    if (quiz.info.name === name) {
      throw HTTPError(400, `name ${name} has already been used for another quiz`);
    }
  }
  // check if description is valid
  if (description.length > MAXIMUM_DESCRIPTION_LENGTH) {
    throw HTTPError(400, 'description must not be less than or equal to 100 characters');
  }

  // looked this up
  const time: number = Math.floor(Date.now() / 1000);
  const newQuizId: number = dataStore.quizLength + 1;
  dataStore.quizLength += 1;
  const quizInfo: typeV2.QuizInfo = {
    quizId: newQuizId,
    name: name,
    timeCreated: time,
    timeLastEdited: time,
    description: description,
    numQuestions: 0,
    questions: [],
    duration: 0,
    thumbnailUrl: '',
  };
  const newQuiz: typeV2.Quiz = {
    info: quizInfo
  };
  user.quizzes.push(newQuiz);
  setDataV2(dataStore);
  return {
    quizId: newQuizId
  };
}

/**
* Written by Marius
* View the quizzes in trash
* @param {number} authUserId - ID of a particular user
* @returns {typeV2.QuizList} - A new object containing quizId and name or
* @returns {typeV2.ErrorMsg} - A new object containing error
*/
export function adminQuizTrashV2(authUserId : number): typeV2.QuizList | typeV2.ErrorMsg {
  const data: typeV2.Data = getDataV2();
  const targetUser : typeV2.User = data.users.find((user: typeV2.User) => user.info.authUserId === authUserId);
  const trashedQuizzes : typeV2.Quiz[] = targetUser.trash;

  const trashDetails: typeV2.QuizList = {
    quizzes: [] as typeV2.QuizDetails[],
  };

  trashedQuizzes.forEach(quiz => {
    const quizDetails : typeV2.QuizDetails = {
      quizId: quiz.info.quizId,
      name: quiz.info.name,
    };

    trashDetails.quizzes.push(quizDetails);
  });

  return trashDetails;
}

/**
 * Written by Yepeng
 * Send a quiz to trash
 * @param {interger} authUserId - The ID of User
 * @param {interger} quizId - The ID of Quiz
 * @returns {typeV2.Empty} - empty object or
 * @returns {typeV2.ErrorMsg} - A new object containing error
 */
export function adminQuizRemoveV2 (authUserId : number, quizId : number): typeV2.ErrorMsg | typeV2.Empty {
  const dataStore: typeV2.Data = getDataV2();
  let user: typeV2.User;

  // find user
  for (const currUser of dataStore.users) {
    if (currUser.info.authUserId === authUserId) {
      user = currUser;
      break;
    }
  }

  let hasQuiz = 0;
  const quizzes: typeV2.Quiz[] = user.quizzes;
  // find quiz
  for (const quiz of quizzes) {
    if (quiz.info.quizId === quizId) {
      hasQuiz = 1;
      quizzes.splice(quizzes.indexOf(quiz), 1);
      user.trash.push(quiz);
      quiz.info.timeLastEdited = Math.floor(Date.now() / 1000);
      break;
    }
  }
  // check if quiz ID exist
  if (!hasQuiz) {
    throw HTTPError(400, 'quiz Id does not exist or not owned by this user');
  }
  setDataV2(dataStore);
  return {};
}

/**
 * Written by Yepeng, Marius.
 * Get info about current quiz
 * @param {number} authUserId - ID of a particular user
 * @param {number} quizId - ID of a particular quiz
 * @returns {typeV2.QuizInfo} - A new object containing quizId, name, timeCreated, timeLastEdited, description, numQuestions, questions, duration or
 * @returns {typeV2.ErrorMsg} - A new object containing error
 */
export function adminQuizInfoV2(authUserId : number, quizId : number): typeV2.ErrorMsg | typeV2.QuizInfo {
  const data: typeV2.Data = getDataV2();
  const targetUser: any = data.users.find((user: typeV2.User) => user.info.authUserId === authUserId);

  // Tries to find the specified quizId
  let targetQuiz : any;
  for (const user of data.users) {
    const currentQuiz = user.quizzes.find((quiz: typeV2.Quiz) => quiz.info.quizId === quizId);
    if (currentQuiz) {
      targetQuiz = currentQuiz;
      break;
    }
  }

  // No quiz with specified quizId exists
  if (!targetQuiz) {
    throw HTTPError(400, 'No such quizId exists.');
  }

  // Both authUserId and quizId are valid, but the targeted user doesn't contain it
  if (!targetUser.quizzes.find((quiz: typeV2.Quiz) => quiz.info.quizId === targetQuiz.info.quizId)) {
    throw HTTPError(400, 'This particular user does not contain the specified quiz.');
  }

  // AuthUserId contains the specified quizId
  return targetQuiz.info;
}

/**
 * Written by Yepeng.
 * Update quiz name.
 * @param {number} authUserId  - ID of the user.
 * @param {number} quizId - ID of the quiz.
 * @param {string} name - The user name of the quiz creator.
 * @returns {typeV2.Empty} - A empty object or
 * @returns {typeV2.ErrorMsg} - A new object containing error
 */
export function adminQuizNameUpdateV2 (authUserId : number, quizId : number, name : string): typeV2.ErrorMsg | typeV2.Empty {
  const data: typeV2.Data = getDataV2();

  // Find the user with the provided userId
  const user: any = data.users.find((user: typeV2.User) => user.info.authUserId === authUserId);

  // Find the quiz with the provided quizId within the user's quizzes
  const quiz: any = user.quizzes.find((quiz: typeV2.Quiz) => quiz.info.quizId === quizId);

  // If the quiz doesn't exist, return an error
  if (!quiz) {
    throw HTTPError(400, 'Quiz not found or not owned by this user');
  }

  // Check if the name contains any characters that are not alphanumeric or are spaces

  // check if name letter is valid
  let containAlphaNumeric = 0;
  for (const letter of name) {
    if (/^[a-z0-9]+$/i.test(letter)) {
      containAlphaNumeric = 1;
    }
    if (!(/^[a-z0-9]+$/i.test(letter) || letter === ' ')) {
      throw HTTPError(400, 'name must contain only alphanumeric characters');
    }
  }
  /* istanbul ignore next */
  if (!containAlphaNumeric) {
    throw HTTPError(400, 'name must not be only spaces');
  }

  // Check if the name is either less than 3 characters long or more than 30 characters long
  if (name.length < MINIMUM_NAME_LENGTH || name.length > MAXIMUM_NAME_LENGTH) {
    throw HTTPError(400, 'Name must be between 3 and 30 characters long');
  }

  // Check if the name is already used by the current logged in user for another quiz
  const isNameUsed: any = user.quizzes.some((quiz: typeV2.Quiz) => quiz.info.name === name);
  if (isNameUsed) {
    throw HTTPError(400, 'Name is already used by the user for another quiz');
  }

  // Update the quiz's name and timeLastEdited
  quiz.info.name = name;
  const time: number = Math.floor(Date.now() / 1000);
  quiz.info.timeLastEdited = time;

  // Save the updated data
  setDataV2(data);

  return {};
}

/**
 * Written by Yepeng
 * Update quiz description
 * @param {number} authUserId -The user ID of the quiz creator
 * @param {number} quizId - The quizId of the quiz creator
 * @param {string} description -Description about the new quiz
 * @returns {typeV2.Empty} - A empty object or
 * @returns {typeV2.ErrorMsg} - A new object containing error
 */
export function adminQuizDescriptionUpdateV2(authUserId : number, quizId : number, newDescription : string): typeV2.Empty | typeV2.ErrorMsg {
  const data: typeV2.Data = getDataV2();

  // Find the user with the provided userId
  const user: any = data.users.find((user: typeV2.User) => user.info.authUserId === authUserId);
  // Find the quiz with the provided quizId within the user's quizzes
  const quiz: any = user.quizzes.find((quiz: typeV2.Quiz) => quiz.info.quizId === quizId);

  // If the quiz doesn't exist, return an error
  if (!quiz) {
    throw HTTPError(400, 'Quiz not found');
  }
  if (newDescription.length > 100) {
    throw HTTPError(400, 'Description is more than 100 characters in length');
  }
  const time: number = Math.floor(Date.now() / 1000);
  quiz.info.timeLastEdited = time;
  quiz.info.description = newDescription;

  setDataV2(data);

  return {};
}

/**
  * Written by Yepeng
  * Restore a quiz from trash
  * @param {number} authUserId - ID of a particular user
  * @param {number} quizId - ID of a particular quiz
  * @returns {typeV2.Empty} - A empty object or
  * @returns {typeV2.ErrorMsg} - A new object containing error
 */
export const adminQuizRestoreV2 = (authUserId : number, quizId : number): typeV2.ErrorMsg | typeV2.Empty => {
  const dataStore: typeV2.Data = getDataV2();
  const targetUser: any = dataStore.users.find((user: typeV2.User) => {
    return user.info.authUserId === authUserId;
  });

  const targetQuiz: any = targetUser.trash.find((quiz: typeV2.Quiz) => {
    return quiz.info.quizId === quizId;
  });

  if (targetQuiz === undefined) {
    throw HTTPError(400, 'quiz Id does not exist or not owned by this user');
  }

  const index: any = targetUser.trash.findIndex((item: typeV2.Quiz) => {
    return item.info.quizId === quizId;
  });

  targetUser.trash.splice(index, 1);
  targetUser.quizzes.push(targetQuiz);
  setDataV2(dataStore);
  return {};
};

/**
  * Written by Yepeng
  * Empty trash
  * @param {number} authUserId - ID of a particular user
  * @param {number[]} quizIds - ID of a particular quiz
  * @returns {typeV2.Empty} - A empty object or
  * @returns {typeV2.ErrorMsg} - A new object containing error
 */
export const adminQuizEmptyTrashV2 = (autherUserId: number, quizIds: number[]): typeV2.ErrorMsg | typeV2.Empty => {
  const data: typeV2.Data = getDataV2();
  const targetUser: any = data.users.find((user: typeV2.User) => {
    return user.info.authUserId === autherUserId;
  });

  for (const quizId of quizIds) {
    const hasQuiz: any = targetUser.trash.find((quiz: typeV2.Quiz) => {
      return quiz.info.quizId === quizId;
    });
    if (hasQuiz === undefined) {
      throw HTTPError(400, 'quizId does not exist in trash');
    }
  }

  for (const quizId of quizIds) {
    const index: any = targetUser.trash.findIndex((item: typeV2.Quiz) => {
      return item.info.quizId === quizId;
    });
    targetUser.trash.splice(index, 1);
  }
  setDataV2(data);
  return {};
};

/**
 * Written by Yepeng
 * Transfer the quiz to another owner
 * @param {number} authUserId - ID of a particular user
 * @param {number} quizId - ID of a particular quiz
 * @param {string} email - Email of the new owner
 * @returns {typeV2.Empty} - A empty object or
 * @returns {typeV2.ErrorMsg} - A new object containing error
*/
export const adminQuizTransferV2 = (authUserId: number, quizId: number, email: string): typeV2.Empty | typeV2.ErrorMsg => {
  const data: typeV2.Data = getDataV2();
  const quizSender: any = data.users.find((user: typeV2.User) => {
    return user.info.authUserId === authUserId;
  });

  const quizReceiver: any = data.users.find((user: typeV2.User) => {
    return user.info.email === email;
  });

  if (quizReceiver === undefined) {
    throw HTTPError(400, 'receiver not found');
  }

  if (quizReceiver.info.email === quizSender.info.email) {
    throw HTTPError(400, 'receiver and sender are the same');
  }

  const isOnline: any = data.tokens.find((token: typeV2.Token) => {
    return token.userId === quizReceiver.info.authUserId;
  });
  /* istanbul ignore next */
  if (isOnline === undefined) {
    throw HTTPError(400, 'receiver is not online');
  }

  const targetQuizIndex: any = quizSender.quizzes.findIndex((quiz: typeV2.Quiz) => {
    return quiz.info.quizId === quizId;
  });

  const targetQuiz: any = quizSender.quizzes[targetQuizIndex];

  if (targetQuizIndex === -1) {
    throw HTTPError(400, 'sender does not own this quiz');
  }

  const hasReceiver: any = quizReceiver.quizzes.find((quiz: typeV2.Quiz) => {
    return quiz.info.name === targetQuiz.info.name;
  });

  if (hasReceiver !== undefined) {
    throw HTTPError(400, 'the receiver already has a quiz with the same name');
  }

  quizReceiver.quizzes.push(targetQuiz);
  quizSender.quizzes.splice(targetQuizIndex, 1);
  setDataV2(data);
  return {};
};

/**
  * Written by Marius
  * Create quiz question
  * @param {number} authUserId - ID of a particular user
  * @param {number} quizId - ID of a particular quiz
  * @param {string} question - The question
  * @param {number} duration - The duration of the question
  * @param {number} points - The points of the question
  * @param {typeV2.AnswerDetails[]} answers - The answers of the question
  * @returns {typeV2.QuestionId} - A new object containing questionId or
  * @returns {typeV2.ErrorMsg} - A new object containing error
*/
export const adminQuizQuestionCreateV2 = (authUserId: number, quizId: number, question: string, duration: number, points: number, answers: typeV2.AnswerDetails[], imageUrl: string): typeV2.QuestionId | typeV2.ErrorMsg => {
  const data: typeV2.Data = getDataV2();

  const targetUser: any = hf.findUser(data, authUserId);
  const targetQuiz: any = hf.findQuiz(data, quizId);
  /* istanbul ignore next */
  if (!targetUser.quizzes.find((quiz: typeV2.Quiz) => quiz.info.quizId === quizId)) {
    throw HTTPError(400, 'User does not own quizId');
  }

  if (question.length < MINIMUM_QUESTION_LENGTH || question.length > MAXIMUM_QUESTION_LENGTH) {
    throw HTTPError(400, 'Question must be between 5-50 characters long');
  }

  if (answers.length < MINIMUM_QUIZ_ANSWER || answers.length > MAXIMUM_QUIZ_ANSWER) {
    throw HTTPError(400, 'Quizzes must have 2-6 answers');
  }

  if (duration <= MINIMUM_DURATION) {
    throw HTTPError(400, 'Question duration should be greater than 0');
  }

  const durations: number = targetQuiz.info.questions.map((question: typeV2.Question) => question.duration).reduce((acc: any, curVal: any) => acc + curVal, 0) + duration;
  if (durations > MAXIMUM_DURATION) {
    throw HTTPError(400, 'Quiz cannot be longer than 3 minutes in total');
  }

  if (points < MINIMUM_POINT || points > MAXIMUM_POINT) {
    throw HTTPError(400, 'Questions must be worth 1-10 points');
  }

  if (answers.some((answer: typeV2.Answer) => answer.answer.length < MINIMUM_ANSWER_LENGTH || answer.answer.length > MAXIMUM_ANSWER_LENGTH)) {
    throw HTTPError(400, 'All answers must have a length of 1-30 characters');
  }

  // Converts an array into a javascript set. Any duplicate values are removed
  // If the size differs between the set and the array, then a duplicate was present
  const answerArr : string[] = answers.map((answer: typeV2.Answer) => answer.answer);
  const answerSet = new Set(answerArr);

  if (answerArr.length !== answerSet.size) {
    throw HTTPError(400, 'All answers must be unique');
  }

  if (!answers.some((answer: typeV2.Answer) => answer.correct === true)) {
    throw HTTPError(400, 'Questions must have atleast 1 correct answer');
  }

  // Classic kahoot colour scheme
  const colours: string[] = ['red', 'green', 'blue', 'yellow', 'orange', 'purple'];

  // Gives each answer a unique id and unique, randomized colour
  const completeAnswers : typeV2.Answer[] = answers.map((answer: typeV2.Answer) => {
    const randColIndex: number = Math.floor(Math.random() * colours.length);

    const completeAnswer : typeV2.Answer = {
      answerId: data.answerLength,
      answer: answer.answer,
      colour: colours[randColIndex],
      correct: answer.correct,
    };

    data.answerLength++;
    colours.splice(randColIndex, 1);
    return completeAnswer;
  });

  const thumbnailUrl = hf.UpdateQuestionThumbnail(data.questionLength, imageUrl);

  // Generates a new question out of provided data
  const newQuestion : typeV2.Question = {
    questionId: data.questionLength,
    question: question,
    duration: duration,
    points: points,
    answers: completeAnswers,
    thumbnailUrl: thumbnailUrl,
  };

  data.questionLength++;
  // Update the timeLastEdited
  const time = Math.floor(Date.now() / 1000);
  targetQuiz.info.timeLastEdited = time;

  // Don't forget to update the thumbnail in targetQuiz too
  targetQuiz.thumbnail = thumbnailUrl;
  targetQuiz.info.duration += duration;
  targetQuiz.info.questions.push(newQuestion);
  targetQuiz.info.numQuestions++;
  setDataV2(data);
  return { questionId: newQuestion.questionId };
};

/**
 * Written by Marius
 * Duplicate quiz question
 * @param {number} authUserId - ID of a particular user
 * @param {number} quizId - ID of a particular quiz
 * @param {number} questionId - ID of a particular question
 * @returns {typeV2.NewQuestionId} - A new object containing newQuestionId or
 * @returns {typeV2.ErrorMsg} - A new object containing error
*/
export const adminQuizQuestionDuplicateV2 = (authUserId: number, quizId: number, questionId: number): typeV2.NewQuestionId | typeV2.ErrorMsg => {
  const data : typeV2.Data = getDataV2();

  const targetUser : any = hf.findUser(data, authUserId);
  const targetQuiz : any = hf.findQuiz(data, quizId);

  if (!targetQuiz) {
    throw HTTPError(400, 'Invalid quizId');
  }

  if (!targetUser.quizzes.find((quiz: typeV2.Quiz) => quiz.info.quizId === quizId)) {
    throw HTTPError(400, 'User does not own quizId');
  }

  let questionToMove : typeV2.Question | undefined;
  let oldPosition : number | undefined;
  targetQuiz.info.questions.forEach((question: any, index: any) => {
    if (question.questionId === questionId) {
      questionToMove = question;
      oldPosition = index;
    }
  });

  if (!questionToMove) {
    throw HTTPError(400, 'The specfied quiz does not contain the question provided');
  }

  const copy: typeV2.Question = JSON.parse(JSON.stringify(questionToMove));
  /* istanbul ignore next */
  if (targetQuiz.info.duration + questionToMove.duration > 180) {
    throw HTTPError(400, 'total duration will exceed 3 mins');
  }

  const time: number = Math.floor(Date.now() / 1000);
  data.questionLength++;
  copy.questionId = data.questionLength;
  targetQuiz.info.timeLastEdited = time;
  targetQuiz.info.duration += questionToMove.duration;
  targetQuiz.info.questions.splice(oldPosition + 1, 0, copy);
  targetQuiz.info.numQuestions++;
  hf.duplicateQuestionThumbnail(questionToMove.thumbnailUrl, copy.questionId);
  setDataV2(data);
  return { newQuestionId: data.questionLength };
};

/**
 * Written by Yepeng
 * Update quiz question
 * @param {number} authUserId - ID of a particular user
 * @param {number} quizId - ID of a particular quiz
 * @param {number} questionId - ID of a particular question
 * @param {typeV2.QuestionBody} questionBody - The question body
 * @returns {typeV2.Empty} - A empty object or
 * @returns {typeV2.ErrorMsg} - A new object containing error
*/
export const adminQuizQuestionUpdateV2 = (authUserId: number, quizId: number, questionId: number, questionBody: typeV2.QuestionBody, thumbnailUrl : string): typeV2.ErrorMsg | typeV2.Empty => {
  const data: typeV2.Data = getDataV2();

  const targetUser: any = hf.findUser(data, authUserId);
  const targetQuiz: any = hf.findQuiz(data, quizId);
  if (targetQuiz === undefined) {
    throw HTTPError(400, 'quiz does not exist');
  }

  const question: string = questionBody.question;
  const answers: typeV2.AnswerBody[] = questionBody.answers;
  const duration: number = questionBody.duration;
  const points: number = questionBody.points;

  const index: any = targetQuiz.info.questions.findIndex((question: typeV2.Question) => {
    return question.questionId === questionId;
  });

  if (index === -1) {
    throw HTTPError(400, `question ${questionId} not found`);
  }

  const questionToMove: typeV2.Question = targetQuiz.info.questions[index];

  if (!targetUser.quizzes.find((quiz: typeV2.Quiz) => quiz.info.quizId === quizId)) {
    throw HTTPError(400, 'User does not own quizId');
  }

  if (question.length < MINIMUM_QUESTION_LENGTH || question.length > MAXIMUM_QUESTION_LENGTH) {
    throw HTTPError(400, 'Question must be between 5-50 characters long');
  }

  if (answers.length < MINIMUM_QUIZ_ANSWER || answers.length > MAXIMUM_QUIZ_ANSWER) {
    throw HTTPError(400, 'Quizzes must have 2-6 answers');
  }

  if (duration <= MINIMUM_DURATION) {
    throw HTTPError(400, 'Question duration should be greater than 0');
  }

  const durations = targetQuiz.info.questions.map((question: typeV2.Question) => question.duration).reduce((acc: any, curVal: any) => acc + curVal, 0) + duration;
  if (durations > MAXIMUM_DURATION) {
    throw HTTPError(400, 'Quiz cannot be longer than 3 minutes in total');
  }

  if (points < MINIMUM_POINT || points > MAXIMUM_POINT) {
    throw HTTPError(400, 'Questions must be worth 1-10 points');
  }

  if (answers.some(answer => answer.answer.length < MINIMUM_ANSWER_LENGTH || answer.answer.length > MAXIMUM_ANSWER_LENGTH)) {
    throw HTTPError(400, 'All answers must have a length of 1-30 characters');
  }

  // Converts an array into a javascript set. Any duplicate values are removed
  // If the size differs between the set and the array, then a duplicate was present
  const answerArr: string[] = answers.map(answer => answer.answer);
  const answerSet = new Set(answerArr);
  /* istanbul ignore next */
  if (answerArr.length !== answerSet.size) {
    throw HTTPError(400, 'All answers must be unique');
  }

  /* istanbul ignore next */
  if (!answers.some(answer => answer.correct === true)) {
    throw HTTPError(400, 'Questions must have atleast 1 correct answer');
  }

  const colours: string[] = ['red', 'green', 'blue', 'yellow', 'orange', 'purple'];

  // Gives each answer a unique id and unique, randomized colour
  const completeAnswers: typeV2.Answer[] = answers.map((answer) => {
    const randColIndex: number = Math.floor(Math.random() * colours.length);

    const completeAnswer : typeV2.Answer = {
      answerId: data.answerLength,
      answer: answer.answer,
      colour: colours[randColIndex],
      correct: answer.correct,
    };

    data.answerLength++;
    colours.splice(randColIndex, 1);
    return completeAnswer;
  });

  const thumbnailPath = hf.UpdateQuestionThumbnail(questionToMove.questionId, thumbnailUrl);

  // Generates a new question out of provided data
  const newQuestion: typeV2.Question = {
    questionId: questionToMove.questionId,
    question: question,
    duration: duration,
    points: points,
    answers: completeAnswers,
    thumbnailUrl: thumbnailPath,
  };

  // Update the timeLastEdited
  const time: number = Math.floor(Date.now() / 1000);
  targetQuiz.info.timeLastEdited = time;
  targetQuiz.info.duration -= questionToMove.duration;
  targetQuiz.info.duration += duration;
  targetQuiz.info.questions.splice(index, 1, newQuestion);
  // targetQuiz.info.numQuestions++;
  setDataV2(data);
  return {};
};

/**
 * Written by Yepeng
 * Remove quiz question
 * @param {number} authUserId - ID of a particular user
 * @param {number} quizId - ID of a particular quiz
 * @param {number} questionId - ID of a particular question
 * @returns {typeV2.Empty} - A empty object or
 * @returns {typeV2.ErrorMsg} - A new object containing error
*/
export const adminQuizQuestionRemoveV2 = (authUserId: number, quizId: number, questionId: number): typeV2.ErrorMsg | typeV2.Empty => {
  const data: typeV2.Data = getDataV2();

  const targetUser: any = data.users.find((user: typeV2.User) => {
    return user.info.authUserId === authUserId;
  });

  const targetQuiz: any = targetUser.quizzes.find((quiz: typeV2.Quiz) => {
    return quiz.info.quizId === quizId;
  });
  if (targetQuiz === undefined) {
    throw HTTPError(400, 'quiz does not exist');
  }
  const targetQuestionIndex = targetQuiz.info.questions.findIndex((question: typeV2.Question) => {
    return question.questionId === questionId;
  });
  if (targetQuestionIndex === -1) {
    throw HTTPError(400, 'question does not exist');
  }
  targetQuiz.info.numQuestions--;
  targetQuiz.info.duration -= targetQuiz.info.questions[targetQuestionIndex].duration;
  targetQuiz.info.questions.splice(targetQuestionIndex, 1);
  targetQuiz.info.timeLastEdited = Math.floor(Date.now() / 1000);
  hf.removeQuestionThumbnail(questionId);

  setDataV2(data);
  return {};
};

/**
 * Written by Marius
 * Move quiz question
 * @param {number} authUserId - ID of a particular user
 * @param {number} quizId - ID of a particular quiz
 * @param {number} questionId - ID of a particular question
 * @param {number} newPosition - The new position of the question
 * @returns {typeV2.Empty} - A empty object or
 * @returns {typeV2.ErrorMsg} - A new object containing error
*/
export const adminQuizQuestionMoveV2 = (authUserId : number, quizId : number, questionId : number, newPosition : number): typeV2.Empty | typeV2.ErrorMsg => {
  const data : typeV2.Data = getDataV2();

  const targetUser: any = data.users.find((user: typeV2.User) => {
    return user.info.authUserId === authUserId;
  });

  const targetQuiz: any = targetUser.quizzes.find((quiz: typeV2.Quiz) => {
    return quiz.info.quizId === quizId;
  });

  if (targetQuiz === undefined) {
    throw HTTPError(400, 'quiz not found');
  }

  const targetQuestionIndex: any = targetQuiz.info.questions.findIndex((question: typeV2.Question) => {
    return question.questionId === questionId;
  });

  if (targetQuestionIndex === -1) {
    throw HTTPError(400, 'question not found');
  }

  if (targetQuestionIndex === newPosition) {
    throw HTTPError(400, 'new position must be a different position');
  }

  if (newPosition < 0 || newPosition >= targetQuiz.info.questions.length) {
    throw HTTPError(400, 'new position must be greater than 0, or less than total amount of questions');
  }

  targetQuiz.info.timeLastEdited = Math.floor(Date.now() / 1000);
  const targetQuestion = { ...targetQuiz.info.questions[targetQuestionIndex] };
  // return {targetQuestionIndex};
  targetQuiz.info.questions.splice(targetQuestionIndex, 1);
  targetQuiz.info.questions.splice(newPosition, 0, targetQuestion);

  setDataV2(data);
  return {};
};

export const adminQuizThumbnailUpdate = (authUserId: number, quizId: number, thumbnail: string) => {
  const data = getDataV2();
  const targetUser = data.users.find(user => user.info.authUserId === authUserId);

  const targetQuiz = targetUser.quizzes.find(quiz => quiz.info.quizId === quizId);
  if (!targetQuiz) {
    throw HTTPError(400, 'quiz not found');
  }

  targetQuiz.info.thumbnailUrl = hf.UpdateQuizThumbnail(targetQuiz.info.quizId, thumbnail);
  return {};
};
