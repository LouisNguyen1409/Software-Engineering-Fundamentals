import fs from 'fs';

import {
  getGameInfo,
  addWord,
  removeWord,
  viewDictionary,
  resetGame,
  loadGame,
  saveGame,
} from './memory';

const PRINT_DELETED_FILENAME_FOR_DEBUGGING = true;

// Helper function to remove all memory_[NAME].json files in
// the current directory.
function removeSavedGames() {
  fs.readdirSync('./')
    .filter(file => /^memory_[a-zA-Z0-9]+\.json$/.test(file))
    .forEach(file => {
      if (PRINT_DELETED_FILENAME_FOR_DEBUGGING) {
        console.log(`REMOVING FILE: ${file}`);
      }
      fs.unlinkSync('./' + file);
    });
}

function clear() {
  removeSavedGames();
  resetGame();
}

beforeAll(() => {
  clear();
});

afterEach(() => {
  clear();
});

describe('addWord', () => {
  test('adding the same word twice', () => {
    expect(() => addWord('hello')).not.toThrow(Error);
    expect(() => addWord('hello')).toThrow(Error);
  });

  test('adding a different word', () => {
    expect(() => addWord('hello')).not.toThrow(Error);
    expect(() => addWord('world')).not.toThrow(Error);
  });

  test('game is inactive', () => {
    expect(() => addWord('hello')).not.toThrow(Error);
    expect(() => addWord('hello')).toThrow(Error);
    expect(() => addWord('hello')).toThrow(Error);
    expect(() => addWord('hello')).toThrow(Error);
    expect(() => addWord('hello')).toThrow(Error);
  });
});

describe('removeWord', () => {
  test('No such word', () => {
    expect(() => removeWord('hello')).toThrow(Error);
  });

  test('Double remove', () => {
    addWord('hello');
    expect(() => removeWord('hello')).not.toThrow(Error);
    expect(() => removeWord('hello')).toThrow(Error);
  });

  test('game is inactive', () => {
    expect(() => removeWord('hello')).toThrow(Error);
    expect(() => removeWord('hello')).toThrow(Error);
    expect(() => removeWord('hello')).toThrow(Error);
    expect(() => removeWord('hello')).toThrow(Error);
  });
});

describe('getGameInfo', () => {
  test('game is active', () => {
    expect(() => addWord('hello')).not.toThrow(Error);
    expect(() => addWord('hello')).toThrow(Error);
    expect(() => addWord('hello')).toThrow(Error);
    expect(() => addWord('hello')).toThrow(Error);
    expect(() => addWord('hello')).toThrow(Error);
    expect(getGameInfo()).toEqual({
      score: 1,
      mistakesRemaining: 0,
      cluesRemaining: 3,
    });
  });
  test('GameInfo is correct', () => {
    expect(() => addWord('hello')).not.toThrow(Error);
    expect(() => addWord('world')).not.toThrow(Error);
    expect(() => addWord('world')).toThrow(Error);
    expect(() => removeWord('hello')).not.toThrow(Error);
    expect(() => addWord('order')).not.toThrow(Error);
    expect(viewDictionary()).toStrictEqual(['world', 'order']);
    expect(() => viewDictionary()).not.toThrow(Error);
    expect(getGameInfo()).toStrictEqual({
      score: 4,
      mistakesRemaining: 2,
      cluesRemaining: 1,
    });
  });
});

describe('viewDictionary', () => {
  test('game is inactive', () => {
    expect(() => addWord('hello')).not.toThrow(Error);
    expect(() => addWord('word')).not.toThrow(Error);
    expect(() => addWord('hello')).toThrow(Error);
    expect(() => addWord('hello')).toThrow(Error);
    expect(() => addWord('hello')).toThrow(Error);
    expect(() => addWord('hello')).toThrow(Error);
    expect(() => viewDictionary()).not.toThrow(Error);
    expect(viewDictionary()).toStrictEqual(['hello', 'word']);
  });

  test('game is active', () => {
    expect(() => addWord('one')).not.toThrow(Error);
    expect(() => addWord('two')).not.toThrow(Error);
    expect(() => addWord('three')).not.toThrow(Error);
    expect(() => viewDictionary()).not.toThrow(Error);
    expect(viewDictionary()).toStrictEqual(['one', 'two', 'three']);
  });

  test('no clues remaining', () => {
    expect(() => addWord('one')).not.toThrow(Error);
    expect(() => addWord('two')).not.toThrow(Error);
    expect(() => addWord('three')).not.toThrow(Error);
    expect(() => viewDictionary()).not.toThrow(Error);
    expect(viewDictionary()).toStrictEqual(['one', 'two', 'three']);
    expect(() => viewDictionary()).not.toThrow(Error);
    expect(() => viewDictionary()).toThrow(Error);
    expect(getGameInfo()).toEqual({
      score: 3,
      mistakesRemaining: 3,
      cluesRemaining: 0,
    });
  });
});

describe('resetGame', () => {
  test('game is inactive', () => {
    expect(() => addWord('hello')).not.toThrow(Error);
    expect(() => addWord('word')).not.toThrow(Error);
    expect(() => addWord('hello')).toThrow(Error);
    expect(() => addWord('hello')).toThrow(Error);
    expect(() => addWord('hello')).toThrow(Error);
    expect(() => addWord('hello')).toThrow(Error);
    resetGame();
    expect(getGameInfo()).toEqual({
      score: 0,
      mistakesRemaining: 3,
      cluesRemaining: 3,
    });
  });

  test('game is active', () => {
    expect(() => addWord('one')).not.toThrow(Error);
    expect(() => addWord('two')).not.toThrow(Error);
    expect(() => addWord('three')).not.toThrow(Error);
    expect(() => viewDictionary()).not.toThrow(Error);
    resetGame();
    expect(getGameInfo()).toEqual({
      score: 0,
      mistakesRemaining: 3,
      cluesRemaining: 3,
    });
  });
});

describe('saveGame', () => {
  test('given name is empty string', () => {
    expect(() => addWord('one')).not.toThrow(Error);
    expect(() => addWord('two')).not.toThrow(Error);
    expect(() => addWord('three')).not.toThrow(Error);
    expect(() => saveGame('')).toThrow(Error);
  });
  test('given name contains invalid characters', () => {
    expect(() => addWord('one')).not.toThrow(Error);
    expect(() => addWord('two')).not.toThrow(Error);
    expect(() => addWord('three')).not.toThrow(Error);
    expect(() => saveGame('!@#$%^&*()')).toThrow(Error);
  });
  test('A game of this name is already saved', () => {
    expect(() => addWord('one')).not.toThrow(Error);
    expect(() => addWord('two')).not.toThrow(Error);
    expect(() => addWord('three')).not.toThrow(Error);
    expect(() => saveGame('test')).not.toThrow(Error);
    expect(() => saveGame('test')).toThrow(Error);
  });

  test('saveGame correct', () => {
    expect(() => addWord('one')).not.toThrow(Error);
    expect(() => addWord('two')).not.toThrow(Error);
    expect(() => addWord('three')).not.toThrow(Error);
    expect(() => saveGame('test')).not.toThrow(Error);
    expect(() => loadGame('test')).not.toThrow(Error);
    expect(getGameInfo()).toEqual({
      score: 3,
      mistakesRemaining: 3,
      cluesRemaining: 3,
    });
  });
});

describe('loadGame', () => {
  test('given name is empty string', () => {
    expect(() => addWord('one')).not.toThrow(Error);
    expect(() => addWord('two')).not.toThrow(Error);
    expect(() => addWord('three')).not.toThrow(Error);
    expect(() => saveGame('test')).not.toThrow(Error);
    expect(() => loadGame('')).toThrow(Error);
  });

  test('given name contains invalid characters', () => {
    expect(() => addWord('one')).not.toThrow(Error);
    expect(() => addWord('two')).not.toThrow(Error);
    expect(() => addWord('three')).not.toThrow(Error);
    expect(() => saveGame('test')).not.toThrow(Error);
    expect(() => loadGame('!@#$%^&*()')).toThrow(Error);
  });

  test('No saved games correspond to the given name', () => {
    expect(() => addWord('one')).not.toThrow(Error);
    expect(() => addWord('two')).not.toThrow(Error);
    expect(() => addWord('three')).not.toThrow(Error);
    expect(() => saveGame('test')).not.toThrow(Error);
    expect(() => loadGame('example')).toThrow(Error);
  });

  test('loadGame correct', () => {
    expect(() => addWord('one')).not.toThrow(Error);
    expect(() => addWord('two')).not.toThrow(Error);
    expect(() => addWord('three')).not.toThrow(Error);
    expect(() => saveGame('test')).not.toThrow(Error);
    expect(() => loadGame('test')).not.toThrow(Error);
    expect(getGameInfo()).toEqual({
      score: 3,
      mistakesRemaining: 3,
      cluesRemaining: 3,
    });
  });
});
