const ORIGIN_YEAR = 1970;

const isLeap = y => new Date(y, 1, 29).getDate() === 29;

export function dayToYear(days) {
  let year = ORIGIN_YEAR;
  while (days > 365) {
    if (isLeap(year)) {
      if (days > 366) {
        days -= 366;
        year += 1;
      }
    } else {
      days -= 365;
      year += 1;
    }
  }
  return year;
}
