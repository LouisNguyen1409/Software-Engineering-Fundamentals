import * as help from '../server/helperfunction';
import { getDataV2, setDataV2 } from '../dataStore';
import * as type from '../interfaceV2';
import HTTPError from 'http-errors';
import { adminQuizSessionUpdate } from './session';

export function playerJoin(sessionId: number, name: string) {
  const data: type.Data = getDataV2();
  const targetSession = data.sessions.find((session: type.Session) => session.sessionId === sessionId);
  const uniqueName = targetSession.players.find((player: type.Player) => player.name === name);

  if (uniqueName !== undefined) {
    throw HTTPError(400, 'Name of user entered is not unique ');
  }

  if (targetSession.state !== type.SessionState.LOBBY) {
    throw HTTPError(400, 'Session is not in LOBBY state');
  }

  if (name === '') {
    name = help.nameGenerator();
  }

  const playerId = data.playerLength;
  data.playerLength += 1;
  targetSession.players.push({
    name: name,
    playerId: playerId,
    score: 0,
  });
  if (targetSession.players.length === targetSession.autoStart) {
    adminQuizSessionUpdate(targetSession.authUserId, targetSession.metadata.quizId, sessionId, 'NEXT_QUESTION');
  }
  setDataV2(data);
  return { playerId: playerId };
}

export function playerStatus(playerId: number) {
  const data: type.Data = getDataV2();
  const targetSession = data.sessions.find((session: type.Session) => session.players.find((player: type.Player) => player.playerId === playerId));
  if (targetSession === undefined) {
    throw HTTPError(400, 'Player ID does not exist');
  }

  return {
    state: targetSession.state,
    numQuestions: targetSession.metadata.numQuestions,
    atQuestion: targetSession.atQuestion,
  };
}

export function playerQuestion(playerId: number, questionPosition: number) {
  const data: type.Data = getDataV2();
  const targetSession = data.sessions.find((session: type.Session) => session.players.find((player: type.Player) => player.playerId === playerId));
  if (targetSession === undefined) {
    throw HTTPError(400, 'Player ID does not exist');
  }
  if (questionPosition < 0 || questionPosition > targetSession.metadata.numQuestions) {
    throw HTTPError(400, 'Question position is not valid for the session this player is in');
  }

  if (targetSession.atQuestion !== questionPosition) {
    throw HTTPError(400, 'Session is not currently on this question');
  }
  if (targetSession.state === type.SessionState.LOBBY || targetSession.state === type.SessionState.END) {
    throw HTTPError(400, 'Session is in LOBBY or END state');
  }
  const targetQuestion = targetSession.metadata.questions[questionPosition - 1];

  return {
    questionId: targetQuestion.questionId,
    question: targetQuestion.question,
    duration: targetQuestion.duration,
    thumbnailUrl: targetQuestion.thumbnailUrl,
    points: targetQuestion.points,
    answers: targetQuestion.answers.map(answer => {
      return {
        answerId: answer.answerId,
        answer: answer.answer,
        colour: answer.colour
      };
    }),
  };
}

export function playerAnswer(playerId: number, questionPosition: number, answerIds: number[]) {
  const time: number = Math.floor(Date.now() / 1000);
  const data: type.Data = getDataV2();
  const targetSession = data.sessions.find((session: type.Session) => session.players.find((player: type.Player) => player.playerId === playerId));
  if (targetSession === undefined) {
    throw HTTPError(400, 'Player ID does not exist');
  }
  const targetPlayer = targetSession.players.find(player => {
    return player.playerId === playerId;
  });
  if (questionPosition < 0 || questionPosition > targetSession.metadata.numQuestions) {
    throw HTTPError(400, 'Question position is not valid for the session this player is in');
  }

  if (targetSession.state !== type.SessionState.QUESTION_OPEN) {
    throw HTTPError(400, 'Session is in LOBBY or END state');
  }

  if (targetSession.atQuestion !== questionPosition) {
    throw HTTPError(400, 'Session is not currently on this question');
  }

  if (answerIds.length < 1) {
    throw HTTPError(400, 'given 0 answerId');
  }

  if (answerIds.find(answerId => {
    if (!targetSession.metadata.questions[targetSession.atQuestion - 1].answers.find(answer => {
      return answer.answerId === answerId;
    })) {
      return true;
    }
    return false;
  })) {
    throw HTTPError(400, 'one or more answerIds is not in this question');
  }
  answerIds.forEach(answerId => {
    if (answerIds.filter(subAnswerId => subAnswerId === answerId).length > 1) {
      throw HTTPError(400, 'duplicate answerIds');
    }
  });
  const index = targetSession.questionStates[targetSession.atQuestion - 1].playerAnswers.findIndex(playerAnswer => {
    return playerAnswer.playerId === playerId;
  });
  const playerAnswer : type.PlayerAnswer = {
    name: targetPlayer.name,
    playerId: playerId,
    answerIds: answerIds,
    timeTaken: Math.round((time - targetSession.questionStates[targetSession.atQuestion - 1].starTime))
  };
  if (index === -1) {
    targetSession.questionStates[targetSession.atQuestion - 1].playerAnswers.push(playerAnswer);
  } else {
    targetSession.questionStates[targetSession.atQuestion - 1].playerAnswers.splice(index, 1, playerAnswer);
  }
  return {};
}

export function playerQuestionResult(playerId: number, questionPosition: number) {
  const data: type.Data = getDataV2();
  const targetSession = data.sessions.find((session: type.Session) => session.players.find((player: type.Player) => player.playerId === playerId));
  if (targetSession === undefined) {
    throw HTTPError(400, 'Player ID does not exist');
  }

  if (targetSession.atQuestion !== questionPosition) {
    throw HTTPError(400, 'Session is not currently on this question');
  }
  /* istanbul ignore next */
  if (questionPosition < 0 || questionPosition > targetSession.metadata.numQuestions) {
    throw HTTPError(400, 'Question position is not valid for the session this player is in');
  }

  if (targetSession.state !== type.SessionState.ANSWER_SHOW) {
    throw HTTPError(400, 'Session is not in ANSWER_SHOW state');
  }
  const targetQuestion = targetSession.metadata.questions[questionPosition - 1];
  const targetQuestionId = targetQuestion.questionId;
  const targetQuestionResult = targetSession.questionResults.find((question) => question.questionId === targetQuestionId);
  return {
    questionId: targetQuestion.questionId,
    questionCorrectBreakdown: targetQuestionResult.questionCorrectBreakdown,
    averageAnswerTime: targetQuestionResult.averageAnswerTime,
    percentCorrect: targetQuestionResult.percentCorrect,
  };
}

export function playerSessionResult(playerId: number) {
  const data: type.Data = getDataV2();
  const targetSession = data.sessions.find((session: type.Session) => session.players.find((player: type.Player) => player.playerId === playerId));
  if (targetSession === undefined) {
    throw HTTPError(400, 'Player ID does not exist');
  }

  if (targetSession.state !== type.SessionState.FINAL_RESULTS) {
    throw HTTPError(400, 'Session is not in FINAL_RESULTS state');
  }
  const sortPlayers = targetSession.players.sort((a, b) => b.score - a.score);
  const rankPlayers = sortPlayers.map((player) => {
    return {
      name: player.name,
      score: player.score
    };
  });
  return {
    usersRankedByScore: rankPlayers,
    questionResults: targetSession.questionResults,
  };
}

export function playerSessionChat(playerId: number) {
  const data: type.Data = getDataV2();
  const targetSession : type.Session = data.sessions.find((session: type.Session) => session.players.find((player: type.Player) => player.playerId === playerId));
  if (targetSession === undefined) {
    throw HTTPError(400, 'Player ID does not exist');
  }
  return { messages: targetSession.messages };
}

export function playerSessionSendChat(playerId: number, message: type.MessageInput) {
  const data: type.Data = getDataV2();
  const targetSession = data.sessions.find((session: type.Session) => session.players.find((player: type.Player) => player.playerId === playerId));
  if (targetSession === undefined) {
    throw HTTPError(400, 'Player ID does not exist');
  }
  const targetplayer = targetSession.players.find((player: type.Player) => player.playerId === playerId);
  const targetName = targetplayer.name;
  const targetTime = Math.floor(Date.now() / 1000);
  if (message.messageBody.length < 1 || message.messageBody.length > 100) {
    throw HTTPError(400, 'Message body is less than 1 character or more than 100 characters');
  }
  const MessageStore : type.Message = {
    messageBody: message.messageBody,
    playerId: playerId,
    playerName: targetName,
    timeSent: targetTime
  };
  targetSession.messages.push(MessageStore);
  return {};
}
