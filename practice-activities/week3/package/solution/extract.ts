import { readFileSync } from 'fs';

type ListifyElement = [string, number];

function mostCommon() {
  const fileData = readFileSync('./shapecolour.json', { encoding: 'utf8' });
  const data = JSON.parse(fileData);

  const common = {};
  for (const d of data) {
    const key = `${d.colour}|${d.shape}`;
    if (!(key in common)) {
      common[key] = 0;
    }
    common[key] += 1;
  }

  const listify: Array<ListifyElement> = [];
  for (const key in common) {
    listify.push([key, common[key]]);
  }

  listify.sort((a: ListifyElement, b: ListifyElement) => b[1] - a[1]);

  const [colour, shape] = listify[0][0].split('|');

  return {
    colour: colour,
    shape: shape,
  };
}

export {
  mostCommon,
};
