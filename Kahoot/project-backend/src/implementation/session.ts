import { parse } from 'json2csv';
import fs from 'fs';
import { getDataV2, setDataV2 } from '../dataStore';
import * as typeV2 from '../interfaceV2';
// import * as hf from '../server/helperfunction';
import HTTPError from 'http-errors';

export function adminQuizViewSessions(authUserId: number, quizId: number) {
  const data = getDataV2();
  const targetUser = data.users.find(user => user.info.authUserId === authUserId);
  const targetQuiz = targetUser.quizzes.find(quiz => quiz.info.quizId === quizId);
  if (!targetQuiz) {
    throw HTTPError(400, 'quiz not found');
  }
  const activeSessions = data.sessionStatus.active.filter(sessionInfo => {
    return sessionInfo.quizId === quizId;
  }).map(sessionInfo => sessionInfo.sessionId).sort((a, b) => a - b);
  const inactiveSessions = data.sessionStatus.inactive.filter(sessionInfo => {
    return sessionInfo.quizId === quizId;
  }).map(sessionInfo => sessionInfo.sessionId).sort((a, b) => a - b);
  return {
    activeSessions: activeSessions,
    inactiveSessions: inactiveSessions
  };
}

export function adminQuizSessionStart(authUserId: number, quizId: number, autoStartNum: number) {
  const data = getDataV2();
  const targetUser = data.users.find(user => user.info.authUserId === authUserId);
  const targetQuiz = targetUser.quizzes.find(quiz => quiz.info.quizId === quizId);
  if (!targetQuiz) {
    throw HTTPError(400, 'quiz not found');
  }

  if (autoStartNum > 50) {
    throw HTTPError(400, 'autoStartNum > 50 not allowed');
  }

  if (adminQuizViewSessions(authUserId, quizId).activeSessions.length >= 10) {
    throw HTTPError(400, 'no more than 10 active sessions allowed');
  }

  if (targetQuiz.info.numQuestions < 1) {
    throw HTTPError(400, 'no question in the quiz');
  }
  data.sessionLength++;
  const questionState : typeV2.QuestionState = {
    starTime: 0,
    playerAnswers: [],
  };
  const questionStates : typeV2.QuestionState[] = [];
  let n = targetQuiz.info.numQuestions;
  while (n > 0) {
    n--;
    questionStates.push(JSON.parse(JSON.stringify(questionState)));
  }
  const newSession : typeV2.Session = {
    sessionId: data.sessionLength,
    countdownId: 0,
    state: 'LOBBY',
    authUserId: authUserId,
    atQuestion: 0,
    autoStart: autoStartNum,
    players: [],
    questionStates: questionStates,
    questionResults: [],
    messages: [],
    metadata: JSON.parse(JSON.stringify(targetQuiz.info))
  };

  data.sessions.push(newSession);
  data.sessionStatus.active.push({
    sessionId: data.sessionLength,
    quizId: quizId
  });

  setDataV2(data);
  // add a call to start question if autoStartNum is 0
  if (autoStartNum === 0) adminQuizSessionUpdate(authUserId, quizId, data.sessionLength, 'NEXT_QUESTION');
  return { sessionId: data.sessionLength };
}

function checkAction(currentState: string, action: string) {
  if (currentState === typeV2.SessionState.LOBBY) {
    if (action === typeV2.SessionAction.END || action === typeV2.SessionAction.NEXT_QUESTION) {
      return true;
    }
    return false;
  }
  if (currentState === typeV2.SessionState.QUESTION_COUNTDOWN) {
    if (action === typeV2.SessionAction.END) {
      return true;
    }
    return false;
  }
  if (currentState === typeV2.SessionState.QUESTION_OPEN) {
    if (action === typeV2.SessionAction.END || action === typeV2.SessionAction.GO_TO_ANSWER) {
      return true;
    }
    return false;
  }
  if (currentState === typeV2.SessionState.QUESTION_CLOSE) {
    return true;
  }
  if (currentState === typeV2.SessionState.ANSWER_SHOW) {
    if (action === typeV2.SessionAction.GO_TO_ANSWER) {
      return false;
    }
    return true;
  }
  if (currentState === typeV2.SessionState.FINAL_RESULTS) {
    if (action === typeV2.SessionAction.END) {
      return true;
    }
    return false;
  }
  return false;
}

function doQuestionResult(session: typeV2.Session) {
  const answerBreakdown : typeV2.AnswerResult[] = session.metadata.questions[session.atQuestion - 1].answers.filter(answer => {
    return answer.correct;
  }).map(answer => {
    return {
      answerId: answer.answerId,
      playersCorrect: [],
    };
  });

  const questionState : typeV2.QuestionState = JSON.parse(JSON.stringify(session.questionStates[session.atQuestion - 1]));
  const playerResults : typeV2.PlayerAnswer[] = questionState.playerAnswers.sort((a, b) => a.timeTaken - b.timeTaken);
  answerBreakdown.forEach(answer => {
    playerResults.forEach(playerResult => {
      if (playerResult.answerIds.find(answerId => answerId === answer.answerId) !== undefined) {
        answer.playersCorrect.push(playerResult.name);
      }
    });
  });

  const targetQuestion = session.metadata.questions[session.atQuestion - 1];
  let totalAnswerTime = 0;
  let counter = 1;
  playerResults.forEach(playerResult => {
    totalAnswerTime += playerResult.timeTaken;
    const numCorrect = playerResult.answerIds.filter(answerId => {
      if (answerBreakdown.find(answer => answer.answerId === answerId) !== undefined) {
        return true;
      } else {
        return false;
      }
    }).length;
    if (numCorrect === answerBreakdown.length && numCorrect === playerResult.answerIds.length) {
      const targetPlayer = session.players.find(player => player.playerId === playerResult.playerId);
      targetPlayer.score = Math.round(100 * (targetPlayer.score + targetQuestion.points) / counter) / 100;
      counter++;
    }
  });
  let averageAnswerTime = 0;
  let percentCorrect = 0;
  if (playerResults.length) {
    averageAnswerTime = Math.round(totalAnswerTime / playerResults.length);
    percentCorrect = Math.round((counter - 1) / playerResults.length * 100);
  }

  const result : typeV2.QuestionResults = {
    questionId: session.metadata.questions[session.atQuestion - 1].questionId,
    questionCorrectBreakdown: answerBreakdown,
    averageAnswerTime: averageAnswerTime,
    percentCorrect: percentCorrect,
  };
  session.questionResults.push(result);
}

function startCountDown(session: typeV2.Session) {
  function switchToOpen() {
    session.questionStates[session.atQuestion - 1].starTime = Math.floor(Date.now() / 1000);
    function switchToClosed() {
      doQuestionResult(session);
      session.state = 'QUESTION_CLOSE';
    }
    session.state = 'QUESTION_OPEN';
    session.countdownId = setTimeout(switchToClosed, session.metadata.questions[session.atQuestion - 1].duration * 1000);
  }
  session.state = 'QUESTION_COUNTDOWN';
  session.countdownId = setTimeout(switchToOpen, typeV2.COUNTDOWN_TIME);
}

export function adminQuizSessionUpdate(authUserId: number, quizId: number, sessionId: number, action: string) {
  const data = getDataV2();
  const targetUser = data.users.find(user => user.info.authUserId === authUserId);
  const targetQuiz = targetUser.quizzes.find(quiz => quiz.info.quizId === quizId);
  if (!targetQuiz) {
    throw HTTPError(400, 'quiz not found');
  }
  const targetSession = data.sessions.find(session => session.sessionId === sessionId);

  if (targetSession.metadata.quizId !== quizId) {
    throw HTTPError(400, 'session not for this quiz');
  }
  if (!checkAction(targetSession.state, action)) {
    throw HTTPError(400, 'action not allowed');
  }

  if (action === typeV2.SessionAction.GO_TO_ANSWER) {
    if (targetSession.state === 'QUESTION_OPEN') {
      doQuestionResult(targetSession);
    }
    clearTimeout(targetSession.countdownId);
    targetSession.state = 'ANSWER_SHOW';
  }

  if (action === typeV2.SessionAction.NEXT_QUESTION) {
    if (targetSession.atQuestion === targetQuiz.info.numQuestions) {
      /* istanbul ignore next */
      throw HTTPError(400, 'this is the last question');
      // action = typeV2.SessionAction.GO_TO_ANSWER;
    } else {
      targetSession.atQuestion++;
      startCountDown(targetSession);
    }
  }

  if (action === typeV2.SessionAction.GO_TO_FINAL_RESULTS) {
    clearTimeout(targetSession.countdownId);
    targetSession.state = 'FINAL_RESULTS';
  }

  if (action === typeV2.SessionAction.END) {
    clearTimeout(targetSession.countdownId);
    const index = data.sessionStatus.active.findIndex(session => session.sessionId === sessionId);
    if (index === -1) console.log('WTF WHY IS THIS');
    data.sessionStatus.inactive.push(data.sessionStatus.active[index]);
    data.sessionStatus.active.splice(index, 1);
    targetSession.state = 'END';
  }
  setDataV2(data);
  return {};
}

export function adminQuizSessionStatus(quizId: number, sessionId: number, authUserId: number) {
  const data = getDataV2();
  // TODO: Quiz ID does not refer to a valid quiz
  const targetUser = data.users.find(user => user.info.authUserId === authUserId);
  const targetQuiz = targetUser.quizzes.find(quiz => quiz.info.quizId === quizId);
  if (targetQuiz === undefined) {
    throw HTTPError(400, 'Quiz ID does not refer to a quiz that this user owns');
  }

  const targetSession = data.sessions.find(session => session.sessionId === sessionId);
  if (targetSession.metadata.quizId !== quizId) {
    throw HTTPError(400, 'Session Id does not refer to a valid session within this quiz');
  }
  return {
    state: targetSession.state,
    atQuestion: targetSession.atQuestion,
    players: targetSession.players,
    metadata: targetSession.metadata,
  };
}

export function adminQuizSessionResults(quizId: number, sessionId: number, authUserId: number) {
  const data = getDataV2();
  const targetUser = data.users.find(user => user.info.authUserId === authUserId);
  const targetQuiz = targetUser.quizzes.find(quiz => quiz.info.quizId === quizId);
  if (!targetQuiz) {
    throw HTTPError(400, 'Quiz ID does not refer to a quiz that this user owns');
  }

  const targetSession = data.sessions.find(session => session.sessionId === sessionId);
  if (targetSession.metadata.quizId !== quizId) {
    throw HTTPError(400, 'Session Id does not refer to a valid session within this quiz');
  }

  if (targetSession.state !== 'FINAL_RESULTS') {
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

export function adminQuizSessionResultsCSV(quizId: number, sessionId: number, authUserId: number) {
  const jsonData = adminQuizSessionResults(quizId, sessionId, authUserId);
  console.log(jsonData);
  const playerData: any = {};
  for (let i = 0; i < jsonData.usersRankedByScore.length; i++) {
    const user = jsonData.usersRankedByScore[i];
    const player = user.name;
    if (!playerData[player]) { // if a player didn't answer any question, their rank is 0
      playerData[player] = {};
    }
    /* istanbul ignore next */
    for (let j = 0; j < Object.keys(playerData[player]).length / 2; j++) {
      if (!playerData[player][`question${j + 1}rank`]) {
        playerData[player][`question${j + 1}rank`] = 0;
      } else {
        playerData[player][`question${j + 1}rank`] = user.score;
      }
    }
  }

  // Convert to an array of objects for json2csv
  const playerDataArray = Object.keys(playerData).map((player) => {
    return { Player: player, ...playerData[player] };
  });

  // Sort by player name
  playerDataArray.sort((a, b) => a.Player.localeCompare(b.Player));

  // Convert to CSV
  const csvData = parse(playerDataArray, { header: true });
  /* istanbul ignore next */
  if (!fs.existsSync('./results')) {
    fs.mkdirSync('./results', { recursive: true });
  }
  fs.writeFileSync(`./results/results_${sessionId}.csv`, csvData);
  return { url: `http://localhost:49153/results/results_${sessionId}.csv` };
}
