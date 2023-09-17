/**
 * NOTE: Tests for the checkPassword should be written first,
 * before implementing the function below.
 * @module password
 */

/**
 * Checks the strength of the given password and returns a string
 * to represent the result.
 *
 * The returned string (in Title Case) is based on the requirements below:
 * - "Strong Password"
 *     - at least 12 characters long
 *     - at least  1 number
 *     - at least  1 uppercase letter
 *     - at least  1 lowercase letter
 * - "Moderate Password"
 *     - at least  8 characters long
 *     - at least  1 letter (upper or lower case)
 *     - at least  1 number
 * - "Horrible Password"
 *     - passwords that are exactly any of the top 5 (not 20) passwords
 *     from the 2021 Nordpass Ranking:
*      - https://en.wikipedia.org/wiki/List_of_the_most_common_passwords
 * - "Poor Password"
 *     - any password that is not horrible, moderate or strong.
 *
 * @param {string} password to check
 * @returns {string} string to indicate the strength of the password.
 */
export function checkPassword(password) {
  // FIXME
  const is_num = /[0-9]/.test(password);
  const is_upper = /[A-Z]/.test(password);
  const is_lower = /[a-z]/.test(password);
  const horrible_list = ["123456", "123456789", "12345", "qwerty", "password"];
  const horrible = horrible_list.includes(password)
  if (password.length >= 12 && is_num === true && is_upper === true && is_lower === true) {
    return "Strong Password";
  }

  if (password.length >= 8 && (is_upper === true || is_lower === true) && is_num === true) {
    return "Moderate Password"
  }

  if (horrible === true) {
    return "Horrible Password"
  }
  return "Poor Password";
}

/**
 * Testing will no longer be done in here.
 * See password.test.js
 */
