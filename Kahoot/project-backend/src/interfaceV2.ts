// Interface for error
/**
 * Written by Louis
 * Interface for error message
 */
export interface ErrorMsg {
  error: string;
}

// Interface for empty
/**
 * Written by Louis
 * Interface for empty
 */
export type Empty = Record<string, never>

// Interface for auth
/**
 * Written by Louis
 * Interface for ReturnToken
 */
export interface ReturnToken {
  token: string;
}

/**
 * Written by Louis
 * Interface for UserDetails
 */
export interface UserDetails {
  user: {
    userId: number,
    name: string,
    email: string,
    numSuccessfulLogins: number,
    numFailedPasswordsSinceLastLogin: number,
  }
}

// Interface for quiz
/**
 * Written by Louis
 * Interface for QuizDetails
 */
export interface QuizDetails {
  quizId: number,
  name: string
}

/**
 * Written by Louis
 * Interface for QuizList
 */
export interface QuizList {
  quizzes: QuizDetails[],
}

/**
 * Written by Louis
 * Interface for QuizId
 */
export interface QuizId {
  quizId: number,
}

/**
 * Written by Louis
 * Interface for Answer
 */
export interface Answer {
  answerId: number,
  answer: string,
  colour: string,
  correct: boolean
}

export interface AnswerDetails {
  answer: string,
  correct: boolean,
}

/**
 * Written by Louis
 * Interface for Question
 */

export interface Question {
  questionId: number,
  question: string,
  duration: number,
  points: number
  answers: Answer[],
  thumbnailUrl: string,
}

/**
 * Written by Louis
 * Interface for QuizInfo
 */

export interface QuizInfo {
  quizId: number,
  name: string,
  timeCreated: number,
  timeLastEdited: number,
  description: string,
  numQuestions: number,
  questions: Question[],
  duration: number,
  thumbnailUrl: string,
}

// Interface for question

/**
 * Written by Louis
 * Interface for QuestionId
 */
export interface QuestionId {
  questionId: number,
}

export const COUNTDOWN_TIME = 100; // in ms

/**
 * Written by Louis
 * Interface for NewQuestionId
 */
export interface NewQuestionId {
  newQuestionId: number,
}

// Interface for data
/**
 * Written by Louis
 * Interface for Quiz
 */

export interface Quiz {
  info: {
      quizId: number,
      name: string,
      timeCreated: number,
      timeLastEdited: number,
      description: string,
      numQuestions: number,
      questions: Question[],
      duration: number,
      thumbnailUrl: string,
  }
}

export const SessionAction = {
  NEXT_QUESTION: 'NEXT_QUESTION',
  GO_TO_ANSWER: 'GO_TO_ANSWER',
  GO_TO_FINAL_RESULTS: 'GO_TO_FINAL_RESULTS',
  END: 'END'
};

export type SessionActionType = 'NEXT_QUESTION' | 'GO_TO_ANSWER' | 'GO_TO_FINAL_RESULTS' | 'END'

/**
 * Written by Yepeng
 */
export const SessionState = {
  LOBBY: 'LOBBY',
  QUESTION_COUNTDOWN: 'QUESTION_COUNTDOWN',
  QUESTION_OPEN: 'QUESTION_OPEN',
  QUESTION_CLOSE: 'QUESTION_CLOSE',
  ANSWER_SHOW: 'ANSWER_SHOW',
  FINAL_RESULTS: 'FINAL_RESULTS',
  END: 'END'
};

export type SessionStateType = 'LOBBY' | 'QUESTION_COUNTDOWN' | 'QUESTION_OPEN' | 'QUESTION_CLOSE' | 'ANSWER_SHOW' | 'FINAL_RESULTS' | 'END'

export interface SessionInfo {
  sessionId: number;
  quizId: number;
}

export interface SessionStatus {
  active: SessionInfo[],
  inactive: SessionInfo[]
}

export interface Player {
  name: string,
  playerId: number,
  score: number
}

export interface AnswerResult {
  answerId: number,
  playersCorrect: string[]
}

export interface QuestionResults {
  questionId: number,
  questionCorrectBreakdown: AnswerResult[],
  averageAnswerTime: number,
  percentCorrect: number
}

export interface PlayerAnswer {
  name: string,
  playerId: number,
  answerIds: number[],
  timeTaken: number,
}

export interface QuestionState {
  starTime: number,
  playerAnswers: PlayerAnswer[]
}

export interface Message {
  messageBody: string,
  playerId: number,
  playerName: string,
  timeSent: number
}

/**
 * Written by Yepeng
 */
export interface Session {
  sessionId: number,
  countdownId: any
  state: SessionStateType;
  authUserId: number,
  atQuestion: number,
  autoStart: number,
  players: Player[],
  questionStates: QuestionState[],
  questionResults: QuestionResults[],
  messages: Message[],
  metadata: QuizInfo
}

/**
 * Written by Louis
 * Interface for Token
 */
export interface Token {
  sessionId: string,
  userId: number
}

/**
 * Written by Louis
 * Interface for Info
 */
export interface Info {
  authUserId: number,
  name: string,
  email: string,
  password: string,
  passwordList: string[],
  numSuccessfulLogins: number,
  numFailedPasswordsSinceLastLogin: number,
}

/**
 * Written by Louis
 * Interface for User
 */
export interface User {
  info: Info,
  quizzes: Quiz[],
  trash: Quiz[],
}

/**
 * Written by Louis
 * Interface for Data
 */
export interface Data {
  users: User[],
  tokens: Token[],
  sessionStatus: SessionStatus,
  sessions: Session[],
  quizLength: number,
  questionLength: number,
  answerLength: number,
  sessionLength: number,
  playerLength: number
}

// Interface for response
/**
 * Written by Louis
 * Interface for Response
 */
export interface Response {
  status: number,
  body: any,
}

/**
 * Written by Yepeng
 * Interface for AnswerBody
 */
export interface AnswerBody {
  answer: string,
  correct: boolean
}

/**
 * Written by Yepeng
 * Interface for QuestionBody
 */
export interface QuestionBody {
  question: string,
  duration: number,
  points: number,
  answers: AnswerBody[],
  thumbnailUrl: string,
}

export interface Payload {
  [key: string]: any;
}

export interface AnswerIds {
  answerIds: number[],
}

/**
 * Interface for player chat
 */
export interface MessageInput {
  messageBody: string,
}
