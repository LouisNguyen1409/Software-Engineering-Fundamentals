/**
 * Add type annotations to function parameters and replace all type stubs 'any'.
 *
 * Note: All functions in this lab are pure functions (https://en.wikipedia.org/wiki/Pure_function)
 * You should NOT introduce a "dataStore" or use any global variables in this file.
 */

export interface Madrigal {
  name: string;
  age: number;
  gift?: string;
}

export interface Song {
  name: string;
  singers: string | string[];
}

export function createMadrigal(name: string, age: number, gift? : string): Madrigal {
  const madrigal: Madrigal = {
    name: name,
    age: age,
  }

  if (gift != undefined) {
    madrigal.gift = gift
  }

  return madrigal;
}

export function createSong(name: string, singers: string | string[]): Song {
  const song: Song = {
    name: name,
    singers: singers,
  }

  return song;
}


export function extractNamesMixed(array: (Madrigal | Song)[]): string[] {
  const new_array: string[] = [];
  for (let index of array) {
    new_array.push(index.name)
  }
  return new_array;
}

export function extractNamesPure(array: Madrigal[] | Song[]): string[] {
  const new_array: string[] = []
  for (let index of array) {
    new_array.push(index.name);
  }
  return new_array;
}

export function madrigalIsSinger(madrigal: Madrigal, song: Song): boolean {
  let return_value: boolean = song.singers.includes(madrigal.name)
  return return_value;
}

export function sortedMadrigals(madrigals: Madrigal[],) {
  madrigals.sort((a, b) => {
    if (a.age - b.age !== 0) {
      return a.age - b.age; 
    }
    const upper_a_name = a.name.toUpperCase();
    const upper_b_name = b.name.toUpperCase();

    if (upper_a_name < upper_b_name) {
      return -1;
    }

    if (upper_a_name < upper_b_name) {
      return 1;
    }
    return 0;
  })
  return madrigals;
}

export function filterSongsWithMadrigals(madrigals: Madrigal[], songs: Song[]): Song[] {
  const song_playlist: Song[] = [];
  for (const song of songs) {
    for (const madrigal of madrigals) {
      if (madrigalIsSinger(madrigal, song) === true) {
        song_playlist.push(song);
        break;
      }
    }
  }
  return song_playlist;
}

export function getMostSpecialMadrigal(madrigals: Madrigal[], songs: Song[]): Madrigal {
  let famous_singer: Madrigal = madrigals[0];
  let max_song: number = 0

  for (let madrigal of madrigals) {
    let num_song: number = 0;
    for (let song of songs) {
      if (madrigalIsSinger(madrigal, song) === true) {
        num_song += 1;
      }
    }
    if (num_song > max_song) {
      max_song = num_song;
      famous_singer = madrigal;
    }
  }
  return famous_singer;
}
