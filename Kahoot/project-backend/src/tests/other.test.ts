// import * as other from '../server/helperfunction';
import * as other from '../server/route';
import { Response } from '../interface';

beforeEach(() => {
  other.clear();
});

afterEach(() => {
  other.clear();
});

const ERROR = { error: expect.any(String) };

test('Clear is working correct', () => {
  const user: any = other.adminAuthRegister('willhuynh@gmail.com', 'thisiswill1234', 'William', 'Huynh').body;
  other.adminQuizCreate(user.token, 'Science Quiz2023', 'abcd');
  const response: Response = other.clear();
  expect(response.body).toStrictEqual({});
  expect(response.status).toStrictEqual(200);
  expect(other.adminUserDetails(user.token).body).toStrictEqual(ERROR);
  expect(other.adminQuizList(user.token).body).toStrictEqual(ERROR);
});
