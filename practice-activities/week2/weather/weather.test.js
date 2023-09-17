import { weather } from './weather';

test.each([
  { date: '08-08-9999', location: 'Albury', expected: [null, null] },
  { date: '08-08-2010', location: 'New York', expected: [null, null] },
  { date: '08-08-2010', location: 'Albury', expected: [10.8, 10.0] },
  { date: '07-08-2010', location: 'Richmond', expected: [11.3, 8.3] },
  { date: '04-12-2008', location: 'Newcastle', expected: [5.5, 0.1] },
])('weather($date, location=$location) => $expected', ({ date, location, expected }) => {
  expect(weather(date, location)).toEqual(expected);
});
