import { getDataV2, setDataV2 } from '../dataStore';
import * as type from '../interface';
import fs from 'fs';
import path from 'path';
import * as typeV2 from '../interfaceV2';

/**
 * Written by Louis
 * This function resets the state of the application
 * back to the start
 * @param {} - none
 * @returns {} - none
 */
export function clear(): type.Empty {
  const data: typeV2.Data = getDataV2();
  data.users = [];
  data.sessionStatus = {
    active: [],
    inactive: []
  };
  data.sessions = [];
  data.answerLength = 0;
  data.questionLength = 0;
  data.tokens = [];
  data.quizLength = 0;
  data.sessionLength = 0;
  data.playerLength = 0;
  setDataV2(data);
  clearThumbnails();
  clearCsv();
  return {};
}

/**
 * Written by Marius
 * This function clears all image thumbnails in ./images
 * @param {} - none
 * @returns {} - none
 */
function clearThumbnails() {
  // next line only executed when theres no directory called image
  // this avoids error if the file is accidentally deleted, but not executed in tests
  /* istanbul ignore next */
  if (!fs.existsSync('./images')) {
    fs.mkdirSync('./images');
  }

  const contents = fs.readdirSync('./images');
  /* istanbul ignore next */
  for (const file of contents) {
    fs.unlink(path.join('./images', file), err => {
      if (err) console.log(err);
    });
  }
}

function clearCsv() {
  // only executes if no such directory
  /* istanbul ignore next */
  if (!fs.existsSync('./results')) {
    fs.mkdirSync('./results');
  }

  const contents = fs.readdirSync('./results');
  /* istanbul ignore next */
  for (const file of contents) {
    fs.unlink(path.join('./results', file), err => {
      if (err) console.log(err);
    });
  }
}
