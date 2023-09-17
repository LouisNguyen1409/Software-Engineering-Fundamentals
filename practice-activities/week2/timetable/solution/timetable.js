import add from 'date-fns/add/index.js';

/*
  Tells you what year you're in given a number of days to move
  ahead in the future compared to now
*/
function yearInDays(daysAhead, currDate = new Date()) {
  const now = new Date();
  const result = add(now, { days: daysAhead });
  return result.getFullYear();
}

export {
  yearInDays,
};
