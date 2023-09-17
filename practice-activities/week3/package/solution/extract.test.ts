import { mostCommon } from './extract';

describe('Most common', () => {
  test('Only output', () => {
    const result = {
      colour: 'green',
      shape: 'hexagon',
    };
    expect(mostCommon()).toEqual(result);
  });
});
