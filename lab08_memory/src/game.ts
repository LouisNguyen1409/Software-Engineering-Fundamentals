/**
 * Optional file for playing the game.
 *
 * The code as already been written - you do not need to
 * modify this file unless you want to.
 *
 * Install the required libraries with
 *     $ npm i prompt-sync random-words@1.3.0
 */

import promptSync from 'prompt-sync';
import randomWords from 'random-words';

import {
  getGameInfo,
  addWord,
  removeWord,
  viewDictionary,
  resetGame,
  loadGame,
  saveGame,
} from './memory';

// ========================================================================= //

// Change this if you want longer/shorter words. Must be at least 2.
const MAX_WORD_LENGTH = 3;

// ========================================================================= //

function handleHelp() {
  console.log(`
=== DISPLAYING HELP ===
|| It is sufficient to type only the first letter of
|| the commands below, e.g. 'h' for 'help'.
|| --------------------
|| help
||    display this help message
|| info
||    return the current game info
|| yes
||    yes, word is not in the dictionary, add it!
|| no
||    no, word is in the dictionary, remove it!
|| view
||    display the dictionary.
|| reset
||    reset the game to the initial state
|| quit
||    exits from the game
|| save NAME
||    saves the state of the game into a JSON file with
||    the added prefix memory_ and extension .json, e.g.
||    memory_NAME.json
|| load NAME
||    loads the state of the game from a file with
||    the added extension .json, e.g. memory_NAME.json
|| clear
||    clears the output in the console, similar to Linux's clear command.
=======================`
  );
}

function getRandomWord() {
  return randomWords({ exactly: 1, maxLength: MAX_WORD_LENGTH })[0];
}

function handleYes(word: string) {
  try {
    addWord(word);
  } catch (e) {
    console.log(`Failed to add '${word}':`, e.message);
  }
}

function handleNo(word: string) {
  try {
    removeWord(word);
  } catch (e) {
    console.log(`Failed to remove '${word}':`, e.message);
  }
}

function handleViewDictionary() {
  try {
    console.log(viewDictionary());
  } catch (e) {
    console.log('Failed to view dictionary:', e.message);
  }
}

function handleSave(name: string) {
  try {
    saveGame(name);
    console.log(`Saving file memory_${name}.json`);
  } catch (e) {
    console.log(`Failed to save game ${name}:`, e.message);
  }
}

function handleLoad(name: string) {
  try {
    loadGame(name);
    console.log(`Loading file memory_${name}.json`);
  } catch (e) {
    console.log(`Failed to load game ${name}:`, e.message);
  }
}

function playGame() {
  const prompt = promptSync();
  console.log('^_^ Welcome to Memory 101! ^_^');
  console.log("Type 'help' to see the list of available commands!");
  console.log();

  let word = getRandomWord();
  while (true) {
    let getNextWord = false;

    const info = getGameInfo();
    const face = info.mistakesRemaining > 0 ? '^_^' : 'T_T';

    console.log(`[${face}] Add '${word}' to dictionary?`);
    const input = prompt('>>> command: ');

    const [command, ...args] = input ? input.split(' ') : [null];

    if (['h', 'help'].includes(command)) {
      handleHelp();
    } else if (['i', 'info'].includes(command)) {
      console.log(info);
    } else if (['v', 'view'].includes(command)) {
      handleViewDictionary();
    } else if (['y', 'yes'].includes(command)) {
      handleYes(word);
      getNextWord = true;
    } else if (['n', 'no'].includes(command)) {
      handleNo(word);
      getNextWord = true;
    } else if (['r', 'reset'].includes(command)) {
      console.log('Resetting game...');
      resetGame();
    } else if (['q', 'quit', null].includes(command)) {
      break;
    } else if (['s', 'save'].includes(command)) {
      handleSave(args[0] ? args[0] : '');
    } else if (['l', 'load'].includes(command)) {
      handleLoad(args[0] ? args[0] : '');
    } else if (['c', 'clear'].includes(command)) {
      console.clear();
    } else {
      console.log(`Unknown command '${command}'. Try 'help' or 'quit'!`);
    }

    if (getNextWord) {
      word = getRandomWord();
    }
    console.log();
  }

  console.log('... Exiting. Thanks for playing!');
}

/**
 * Launch the game! ^_^
 */
playGame();
