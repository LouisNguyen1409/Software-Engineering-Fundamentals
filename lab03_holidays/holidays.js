// TODO: Add more imports here.
import promptSync from 'prompt-sync';
import { getValentinesDay, getEaster, getChristmas } from 'date-fns-holiday-us';
import { format } from 'date-fns';
/**
 * Given a starting year and an ending year:
 * - If `start` is not at least 325, return an empty array.
 * - If `start` is strictly greater than `end`, return an empty array.
 * - Otherwise, return an array of objects containing information about the valentine,
 * easter and christmas date strings in the given (inclusive) range.
 *
 * An example format for christmas in 1970 is
 * - Friday, 25.12.1970
 *
 * @param {number} start - starting year, inclusive
 * @param {number} end - ending year, inclusive
 * @returns {Array<{valentinesDay: string, easter: string, christmas: string}>}
 */
export function holidaysInRange(start, end) {
  if (start < 325) {
    return [];
  }
  if (start > end) {
    return [];
  }
  const range = end - start
  const array = []
  for (let i = 0; i <= range; i++) {
    let valentines_day = getValentinesDay(start + i);
    let easter = getEaster(start + i);
    let christmas = getChristmas(start + i);
    array.push({
      valentinesDay: format(valentines_day, 'EEEE, dd.MM.yyyy'),
      easter: format(easter, 'EEEE, dd.MM.yyyy'),
      christmas: format(christmas, 'EEEE, dd.MM.yyyy'),
    })
  }

  return array;
}

/**
 * TODO: Implement the two lines in the "main" function below.
 * This function is imported and called in main.js
 */
export function main() {
  const prompt = promptSync();
  const start = parseInt(prompt("Enter start: ")); // FIXME use prompt and parseInt()
  const end = parseInt(prompt("Enter end: ")); // FIXME use prompt and parseInt()

  const holidays = holidaysInRange(start, end);
  console.log(holidays);
}
