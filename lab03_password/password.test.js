/**
 * @see password
 * @module password.test
 *
 * TIP: you are highly encouraged to look into test.each, test.only, test.skip, test.todo
 * from the jest documentations: https://jestjs.io/docs/api
 */

import { checkPassword } from './password';




// You can remove or replace this with your own tests.
// TIP: you may want to explore "test.each"
describe('Example block of tests', () => {
  test('Example test 1', () => {
    expect(checkPassword('something')).toEqual('Poor Password');
  });

  test('Example test 2', () => {
    expect(checkPassword('not a good test')).toEqual('Poor Password');
  });
});



describe("Testing for Strong Password", () => {
  test("Strong Password", () => {
    expect(checkPassword('Louis15072023')).toEqual("Strong Password");
  })
  test("Strong Password with symbols", () => {
    expect(checkPassword('Lo1<>?:":"~!')).toEqual("Strong Password");
  })
  test("Moderate Password with lower", () => {
    expect(checkPassword('louis1507')).toEqual("Moderate Password");
  })
  test("Moderate Password with symbols", () => {
    expect(checkPassword('~!@#$4Td')).toEqual("Moderate Password");
  })
  test("Moderate Password with upper", () => {
    expect(checkPassword('LOUIS1507')).toEqual("Moderate Password");
  })
  test("Horrible Password with words", () => {
    expect(checkPassword('password')).toEqual("Horrible Password");
  })
  test("Horrible Password with numbers", () => {
    expect(checkPassword('123456')).toEqual("Horrible Password");
  })
  test("Poor Password with words", () => {
    expect(checkPassword('hdfasjhfasjkhfasdhnfajksdhfj')).toEqual("Poor Password");
  })  
  test("Poor Password with numbers", () => {
    expect(checkPassword('83')).toEqual("Poor Password");
  })
  test("Poor Password with symbols", () => {
    expect(checkPassword('!@#$%^&*()_+')).toEqual("Poor Password");
  })
})
