/**
 * Note: tests below are not written with the best design in mind,
 * and there may be code duplications. You should aim to avoid this!
 *
 * Also, you are expected to either write more tests or modify your
 * implementation to achieve 100% coverage while still adhering to the
 * specification
 */

import request, { HttpVerb } from 'sync-request';
import { port, url } from './config.json';
import { IncomingHttpHeaders } from 'http';
import HTTPError from 'http-errors';

const SERVER_URL = `${url}:${port}`;
const TIMEOUT_MS = 10000;

interface Payload {
  [key: string]: any;
}

const LAB08_QUIZ_SECRET = "bruno's fight club";

// ========================================================================= //

// Helpers
const requestHelper = (
  method: HttpVerb,
  path: string,
  payload: Payload,
  headers: IncomingHttpHeaders = {}
): any => {
  let qs = {};
  let json = {};
  if (['GET', 'DELETE'].includes(method.toUpperCase())) {
    qs = payload;
  } else {
    // PUT/POST
    json = payload;
  }

  const url = SERVER_URL + path;
  const res = request(method, url, { qs, json, headers, timeout: TIMEOUT_MS });

  let responseBody: any;
  try {
    responseBody = JSON.parse(res.body.toString());
  } catch (err: any) {
    if (res.statusCode === 200) {
      throw HTTPError(500,
        `Non-jsonifiable body despite code 200: '${res.body}'.\nCheck that you are not doing res.json(undefined) instead of res.json({}), e.g. in '/clear'`
      );
    }
    responseBody = { error: `Failed to parse JSON: '${err.message}'` };
  }

  const errorMessage = `[${res.statusCode}] ` + responseBody?.error || responseBody || 'No message specified!';

  switch (res.statusCode) {
    case 400: // BAD_REQUEST
    case 401: // UNAUTHORIZED
      throw HTTPError(res.statusCode, errorMessage);
    case 404: // NOT_FOUND
      throw HTTPError(res.statusCode, `Cannot find '${url}' [${method}]\nReason: ${errorMessage}\n\nHint: Check that your server.ts have the correct path AND method`);
    case 500: // INTERNAL_SERVER_ERROR
      throw HTTPError(res.statusCode, errorMessage + '\n\nHint: Your server crashed. Check the server log!\n');
    default:
      if (res.statusCode !== 200) {
        throw HTTPError(res.statusCode, errorMessage + `\n\nSorry, no idea! Look up the status code ${res.statusCode} online!\n`);
      }
  }
  return responseBody;
};

// Function to block execution (i.e. sleep)
// Not ideal (inefficent/poor performance) and should not be used often.
//
// Alternatives include:
// - https://www.npmjs.com/package/atomic-sleep
// - or use async (not covered in this course!)
function sleepSync(ms: number) {
  const startTime = new Date().getTime();
  while (new Date().getTime() - startTime < ms) { /* empty */ }
}

// ========================================================================= //

interface Answer {
  isCorrect: boolean;
  answerString: string;
}

// Wrapper functions

function clear() {
  return requestHelper('DELETE', '/clear', {});
}

function root() {
  return requestHelper('GET', '/', {});
}

function echo(message: string) {
  return requestHelper('GET', '/echo/echo', { message });
}

// PROTECTED ROUTES

function quizCreate(quizTitle: string, quizSynopsis: string, lab08quizsecret = LAB08_QUIZ_SECRET) {
  return requestHelper('POST', '/quiz/create', { quizTitle, quizSynopsis }, { lab08quizsecret });
}

function quizDetails(quizId: number, lab08quizsecret = LAB08_QUIZ_SECRET) {
  return requestHelper('GET', `/quiz/${quizId}`, {}, { lab08quizsecret });
}

function quizEdit(quizId: number, quizTitle: string, quizSynopsis: string, lab08quizsecret = LAB08_QUIZ_SECRET) {
  return requestHelper('PUT', `/quiz/${quizId}`, { quizTitle, quizSynopsis }, { lab08quizsecret });
}

function quizRemove(quizId: number, lab08quizsecret = LAB08_QUIZ_SECRET) {
  return requestHelper('DELETE', `/quiz/${quizId}`, {}, { lab08quizsecret });
}

function quizzesList(lab08quizsecret = LAB08_QUIZ_SECRET) {
  return requestHelper('GET', '/quizzes/list', {}, { lab08quizsecret });
}

function questionAdd(quizId: number, questionString: string, questionType: string, answers: Answer[], lab08quizsecret = LAB08_QUIZ_SECRET) {
  return requestHelper('POST', `/quiz/${quizId}/question`, { questionString, questionType, answers }, { lab08quizsecret });
}

function questionEdit(questionId: number, questionString: string, questionType: string, answers: Answer[], lab08quizsecret = LAB08_QUIZ_SECRET) {
  return requestHelper('PUT', `/question/${questionId}`, { questionString, questionType, answers }, { lab08quizsecret });
}

function questionRemove(questionId: number, lab08quizsecret = LAB08_QUIZ_SECRET) {
  return requestHelper('DELETE', `/question/${questionId}`, {}, { lab08quizsecret });
}

function quizScheduleRemove(quizId: number, secondsFromNow: number, lab08quizsecret = LAB08_QUIZ_SECRET) {
  return requestHelper('DELETE', `/quiz/${quizId}/schedule/remove`, { secondsFromNow }, { lab08quizsecret });
}

function quizScheduleRemoveAbort(quizId: number, lab08quizsecret = LAB08_QUIZ_SECRET) {
  return requestHelper('POST', `/quiz/${quizId}/schedule/remove/abort`, {}, { lab08quizsecret });
}

// ========================================================================= //

beforeEach(clear);
afterAll(clear);

describe('/', () => {
  test('success', () => {
    expect(root()).toStrictEqual({ message: expect.any(String) });
  });
});

describe('/echo', () => {
  test('success', () => {
    expect(echo('helloworld')).toStrictEqual({ message: 'helloworld' });
  });

  test('failure', () => {
    expect(() => echo('echo')).toThrow(HTTPError[400]);
  });
});

describe('/quiz/create', () => {
  describe('failure', () => {
    test('invalid lab08quizsecret', () => {
      expect(() => quizCreate('valid title', 'valid sypnosis', 'invalid lab08quizsecret')).toThrow(HTTPError[401]);
    });

    test.each([
      { quizTitle: '', quizSynopsis: 'valid' },
      { quizTitle: 'valid', quizSynopsis: '' },
      { quizTitle: '', quizSynopsis: '' },
    ])("quizTitle='$quizTitle', quizSynopsis='$quizSynopsis'", ({ quizTitle, quizSynopsis }) => {
      expect(() => quizCreate(quizTitle, quizSynopsis)).toThrow(HTTPError[400]);
    });
  });

  describe('success', () => {
    test('valid inputs', () => {
      expect(quizCreate('validTitle', 'validSynopsis')).toStrictEqual({ quizId: expect.any(Number) });
    });

    test('unique ids', () => {
      const quiz1 = quizCreate('validTitle', 'validSynopsis');
      const quiz2 = quizCreate('validTitle', 'validSynopsis');
      const quiz3 = quizCreate('validTitle', 'validSynopsis');
      const uniqueIds = Array.from(new Set([quiz1.quizId, quiz2.quizId, quiz3.quizId]));
      expect(uniqueIds).toHaveLength(3);
    });
  });
});

describe('GET /quiz/:quizid', () => {
  describe('error', () => {
    test('empty state', () => {
      expect(() => quizDetails(999)).toThrow(HTTPError[400]);
    });

    test('invalid lab08quizsecret', () => {
      const quiz = quizCreate('valid', 'valid');
      expect(() => quizDetails(quiz.quizId, 'invalid lab08quizsecret')).toThrow(HTTPError[401]);
    });

    test('wrong id', () => {
      const quiz = quizCreate('valid', 'valid');
      expect(() => quizDetails(quiz.quizId + 1)).toThrow(HTTPError[400]);
    });
  });

  describe('success', () => {
    test('correct details single quiz', () => {
      const quiz = quizCreate('valid title', 'valid sypnosis');
      expect(quizDetails(quiz.quizId)).toStrictEqual({
        quiz: {
          quizId: quiz.quizId,
          quizTitle: 'valid title',
          quizSynopsis: 'valid sypnosis',
          questions: [],
        }
      });
    });

    test('correct details multiple', () => {
      const quiz1 = quizCreate('t1', 's1');
      const quiz2 = quizCreate('t2', 's2');
      const quiz3 = quizCreate('t3', 's3');
      const expected = [
        {
          quizId: quiz1.quizId,
          quizTitle: 't1',
          quizSynopsis: 's1',
          questions: [],
        },
        {
          quizId: quiz2.quizId,
          quizTitle: 't2',
          quizSynopsis: 's2',
          questions: [],
        },
        {
          quizId: quiz3.quizId,
          quizTitle: 't3',
          quizSynopsis: 's3',
          questions: [],
        },
      ];
      const received = [
        quizDetails(quiz1.quizId).quiz,
        quizDetails(quiz2.quizId).quiz,
        quizDetails(quiz3.quizId).quiz,
      ];
      expect(received).toEqual(expected);
    });
  });
});

describe('PUT /quiz/:quizid', () => {
  describe('error', () => {
    test('empty state', () => {
      expect(() => quizEdit(999, 'valid', 'valid')).toThrow(HTTPError[400]);
    });

    test('invalid lab08quizsecret', () => {
      const quiz = quizCreate('valid', 'valid');
      expect(() => quizEdit(quiz.quizId, 'new', 'new', 'invalid lab08quizsecret')).toThrow(HTTPError[401]);
    });

    test('wrong id', () => {
      const quiz = quizCreate('valid', 'valid');
      expect(() => quizEdit(quiz.quizId + 1, 'new', 'new')).toThrow(HTTPError[400]);
    });

    test.each([
      { quizTitle: '', quizSynopsis: 'valid' },
      { quizTitle: 'valid', quizSynopsis: '' },
      { quizTitle: '', quizSynopsis: '' },
    ])("quizTitle='$quizTitle', quizSynopsis='$quizSynopsis", ({ quizTitle, quizSynopsis }) => {
      const quiz = quizCreate('valid', 'valid');
      expect(() => quizEdit(quiz.quizId, quizTitle, quizSynopsis)).toThrow(HTTPError[400]);
    });
  });

  describe('success', () => {
    test('single quiz successful edit', () => {
      const quiz = quizCreate('valid', 'valid');
      expect(quizEdit(quiz.quizId, 'new title', 'new sypnosis')).toStrictEqual({});
      expect(quizDetails(quiz.quizId)).toStrictEqual({
        quiz: {
          quizId: quiz.quizId,
          quizTitle: 'new title',
          quizSynopsis: 'new sypnosis',
          questions: [],
        }
      });
    });

    test('multiple quiz successful edit', () => {
      const quiz1 = quizCreate('t1', 's1');
      const quiz2 = quizCreate('t2', 's2');
      const quiz3 = quizCreate('t3', 's3');
      quizEdit(quiz1.quizId, 't1 new', 's1 new');
      quizEdit(quiz2.quizId, 't2 new', 's2 new');
      quizEdit(quiz3.quizId, 't3 new', 's3 new');
      const expected = [
        {
          quizId: quiz1.quizId,
          quizTitle: 't1 new',
          quizSynopsis: 's1 new',
          questions: [],
        },
        {
          quizId: quiz2.quizId,
          quizTitle: 't2 new',
          quizSynopsis: 's2 new',
          questions: [],
        },
        {
          quizId: quiz3.quizId,
          quizTitle: 't3 new',
          quizSynopsis: 's3 new',
          questions: [],
        },
      ];
      const received = [
        quizDetails(quiz1.quizId).quiz,
        quizDetails(quiz2.quizId).quiz,
        quizDetails(quiz3.quizId).quiz,
      ];
      expect(received).toEqual(expected);
    });
  });
});

describe('DELETE /quiz/remove', () => {
  describe('error', () => {
    test('empty state', () => {
      expect(() => quizRemove(999)).toThrow(HTTPError[400]);
    });

    test('wrong id', () => {
      const quiz = quizCreate('valid', 'valid');
      expect(() => quizRemove(quiz.quizId + 1)).toThrow(HTTPError[400]);
    });

    test('invalid lab08quizsecret', () => {
      const quiz = quizCreate('valid', 'valid');
      expect(() => quizRemove(quiz.quizId, 'invalid lab08quizsecret')).toThrow(HTTPError[401]);
    });

    test('double remove', () => {
      const quiz = quizCreate('valid', 'valid');
      expect(quizRemove(quiz.quizId)).toEqual({});
      expect(() => quizRemove(quiz.quizId)).toThrow(HTTPError[400]);
    });
  });

  describe('success', () => {
    test('single removal', () => {
      const quiz = quizCreate('valid', 'valid');
      expect(quizRemove(quiz.quizId)).toStrictEqual({});
      expect(() => quizDetails(quiz.quizId)).toThrow(HTTPError[400]);
    });

    test('remove correct entry', () => {
      const quiz1 = quizCreate('1', '1');
      const quiz2 = quizCreate('2', '2');
      const quiz3 = quizCreate('3', '3');
      expect(quizRemove(quiz1.quizId)).toStrictEqual({});
      expect(quizRemove(quiz3.quizId)).toStrictEqual({});
      expect(quizzesList().quizzes).toStrictEqual([{ quizId: quiz2.quizId, quizTitle: '2' }]);
    });

    test('no re-using id after removal', () => {
      const quiz1 = quizCreate('1', '1');
      expect(quizRemove(quiz1.quizId)).toStrictEqual({});
      const quiz2 = quizCreate('2', '2');
      expect(quiz1.quizId).not.toEqual(quiz2.quizId);
    });
  });
});

describe('/quizzes/list', () => {
  test('invalid lab08quizsecret', () => {
    expect(() => quizzesList('invalid lab08quizsecret')).toThrow(HTTPError[401]);
  });

  test('list empty', () => {
    expect(quizzesList()).toStrictEqual({ quizzes: [] });
  });

  test('list single quiz', () => {
    const quiz = quizCreate('title', 'sypnosis');
    expect(quizzesList()).toStrictEqual({ quizzes: [{ quizId: quiz.quizId, quizTitle: 'title' }] });
  });

  test('list multiple quizzes', () => {
    const quiz1 = quizCreate('1', 'sypnosis');
    const quiz2 = quizCreate('2', 'sypnosis');
    const quiz3 = quizCreate('3', 'sypnosis');
    expect(quizzesList()).toStrictEqual({
      quizzes: [
        { quizId: quiz1.quizId, quizTitle: '1' },
        { quizId: quiz2.quizId, quizTitle: '2' },
        { quizId: quiz3.quizId, quizTitle: '3' },
      ],
    });
  });
});

const validTrueAnswer = { isCorrect: true, answerString: 'a' };
const commonAnswerErrors = [
  { testName: 'empty', answers: [] },
  { testName: 'one answer, empty answerString', answers: [{ isCorrect: true, answerString: '' }] },
  { testName: 'one answer, no correct', answers: [{ isCorrect: false, answerString: 'a' }] },
  { testName: 'two answers, one empty answerString', answers: [validTrueAnswer, { isCorrect: false, answerString: '' }] },
  { testName: 'two answers, no correct', answers: [{ isCorrect: false, answerString: 'a' }, { isCorrect: false, answerString: 'a' }] },
];

describe('/quiz/:quizid/question', () => {
  describe('error', () => {
    test('empty state', () => {
      expect(() => questionAdd(999, 'valid', 'single', [validTrueAnswer])).toThrow(HTTPError[400]);
    });

    test('invalid lab08quizsecret', () => {
      const quiz = quizCreate('q', 'q');
      expect(() => questionAdd(quiz.quizId, '?', 'single', [validTrueAnswer], 'invalid lab08quizsecret')).toThrow(HTTPError[401]);
    });

    test('wrong id', () => {
      const quiz = quizCreate('q', 'q');
      expect(() => questionAdd(quiz.quizId + 1, '?', 'single', [validTrueAnswer])).toThrow(HTTPError[400]);
    });

    test('empty question string', () => {
      const quiz = quizCreate('q', 'q');
      expect(() => questionAdd(quiz.quizId, '', 'single', [validTrueAnswer])).toThrow(HTTPError[400]);
    });

    test('invalid question type', () => {
      const quiz = quizCreate('q', 'q');
      expect(() => questionAdd(quiz.quizId, '?', 'sing', [validTrueAnswer])).toThrow(HTTPError[400]);
    });

    describe.each([
      'single', 'multiple'
    ])('Common answers error, type %s', (questionType) => {
      test.each(commonAnswerErrors)('invalid answers: $testName', ({ answers }) => {
        const quiz = quizCreate('q', 'q');
        expect(() => questionAdd(quiz.quizId, '?', questionType, answers)).toThrow(HTTPError[400]);
      });
    });

    test('type single, more than one correct answer', () => {
      const quiz = quizCreate('q', 'q');
      expect(() => questionAdd(quiz.quizId, '?', 'single', [validTrueAnswer, validTrueAnswer])).toThrow(HTTPError[400]);
    });
  });

  describe('success', () => {
    test('add single', () => {
      const quiz = quizCreate('q', 'q');
      const question = questionAdd(quiz.quizId, '?', 'single', [validTrueAnswer]);
      expect(quizDetails(quiz.quizId)).toStrictEqual({
        quiz: {
          quizId: quiz.quizId,
          quizTitle: 'q',
          quizSynopsis: 'q',
          questions: [
            {
              questionId: question.questionId,
              questionString: '?',
              questionType: 'single',
              answers: [validTrueAnswer],
            }
          ],
        }
      });
    });

    test('add multiple', () => {
      const quiz = quizCreate('q', 'q');
      const q1 = questionAdd(quiz.quizId, '1?', 'single', [validTrueAnswer]);
      const q2 = questionAdd(quiz.quizId, '2?', 'multiple', [validTrueAnswer, validTrueAnswer]);
      const q3 = questionAdd(quiz.quizId, '3?', 'single', [validTrueAnswer]);
      expect(quizDetails(quiz.quizId)).toStrictEqual({
        quiz: {
          quizId: quiz.quizId,
          quizTitle: 'q',
          quizSynopsis: 'q',
          questions: [
            {
              questionId: q1.questionId,
              questionString: '1?',
              questionType: 'single',
              answers: [validTrueAnswer],
            },
            {
              questionId: q2.questionId,
              questionString: '2?',
              questionType: 'multiple',
              answers: [validTrueAnswer, validTrueAnswer],
            },
            {
              questionId: q3.questionId,
              questionString: '3?',
              questionType: 'single',
              answers: [validTrueAnswer],
            },
          ],
        }
      });
    });
  });
});

describe('PUT /question/:questionid', () => {
  describe('error', () => {
    test('empty state', () => {
      expect(() => questionEdit(999, 'valid', 'single', [validTrueAnswer])).toThrow(HTTPError[400]);
    });

    test('invalid lab08quizsecret', () => {
      const quiz = quizCreate('q', 'q');
      const question = questionAdd(quiz.quizId, 'valid', 'single', [validTrueAnswer]);
      expect(() => questionEdit(question.questionId, '?', 'single', [validTrueAnswer], 'invalid lab08quizsecret')).toThrow(HTTPError[401]);
    });

    test('wrong id', () => {
      const quiz = quizCreate('q', 'q');
      const question = questionAdd(quiz.quizId, 'valid', 'single', [validTrueAnswer]);
      expect(() => questionEdit(question.questionId + 1, '?', 'single', [validTrueAnswer])).toThrow(HTTPError[400]);
    });

    test('empty question string', () => {
      const quiz = quizCreate('q', 'q');
      const question = questionAdd(quiz.quizId, 'valid', 'single', [validTrueAnswer]);
      expect(() => questionEdit(question.questionId, '', 'single', [validTrueAnswer])).toThrow(HTTPError[400]);
    });

    test('invalid question type', () => {
      const quiz = quizCreate('q', 'q');
      const question = questionAdd(quiz.quizId, 'valid', 'single', [validTrueAnswer]);
      expect(() => questionEdit(question.questionId, '?', 'sing', [validTrueAnswer])).toThrow(HTTPError[400]);
    });

    describe.each(['single', 'multiple'])('Common answers error, type %s', (questionType) => {
      test.each(commonAnswerErrors)('invalid answers: $testName', ({ answers }) => {
        const quiz = quizCreate('q', 'q');
        const question = questionAdd(quiz.quizId, 'valid', 'single', [validTrueAnswer]);
        expect(() => questionEdit(question.questionId, '?', questionType, answers)).toThrow(HTTPError[400]);
      });
    });

    test('type single, more than one correct answer', () => {
      const quiz = quizCreate('q', 'q');
      const question = questionAdd(quiz.quizId, 'valid', 'single', [validTrueAnswer]);
      expect(() => questionEdit(question.questionId, '?', 'single', [validTrueAnswer, validTrueAnswer])).toThrow(HTTPError[400]);
    });
  });

  describe('success', () => {
    test('edit single', () => {
      const quiz = quizCreate('q', 'q');
      const question = questionAdd(quiz.quizId, 'old?', 'single', [validTrueAnswer]);
      questionEdit(question.questionId, 'new?', 'multiple', [validTrueAnswer, validTrueAnswer]);
      expect(quizDetails(quiz.quizId)).toStrictEqual({
        quiz: {
          quizId: quiz.quizId,
          quizTitle: 'q',
          quizSynopsis: 'q',
          questions: [
            {
              questionId: question.questionId,
              questionString: 'new?',
              questionType: 'multiple',
              answers: [validTrueAnswer, validTrueAnswer],
            }
          ],
        },
      });
    });

    test('edit multiple', () => {
      const quiz = quizCreate('q', 'q');
      const q1 = questionAdd(quiz.quizId, 'old?', 'single', [validTrueAnswer]);
      const q2 = questionAdd(quiz.quizId, 'old?', 'single', [validTrueAnswer]);
      const q3 = questionAdd(quiz.quizId, 'old?', 'single', [validTrueAnswer]);
      questionEdit(q1.questionId, '1?', 'single', [validTrueAnswer]);
      questionEdit(q2.questionId, '2?', 'multiple', [validTrueAnswer, validTrueAnswer]);
      questionEdit(q3.questionId, '3?', 'single', [validTrueAnswer]);
      expect(quizDetails(quiz.quizId)).toStrictEqual({
        quiz: {
          quizId: quiz.quizId,
          quizTitle: 'q',
          quizSynopsis: 'q',
          questions: [
            {
              questionId: q1.questionId,
              questionString: '1?',
              questionType: 'single',
              answers: [validTrueAnswer],
            },
            {
              questionId: q2.questionId,
              questionString: '2?',
              questionType: 'multiple',
              answers: [validTrueAnswer, validTrueAnswer],
            },
            {
              questionId: q3.questionId,
              questionString: '3?',
              questionType: 'single',
              answers: [validTrueAnswer],
            },
          ],
        },
      });
    });
  });
});

describe('DELETE /question/:questionid', () => {
  describe('error', () => {
    test('empty state', () => {
      expect(() => questionRemove(999)).toThrow(HTTPError[400]);
    });

    test('invalid lab08quizsecret', () => {
      const quiz = quizCreate('q', 'q');
      const question = questionAdd(quiz.quizId, 'valid', 'single', [validTrueAnswer]);
      expect(() => questionRemove(question.questionId, 'invalid lab08quizsecret')).toThrow(HTTPError[401]);
    });

    test('wrong id remove', () => {
      const quiz = quizCreate('q', 'q');
      const question = questionAdd(quiz.quizId, 'valid', 'single', [validTrueAnswer]);
      expect(() => questionRemove(question.questionId + 1)).toThrow(HTTPError[400]);
    });
  });

  describe('success', () => {
    test('single remove', () => {
      const quiz = quizCreate('q', 'q');
      const question = questionAdd(quiz.quizId, 'valid', 'single', [validTrueAnswer]);
      expect(questionRemove(question.questionId)).toStrictEqual({});
      expect(() => questionEdit(question.questionId, 'fail', 'single', [validTrueAnswer])).toThrow(HTTPError[400]);
      expect(quizDetails(quiz.quizId)).toStrictEqual({
        quiz: {
          quizId: quiz.quizId,
          quizTitle: 'q',
          quizSynopsis: 'q',
          questions: [],
        },
      });
    });
    test('multiple items remove', () => {
      const quiz = quizCreate('q', 'q');
      const q1 = questionAdd(quiz.quizId, '1?', 'single', [validTrueAnswer]);
      const q2 = questionAdd(quiz.quizId, '2?', 'multiple', [validTrueAnswer, validTrueAnswer]);
      const q3 = questionAdd(quiz.quizId, '3?', 'single', [validTrueAnswer]);
      const q4 = questionAdd(quiz.quizId, '4?', 'single', [validTrueAnswer]);
      const expectQ1 = {
        questionId: q1.questionId,
        questionString: '1?',
        questionType: 'single',
        answers: [validTrueAnswer],
      };
      const expectQ2 = {
        questionId: q2.questionId,
        questionString: '2?',
        questionType: 'multiple',
        answers: [validTrueAnswer, validTrueAnswer],
      };
      const expectQ3 = {
        questionId: q3.questionId,
        questionString: '3?',
        questionType: 'single',
        answers: [validTrueAnswer],
      };
      const expectQ4 = {
        questionId: q4.questionId,
        questionString: '4?',
        questionType: 'single',
        answers: [validTrueAnswer],
      };
      expect(quizDetails(quiz.quizId)).toStrictEqual({
        quiz: {
          quizId: quiz.quizId,
          quizTitle: 'q',
          quizSynopsis: 'q',
          questions: [expectQ1, expectQ2, expectQ3, expectQ4],
        }
      });
      questionRemove(q1.questionId);
      expect(quizDetails(quiz.quizId)).toStrictEqual({
        quiz: {
          quizId: quiz.quizId,
          quizTitle: 'q',
          quizSynopsis: 'q',
          questions: [expectQ2, expectQ3, expectQ4],
        }
      });
      questionRemove(q3.questionId);
      expect(quizDetails(quiz.quizId)).toStrictEqual({
        quiz: {
          quizId: quiz.quizId,
          quizTitle: 'q',
          quizSynopsis: 'q',
          questions: [expectQ2, expectQ4],
        }
      });
      questionRemove(q4.questionId);
      expect(quizDetails(quiz.quizId)).toStrictEqual({
        quiz: {
          quizId: quiz.quizId,
          quizTitle: 'q',
          quizSynopsis: 'q',
          questions: [expectQ2],
        }
      });
      questionRemove(q2.questionId);
      expect(quizDetails(quiz.quizId)).toStrictEqual({
        quiz: {
          quizId: quiz.quizId,
          quizTitle: 'q',
          quizSynopsis: 'q',
          questions: [],
        }
      });
    });
  });
});

describe('/quiz/:quizid/schedule/remove', () => {
  describe('error', () => {
    test('empty state', () => {
      expect(() => quizScheduleRemove(999, 2)).toThrow(HTTPError[400]);
    });

    test('invalid lab08quizsecret', () => {
      const quiz = quizCreate('valid', 'valid');
      expect(() => quizScheduleRemove(quiz.quizId, 2, 'invalid lab08quizsecret')).toThrow(HTTPError[401]);
    });

    test('wrong id', () => {
      const quiz = quizCreate('valid', 'valid');
      expect(() => quizScheduleRemove(quiz.quizId + 1, 2)).toThrow(HTTPError[400]);
    });

    test('seconds not strictly positive', () => {
      const quiz = quizCreate('valid', 'valid');
      expect(() => quizScheduleRemove(quiz.quizId, -1)).toThrow(HTTPError[400]);
      expect(() => quizScheduleRemove(quiz.quizId, 0)).toThrow(HTTPError[400]);
    });

    test('trying to schedule removal twice with one still active', () => {
      const quiz = quizCreate('valid', 'valid');
      expect(quizScheduleRemove(quiz.quizId, 2)).toStrictEqual({});
      expect(() => quizScheduleRemove(quiz.quizId, 2)).toThrow(HTTPError[400]);
    });
  });

  describe('success', () => {
    test('single quiz successfully scheduled for removal', () => {
      const quiz = quizCreate('valid', 'valid');
      expect(quizScheduleRemove(quiz.quizId, 2)).toStrictEqual({});
      expect(quizzesList()).toStrictEqual({ quizzes: [{ quizId: quiz.quizId, quizTitle: 'valid' }] });
      sleepSync(2 * 1000);
      expect(quizzesList()).toStrictEqual({ quizzes: [] });
    });
  });
});

// NOTE: For these tests, it is very important that your clear function actually clears any active timers
// with clearTimeout, otherwise they may interfere with one another.
describe('/quiz/:quizid/schedule/remove/abort', () => {
  test('empty state', () => {
    expect(() => quizScheduleRemoveAbort(999)).toThrow(HTTPError[400]);
  });

  test('quiz exists but not scheduled for removal', () => {
    const quiz = quizCreate('valid', 'valid');
    expect(() => quizScheduleRemoveAbort(quiz.quizId)).toThrow(HTTPError[400]);
  });

  describe('one quiz created and scheduled for removal', () => {
    let quiz: { quizId: number };
    beforeEach(() => {
      quiz = quizCreate('valid', 'valid');
      expect(quizScheduleRemove(quiz.quizId, 2)).toStrictEqual({});
    });

    describe('error', () => {
      test('invalid lab08quizsecret', () => {
        expect(() => quizScheduleRemoveAbort(quiz.quizId, 'invalid lab08quizsecret')).toThrow(HTTPError[401]);
      });

      test('wrong id', () => {
        expect(() => quizScheduleRemoveAbort(quiz.quizId + 1)).toThrow(HTTPError[400]);
      });

      test('trying to abort removal twice', () => {
        expect(quizScheduleRemoveAbort(quiz.quizId)).toStrictEqual({});
        expect(() => quizScheduleRemoveAbort(quiz.quizId)).toThrow(HTTPError[400]);
      });
    });

    describe('success', () => {
      test('single quiz successfully scheduled for removal, then aborted', () => {
        expect(quizScheduleRemoveAbort(quiz.quizId)).toStrictEqual({});
        expect(quizzesList()).toStrictEqual({ quizzes: [{ quizId: quiz.quizId, quizTitle: 'valid' }] });
        sleepSync(2 * 1000);
        expect(quizzesList()).toStrictEqual({ quizzes: [{ quizId: quiz.quizId, quizTitle: 'valid' }] });
      });
    });
  });
});
