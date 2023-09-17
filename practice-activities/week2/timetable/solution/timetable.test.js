import { yearInDays } from './timetable';

describe('Year in days ahead', () => {
  const specificDate = new Date(2022, 5, 1);
  test('1 day', () => {
    expect(yearInDays(1, specificDate)).toEqual(2022);
  });
  test('1 year of days', () => {
    expect(yearInDays(365, specificDate)).toEqual(2023);
  });
  test('10 year of days', () => {
    expect(yearInDays(365 * 10, specificDate)).toEqual(2032);
  });
});
