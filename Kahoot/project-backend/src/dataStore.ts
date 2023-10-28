// YOU SHOULD MODIFY THIS OBJECT BELOW
// import * as type from './interface';
import * as typeV2 from './interfaceV2';
import fs from 'fs';
import { adminQuizSessionUpdate } from './implementation/session';

const emptyData : typeV2.Data = {
  users: [],
  tokens: [],
  sessionStatus: {
    active: [],
    inactive: [],
  },
  sessions: [],
  quizLength: 0,
  questionLength: 0,
  answerLength: 0,
  sessionLength: 0,
  playerLength: 0
};

let dataV2 : typeV2.Data;

function retrieveData() {
  // coverage disabled as this is only for when data.json is deleted or does not exist, which will cause an error
  /* istanbul ignore next */
  if (!fs.existsSync('./data.json')) {
    fs.writeFileSync('./data.json', JSON.stringify(emptyData));
  }
  dataV2 = JSON.parse(fs.readFileSync('./data.json').toString());
}

// this function is only executed when server shuts down, for persistence
// only gets executed once
/* istanbul ignore next */
function saveData() {
  // this one is only for server starts then is shut down immediately
  if (dataV2 === undefined) {
    retrieveData();
  }

  // make all ongoing sessions inactive before server shuts down
  // this is because in the test, the sessions are automatically cleared, this aciton is not required in test
  // however in real server, when a server shuts down, it is supposed to move all sessions to END state
  dataV2.sessions.forEach(session => {
    if (session.state !== 'END') {
      adminQuizSessionUpdate(session.authUserId, session.metadata.quizId, session.sessionId, 'END');
    }
  });
  dataV2.tokens = [];
  if (fs.existsSync('./data.json')) {
    fs.writeFileSync('./data.json', JSON.stringify(dataV2, null, 2));
  }
}

// YOU SHOULDNT NEED TO MODIFY THE FUNCTIONS BELOW IN ITERATION 1

/*
Example usage
    let store = getData()
    console.log(store) # Prints { 'names': ['Hayden', 'Tam', 'Rani', 'Giuliana', 'Rando'] }

    names = store.names

    names.pop()
    names.push('Jake')

    console.log(store) # Prints { 'names': ['Hayden', 'Tam', 'Rani', 'Giuliana', 'Jake'] }
    setData(store)
*/

// Use get() to access the data
/**
 * Written by Louis
 * @param {} - None
 * @returns the data object
 */
function getDataV2(): typeV2.Data {
  if (dataV2 === undefined) retrieveData();
  return dataV2;
}

// Use set(newData) to pass in the entire data object, with modifications made
/**
 * Written by Louis
 * sets the data object to the new data object
 * @param {Data} newData - the new data object
 * @returns {} - None
 */
function setDataV2(newData : typeV2.Data) {
  dataV2 = newData;
}

export { getDataV2, setDataV2, retrieveData, saveData };
