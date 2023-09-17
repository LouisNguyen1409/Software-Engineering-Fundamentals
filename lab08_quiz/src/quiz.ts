/**
 * Placeholder file for defining your feature functions
 * Feel free to add, edit, ignore or remove this file and create your own files if you wish.
 */
import { getData, setData, Answer } from './dataStore';
import HTTPError from 'http-errors';

const LAB08_QUIZ_SECRET = "bruno's fight club";
let quizId = -1;
let questionId = -1;
let timerId: any = -1;

export const clear = () => {
  const data = getData();
  data.quizzes = [];
  setData(data);
  if (timerId !== -1) {
    clearTimeout(timerId);
    timerId = -1;
  }
  return {};
};

export function createQuiz(quizTitle: string, quizSynopsis: string, lab08quizsecret: any) {
  if (lab08quizsecret !== LAB08_QUIZ_SECRET) {
    throw HTTPError(401, 'lab08quizsecret is not exactly the string');
  }
  if (quizTitle === '') {
    throw HTTPError(400, 'quizTitle is empty');
  }
  if (quizSynopsis === '') {
    throw HTTPError(400, 'quizSynopsis is empty');
  }
  const data = getData();
  quizId = quizId + 1;
  data.quizzes.push({
    quizId: quizId,
    quizTitle: quizTitle,
    quizSynopsis: quizSynopsis,
    questions: []
  });
  setData(data);
  return { quizId };
}

export function quizDetails(quizId: number, lab08quizsecret: any) {
  if (lab08quizsecret !== LAB08_QUIZ_SECRET) {
    throw HTTPError(401, 'lab08quizsecret is not exactly the string');
  }
  const data = getData();
  const quiz = data.quizzes.find((quiz) => quiz.quizId === quizId);
  if (quiz === undefined) {
    throw HTTPError(400, 'quizid does not refer to an existing quiz');
  }
  return { quiz };
}

export function editQuiz(quizId: number, quizTitle: string, quizSynopsis: string, lab08quizsecret: any) {
  if (lab08quizsecret !== LAB08_QUIZ_SECRET) {
    throw HTTPError(401, 'lab08quizsecret is not exactly the string');
  }
  if (quizTitle === '') {
    throw HTTPError(400, 'quizTitle is empty');
  }
  if (quizSynopsis === '') {
    throw HTTPError(400, 'quizSynopsis is empty');
  }
  const data = getData();
  const quiz = data.quizzes.find((quiz) => quiz.quizId === quizId);
  if (quiz === undefined) {
    throw HTTPError(400, 'quizid does not refer to an existing quiz');
  }
  quiz.quizTitle = quizTitle;
  quiz.quizSynopsis = quizSynopsis;
  setData(data);
  return {};
}

export function deleteQuiz(quizId: number, lab08quizsecret: any) {
  if (lab08quizsecret !== LAB08_QUIZ_SECRET) {
    throw HTTPError(401, 'lab08quizsecret is not exactly the string');
  }
  const data = getData();
  const quiz = data.quizzes.find((quiz) => quiz.quizId === quizId);
  if (quiz === undefined) {
    throw HTTPError(400, 'quizid does not refer to an existing quiz');
  }
  data.quizzes = data.quizzes.filter((quiz) => quiz.quizId !== quizId);
  setData(data);
  return {};
}

export function quizList(lab08quizsecret: any) {
  if (lab08quizsecret !== LAB08_QUIZ_SECRET) {
    throw HTTPError(401, 'lab08quizsecret is not exactly the string');
  }
  const data = getData();
  const quizzes = [];
  for (const quiz of data.quizzes) {
    quizzes.push({
      quizId: quiz.quizId,
      quizTitle: quiz.quizTitle
    });
  }
  return { quizzes };
}

export function questionCreate(quizid: number, questionString: string, questionType: 'single' | 'multiple', answers: Answer[], lab08quizsecret: any) {
  if (lab08quizsecret !== LAB08_QUIZ_SECRET) {
    throw HTTPError(401, 'lab08quizsecret is not exactly the string');
  }
  const data = getData();
  const quiz = data.quizzes.find((quiz) => quiz.quizId === quizid);
  if (quiz === undefined) {
    throw HTTPError(400, 'quizid does not refer to an existing quiz');
  }
  if (questionString === '') {
    throw HTTPError(400, 'questionString is empty');
  }
  if (questionType !== 'single' && questionType !== 'multiple') {
    throw HTTPError(400, 'questionType is not single or multiple');
  }
  const correctAnswers = answers.filter((answer) => answer.isCorrect === true);
  if (correctAnswers.length === 0) {
    throw HTTPError(400, 'there are no correct answers');
  }
  if (questionType === 'single' && correctAnswers.length !== 1) {
    throw HTTPError(400, 'questionType is single but answers is not length 1');
  }
  for (const answer of answers) {
    if (answer.answerString === '') {
      throw HTTPError(400, 'answerString is empty');
    }
  }
  questionId = questionId + 1;
  quiz.questions.push({
    questionId: questionId,
    questionString: questionString,
    questionType: questionType,
    answers: answers
  });
  setData(data);
  return { questionId };
}

export function questionEdit(questionId: number, questionString: string, questionType: 'single' | 'multiple', answers: Answer[], lab08quizsecret: any) {
  if (lab08quizsecret !== LAB08_QUIZ_SECRET) {
    throw HTTPError(401, 'lab08quizsecret is not exactly the string');
  }
  const data = getData();
  let question;
  for (const quiz of data.quizzes) {
    question = quiz.questions.find((question) => question.questionId === questionId);
    if (question !== undefined) {
      break;
    }
  }
  if (question === undefined) {
    throw HTTPError(400, 'questionid does not refer to an existing question');
  }
  if (questionString === '') {
    throw HTTPError(400, 'questionString is empty');
  }
  if (questionType !== 'single' && questionType !== 'multiple') {
    throw HTTPError(400, 'questionType is not single or multiple');
  }
  const correctAnswers = answers.filter((answer) => answer.isCorrect === true);
  if (correctAnswers.length === 0) {
    throw HTTPError(400, 'there are no correct answers');
  }
  if (questionType === 'single' && correctAnswers.length !== 1) {
    throw HTTPError(400, 'questionType is single but answers is not length 1');
  }
  for (const answer of answers) {
    if (answer.answerString === '') {
      throw HTTPError(400, 'answerString is empty');
    }
  }
  question.questionString = questionString;
  question.questionType = questionType;
  question.answers = answers;
  setData(data);
  return {};
}

export function questionDelete(questionId: number, lab08quizsecret: any) {
  if (lab08quizsecret !== LAB08_QUIZ_SECRET) {
    throw HTTPError(401, 'lab08quizsecret is not exactly the string');
  }
  const data = getData();
  let question;
  for (const quiz of data.quizzes) {
    question = quiz.questions.find((question) => question.questionId === questionId);
    if (question !== undefined) {
      break;
    }
  }
  if (question === undefined) {
    throw HTTPError(400, 'questionid does not refer to an existing question');
  }
  for (const quiz of data.quizzes) {
    quiz.questions = quiz.questions.filter((question) => question.questionId !== questionId);
  }
  setData(data);
  return {};
}

export function quizRemoveSchedule(quizId: number, secondsFromNow: number, lab08quizsecret: any) {
  if (lab08quizsecret !== LAB08_QUIZ_SECRET) {
    throw HTTPError(401, 'lab08quizsecret is not exactly the string');
  }
  if (secondsFromNow <= 0) {
    throw HTTPError(400, 'secondsFromNow is not strictly positive');
  }
  const data = getData();
  const quiz = data.quizzes.find((quiz) => quiz.quizId === quizId);
  if (quiz === undefined) {
    throw HTTPError(400, 'quizid does not refer to an existing quiz');
  }
  if (timerId !== -1) {
    throw HTTPError(400, 'there is already a scheduled quiz removal');
  }
  timerId = setTimeout(() => {
    data.quizzes = data.quizzes.filter((quiz) => quiz.quizId !== quizId);
    setData(data);
    timerId = -1;
  }, secondsFromNow * 1000);
  return {};
}

export function quizScheduleRemoveAbort(quizId: number, lab08quizsecret: any) {
  if (lab08quizsecret !== LAB08_QUIZ_SECRET) {
    throw HTTPError(401, 'lab08quizsecret is not exactly the string');
  }
  const data = getData();
  const quiz = data.quizzes.find((quiz) => quiz.quizId === quizId);
  if (quiz === undefined) {
    throw HTTPError(400, 'quizid does not refer to an existing quiz');
  }
  if (timerId === -1) {
    throw HTTPError(400, 'there is no scheduled quiz removal');
  }
  timerId = clearTimeout(timerId);
  timerId = -1;
  return {};
}
