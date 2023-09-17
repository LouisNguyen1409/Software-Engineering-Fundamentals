/**
/* Note:
/* - You should *not* need use try/catch in this file - your tests should instead expect an error to be thrown.
/* - The use of try/catch is demonstrated in the file src/game.ts
/*
 */
import fs from 'fs';

interface Game {
  score: number;
  mistakesRemaining: number;
  cluesRemaining: number;
  dictionary: string[];
}

interface GameInfo {
  score: number;
  mistakesRemaining: number;
  cluesRemaining: number;
}

let currentGame: Game = {
  score: 0,
  mistakesRemaining: 3,
  cluesRemaining: 3,
  dictionary: [],
};

export function getGameInfo(): GameInfo {
  return {
    score: currentGame.score,
    mistakesRemaining: currentGame.mistakesRemaining,
    cluesRemaining: currentGame.cluesRemaining,
  };
}

export function addWord(word: string): void {
  if (currentGame.mistakesRemaining === 0) {
    throw new Error('The game is inactive!');
  }
  if (currentGame.dictionary.includes(word)) {
    currentGame.mistakesRemaining -= 1;
    throw new Error('The given word already exists in the current game\'s dictionary!');
  }

  currentGame.dictionary.push(word);
  currentGame.score += 1;
}

export function removeWord(word: string): void {
  if (currentGame.mistakesRemaining === 0) {
    throw new Error('The game is inactive!');
  }
  if (!currentGame.dictionary.includes(word)) {
    currentGame.mistakesRemaining -= 1;
    throw new Error('The given word does not exist in the current game\'s dictionary!');
  }

  currentGame.dictionary = currentGame.dictionary.filter((item) => item !== word);
  currentGame.score += 1;
}

export function viewDictionary(): string[] {
  if (currentGame.mistakesRemaining !== 0) {
    if (currentGame.cluesRemaining === 0) {
      throw new Error('There are no clues remaining during an active game.!');
    }
    currentGame.cluesRemaining -= 1;
  }
  return currentGame.dictionary;
}

export function resetGame() {
  currentGame.cluesRemaining = 3;
  currentGame.mistakesRemaining = 3;
  currentGame.score = 0;
  currentGame.dictionary = [];
}

export function saveGame(name: string) {
  if (name === '') {
    throw new Error('The given name is empty string!');
  }
  if (/^[A-Za-z0-9]*$/.test(name) === false) {
    throw new Error('The given name contains invalid characters!');
  }
  if (fs.existsSync(`./memory_${name}.json`)) {
    throw new Error('A game of this name is already saved!');
  }
  fs.writeFileSync(`./memory_${name}.json`, JSON.stringify(currentGame, null, 2));
}

export function loadGame(name: string) {
  if (name === '') {
    throw new Error('The given name is empty string!');
  }
  if (/^[a-zA-Z0-9]*$/.test(name) === false) {
    throw new Error('The given name contains invalid characters!');
  }
  if (fs.existsSync(`./memory_${name}.json`) === false) {
    throw new Error('No saved games correspond to the given name!');
  }
  currentGame = JSON.parse(fs.readFileSync(`./memory_${name}.json`).toString());
}
