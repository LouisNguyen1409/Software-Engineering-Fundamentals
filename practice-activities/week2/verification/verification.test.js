import { dayToYear } from './verification';

describe('verification tests', () => {
  test.each([
    { days: 1, year: 1970 }, // "January 1st 1970"
    { days: 366, year: 1971 }, // "January 1st 1971"
    { days: 365 + 365 + 1, year: 1972 }, // "January 1st 1972"
    { days: 365 + 365 + 366 + 1, year: 1973 }, // "January 1st 1973"

    // TODO: Catch bug

  ])('dayToYear($days) => $year', ({ days, year }) => {
    expect(dayToYear(days)).toEqual(year);
  });
});
