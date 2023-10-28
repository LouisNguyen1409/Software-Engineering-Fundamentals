const SECONDS = 1000;
jest.setTimeout(100 * SECONDS);

// import * as hf from '../server/helperfunction';
import * as hf from '../server/route';
import * as typeV2 from '../interfaceV2';
import HTTPError from 'http-errors';
const sleep = require('atomic-sleep');

beforeEach(() => {
  hf.clear();
});

afterEach(() => {
  hf.clear();
});

describe('GET, /v1/admin/quiz/{quizid}/sessions', () => {
  let user1 : string;
  let quiz1 : number;
  beforeEach(() => {
    user1 = hf.adminAuthRegister('Yepeng@gmail.com', 'Yepeng12321', 'Yepeng', 'Lin').body.token;
    quiz1 = hf.adminQuizCreateV2(user1, 'GeographyGame', '').quizId;
  });

  describe('error cases:', () => {
    test.each([
      '',
      null
    ])('Token is not a valid structure', (invalidToken) => {
      expect(() => hf.adminQuizViewSessions(invalidToken, quiz1)).toThrow(HTTPError[401]);
    });

    test('Provided token is valid structure, but is not for a currently logged in session', () => {
      hf.adminAuthLogoutV2(user1);
      expect(() => hf.adminQuizViewSessions(user1, quiz1)).toThrow(HTTPError[403]);
    });

    test('Quiz ID does not refer to a valid quiz', () => {
      expect(() => hf.adminQuizViewSessions(user1, quiz1 + 1)).toThrow(HTTPError[400]);
    });

    test('Quiz ID does not refer to a quiz that this user owns', () => {
      const user2 = hf.adminAuthRegister('Hayden@gmail.com', 'Hayden12321', 'Hayden', 'Smith').body.token;
      const quiz2 = hf.adminQuizCreateV2(user2, 'LiteratureTest', '').quizId;
      expect(() => hf.adminQuizViewSessions(user1, quiz2)).toThrow(HTTPError[400]);
      expect(() => hf.adminQuizViewSessions(user2, quiz1)).toThrow(HTTPError[400]);
    });
  });

  describe('success cases:', () => {
    test('successfully retrieved active and inactive sessionIds (in ascending order) for the input quiz', () => {
      expect(hf.adminQuizViewSessions(user1, quiz1)).toStrictEqual({
        activeSessions: [],
        inactiveSessions: []
      });
    });
  });
});

const validQuestions = [
  {
    question: 'Who was the first man on moon?',
    duration: 1,
    points: 5,
    answers: [
      {
        answer: 'Neil Armstrong',
        correct: true
      },
      {
        answer: 'Buzz Aldrin',
        correct: false
      }
    ],
    thumbnailUrl: 'https://i.imgur.com/4CJ1TaY.png',
  },
  {
    question: 'What is the capital of France?',
    duration: 45,
    points: 3,
    answers: [
      {
        answer: 'Paris',
        correct: true
      },
      {
        answer: 'London',
        correct: false
      }
    ],
    thumbnailUrl: 'https://i.imgur.com/4CJ1TaY.png',
  },
  {
    question: 'What is the largest mammal?',
    duration: 45,
    points: 7,
    answers: [
      {
        answer: 'Blue Whale',
        correct: true
      },
      {
        answer: 'Elephant',
        correct: false
      }
    ],
    thumbnailUrl: 'https://i.imgur.com/4CJ1TaY.png',
  }
];

describe('POST, /v1/admin/quiz/{quizid}/session/start', () => {
  let user1 : string;
  let quiz1 : number;
  beforeEach(() => {
    user1 = hf.adminAuthRegister('Yepeng@gmail.com', 'Yepeng12321', 'Yepeng', 'Lin').body.token;
    quiz1 = hf.adminQuizCreateV2(user1, 'GeographyGame', '').quizId;
    hf.adminQuestionCreateV2(user1, quiz1, validQuestions[0]);
  });
  describe('error cases:', () => {
    test.each([
      '',
      null
    ])('Token is not a valid structure', (invalidToken) => {
      expect(() => hf.adminQuizSessionStart(invalidToken, quiz1, 3)).toThrow(HTTPError[401]);
    });
    test('Provided token is valid structure, but is not for a currently logged in session', () => {
      hf.adminAuthLogoutV2(user1);
      expect(() => hf.adminQuizSessionStart(user1, quiz1, 3)).toThrow(HTTPError[403]);
    });
    test('Quiz ID does not refer to a valid quiz', () => {
      expect(() => hf.adminQuizSessionStart(user1, quiz1 + 1, 3)).toThrow(HTTPError[400]);
    });
    test('Quiz ID does not refer to a quiz that this user owns', () => {
      const user2 = hf.adminAuthRegister('Hayden@gmail.com', 'Hayden12321', 'Hayden', 'Smith').body.token;
      const quiz2 = hf.adminQuizCreateV2(user2, 'LiteratureTest', '').quizId;
      hf.adminQuestionCreateV2(user2, quiz2, validQuestions[1]);
      expect(() => hf.adminQuizSessionStart(user1, quiz2, 3)).toThrow(HTTPError[400]);
      expect(() => hf.adminQuizSessionStart(user2, quiz1, 3)).toThrow(HTTPError[400]);
    });
    test('autoStartNum is a number greater than 50', () => {
      expect(() => hf.adminQuizSessionStart(user1, quiz1, 51)).toThrow(HTTPError[400]);
    });
    test('A maximum of 10 sessions that are not in END state currently exist', () => {
      for (let i = 0; i < 10; i++) {
        expect(hf.adminQuizSessionStart(user1, quiz1, 3)).toStrictEqual({ sessionId: expect.any(Number) });
      }
      expect(() => hf.adminQuizSessionStart(user1, quiz1, 3)).toThrow(HTTPError[400]);
    });
    test('The quiz does not have any questions in it', () => {
      const quiz3 = hf.adminQuizCreateV2(user1, 'Science Game', '').quizId;
      expect(() => hf.adminQuizSessionStart(user1, quiz3, 3)).toThrow(HTTPError[400]);
    });
  });
  describe('success cases:', () => {
    test('successfully started quiz sessions', () => {
      for (let i = 0; i < 10; i++) {
        expect(hf.adminQuizSessionStart(user1, quiz1, 3)).toStrictEqual({ sessionId: expect.any(Number) });
      }
      const activeSessions : typeV2.SessionInfo[] = hf.adminQuizViewSessions(user1, quiz1).activeSessions;
      expect(activeSessions.length).toStrictEqual(10);
      expect(activeSessions).toStrictEqual(activeSessions.sort((a, b) => a.sessionId - b.sessionId));
    });
  });
});

describe('PUT, /v1/admin/quiz/{quizid}/session/{sessionid}', () => {
  const COUNTDOWN = typeV2.COUNTDOWN_TIME;
  let user1 : string;
  let quiz1 : number;
  let session1: number;
  beforeEach(() => {
    user1 = hf.adminAuthRegister('Yepeng@gmail.com', 'Yepeng12321', 'Yepeng', 'Lin').body.token;
    quiz1 = hf.adminQuizCreateV2(user1, 'GeographyGame', '').quizId;
    hf.adminQuestionCreateV2(user1, quiz1, validQuestions[0]);
    hf.adminQuestionCreateV2(user1, quiz1, validQuestions[1]);
    session1 = hf.adminQuizSessionStart(user1, quiz1, 3).sessionId;
  });
  describe('error case:', () => {
    test.each([
      '',
      null
    ])('Token is not a valid structure', (invalidToken) => {
      expect(() => hf.adminQuizSessionUpdate(quiz1, session1, invalidToken, 'NEXT_QUESTION')).toThrow(HTTPError[401]);
    });
    test('Provided token is valid structure, but is not for a currently logged in session', () => {
      hf.adminAuthLogoutV2(user1);
      expect(() => hf.adminQuizSessionUpdate(quiz1, session1, user1, 'NEXT_QUESTION')).toThrow(HTTPError[403]);
    });
    test('Quiz ID does not refer to a valid quiz', () => {
      expect(() => hf.adminQuizSessionUpdate(quiz1 + 1, session1, user1, 'NEXT_QUESTION')).toThrow(HTTPError[400]);
    });
    test('Quiz ID does not refer to a quiz that this user owns', () => {
      const user2 = hf.adminAuthRegister('Hayden@gmail.com', 'Hayden12321', 'Hayden', 'Smith').body.token;
      const quiz2 = hf.adminQuizCreateV2(user2, 'LiteratureTest', '').quizId;
      hf.adminQuestionCreateV2(user2, quiz2, validQuestions[1]);
      const session2 = hf.adminQuizSessionStart(user2, quiz2, 3).sessionId;
      expect(() => hf.adminQuizSessionUpdate(quiz2, session2, user1, 'NEXT_QUESTION')).toThrow(HTTPError[400]);
      expect(() => hf.adminQuizSessionUpdate(quiz1, session1, user2, 'NEXT_QUESTION')).toThrow(HTTPError[400]);
    });
    test('Session Id does not refer to a valid session within this quiz', () => {
      const user2 = hf.adminAuthRegister('Hayden@gmail.com', 'Hayden12321', 'Hayden', 'Smith').body.token;
      const quiz2 = hf.adminQuizCreateV2(user2, 'LiteratureTest', '').quizId;
      hf.adminQuestionCreateV2(user2, quiz2, validQuestions[1]);
      const session2 = hf.adminQuizSessionStart(user2, quiz2, 3).sessionId;
      expect(() => hf.adminQuizSessionUpdate(quiz1, session2, user1, 'NEXT_QUESTION')).toThrow(HTTPError[400]);
      expect(() => hf.adminQuizSessionUpdate(quiz2, session1, user2, 'NEXT_QUESTION')).toThrow(HTTPError[400]);
    });
    test.each([
      'PREVIOUS_QUESTION',
      'MUTE_PLAYER'
    ])('Action provided is not a valid Action enum', (invalidAction) => {
      expect(() => hf.adminQuizSessionUpdate(quiz1, session1, user1, invalidAction)).toThrow(HTTPError[400]);
    });
    test.each([
      { action: typeV2.SessionAction.GO_TO_ANSWER, isAllowed: false },
      { action: typeV2.SessionAction.GO_TO_FINAL_RESULTS, isAllowed: false },
    ])('Action enum cannot be applied in the current state (see spec for details) from LOBBY', (move) => {
      if (!move.isAllowed) {
        expect(() => hf.adminQuizSessionUpdate(quiz1, session1, user1, move.action)).toThrow(HTTPError[400]);
      } else {
        expect(hf.adminQuizSessionUpdate(quiz1, session1, user1, move.action)).toStrictEqual({});
      }
    });

    test.each([
      { action: typeV2.SessionAction.GO_TO_ANSWER, isAllowed: false },
      { action: typeV2.SessionAction.GO_TO_FINAL_RESULTS, isAllowed: false },
      { action: typeV2.SessionAction.END, isAllowed: false },
      { action: typeV2.SessionAction.NEXT_QUESTION, isAllowed: false },
    ])('Action enum cannot be applied in the current state (see spec for details) from END', (move) => {
      expect(hf.adminQuizSessionUpdate(quiz1, session1, user1, typeV2.SessionAction.END)).toStrictEqual({});
      if (!move.isAllowed) {
        expect(() => hf.adminQuizSessionUpdate(quiz1, session1, user1, move.action)).toThrow(HTTPError[400]);
      } else {
        expect(hf.adminQuizSessionUpdate(quiz1, session1, user1, move.action)).toStrictEqual({});
      }
    });
    test('Action enum cannot be applied in the current state (see spec for details) from QUESTION_COUNTDOWN', () => {
      const moves = [
        { action: typeV2.SessionAction.GO_TO_ANSWER, isAllowed: false },
        { action: typeV2.SessionAction.GO_TO_FINAL_RESULTS, isAllowed: false },
        { action: typeV2.SessionAction.NEXT_QUESTION, isAllowed: false },
      ];
      expect(hf.adminQuizSessionUpdate(quiz1, session1, user1, typeV2.SessionAction.NEXT_QUESTION)).toStrictEqual({});
      moves.forEach(move => {
        if (!move.isAllowed) {
          expect(() => hf.adminQuizSessionUpdate(quiz1, session1, user1, move.action)).toThrow(HTTPError[400]);
        } else {
          expect(hf.adminQuizSessionUpdate(quiz1, session1, user1, move.action)).toStrictEqual({});
        }
      });
    });

    test('Action enum cannot be applied in the current state (see spec for details) from QUESTION_OPEN', (done) => {
      const moves = [
        { action: typeV2.SessionAction.GO_TO_FINAL_RESULTS, isAllowed: false },
        { action: typeV2.SessionAction.NEXT_QUESTION, isAllowed: false },
      ];
      expect(hf.adminQuizSessionUpdate(quiz1, session1, user1, typeV2.SessionAction.NEXT_QUESTION)).toStrictEqual({});
      setTimeout(() => {
        moves.forEach(move => {
          if (!move.isAllowed) {
            expect(() => hf.adminQuizSessionUpdate(quiz1, session1, user1, move.action)).toThrow(HTTPError[400]);
          } else {
            expect(hf.adminQuizSessionUpdate(quiz1, session1, user1, move.action)).toStrictEqual({});
          }
        });
        done();
      }, COUNTDOWN + 20);
    });

    test('Action enum cannot be applied in the current state (see spec for details) from QUESTION_CLOSE: no next question', (done) => {
      hf.clear();
      user1 = hf.adminAuthRegister('Yepeng@gmail.com', 'Yepeng12321', 'Yepeng', 'Lin').body.token;
      quiz1 = hf.adminQuizCreateV2(user1, 'GeographyGame', '').quizId;
      hf.adminQuestionCreateV2(user1, quiz1, validQuestions[0]);
      session1 = hf.adminQuizSessionStart(user1, quiz1, 3).sessionId;
      const move = { action: typeV2.SessionAction.NEXT_QUESTION, isAllowed: false };
      expect(hf.adminQuizSessionUpdate(quiz1, session1, user1, typeV2.SessionAction.NEXT_QUESTION)).toStrictEqual({});
      setTimeout(() => {
        if (!move.isAllowed) {
          expect(() => hf.adminQuizSessionUpdate(quiz1, session1, user1, move.action)).toThrow(HTTPError[400]);
        } else {
          expect(hf.adminQuizSessionUpdate(quiz1, session1, user1, move.action)).toStrictEqual({});
        }
        done();
      }, COUNTDOWN + validQuestions[0].duration + 20);
    });

    test('Action enum cannot be applied in the current state (see spec for details) from ANSWER_SHOW', (done) => {
      const move = { action: typeV2.SessionAction.GO_TO_ANSWER, isAllowed: false };
      expect(hf.adminQuizSessionUpdate(quiz1, session1, user1, typeV2.SessionAction.NEXT_QUESTION)).toStrictEqual({});
      setTimeout(() => {
        expect(hf.adminQuizSessionUpdate(quiz1, session1, user1, typeV2.SessionAction.GO_TO_ANSWER)).toStrictEqual({});
        if (!move.isAllowed) {
          expect(() => hf.adminQuizSessionUpdate(quiz1, session1, user1, move.action)).toThrow(HTTPError[400]);
        } else {
          expect(hf.adminQuizSessionUpdate(quiz1, session1, user1, move.action)).toStrictEqual({});
        }
        done();
      }, COUNTDOWN + 20);
    });

    test('Action enum cannot be applied in the current state (see spec for details) from FINAL_RESULT', (done) => {
      const moves = [
        { action: typeV2.SessionAction.GO_TO_ANSWER, isAllowed: false },
        { action: typeV2.SessionAction.NEXT_QUESTION, isAllowed: false },
        { action: typeV2.SessionAction.GO_TO_FINAL_RESULTS, isAllowed: false }
      ];
      expect(hf.adminQuizSessionUpdate(quiz1, session1, user1, typeV2.SessionAction.NEXT_QUESTION)).toStrictEqual({});
      setTimeout(() => {
        expect(hf.adminQuizSessionUpdate(quiz1, session1, user1, typeV2.SessionAction.GO_TO_ANSWER)).toStrictEqual({});
        expect(hf.adminQuizSessionUpdate(quiz1, session1, user1, typeV2.SessionAction.GO_TO_FINAL_RESULTS)).toStrictEqual({});
        moves.forEach(move => {
          if (!move.isAllowed) {
            expect(() => hf.adminQuizSessionUpdate(quiz1, session1, user1, move.action)).toThrow(HTTPError[400]);
          } else {
            expect(hf.adminQuizSessionUpdate(quiz1, session1, user1, move.action)).toStrictEqual({});
          }
        });
        done();
      }, COUNTDOWN + 20);
    });
  });

  describe('success cases:', () => {
    test.each([
      { action: typeV2.SessionAction.END, isAllowed: true },
      { action: typeV2.SessionAction.NEXT_QUESTION, isAllowed: true },
    ])('Action enum cannot be applied in the current state (see spec for details) from LOBBY', (move) => {
      if (!move.isAllowed) {
        expect(() => hf.adminQuizSessionUpdate(quiz1, session1, user1, move.action)).toThrow(HTTPError[400]);
      } else {
        expect(hf.adminQuizSessionUpdate(quiz1, session1, user1, move.action)).toStrictEqual({});
      }
    });

    test('Action enum can be applied in the current state (see spec for details) from QUESTION_COUNTDOWN', () => {
      const move = { action: typeV2.SessionAction.END, isAllowed: true };
      expect(hf.adminQuizSessionUpdate(quiz1, session1, user1, typeV2.SessionAction.NEXT_QUESTION)).toStrictEqual({});
      if (!move.isAllowed) {
        expect(() => hf.adminQuizSessionUpdate(quiz1, session1, user1, move.action)).toThrow(HTTPError[400]);
      } else {
        expect(hf.adminQuizSessionUpdate(quiz1, session1, user1, move.action)).toStrictEqual({});
      }
    });

    test('Action enum can be applied in the current state (see spec for details) from QUESTION_OPEN 1', (done) => {
      const move = { action: typeV2.SessionAction.GO_TO_ANSWER, isAllowed: true };
      expect(hf.adminQuizSessionUpdate(quiz1, session1, user1, typeV2.SessionAction.NEXT_QUESTION)).toStrictEqual({});
      setTimeout(() => {
        if (!move.isAllowed) {
          expect(() => hf.adminQuizSessionUpdate(quiz1, session1, user1, move.action)).toThrow(HTTPError[400]);
        } else {
          expect(hf.adminQuizSessionUpdate(quiz1, session1, user1, move.action)).toStrictEqual({});
        }
        done();
      }, COUNTDOWN + 20);
    });

    test('Action enum can be applied in the current state (see spec for details) from QUESTION_OPEN 2', (done) => {
      const move = { action: typeV2.SessionAction.END, isAllowed: true };
      expect(hf.adminQuizSessionUpdate(quiz1, session1, user1, typeV2.SessionAction.NEXT_QUESTION)).toStrictEqual({});
      setTimeout(() => {
        if (!move.isAllowed) {
          expect(() => hf.adminQuizSessionUpdate(quiz1, session1, user1, move.action)).toThrow(HTTPError[400]);
        } else {
          expect(hf.adminQuizSessionUpdate(quiz1, session1, user1, move.action)).toStrictEqual({});
        }
        done();
      }, COUNTDOWN + 20);
    });

    test('Action enum can be applied in the current state (see spec for details) from QUESTION_CLOSE 1', (done) => {
      const move = { action: typeV2.SessionAction.END, isAllowed: true };
      expect(hf.adminQuizSessionUpdate(quiz1, session1, user1, typeV2.SessionAction.NEXT_QUESTION)).toStrictEqual({});
      setTimeout(() => {
        if (!move.isAllowed) {
          expect(() => hf.adminQuizSessionUpdate(quiz1, session1, user1, move.action)).toThrow(HTTPError[400]);
        } else {
          expect(hf.adminQuizSessionUpdate(quiz1, session1, user1, move.action)).toStrictEqual({});
        }
        done();
      }, COUNTDOWN + validQuestions[0].duration * 1000 + 20);
    });

    test('Action enum can be applied in the current state (see spec for details) from QUESTION_CLOSE 2', (done) => {
      const move = { action: typeV2.SessionAction.GO_TO_ANSWER, isAllowed: true };
      expect(hf.adminQuizSessionUpdate(quiz1, session1, user1, typeV2.SessionAction.NEXT_QUESTION)).toStrictEqual({});
      setTimeout(() => {
        if (!move.isAllowed) {
          expect(() => hf.adminQuizSessionUpdate(quiz1, session1, user1, move.action)).toThrow(HTTPError[400]);
        } else {
          expect(hf.adminQuizSessionUpdate(quiz1, session1, user1, move.action)).toStrictEqual({});
        }
        done();
      }, COUNTDOWN + validQuestions[0].duration * 1000 + 20);
    });

    test('Action enum can be applied in the current state (see spec for details) from QUESTION_CLOSE 3', (done) => {
      const move = { action: typeV2.SessionAction.GO_TO_FINAL_RESULTS, isAllowed: true };
      expect(hf.adminQuizSessionUpdate(quiz1, session1, user1, typeV2.SessionAction.NEXT_QUESTION)).toStrictEqual({});
      setTimeout(() => {
        if (!move.isAllowed) {
          expect(() => hf.adminQuizSessionUpdate(quiz1, session1, user1, move.action)).toThrow(HTTPError[400]);
        } else {
          expect(hf.adminQuizSessionUpdate(quiz1, session1, user1, move.action)).toStrictEqual({});
        }
        done();
      }, COUNTDOWN + validQuestions[0].duration * 1000 + 20);
    });

    test('Action enum can be applied in the current state (see spec for details) from QUESTION_CLOSE 4', (done) => {
      const move = { action: typeV2.SessionAction.NEXT_QUESTION, isAllowed: true };
      expect(hf.adminQuizSessionUpdate(quiz1, session1, user1, typeV2.SessionAction.NEXT_QUESTION)).toStrictEqual({});
      setTimeout(() => {
        if (!move.isAllowed) {
          expect(() => hf.adminQuizSessionUpdate(quiz1, session1, user1, move.action)).toThrow(HTTPError[400]);
        } else {
          expect(hf.adminQuizSessionUpdate(quiz1, session1, user1, move.action)).toStrictEqual({});
        }
        done();
      }, COUNTDOWN + validQuestions[0].duration * 1000 + 20);
    });

    test('Action enum can be applied in the current state (see spec for details) from ANSWER_SHOW 1', (done) => {
      const move = { action: typeV2.SessionAction.END, isAllowed: true };
      expect(hf.adminQuizSessionUpdate(quiz1, session1, user1, typeV2.SessionAction.NEXT_QUESTION)).toStrictEqual({});
      setTimeout(() => {
        expect(hf.adminQuizSessionUpdate(quiz1, session1, user1, typeV2.SessionAction.GO_TO_ANSWER)).toStrictEqual({});
        if (!move.isAllowed) {
          expect(() => hf.adminQuizSessionUpdate(quiz1, session1, user1, move.action)).toThrow(HTTPError[400]);
        } else {
          expect(hf.adminQuizSessionUpdate(quiz1, session1, user1, move.action)).toStrictEqual({});
        }
        done();
      }, COUNTDOWN + 20);
    });

    test('Action enum can be applied in the current state (see spec for details) from ANSWER_SHOW 2', (done) => {
      const move = { action: typeV2.SessionAction.GO_TO_FINAL_RESULTS, isAllowed: true };
      expect(hf.adminQuizSessionUpdate(quiz1, session1, user1, typeV2.SessionAction.NEXT_QUESTION)).toStrictEqual({});
      setTimeout(() => {
        expect(hf.adminQuizSessionUpdate(quiz1, session1, user1, typeV2.SessionAction.GO_TO_ANSWER)).toStrictEqual({});
        if (!move.isAllowed) {
          expect(() => hf.adminQuizSessionUpdate(quiz1, session1, user1, move.action)).toThrow(HTTPError[400]);
        } else {
          expect(hf.adminQuizSessionUpdate(quiz1, session1, user1, move.action)).toStrictEqual({});
        }
        done();
      }, COUNTDOWN + 20);
    });

    test('Action enum can be applied in the current state (see spec for details) from ANSWER_SHOW 3', (done) => {
      const move = { action: typeV2.SessionAction.NEXT_QUESTION, isAllowed: true };
      expect(hf.adminQuizSessionUpdate(quiz1, session1, user1, typeV2.SessionAction.NEXT_QUESTION)).toStrictEqual({});
      setTimeout(() => {
        expect(hf.adminQuizSessionUpdate(quiz1, session1, user1, typeV2.SessionAction.GO_TO_ANSWER)).toStrictEqual({});
        if (!move.isAllowed) {
          expect(() => hf.adminQuizSessionUpdate(quiz1, session1, user1, move.action)).toThrow(HTTPError[400]);
        } else {
          expect(hf.adminQuizSessionUpdate(quiz1, session1, user1, move.action)).toStrictEqual({});
        }
        done();
      }, COUNTDOWN + 20);
    });
    test('Action enum can be applied in the current state (see spec for details) from FINAL_RESULT', (done) => {
      const move = { action: typeV2.SessionAction.END, isAllowed: true };
      expect(hf.adminQuizSessionUpdate(quiz1, session1, user1, typeV2.SessionAction.NEXT_QUESTION)).toStrictEqual({});
      setTimeout(() => {
        expect(hf.adminQuizSessionUpdate(quiz1, session1, user1, typeV2.SessionAction.GO_TO_ANSWER)).toStrictEqual({});
        expect(hf.adminQuizSessionUpdate(quiz1, session1, user1, typeV2.SessionAction.GO_TO_FINAL_RESULTS)).toStrictEqual({});
        if (!move.isAllowed) {
          expect(() => hf.adminQuizSessionUpdate(quiz1, session1, user1, move.action)).toThrow(HTTPError[400]);
        } else {
          expect(hf.adminQuizSessionUpdate(quiz1, session1, user1, move.action)).toStrictEqual({});
        }
        done();
      }, COUNTDOWN + 20);
    });
    test('moving to end makes it inactive', () => {
      expect(hf.adminQuizSessionUpdate(quiz1, session1, user1, typeV2.SessionAction.END)).toStrictEqual({});
      const status = hf.adminQuizViewSessions(user1, quiz1);
      const numInactive = status.inactiveSessions.length;
      const numActive = status.activeSessions.length;
      expect(numActive).toStrictEqual(0);
      expect(numInactive).toStrictEqual(1);
    });
    test('moving to end allows more sessions for a quiz', () => {
      for (let i = 0; i < 9; i++) {
        expect(hf.adminQuizSessionStart(user1, quiz1, 3)).toStrictEqual({ sessionId: expect.any(Number) });
      }
      const status = hf.adminQuizViewSessions(user1, quiz1);
      const numActive = status.activeSessions.length;
      expect(numActive).toStrictEqual(10);
      expect(hf.adminQuizSessionUpdate(quiz1, session1, user1, typeV2.SessionAction.END)).toStrictEqual({});
      expect(hf.adminQuizSessionStart(user1, quiz1, 3)).toStrictEqual({ sessionId: expect.any(Number) });
    });
  });
});

describe('GET, /v1/admin/quiz/{quizid}/session/{sessionid}', () => {
  let user1 : string;
  let quiz1 : number;
  let session1: number;
  let question1: any;
  let question2: any;
  beforeEach(() => {
    user1 = hf.adminAuthRegister('louis@gmail.com', 'Louis12323', 'Louis', 'Nguyen').body.token;
    quiz1 = hf.adminQuizCreateV2(user1, 'GeographyGame', '').quizId;
    question1 = hf.adminQuestionCreateV2(user1, quiz1, validQuestions[0]);
    question2 = hf.adminQuestionCreateV2(user1, quiz1, validQuestions[1]);
    session1 = hf.adminQuizSessionStart(user1, quiz1, 3).sessionId;
  });

  test('Token is not a valid structure', () => {
    expect(() => hf.adminQuizSessionStatus(quiz1, session1, null)).toThrow(HTTPError[401]);
  });

  test('Token is not a valid structure', () => {
    expect(() => hf.adminQuizSessionStatus(quiz1, session1, '')).toThrow(HTTPError[401]);
  });

  test('Provided token is valid structure, but is not for a currently logged in session', () => {
    hf.adminAuthLogoutV2(user1);
    expect(() => hf.adminQuizSessionStatus(quiz1, session1, user1)).toThrow(HTTPError[403]);
  });

  test('Quiz ID does not refer to a valid quiz', () => {
    expect(() => hf.adminQuizSessionStatus(quiz1 + 1, session1, user1)).toThrow(HTTPError[400]);
  });

  test('Quiz ID does not refer to a quiz that this user owns', () => {
    const user2 = hf.adminAuthRegister('Hayden@gmail.com', 'Hayden12321', 'Hayden', 'Smith').body.token;
    const quiz2 = hf.adminQuizCreateV2(user2, 'LiteratureTest', '').quizId;
    hf.adminQuestionCreateV2(user2, quiz2, validQuestions[1]);
    const session2 = hf.adminQuizSessionStart(user2, quiz2, 3).sessionId;
    expect(() => hf.adminQuizSessionStatus(quiz2, session2, user1)).toThrow(HTTPError[400]);
    expect(() => hf.adminQuizSessionStatus(quiz1, session1, user2)).toThrow(HTTPError[400]);
  });

  test('Session Id does not refer to a valid session within this quiz', () => {
    const user2 = hf.adminAuthRegister('Hayden@gmail.com', 'Hayden12321', 'Hayden', 'Smith').body.token;
    const quiz2 = hf.adminQuizCreateV2(user2, 'LiteratureTest', '').quizId;
    hf.adminQuestionCreateV2(user2, quiz2, validQuestions[1]);
    const session2 = hf.adminQuizSessionStart(user2, quiz2, 3).sessionId;
    expect(() => hf.adminQuizSessionStatus(quiz1, session2, user1)).toThrow(HTTPError[400]);
    expect(() => hf.adminQuizSessionStatus(quiz2, session1, user2)).toThrow(HTTPError[400]);
  });

  test('successfully retrieved the current state of the session', () => {
    expect(hf.adminQuizSessionStatus(quiz1, session1, user1)).toStrictEqual({
      state: typeV2.SessionState.LOBBY,
      atQuestion: 0,
      players: [],
      metadata: {
        quizId: quiz1,
        name: 'GeographyGame',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: '',
        numQuestions: expect.any(Number),
        questions: [
          {
            questionId: question1.questionId,
            question: 'Who was the first man on moon?',
            duration: validQuestions[0].duration,
            thumbnailUrl: expect.any(String),
            points: 5,
            answers: [
              {
                answerId: expect.any(Number),
                answer: 'Neil Armstrong',
                colour: expect.any(String),
                correct: true
              },
              {
                answerId: expect.any(Number),
                answer: 'Buzz Aldrin',
                colour: expect.any(String),
                correct: false
              }
            ]
          },
          {
            questionId: question2.questionId,
            question: 'What is the capital of France?',
            duration: 45,
            thumbnailUrl: expect.any(String),
            points: 3,
            answers: [
              {
                answerId: expect.any(Number),
                answer: 'Paris',
                colour: expect.any(String),
                correct: true
              },
              {
                answerId: expect.any(Number),
                answer: 'London',
                colour: expect.any(String),
                correct: false
              },
            ]
          }
        ],
        duration: validQuestions[0].duration + validQuestions[1].duration,
        thumbnailUrl: '',
      }
    });
  });
});

describe('/v1/admin/quiz/{quizid}/session/{sessionid}/results', () => {
  let user1 : string;
  let quiz1 : number;
  let question1 : number;
  let question2 : number;
  let session1 : number;
  let player1Id : number;
  let player2Id : number;
  let q1AnswersCorrect : number[];

  beforeEach(() => {
    user1 = hf.adminAuthRegister('Yepeng@gmail.com', 'Yepeng12321', 'Yepeng', 'Lin').body.token;
    quiz1 = hf.adminQuizCreateV2(user1, 'GeographyGame', '').quizId;
    question1 = hf.adminQuestionCreateV2(user1, quiz1, validQuestions[0]).questionId;
    question2 = hf.adminQuestionCreateV2(user1, quiz1, validQuestions[1]).questionId;
    session1 = hf.adminQuizSessionStart(user1, quiz1, 2).sessionId;
    player1Id = hf.playerJoin(session1, 'Yepeng').playerId;
    player2Id = hf.playerJoin(session1, 'Louis').playerId;
    const quizInfo : typeV2.QuizInfo = hf.adminQuizInfoV2(user1, quiz1);
    const question1Answers = quizInfo.questions.find(question => question.questionId === question1).answers;
    const question2Answers = quizInfo.questions.find(question => question.questionId === question2).answers;
    q1AnswersCorrect = question1Answers.filter(answer => answer.correct === true).map(answer => answer.answerId);
    question2Answers.filter(answer => answer.correct === true).map(answer => answer.answerId);
    question1Answers.filter(answer => answer.correct === false).map(answer => answer.answerId);
  });
  test('Token is not a valid structure', () => {
    expect(() => hf.adminQuizSessionResults(quiz1, session1, null)).toThrow(HTTPError[401]);
  });
  test('Token is valid structure, but is not for a currently logged in session', () => {
    hf.adminAuthLogoutV2(user1);
    expect(() => hf.adminQuizSessionResults(quiz1, session1, user1)).toThrow(HTTPError[403]);
  });
  test('Quiz ID does not refer to a valid quiz', () => {
    expect(() => hf.adminQuizSessionResults(-1, session1, user1)).toThrow(HTTPError[400]);
  });
  test('Quiz ID does not refer to a quiz that this user owns', () => {
    const user2 = hf.adminAuthRegister('louis@gmail.com', 'Louis12321', 'Louis', 'Nguyen').body.token;
    const quiz2 = hf.adminQuizCreateV2(user2, 'LiteratureTest', '').quizId;
    hf.adminQuestionCreateV2(user2, quiz2, validQuestions[1]);
    const session2 = hf.adminQuizSessionStart(user2, quiz2, 3).sessionId;
    expect(() => hf.adminQuizSessionResults(quiz2, session2, user1)).toThrow(HTTPError[400]);
    expect(() => hf.adminQuizSessionResults(quiz1, session1, user2)).toThrow(HTTPError[400]);
  });
  test('Session Id does not refer to a valid session within this quiz', () => {
    const user2 = hf.adminAuthRegister('louis@gmail.com', 'Louis12321', 'Louis', 'Nguyen').body.token;
    const quiz2 = hf.adminQuizCreateV2(user2, 'LiteratureTest', '').quizId;
    hf.adminQuestionCreateV2(user2, quiz2, validQuestions[1]);
    const session2 = hf.adminQuizSessionStart(user2, quiz2, 3).sessionId;
    expect(() => hf.adminQuizSessionResults(quiz1, session2, user1)).toThrow(HTTPError[400]);
    expect(() => hf.adminQuizSessionResults(quiz2, session1, user2)).toThrow(HTTPError[400]);
  });
  test('Session is not in FINAL_RESULTS state', () => {
    expect(() => hf.adminQuizSessionResults(quiz1, session1, user1)).toThrow(HTTPError[400]);
  });
  describe('success case:', () => {
    test('OK', () => {
      sleep(typeV2.COUNTDOWN_TIME);
      expect(() => hf.adminQuizSessionUpdate(quiz1, session1, user1, 'GO_TO_FINAL_RESULTS')).toThrow(HTTPError[400]);
      hf.adminQuizSessionStatus(quiz1, session1, user1);
      expect(hf.playerAnswer(player1Id, 1, q1AnswersCorrect)).toStrictEqual({});
      sleep(500);
      expect(hf.playerAnswer(player2Id, 1, [q1AnswersCorrect[0]])).toStrictEqual({});
      sleep(600);
      hf.adminQuizSessionUpdate(quiz1, session1, user1, 'GO_TO_FINAL_RESULTS');
      const result = hf.adminQuizSessionResults(quiz1, session1, user1);
      expect(result.questionResults[0].averageAnswerTime).toBeGreaterThanOrEqual(0);
      expect(result.questionResults[0].averageAnswerTime).toBeLessThanOrEqual(1);
      expect(result).toStrictEqual({
        questionResults: [
          {
            averageAnswerTime: expect.any(Number),
            percentCorrect: 100,
            questionCorrectBreakdown: [
              {
                answerId: 0,
                playersCorrect: [
                  'Yepeng',
                  'Louis'
                ]
              }
            ],
            questionId: 0
          }
        ],
        usersRankedByScore: [
          {
            name: 'Yepeng',
            score: 5
          },
          {
            name: 'Louis',
            score: 2.5
          }
        ]
      });
    });
  });
});

describe('GET, /v1/admin/quiz/{quizid}/session/{sessionid}/results/csv', () => {
  let user1 : string;
  let quiz1 : number;
  let question1 : number;
  let question2 : number;
  let session1 : number;
  let player1Id : number;
  let player2Id : number;
  let q1AnswersCorrect : number[];

  beforeEach(() => {
    user1 = hf.adminAuthRegister('Yepeng@gmail.com', 'Yepeng12321', 'Yepeng', 'Lin').body.token;
    quiz1 = hf.adminQuizCreateV2(user1, 'GeographyGame', '').quizId;
    question1 = hf.adminQuestionCreateV2(user1, quiz1, validQuestions[0]).questionId;
    question2 = hf.adminQuestionCreateV2(user1, quiz1, validQuestions[1]).questionId;
    session1 = hf.adminQuizSessionStart(user1, quiz1, 2).sessionId;
    player1Id = hf.playerJoin(session1, 'Yepeng').playerId;
    player2Id = hf.playerJoin(session1, 'Louis').playerId;
    const quizInfo : typeV2.QuizInfo = hf.adminQuizInfoV2(user1, quiz1);
    const question1Answers = quizInfo.questions.find(question => question.questionId === question1).answers;
    const question2Answers = quizInfo.questions.find(question => question.questionId === question2).answers;
    q1AnswersCorrect = question1Answers.filter(answer => answer.correct === true).map(answer => answer.answerId);
    question2Answers.filter(answer => answer.correct === true).map(answer => answer.answerId);
    question1Answers.filter(answer => answer.correct === false).map(answer => answer.answerId);
  });
  test('Token is not a valid structure', () => {
    expect(() => hf.adminQuizSessionResultsCSV(quiz1, session1, null)).toThrow(HTTPError[401]);
  });
  test('Token is valid structure, but is not for a currently logged in session', () => {
    hf.adminAuthLogoutV2(user1);
    expect(() => hf.adminQuizSessionResultsCSV(quiz1, session1, user1)).toThrow(HTTPError[403]);
  });
  test('Quiz ID does not refer to a valid quiz', () => {
    expect(() => hf.adminQuizSessionResultsCSV(-1, session1, user1)).toThrow(HTTPError[400]);
  });
  test('Quiz ID does not refer to a quiz that this user owns', () => {
    const user2 = hf.adminAuthRegister('louis@gmail.com', 'Louis12321', 'Louis', 'Nguyen').body.token;
    const quiz2 = hf.adminQuizCreateV2(user2, 'LiteratureTest', '').quizId;
    hf.adminQuestionCreateV2(user2, quiz2, validQuestions[1]);
    const session2 = hf.adminQuizSessionStart(user2, quiz2, 3).sessionId;
    expect(() => hf.adminQuizSessionResultsCSV(quiz2, session2, user1)).toThrow(HTTPError[400]);
    expect(() => hf.adminQuizSessionResultsCSV(quiz1, session1, user2)).toThrow(HTTPError[400]);
  });
  test('Session Id does not refer to a valid session within this quiz', () => {
    const user2 = hf.adminAuthRegister('louis@gmail.com', 'Louis12321', 'Louis', 'Nguyen').body.token;
    const quiz2 = hf.adminQuizCreateV2(user2, 'LiteratureTest', '').quizId;
    hf.adminQuestionCreateV2(user2, quiz2, validQuestions[1]);
    const session2 = hf.adminQuizSessionStart(user2, quiz2, 3).sessionId;
    expect(() => hf.adminQuizSessionResultsCSV(quiz1, session2, user1)).toThrow(HTTPError[400]);
    expect(() => hf.adminQuizSessionResultsCSV(quiz2, session1, user2)).toThrow(HTTPError[400]);
  });
  test('Session is not in FINAL_RESULTS state', () => {
    expect(() => hf.adminQuizSessionResultsCSV(quiz1, session1, user1)).toThrow(HTTPError[400]);
  });
  describe('success case:', () => {
    test('OK', () => {
      sleep(typeV2.COUNTDOWN_TIME);
      expect(() => hf.adminQuizSessionUpdate(quiz1, session1, user1, 'GO_TO_FINAL_RESULTS')).toThrow(HTTPError[400]);
      hf.adminQuizSessionStatus(quiz1, session1, user1);
      expect(hf.playerAnswer(player1Id, 1, q1AnswersCorrect)).toStrictEqual({});
      sleep(500);
      expect(hf.playerAnswer(player2Id, 1, [q1AnswersCorrect[0]])).toStrictEqual({});
      sleep(600);
      hf.adminQuizSessionUpdate(quiz1, session1, user1, 'GO_TO_FINAL_RESULTS');
      const result = hf.adminQuizSessionResults(quiz1, session1, user1);
      expect(hf.adminQuizSessionResultsCSV(quiz1, session1, user1).url).toStrictEqual(expect.any(String));
      expect(result.questionResults[0].averageAnswerTime).toBeGreaterThanOrEqual(0);
      expect(result.questionResults[0].averageAnswerTime).toBeLessThanOrEqual(1);
      expect(result).toStrictEqual({
        questionResults: [
          {
            averageAnswerTime: expect.any(Number),
            percentCorrect: 100,
            questionCorrectBreakdown: [
              {
                answerId: 0,
                playersCorrect: [
                  'Yepeng',
                  'Louis'
                ]
              }
            ],
            questionId: 0
          }
        ],
        usersRankedByScore: [
          {
            name: 'Yepeng',
            score: 5
          },
          {
            name: 'Louis',
            score: 2.5
          }
        ]
      });
    });
  });
});
