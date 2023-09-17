const ORIGIN_YEAR = 1970;

// Note: Be careful, the solution below will not work for large numbers
// e.g. 40000000000000
const isLeap = y => new Date(y, 1, 29).getDate() === 29;

export function dayToYear(days) {
  let year = ORIGIN_YEAR;
  while (days > 365) {
    if (isLeap(year)) {
      if (days > 366) {
        days -= 366;
        year += 1;
      } else {
        break;
      }
    } else {
      days -= 365;
      year += 1;
    }
  }
  return year;
}

export function dayToYearAlternative(days) {
  let year = ORIGIN_YEAR;
  while (days > 0) {
    // 2 - true === 1, and 2 - false === 2.
    // Fun stuff, but don't do it ever unless you're showing off!
    days = days - 365 - isLeap(year);
    year += days > 0;
  }
  return year;
}
