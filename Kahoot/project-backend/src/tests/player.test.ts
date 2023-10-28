const SECONDS = 1000;
jest.setTimeout(100 * SECONDS);

// import * as hf from '../server/helperfunction';
import * as hf from '../server/route';
import HTTPError from 'http-errors';
import * as typeV2 from '../interfaceV2';
const sleep = require('atomic-sleep');
const COUNTDOWN = typeV2.COUNTDOWN_TIME;

beforeEach(() => {
  hf.clear();
});

afterEach(() => {
  hf.clear();
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

describe('playerJoin', () => {
  let user1 : string;
  let quiz1 : number;
  let sessionId: number;
  beforeEach(() => {
    user1 = hf.adminAuthRegister('Louis@gmail.com', 'Louis12321', 'Louis', 'Nguyen').body.token;
    quiz1 = hf.adminQuizCreateV2(user1, 'GeographyGame', '').quizId;
    hf.adminQuestionCreateV2(user1, quiz1, validQuestions[0]);
    hf.adminQuestionCreateV2(user1, quiz1, validQuestions[1]);
    hf.adminQuestionCreateV2(user1, quiz1, validQuestions[2]);
    sessionId = hf.adminQuizSessionStart(user1, quiz1, 3).sessionId;
  });
  test('Successfully joined session with unique name', () => {
    expect(hf.playerJoin(sessionId, 'Louis')).toStrictEqual({ playerId: expect.any(Number) });
  });

  test('AutoStarts when player is enough', () => {
    expect(hf.playerJoin(sessionId, 'Louis')).toStrictEqual({ playerId: expect.any(Number) });
    expect(hf.playerJoin(sessionId, 'Yepeng')).toStrictEqual({ playerId: expect.any(Number) });
    expect(hf.playerJoin(sessionId, 'Marius')).toStrictEqual({ playerId: expect.any(Number) });
  });

  test('Successfully joined session with empty name', () => {
    expect(hf.playerJoin(sessionId, '')).toStrictEqual({ playerId: expect.any(Number) });
  });
  test('Error when joining session with duplicate name', () => {
    hf.playerJoin(sessionId, 'Louis');
    expect(() => hf.playerJoin(sessionId, 'Louis')).toThrow(HTTPError[400]);
  });

  test('Error when joining session is not in LOBBY state', () => {
    hf.adminQuizSessionUpdate(quiz1, sessionId, user1, 'NEXT_QUESTION');
    expect(() => hf.playerJoin(sessionId, 'Louis')).toThrow(HTTPError[400]);
  });
});

describe('playerStatus', () => {
  let user1 : string;
  let quiz1 : number;
  let sessionId: number;
  beforeEach(() => {
    user1 = hf.adminAuthRegister('Louis@gmail.com', 'Louis12321', 'Louis', 'Nguyen').body.token;
    quiz1 = hf.adminQuizCreateV2(user1, 'GeographyGame', '').quizId;
    hf.adminQuestionCreateV2(user1, quiz1, validQuestions[0]);
    hf.adminQuestionCreateV2(user1, quiz1, validQuestions[1]);
    hf.adminQuestionCreateV2(user1, quiz1, validQuestions[2]);
    sessionId = hf.adminQuizSessionStart(user1, quiz1, 3).sessionId;
  });
  test('Successfully get status of player', () => {
    const playerId = hf.playerJoin(sessionId, 'Louis').playerId;
    const sessionInfo = hf.adminQuizSessionStatus(quiz1, sessionId, user1);
    expect(hf.playerStatus(playerId)).toStrictEqual({
      state: sessionInfo.state,
      numQuestions: sessionInfo.metadata.numQuestions,
      atQuestion: sessionInfo.atQuestion,
    });
  });

  test('Error when player ID does not exist', () => {
    expect(() => hf.playerStatus(-1)).toThrow(HTTPError[400]);
  });
});

describe('playerQuestion', () => {
  let user1 : string;
  let quiz1 : number;
  let sessionId: number;
  beforeEach(() => {
    user1 = hf.adminAuthRegister('Louis@gmail.com', 'Louis12321', 'Louis', 'Nguyen').body.token;
    quiz1 = hf.adminQuizCreateV2(user1, 'GeographyGame', '').quizId;
    hf.adminQuestionCreateV2(user1, quiz1, validQuestions[0]);
    hf.adminQuestionCreateV2(user1, quiz1, validQuestions[1]);
    hf.adminQuestionCreateV2(user1, quiz1, validQuestions[2]);
    sessionId = hf.adminQuizSessionStart(user1, quiz1, 3).sessionId;
  });

  test('Successfully get question of player', () => {
    const playerId = hf.playerJoin(sessionId, 'Louis').playerId;
    hf.adminQuizSessionUpdate(quiz1, sessionId, user1, 'NEXT_QUESTION');
    const sessionInfo = hf.adminQuizSessionStatus(quiz1, sessionId, user1);
    const questionInfo : typeV2.Question = sessionInfo.metadata.questions[sessionInfo.atQuestion - 1];
    expect(hf.playerQuestion(playerId, sessionInfo.atQuestion)).toStrictEqual({
      questionId: questionInfo.questionId,
      question: questionInfo.question,
      duration: questionInfo.duration,
      thumbnailUrl: questionInfo.thumbnailUrl,
      points: questionInfo.points,
      answers: questionInfo.answers.map(answer => {
        return {
          answerId: answer.answerId,
          answer: answer.answer,
          colour: answer.colour
        };
      }),
    });
  });

  test('Error when player ID does not exist', () => {
    hf.playerJoin(sessionId, 'Louis');
    const sessionInfo = hf.adminQuizSessionStatus(quiz1, sessionId, user1);
    hf.adminQuizSessionUpdate(quiz1, sessionId, user1, 'NEXT_QUESTION');
    expect(() => hf.playerQuestion(-1, sessionInfo.atQuestion)).toThrow(HTTPError[400]);
  });

  test('Error when question position is not valid for the session this player is in', () => {
    const playerId = hf.playerJoin(sessionId, 'Louis').playerId;
    expect(() => hf.playerQuestion(playerId, -1)).toThrow(HTTPError[400]);
  });

  test('Error when question position is not valid for the session this player is in', () => {
    const playerId = hf.playerJoin(sessionId, 'Louis').playerId;
    expect(() => hf.playerQuestion(playerId, 1000)).toThrow(HTTPError[400]);
  });

  test('Error when session is not currently on this question', () => {
    const playerId = hf.playerJoin(sessionId, 'Louis').playerId;
    hf.adminQuizSessionUpdate(quiz1, sessionId, user1, 'NEXT_QUESTION');
    expect(() => hf.playerQuestion(playerId, 0)).toThrow(HTTPError[400]);
  });

  test('Error when session is in LOBBY state', () => {
    const playerId = hf.playerJoin(sessionId, 'Louis').playerId;
    expect(() => hf.playerQuestion(playerId, 0)).toThrow(HTTPError[400]);
  });

  test('Error when session is in END state', () => {
    const playerId = hf.playerJoin(sessionId, 'Louis').playerId;
    hf.adminQuizSessionUpdate(quiz1, sessionId, user1, 'END');
    expect(() => hf.playerQuestion(playerId, 0)).toThrow(HTTPError[400]);
  });
});

describe('PUT, v1/player/{playerid}/question/{questionposition}/answer', () => {
  let user1 : string;
  let quiz1 : number;
  let question1 : number;
  let question2 : number;
  let session1 : number;
  let player1Id : number;
  let player2Id : number;
  let q1AnswersCorrect : number[];
  let q2AnswersCorrect : number[];
  let q1AnswersWrong : number[];

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
    q2AnswersCorrect = question2Answers.filter(answer => answer.correct === true).map(answer => answer.answerId);
    q1AnswersWrong = question1Answers.filter(answer => answer.correct === false).map(answer => answer.answerId);
  });
  describe('error case:', () => {
    test('If player ID does not exist', (done) => {
      let wrongId = player1Id + 1;
      while (wrongId === player2Id) {
        wrongId++;
      }
      function testMe() {
        const status = hf.adminQuizSessionStatus(quiz1, session1, user1);
        expect(status.atQuestion).toStrictEqual(1);
        expect(status.state).toStrictEqual('QUESTION_OPEN');
        expect(() => hf.playerAnswer(wrongId, 1, q1AnswersCorrect)).toThrow(HTTPError[400]);
        done();
      }
      sleep(COUNTDOWN);
      testMe();
    });

    test('If question position is not valid for the session this player is in', (done) => {
      const testAfterDelay = () => {
        const status = hf.adminQuizSessionStatus(quiz1, session1, user1);
        expect(status.atQuestion).toStrictEqual(1);
        expect(status.state).toStrictEqual('QUESTION_OPEN');
        expect(() => hf.playerAnswer(player1Id, 0, q1AnswersCorrect)).toThrow(HTTPError[400]);
        expect(() => hf.playerAnswer(player1Id, 3, q1AnswersCorrect)).toThrow(HTTPError[400]);
        done();
      };
      sleep(COUNTDOWN);
      testAfterDelay();
    });
    describe('Session is not in QUESTION_OPEN state', () => {
      test('LOBBY', () => {
        const session2 = hf.adminQuizSessionStart(user1, quiz1, 3).sessionId;
        const goodPlayer = hf.playerJoin(session2, 'Yepeng').playerId;
        const status = hf.adminQuizSessionStatus(quiz1, session2, user1);
        expect(status.state).toStrictEqual('LOBBY');
        expect(() => hf.playerAnswer(goodPlayer, status.atQuestion, q1AnswersCorrect)).toThrow(HTTPError[400]);
      });
      test('END', () => {
        const session2 = hf.adminQuizSessionStart(user1, quiz1, 3).sessionId;
        const goodPlayer = hf.playerJoin(session2, 'Yepeng').playerId;
        hf.adminQuizSessionUpdate(quiz1, session2, user1, 'END');
        const status = hf.adminQuizSessionStatus(quiz1, session2, user1);
        expect(status.state).toStrictEqual('END');
        expect(() => hf.playerAnswer(goodPlayer, status.atQuestion, q1AnswersCorrect)).toThrow(HTTPError[400]);
      });
    });
    test('If question position is not valid for the session this player is inIf session is not yet up to this question', (done) => {
      const testAfterDelay = () => {
        const status = hf.adminQuizSessionStatus(quiz1, session1, user1);
        expect(status.atQuestion).toStrictEqual(1);
        expect(status.state).toStrictEqual('QUESTION_OPEN');
        expect(() => hf.playerAnswer(player1Id, 2, q1AnswersCorrect)).toThrow(HTTPError[400]);
        done();
      };
      sleep(COUNTDOWN);
      testAfterDelay();
    });
    test('Answer IDs are not valid for this particular question', (done) => {
      const testAfterDelay = () => {
        const status = hf.adminQuizSessionStatus(quiz1, session1, user1);
        expect(status.atQuestion).toStrictEqual(1);
        expect(status.state).toStrictEqual('QUESTION_OPEN');
        expect(() => hf.playerAnswer(player1Id, 1, q2AnswersCorrect)).toThrow(HTTPError[400]);
        done();
      };
      sleep(COUNTDOWN);
      testAfterDelay();
    });
    test('There are duplicate answer IDs provided', (done) => {
      const testAfterDelay = () => {
        const status = hf.adminQuizSessionStatus(quiz1, session1, user1);
        expect(status.atQuestion).toStrictEqual(1);
        expect(status.state).toStrictEqual('QUESTION_OPEN');
        expect(() => hf.playerAnswer(player1Id, 1, [...q1AnswersCorrect, q1AnswersCorrect[0]])).toThrow(HTTPError[400]);
        done();
      };
      sleep(COUNTDOWN);
      testAfterDelay();
    });

    test('Less than 1 answer ID was submitted', (done) => {
      const testAfterDelay = () => {
        const status = hf.adminQuizSessionStatus(quiz1, session1, user1);
        expect(status.atQuestion).toStrictEqual(1);
        expect(status.state).toStrictEqual('QUESTION_OPEN');
        expect(() => hf.playerAnswer(player1Id, 1, [])).toThrow(HTTPError[400]);
        done();
      };
      sleep(COUNTDOWN);
      testAfterDelay();
    });
  });
  describe('success cases:', () => {
    test('OK', (done) => {
      const testAfterDelay = () => {
        const status = hf.adminQuizSessionStatus(quiz1, session1, user1);
        expect(status.atQuestion).toStrictEqual(1);
        expect(status.state).toStrictEqual('QUESTION_OPEN');
        expect(hf.playerAnswer(player1Id, 1, q1AnswersCorrect)).toStrictEqual({});
        done();
      };
      sleep(COUNTDOWN);
      testAfterDelay();
    });
    test('OK', (done) => {
      const testAfterDelay = () => {
        const status = hf.adminQuizSessionStatus(quiz1, session1, user1);
        expect(status.atQuestion).toStrictEqual(1);
        expect(status.state).toStrictEqual('QUESTION_OPEN');
        expect(hf.playerAnswer(player1Id, 1, q1AnswersWrong)).toStrictEqual({});
        done();
      };
      sleep(COUNTDOWN);
      testAfterDelay();
    });
    test('ANSWER resubmit', (done) => {
      const testAfterDelay = () => {
        const status = hf.adminQuizSessionStatus(quiz1, session1, user1);
        expect(status.atQuestion).toStrictEqual(1);
        expect(status.state).toStrictEqual('QUESTION_OPEN');
        expect(hf.playerAnswer(player1Id, 1, q1AnswersWrong)).toStrictEqual({});
        expect(hf.playerAnswer(player1Id, 1, q1AnswersCorrect)).toStrictEqual({});
        done();
      };
      sleep(COUNTDOWN);
      testAfterDelay();
    });
  });
});

describe('GET, /v1/player/{playerid}/question/{questionposition}/results', () => {
  let user1 : string;
  let quiz1 : number;
  let question1 : number;
  let session1 : number;
  let player1Id : number;
  let player2Id : number;
  let q1AnswersCorrect : number[];
  beforeEach(() => {
    user1 = hf.adminAuthRegister('Yepeng@gmail.com', 'Yepeng12321', 'Yepeng', 'Lin').body.token;
    quiz1 = hf.adminQuizCreateV2(user1, 'GeographyGame', '').quizId;
    question1 = hf.adminQuestionCreateV2(user1, quiz1, validQuestions[0]).questionId;
    hf.adminQuestionCreateV2(user1, quiz1, validQuestions[1]);
    session1 = hf.adminQuizSessionStart(user1, quiz1, 2).sessionId;
    player1Id = hf.playerJoin(session1, 'Yepeng').playerId;
    player2Id = hf.playerJoin(session1, 'Louis').playerId;
    const quizInfo : typeV2.QuizInfo = hf.adminQuizInfoV2(user1, quiz1);
    const question1Answers = quizInfo.questions.find(question => question.questionId === question1).answers;
    q1AnswersCorrect = question1Answers.filter(answer => answer.correct === true).map(answer => answer.answerId);
  });

  test('If player ID does not exist', (done) => {
    let wrongId = player1Id + 1;
    while (wrongId === player2Id) {
      wrongId++;
    }
    function testMe() {
      const status = hf.adminQuizSessionStatus(quiz1, session1, user1);
      expect(status.atQuestion).toStrictEqual(1);
      expect(status.state).toStrictEqual('QUESTION_OPEN');
      expect(() => hf.playerQuestionResult(wrongId, 1)).toThrow(HTTPError[400]);
      done();
    }
    sleep(COUNTDOWN);
    testMe();
  });

  test('If question position is not valid for the session this player is in', (done) => {
    const testAfterDelay = () => {
      const status = hf.adminQuizSessionStatus(quiz1, session1, user1);
      expect(status.atQuestion).toStrictEqual(1);
      expect(status.state).toStrictEqual('QUESTION_OPEN');
      expect(() => hf.playerQuestionResult(player1Id, 0)).toThrow(HTTPError[400]);
      expect(() => hf.playerQuestionResult(player1Id, 3)).toThrow(HTTPError[400]);
      done();
    };
    sleep(COUNTDOWN);
    testAfterDelay();
  });

  describe('Session is not in ANSWER_SHOW state', () => {
    test('LOBBY', () => {
      const session2 = hf.adminQuizSessionStart(user1, quiz1, 3).sessionId;
      const goodPlayer = hf.playerJoin(session2, 'Louis').playerId;
      const status = hf.adminQuizSessionStatus(quiz1, session2, user1);
      expect(status.state).toStrictEqual('LOBBY');
      expect(() => hf.playerQuestionResult(goodPlayer, status.atQuestion)).toThrow(HTTPError[400]);
    });
    test('END', () => {
      const session2 = hf.adminQuizSessionStart(user1, quiz1, 3).sessionId;
      const goodPlayer = hf.playerJoin(session2, 'Louis').playerId;
      hf.adminQuizSessionUpdate(quiz1, session2, user1, 'END');
      const status = hf.adminQuizSessionStatus(quiz1, session2, user1);
      expect(status.state).toStrictEqual('END');
      expect(() => hf.playerQuestionResult(goodPlayer, status.atQuestion)).toThrow(HTTPError[400]);
    });
  });

  test('If question position is not valid for the session this player is in.If session is not yet up to this question', (done) => {
    const testAfterDelay = () => {
      const status = hf.adminQuizSessionStatus(quiz1, session1, user1);
      expect(status.atQuestion).toStrictEqual(1);
      expect(status.state).toStrictEqual('QUESTION_OPEN');
      expect(() => hf.playerQuestionResult(player1Id, 0)).toThrow(HTTPError[400]);
      done();
    };
    sleep(COUNTDOWN);
    testAfterDelay();
  });

  describe('success case:', () => {
    test('OK', () => {
      sleep(COUNTDOWN);
      hf.adminQuizSessionStatus(quiz1, session1, user1);
      expect(hf.playerAnswer(player1Id, 1, q1AnswersCorrect)).toStrictEqual({});
      sleep(500);
      expect(hf.playerAnswer(player2Id, 1, [q1AnswersCorrect[0]])).toStrictEqual({});
      sleep(600);
      hf.adminQuizSessionUpdate(quiz1, session1, user1, 'GO_TO_ANSWER');
      const result = hf.playerQuestionResult(player1Id, 1);
      expect(result.averageAnswerTime).toBeGreaterThanOrEqual(0);
      expect(result.averageAnswerTime).toBeLessThanOrEqual(1);
      expect(result).toStrictEqual({
        averageAnswerTime: expect.any(Number),
        percentCorrect: 100,
        questionCorrectBreakdown: [
          {
            answerId: 0,
            playersCorrect: [
              'Yepeng',
              'Louis'
            ]
          },
        ],
        questionId: 0
      });
    });
  });
});

describe('GET, /v1/player/{playerid}/results', () => {
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
  test('If player ID does not exist', (done) => {
    let wrongId = player1Id + 1;
    while (wrongId === player2Id) {
      wrongId++;
    }
    function testMe() {
      const status = hf.adminQuizSessionStatus(quiz1, session1, user1);
      expect(status.atQuestion).toStrictEqual(1);
      expect(status.state).toStrictEqual('QUESTION_OPEN');
      expect(() => hf.playerSessionResult(wrongId)).toThrow(HTTPError[400]);
      done();
    }
    sleep(COUNTDOWN);
    testMe();
  });

  describe('Session is not in FINAL_RESULTS state', () => {
    test('LOBBY', () => {
      const session2 = hf.adminQuizSessionStart(user1, quiz1, 3).sessionId;
      const goodPlayer = hf.playerJoin(session2, 'Louis').playerId;
      const status = hf.adminQuizSessionStatus(quiz1, session2, user1);
      expect(status.state).toStrictEqual('LOBBY');
      expect(() => hf.playerQuestionResult(goodPlayer, status.atQuestion)).toThrow(HTTPError[400]);
    });
    test('END', () => {
      const session2 = hf.adminQuizSessionStart(user1, quiz1, 3).sessionId;
      const goodPlayer = hf.playerJoin(session2, 'Louis').playerId;
      hf.adminQuizSessionUpdate(quiz1, session2, user1, 'END');
      const status = hf.adminQuizSessionStatus(quiz1, session2, user1);
      expect(status.state).toStrictEqual('END');
      expect(() => hf.playerSessionResult(goodPlayer)).toThrow(HTTPError[400]);
    });
  });

  describe('success case:', () => {
    test('OK', () => {
      sleep(COUNTDOWN);
      expect(() => hf.adminQuizSessionUpdate(quiz1, session1, user1, 'GO_TO_FINAL_RESULTS')).toThrow(HTTPError[400]);
      hf.adminQuizSessionStatus(quiz1, session1, user1);
      expect(hf.playerAnswer(player1Id, 1, q1AnswersCorrect)).toStrictEqual({});
      sleep(500);
      expect(hf.playerAnswer(player2Id, 1, [q1AnswersCorrect[0]])).toStrictEqual({});
      sleep(600);
      hf.adminQuizSessionUpdate(quiz1, session1, user1, 'GO_TO_FINAL_RESULTS');
      const result = hf.playerSessionResult(player1Id);
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

describe('playerSessionSendChat', () => {
  let user1 : string;
  let quiz1 : number;
  let sessionId: number;
  let messageBody1 : typeV2.MessageInput;
  let messageBody2 : typeV2.MessageInput;
  let messageBody3 : typeV2.MessageInput;
  beforeEach(() => {
    user1 = hf.adminAuthRegister('Violet@gmail.com', 'Violet12321', 'Violet', 'Nwe').body.token;
    quiz1 = hf.adminQuizCreateV2(user1, 'GeographyGame', '').quizId;
    hf.adminQuestionCreateV2(user1, quiz1, validQuestions[0]);
    hf.adminQuestionCreateV2(user1, quiz1, validQuestions[1]);
    hf.adminQuestionCreateV2(user1, quiz1, validQuestions[2]);
    sessionId = hf.adminQuizSessionStart(user1, quiz1, 3).sessionId;

    messageBody1 = {
      messageBody: 'Hello everyone! Nice to chat.'
    };
    messageBody2 = {
      messageBody: ''

    };
    messageBody3 = {
      messageBody: `asjfhuasdhfuasdhfjkasdhfjdsajkfdhsjf
                    xzddsujfujsdhfjrshjfgshjfsdfjghjsdfhgfsdfhgffsdjkshfgjksdfhgf`
    };
  });
  test('Successfully sent chat', () => {
    const playerId = hf.playerJoin(sessionId, 'Violet').playerId;
    expect(hf.playerSessionSendChat(playerId, messageBody1)).toStrictEqual({});
  });
  test('Error when player ID does not exist', () => {
    const playerId = hf.playerJoin(sessionId, 'Violet').playerId;
    expect(() => hf.playerSessionSendChat(playerId + 1, messageBody1)).toThrow(HTTPError[400]);
  });
  test('Error when message body is less than 1 character', () => {
    const playerId = hf.playerJoin(sessionId, 'Violet').playerId;
    expect(() => hf.playerSessionSendChat(playerId, messageBody2)).toThrow(HTTPError[400]);
  });
  test('Error when message body is more than 100 characters', () => {
    const playerId = hf.playerJoin(sessionId, 'Violet').playerId;
    expect(() => hf.playerSessionSendChat(playerId, messageBody3)).toThrow(HTTPError[400]);
  });
});

describe('playerSessionSendChat', () => {
  let user1 : string;
  let quiz1 : number;
  let sessionId: number;
  const messageBody1 = {
    messageBody: 'Hello everyone! Nice to chat.'
  };
  const messageBody2 = {
    messageBody: ''
  };
  const messageBody3 = {
    messageBody: 'this is 100000000000a charthis is 100000000000a charthis is 100000000000a charthis is 100000000000a charthis is 100000000000a charthis is 100000000000a char',
  };
  beforeEach(() => {
    user1 = hf.adminAuthRegister('Violet@gmail.com', 'Violet12321', 'Violet', 'Nwe').body.token;
    quiz1 = hf.adminQuizCreateV2(user1, 'GeographyGame', '').quizId;
    hf.adminQuestionCreateV2(user1, quiz1, validQuestions[0]);
    hf.adminQuestionCreateV2(user1, quiz1, validQuestions[1]);
    hf.adminQuestionCreateV2(user1, quiz1, validQuestions[2]);
    sessionId = hf.adminQuizSessionStart(user1, quiz1, 3).sessionId;
  });
  test('Successfully sent chat', () => {
    const playerId = hf.playerJoin(sessionId, 'Violet').playerId;
    expect(hf.playerSessionSendChat(playerId, messageBody1)).toStrictEqual({});
  });
  test('Error when player ID does not exist', () => {
    const playerId = hf.playerJoin(sessionId, 'Violet').playerId;
    expect(() => hf.playerSessionSendChat(playerId + 1, messageBody1)).toThrow(HTTPError[400]);
  });
  test('Error when message body is less than 1 character', () => {
    const playerId = hf.playerJoin(sessionId, 'Violet').playerId;
    expect(() => hf.playerSessionSendChat(playerId, messageBody2)).toThrow(HTTPError[400]);
  });
  test('Error when message body is more than 100 characters', () => {
    const playerId = hf.playerJoin(sessionId, 'Violet').playerId;
    expect(() => hf.playerSessionSendChat(playerId, messageBody3)).toThrow(HTTPError[400]);
  });
});

describe('GET, /v1/player/{playerid}/chat', () => {
  let user1 : string;
  let quiz1 : number;
  let sessionId: number;
  let playerId: number;
  const messageBody1 = {
    messageBody: 'Hello everyone! Nice to chat.'
  };
  const messageBody2 = {
    messageBody: 'Idk this cant be empty'
  };
  const messageBody3 = {
    messageBody: 'please get it right this time'
  };
  beforeEach(() => {
    user1 = hf.adminAuthRegister('Violet@gmail.com', 'Violet12321', 'Violet', 'Nwe').body.token;
    quiz1 = hf.adminQuizCreateV2(user1, 'GeographyGame', '').quizId;
    hf.adminQuestionCreateV2(user1, quiz1, validQuestions[0]);
    hf.adminQuestionCreateV2(user1, quiz1, validQuestions[1]);
    hf.adminQuestionCreateV2(user1, quiz1, validQuestions[2]);
    sessionId = hf.adminQuizSessionStart(user1, quiz1, 3).sessionId;
    playerId = hf.playerJoin(sessionId, 'Violet').playerId;
  });
  describe('error case:', () => {
    test('If player ID does not exist', () => {
      hf.playerSessionSendChat(playerId, messageBody1);
      expect(() => hf.playerSessionChat(playerId + 1)).toThrow(HTTPError[400]);
    });
  });
  describe('success case:', () => {
    test('OK', () => {
      const time1 = Math.floor(Date.now() / 1000);
      sleep(1000);
      hf.playerSessionSendChat(playerId, messageBody1);
      let response = hf.playerSessionChat(playerId);
      expect(response).toStrictEqual({
        messages: [
          {
            messageBody: messageBody1.messageBody,
            playerId: playerId,
            playerName: 'Violet',
            timeSent: expect.any(Number),
          }
        ]
      });
      expect(response.messages[0].timeSent).toBeGreaterThan(time1);
      const time2 = Math.floor(Date.now() / 1000);
      sleep(1000);
      hf.playerSessionSendChat(playerId, messageBody2);
      response = hf.playerSessionChat(playerId);
      expect(response).toStrictEqual({
        messages: [
          {
            messageBody: messageBody1.messageBody,
            playerId: playerId,
            playerName: 'Violet',
            timeSent: expect.any(Number),
          },
          {
            messageBody: messageBody2.messageBody,
            playerId: playerId,
            playerName: 'Violet',
            timeSent: expect.any(Number),
          }
        ]
      });
      expect(response.messages[1].timeSent).toBeGreaterThan(time2);

      const time3 = Math.floor(Date.now() / 1000);
      sleep(1000);
      hf.playerSessionSendChat(playerId, messageBody3);
      response = hf.playerSessionChat(playerId);
      expect(response).toStrictEqual({
        messages: [
          {
            messageBody: messageBody1.messageBody,
            playerId: playerId,
            playerName: 'Violet',
            timeSent: expect.any(Number),
          },
          {
            messageBody: messageBody2.messageBody,
            playerId: playerId,
            playerName: 'Violet',
            timeSent: expect.any(Number),
          },
          {
            messageBody: messageBody3.messageBody,
            playerId: playerId,
            playerName: 'Violet',
            timeSent: expect.any(Number),
          }
        ]
      });
      expect(response.messages[2].timeSent).toBeGreaterThan(time3);
    });
  });
});
