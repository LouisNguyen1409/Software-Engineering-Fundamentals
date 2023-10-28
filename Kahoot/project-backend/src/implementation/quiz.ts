// import { errorMonitor } from 'events';
import { getDataV2, setDataV2 } from '../dataStore';
import * as type from '../interfaceV2';
import * as type1 from '../interface';
import * as hf from '../server/helperfunction';

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
 * Send a quiz to trash
 * @param {interger} authUserId - The ID of User
 * @param {interger} quizId - The ID of Quiz
 * @returns {type.Empty} - empty object or
 * @returns {type.ErrorMsg} - A new object containing error
 */
export function adminQuizRemove (authUserId : number, quizId : number): type.ErrorMsg | type.Empty {
  const dataStore: type.Data = getDataV2();
  let user: type.User;

  // find user
  for (const currUser of dataStore.users) {
    if (currUser.info.authUserId === authUserId) {
      user = currUser;
      break;
    }
  }

  let hasQuiz = 0;
  const quizzes: type.Quiz[] = user.quizzes;
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
    return { error: 'quiz Id does not exist or not owned by this user' };
  }
  setDataV2(dataStore);
  return {};
}

/**
 * Written by Yepeng
 * Create a new quiz
 * @param {number} authUserId - The user ID of the quiz creator
 * @param {string} name - The user name of the quiz creator
 * @param {string} description -Description about the new quiz
 * @returns {type.QuizId} - A new object containing quizId or
 * @returns {type.ErrorMsg} - A new object containing error
 */
export function adminQuizCreate(authUserId : number, name : string, description : string): type.ErrorMsg | type.QuizId {
  const dataStore: type.Data = getDataV2();
  let user: type.User;
  // find user
  for (const currUser of dataStore.users) {
    if (currUser.info.authUserId === authUserId) {
      user = currUser;
      break;
    }
  }

  // check if name is length valid
  if (name.length < MINIMUM_NAME_LENGTH || name.length > MAXIMUM_NAME_LENGTH) {
    return { error: 'name must be at least 3 characters and at most 30 characters' };
  }

  // check if name letter is valid
  for (const letter of name) {
    if (!(/^[a-z0-9]+$/i.test(letter) || letter === ' ')) {
      return { error: 'name must contain only alphanumeric characters' };
    }
  }

  // check if name is used
  for (const quiz of user.quizzes) {
    if (quiz.info.name === name) {
      return { error: `name ${name} has already been used for another quiz` };
    }
  }
  // check if description is valid
  if (description.length > MAXIMUM_DESCRIPTION_LENGTH) {
    return { error: 'description must not be less than or equal to 100 characters' };
  }

  // looked this up
  const time: number = Math.floor(Date.now() / 1000);
  const newQuizId: number = dataStore.quizLength + 1;
  dataStore.quizLength += 1;
  const quizInfo: type1.QuizInfoV2 = {
    quizId: newQuizId,
    name: name,
    timeCreated: time,
    timeLastEdited: time,
    description: description,
    numQuestions: 0,
    questions: [],
    duration: 0,
    thumbnailUrl: ''
  };
  const newQuiz: any = {
    info: quizInfo
  };
  user.quizzes.push(newQuiz);
  setDataV2(dataStore);
  return {
    quizId: newQuizId
  };
}

/**
 * Written by Yepeng
 * Lists all user's quizzes
 * @param {number} authUserId -The user ID of the quiz creator
 * @returns {type.QuizList} - A new object containing quizId and name or
 * @returns {type.ErrorMsg} - A new object containing error
 */
export function adminQuizList(authUserId : number): type.ErrorMsg | type.QuizList {
  const data: type.Data = getDataV2();
  let targetUser: type.User;
  // find user
  for (const user of data.users) {
    if (user.info.authUserId === authUserId) {
      targetUser = user;
      break;
    }
  }

  const quizzes: type.QuizDetails[] = targetUser.quizzes.map((quiz) => {
    return {
      quizId: quiz.info.quizId,
      name: quiz.info.name
    };
  });

  return { quizzes: quizzes };
}

/**
 * Written by Yepeng.
 * Update quiz name.
 * @param {number} authUserId  - ID of the user.
 * @param {number} quizId - ID of the quiz.
 * @param {string} name - The user name of the quiz creator.
 * @returns {type.Empty} - A empty object or
 * @returns {type.ErrorMsg} - A new object containing error
 */
export function adminQuizNameUpdate (authUserId : number, quizId : number, name : string): type.ErrorMsg | type.Empty {
  const data: type.Data = getDataV2();

  // Find the user with the provided userId
  const user: any = data.users.find((user: type.User) => user.info.authUserId === authUserId);

  // Find the quiz with the provided quizId within the user's quizzes
  const quiz: any = user.quizzes.find((quiz: type.Quiz) => quiz.info.quizId === quizId);

  // If the quiz doesn't exist, return an error
  if (!quiz) {
    return { error: 'Quiz not found or not owned by this user' };
  }

  // Check if the name contains any characters that are not alphanumeric or are spaces

  // check if name letter is valid
  for (const letter of name) {
    if (!(/^[a-z0-9]+$/i.test(letter) || letter === ' ')) {
      return { error: 'name must contain only alphanumeric characters' };
    }
  }

  // Check if the name is either less than 3 characters long or more than 30 characters long
  if (name.length < MINIMUM_NAME_LENGTH || name.length > MAXIMUM_NAME_LENGTH) {
    return { error: 'Name must be between 3 and 30 characters long' };
  }

  // Check if the name is already used by the current logged in user for another quiz
  const isNameUsed: any = user.quizzes.some((quiz: type.Quiz) => quiz.info.name === name);
  if (isNameUsed) {
    return { error: 'Name is already used by the user for another quiz' };
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
 * Written by Yepeng, Marius.
 * Get info about current quiz
 * @param {number} authUserId - ID of a particular user
 * @param {number} quizId - ID of a particular quiz
 * @returns {type.QuizInfo} - A new object containing quizId, name, timeCreated, timeLastEdited, description, numQuestions, questions, duration or
 * @returns {type.ErrorMsg} - A new object containing error
 */
export function adminQuizInfo(authUserId : number, quizId : number): type.ErrorMsg | type1.QuizInfo {
  const data: type.Data = getDataV2();
  const targetUser: any = data.users.find((user: type.User) => user.info.authUserId === authUserId);

  // Tries to find the specified quizId
  let targetQuiz : any;
  for (const user of data.users) {
    const currentQuiz = user.quizzes.find((quiz: type.Quiz) => quiz.info.quizId === quizId);
    if (currentQuiz) {
      targetQuiz = currentQuiz;
      break;
    }
  }

  // No quiz with specified quizId exists
  if (!targetQuiz) {
    return { error: 'No such quizId exists.' };
  }

  // Both authUserId and quizId are valid, but the targeted user doesn't contain it
  if (!targetUser.quizzes.find((quiz: type.Quiz) => quiz.info.quizId === targetQuiz.info.quizId)) {
    return { error: 'This particular user does not contain the specified quiz.' };
  }

  // AuthUserId contains the specified quizId
  // return targetQuiz.info;
  return {
    quizId: targetQuiz.info.quizId,
    name: targetQuiz.info.name,
    timeCreated: targetQuiz.info.timeCreated,
    timeLastEdited: targetQuiz.info.timeLastEdited,
    description: targetQuiz.info.description,
    numQuestions: targetQuiz.info.numQuestions,
    questions: targetQuiz.info.questions,
    duration: targetQuiz.info.duration
  };
}

/**
 * Written by Yepeng
 * Update quiz description
 * @param {number} authUserId -The user ID of the quiz creator
 * @param {number} quizId - The quizId of the quiz creator
 * @param {string} description -Description about the new quiz
 * @returns {type.Empty} - A empty object or
 * @returns {type.ErrorMsg} - A new object containing error
 */
export function adminQuizDescriptionUpdate(authUserId : number, quizId : number, newDescription : string): type.Empty | type.ErrorMsg {
  const data: type.Data = getDataV2();

  // Find the user with the provided userId
  const user: any = data.users.find((user: type.User) => user.info.authUserId === authUserId);
  // Find the quiz with the provided quizId within the user's quizzes
  const quiz: any = user.quizzes.find((quiz: type.Quiz) => quiz.info.quizId === quizId);

  // If the quiz doesn't exist, return an error
  if (!quiz) {
    return { error: 'Quiz not found' };
  }
  if (newDescription.length > 100) {
    return { error: 'Description is more than 100 characters in length' };
  }
  const time: number = Math.floor(Date.now() / 1000);
  quiz.info.timeLastEdited = time;
  quiz.info.description = newDescription;

  setDataV2(data);

  return {};
}

/**
  * Written by Marius
  * View the quizzes in trash
  * @param {number} authUserId - ID of a particular user
  * @returns {type.QuizList} - A new object containing quizId and name or
  * @returns {type.ErrorMsg} - A new object containing error
 */
export function adminQuizTrash(authUserId : number): type.QuizList | type.ErrorMsg {
  const data: type.Data = getDataV2();
  const targetUser : type.User = data.users.find((user: type.User) => user.info.authUserId === authUserId);
  const trashedQuizzes : type.Quiz[] = targetUser.trash;

  const trashDetails: type.QuizList = {
    quizzes: [] as type.QuizDetails[],
  };

  trashedQuizzes.forEach(quiz => {
    const quizDetails : type.QuizDetails = {
      quizId: quiz.info.quizId,
      name: quiz.info.name,
    };

    trashDetails.quizzes.push(quizDetails);
  });

  return trashDetails;
}

/**
  * Written by Yepeng
  * Restore a quiz from trash
  * @param {number} authUserId - ID of a particular user
  * @param {number} quizId - ID of a particular quiz
  * @returns {type.Empty} - A empty object or
  * @returns {type.ErrorMsg} - A new object containing error
 */
export const adminQuizRestore = (authUserId : number, quizId : number): type.ErrorMsg | type.Empty => {
  const dataStore: type.Data = getDataV2();
  const targetUser: any = dataStore.users.find((user: type.User) => {
    return user.info.authUserId === authUserId;
  });

  const targetQuiz: any = targetUser.trash.find((quiz: type.Quiz) => {
    return quiz.info.quizId === quizId;
  });

  if (targetQuiz === undefined) {
    return { error: 'quiz Id does not exist or not owned by this user' };
  }

  const index: any = targetUser.trash.findIndex((item: type.Quiz) => {
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
  * @returns {type.Empty} - A empty object or
  * @returns {type.ErrorMsg} - A new object containing error
 */
export const adminQuizEmptyTrash = (autherUserId: number, quizIds: number[]): type.ErrorMsg | type.Empty => {
  const data: type.Data = getDataV2();
  const targetUser: any = data.users.find((user: type.User) => {
    return user.info.authUserId === autherUserId;
  });

  for (const quizId of quizIds) {
    const hasQuiz: any = targetUser.trash.find((quiz: type.Quiz) => {
      return quiz.info.quizId === quizId;
    });
    if (hasQuiz === undefined) {
      return { error: 'quizId does not exist in trash' };
    }
  }

  for (const quizId of quizIds) {
    const index: any = targetUser.trash.findIndex((item: type.Quiz) => {
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
 * @returns {type.Empty} - A empty object or
 * @returns {type.ErrorMsg} - A new object containing error
*/
export const adminQuizTransfer = (authUserId: number, quizId: number, email: string): type.Empty | type.ErrorMsg => {
  const data: type.Data = getDataV2();
  const quizSender: any = data.users.find((user: type.User) => {
    return user.info.authUserId === authUserId;
  });

  const quizReceiver: any = data.users.find((user: type.User) => {
    return user.info.email === email;
  });

  if (quizReceiver === undefined) {
    return { error: 'receiver not found' };
  }

  if (quizReceiver.info.email === quizSender.info.email) {
    return { error: 'receiver and sender are the same' };
  }

  const targetQuizIndex: any = quizSender.quizzes.findIndex((quiz: type.Quiz) => {
    return quiz.info.quizId === quizId;
  });

  const targetQuiz: any = quizSender.quizzes[targetQuizIndex];

  if (targetQuizIndex === -1) {
    return { error: 'sender does not own this quiz' };
  }

  const hasReceiver: any = quizReceiver.quizzes.find((quiz: type.Quiz) => {
    return quiz.info.name === targetQuiz.info.name;
  });

  if (hasReceiver !== undefined) {
    return { error: 'the receiver already has a quiz with the same name' };
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
  * @param {type.AnswerDetails[]} answers - The answers of the question
  * @returns {type.QuestionId} - A new object containing questionId or
  * @returns {type.ErrorMsg} - A new object containing error
*/
export const adminQuizQuestionCreate = (authUserId: number, quizId: number, question: string, duration: number, points: number, answers: type.AnswerDetails[]): type.QuestionId | type.ErrorMsg => {
  const data: type.Data = getDataV2();

  const targetUser: any = hf.findUser(data, authUserId);
  const targetQuiz: any = hf.findQuiz(data, quizId);

  if (!targetUser.quizzes.find((quiz: type.Quiz) => quiz.info.quizId === quizId)) {
    return { error: 'User does not own quizId' };
  }

  if (question.length < MINIMUM_QUESTION_LENGTH || question.length > MAXIMUM_QUESTION_LENGTH) {
    return { error: 'Question must be between 5-50 characters long' };
  }

  if (answers.length < MINIMUM_QUIZ_ANSWER || answers.length > MAXIMUM_QUIZ_ANSWER) {
    return { error: 'Quizzes must have 2-6 answers' };
  }

  if (duration <= MINIMUM_DURATION) {
    return { error: 'Question duration should be greater than 0' };
  }

  const durations: number = targetQuiz.info.questions.map((question: type.Question) => question.duration).reduce((acc: any, curVal: any) => acc + curVal, 0) + duration;
  if (durations > MAXIMUM_DURATION) {
    return { error: 'Quiz cannot be longer than 3 minutes in total' };
  }

  if (points < MINIMUM_POINT || points > MAXIMUM_POINT) {
    return { error: 'Questions must be worth 1-10 points' };
  }

  if (answers.some((answer: type.Answer) => answer.answer.length < MINIMUM_ANSWER_LENGTH || answer.answer.length > MAXIMUM_ANSWER_LENGTH)) {
    return { error: 'All answers must have a length of 1-30 characters' };
  }

  // Converts an array into a javascript set. Any duplicate values are removed
  // If the size differs between the set and the array, then a duplicate was present
  const answerArr : string[] = answers.map((answer: type.Answer) => answer.answer);
  const answerSet = new Set(answerArr);

  if (answerArr.length !== answerSet.size) {
    return { error: 'All answers must be unique' };
  }

  if (!answers.some((answer: type.Answer) => answer.correct === true)) {
    return { error: 'Questions must have atleast 1 correct answer' };
  }

  // Classic kahoot colour scheme
  const colours: string[] = ['red', 'green', 'blue', 'yellow', 'orange', 'purple'];

  // Gives each answer a unique id and unique, randomized colour
  const completeAnswers : type.Answer[] = answers.map((answer: type.Answer) => {
    const randColIndex: number = Math.floor(Math.random() * colours.length);

    const completeAnswer : type.Answer = {
      answerId: data.answerLength,
      answer: answer.answer,
      colour: colours[randColIndex],
      correct: answer.correct,
    };

    data.answerLength++;
    colours.splice(randColIndex, 1);
    return completeAnswer;
  });

  // Generates a new question out of provided data
  const newQuestion : type1.Question = {
    questionId: data.questionLength,
    question: question,
    duration: duration,
    points: points,
    answers: completeAnswers,
  };

  data.questionLength++;
  // Update the timeLastEdited
  const time = Math.floor(Date.now() / 1000);
  targetQuiz.info.timeLastEdited = time;

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
 * @returns {type.NewQuestionId} - A new object containing newQuestionId or
 * @returns {type.ErrorMsg} - A new object containing error
*/
export const adminQuizQuestionDuplicate = (authUserId: number, quizId: number, questionId: number): type.NewQuestionId | type.ErrorMsg => {
  const data : type.Data = getDataV2();

  const targetUser : any = hf.findUser(data, authUserId);
  const targetQuiz : any = hf.findQuiz(data, quizId);

  if (!targetQuiz) {
    return { error: 'Invalid quizId' };
  }

  if (!targetUser.quizzes.find((quiz: type.Quiz) => quiz.info.quizId === quizId)) {
    return { error: 'User does not own quizId' };
  }

  let questionToMove : type.Question | undefined;
  let oldPosition : number | undefined;
  targetQuiz.info.questions.forEach((question: any, index: any) => {
    if (question.questionId === questionId) {
      questionToMove = question;
      oldPosition = index;
    }
  });

  if (!questionToMove) {
    return { error: 'The specfied quiz does not contain the question provided' };
  }

  const copy: type.Question = { ...questionToMove };

  if (targetQuiz.info.duration + questionToMove.duration > 180) {
    return { error: 'total duration will exceed 3 mins' };
  }

  const time: number = Math.floor(Date.now() / 1000);
  data.questionLength++;
  copy.questionId = data.questionLength;
  targetQuiz.info.timeLastEdited = time;
  targetQuiz.info.duration += questionToMove.duration;
  targetQuiz.info.questions.splice(oldPosition + 1, 0, copy);
  targetQuiz.info.numQuestions++;
  setDataV2(data);
  return { newQuestionId: data.questionLength };
};

/**
 * Written by Yepeng
 * Update quiz question
 * @param {number} authUserId - ID of a particular user
 * @param {number} quizId - ID of a particular quiz
 * @param {number} questionId - ID of a particular question
 * @param {type.QuestionBody} questionBody - The question body
 * @returns {type.Empty} - A empty object or
 * @returns {type.ErrorMsg} - A new object containing error
*/
export const adminQuizQuestionUpdate = (authUserId: number, quizId: number, questionId: number, questionBody: type.QuestionBody): type.ErrorMsg | type.Empty => {
  const data: type.Data = getDataV2();

  const targetUser: any = hf.findUser(data, authUserId);
  const targetQuiz: any = hf.findQuiz(data, quizId);
  if (targetQuiz === undefined) {
    return { error: 'Invalid quizId' };
  }

  const question: string = questionBody.question;
  const answers: type.AnswerBody[] = questionBody.answers;
  const duration: number = questionBody.duration;
  const points: number = questionBody.points;

  const index: any = targetQuiz.info.questions.findIndex((question: type.Question) => {
    return question.questionId === questionId;
  });

  if (index === -1) {
    return { error: 'question not found' };
  }

  const questionToMove: type.Question = targetQuiz.info.questions[index];

  if (!targetUser.quizzes.find((quiz: type.Quiz) => quiz.info.quizId === quizId)) {
    return { error: 'User does not own quizId' };
  }

  if (question.length < MINIMUM_QUESTION_LENGTH || question.length > MAXIMUM_QUESTION_LENGTH) {
    return { error: 'Question must be between 5-50 characters long' };
  }

  if (answers.length < MINIMUM_QUIZ_ANSWER || answers.length > MAXIMUM_QUIZ_ANSWER) {
    return { error: 'Quizzes must have 2-6 answers' };
  }

  if (duration <= MINIMUM_DURATION) {
    return { error: 'Question duration should be greater than 0' };
  }

  const durations = targetQuiz.info.questions.map((question: type.Question) => question.duration).reduce((acc: any, curVal: any) => acc + curVal, 0) + duration;
  if (durations > MAXIMUM_DURATION) {
    return { error: 'Quiz cannot be longer than 3 minutes in total' };
  }

  if (points < MINIMUM_POINT || points > MAXIMUM_POINT) {
    return { error: 'Questions must be worth 1-10 points' };
  }

  if (answers.some(answer => answer.answer.length < MINIMUM_ANSWER_LENGTH || answer.answer.length > MAXIMUM_ANSWER_LENGTH)) {
    return { error: 'All answers must have a length of 1-30 characters' };
  }

  // Converts an array into a javascript set. Any duplicate values are removed
  // If the size differs between the set and the array, then a duplicate was present
  const answerArr: string[] = answers.map(answer => answer.answer);
  const answerSet = new Set(answerArr);

  if (answerArr.length !== answerSet.size) {
    return { error: 'All answers must be unique' };
  }

  if (!answers.some(answer => answer.correct === true)) {
    return { error: 'Questions must have atleast 1 correct answer' };
  }

  const colours: string[] = ['red', 'green', 'blue', 'yellow', 'orange', 'purple'];

  // Gives each answer a unique id and unique, randomized colour
  const completeAnswers: type.Answer[] = answers.map((answer) => {
    const randColIndex: number = Math.floor(Math.random() * colours.length);

    const completeAnswer : type.Answer = {
      answerId: data.answerLength,
      answer: answer.answer,
      colour: colours[randColIndex],
      correct: answer.correct,
    };

    data.answerLength++;
    colours.splice(randColIndex, 1);
    return completeAnswer;
  });

  // Generates a new question out of provided data
  const newQuestion: type1.Question = {
    questionId: questionToMove.questionId,
    question: question,
    duration: duration,
    points: points,
    answers: completeAnswers,
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
 * @returns {type.Empty} - A empty object or
 * @returns {type.ErrorMsg} - A new object containing error
*/
export const adminQuizQuestionRemove = (authUserId: number, quizId: number, questionId: number): type.ErrorMsg | type.Empty => {
  const data: type.Data = getDataV2();

  const targetUser: any = data.users.find((user: type.User) => {
    return user.info.authUserId === authUserId;
  });

  const targetQuiz: any = targetUser.quizzes.find((quiz: type.Quiz) => {
    return quiz.info.quizId === quizId;
  });
  if (targetQuiz === undefined) {
    return { error: 'quiz does not exist' };
  }
  const targetQuestionIndex = targetQuiz.info.questions.findIndex((question: type.Question) => {
    return question.questionId === questionId;
  });
  if (targetQuestionIndex === -1) {
    return { error: 'question does not exist' };
  }
  targetQuiz.info.numQuestions--;
  targetQuiz.info.duration -= targetQuiz.info.questions[targetQuestionIndex].duration;
  targetQuiz.info.questions.splice(targetQuestionIndex, 1);
  targetQuiz.info.timeLastEdited = Math.floor(Date.now() / 1000);
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
 * @returns {type.Empty} - A empty object or
 * @returns {type.ErrorMsg} - A new object containing error
*/
export const adminQuizQuestionMove = (authUserId : number, quizId : number, questionId : number, newPosition : number): type.Empty | type.ErrorMsg => {
  const data : type.Data = getDataV2();

  const targetUser: any = data.users.find((user: type.User) => {
    return user.info.authUserId === authUserId;
  });

  const targetQuiz: any = targetUser.quizzes.find((quiz: type.Quiz) => {
    return quiz.info.quizId === quizId;
  });

  if (targetQuiz === undefined) {
    return { error: 'user not found' };
  }

  const targetQuestionIndex: any = targetQuiz.info.questions.findIndex((question: type.Question) => {
    return question.questionId === questionId;
  });

  if (targetQuestionIndex === -1) {
    return { error: 'question not found' };
  }

  if (targetQuestionIndex === newPosition) {
    return { error: 'new position must be a different position' };
  }

  if (newPosition < 0 || newPosition >= targetQuiz.info.questions.length) {
    return { error: 'newPosition must be greater than 0, or less than total amount of questions' };
  }

  targetQuiz.info.timeLastEdited = Math.floor(Date.now() / 1000);
  const targetQuestion = { ...targetQuiz.info.questions[targetQuestionIndex] };
  // return {targetQuestionIndex};
  targetQuiz.info.questions.splice(targetQuestionIndex, 1);
  targetQuiz.info.questions.splice(newPosition, 0, targetQuestion);

  setDataV2(data);
  return {};
};
