import { load } from 'csv-load-sync';

export function weather(date, location) {
  let sumMin = 0;
  let sumMax = 0;
  let countMin = 0;
  let countMax = 0;

  let specificMin = -1;
  let specificMax = -1;

  date = date.split('-').reverse().join('-');

  const rows = load('weatherAUS.csv');
  for (const row of rows) {
    if (row.Location !== location) {
      continue;
    }
    if (row.MinTemp !== 'NA') {
      sumMin += parseFloat(row.MinTemp);
      countMin++;
    }
    if (row.MaxTemp !== 'NA') {
      sumMax += parseFloat(row.MaxTemp);
      countMax++;
    }
    if (row.Date === date) {
      specificMin = parseFloat(row.MinTemp);
      specificMax = parseFloat(row.MaxTemp);
    }
  }
  if (specificMin === -1 || specificMax === -1 || countMin === 0 || countMax === 0) {
    return [null, null];
  }
  const diffMin = parseFloat((sumMin / countMin - specificMin).toFixed(1));
  const diffMax = parseFloat((sumMax / countMax - specificMax).toFixed(1));
  return [diffMin, diffMax];
}
