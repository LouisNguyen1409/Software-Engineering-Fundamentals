test('Please replace this with new v2 route tests', () => {
  expect(1 + 1).toEqual(2);
});

// import * as quiz from '../server/helperfunction';
import * as quiz from '../server/route';
import * as type from '../interface';

const ERROR = { error: expect.any(String) };

beforeEach(() => {
  quiz.clear();
});

afterEach(() => {
  quiz.clear();
});

describe('testing for GET route: /v1/admin/quiz/list', () => {
  let user1 : string;
  beforeEach(() => {
    user1 = quiz.adminAuthRegister('Yepeng@gmail.com', 'Yepeng12321', 'Yepeng', 'Lin').body.token;
  });

  test('error case: invalid token 1', () => {
    const res: type.Response = quiz.adminQuizList('');
    expect(res.status).toStrictEqual(401);
    expect(res.body).toStrictEqual(ERROR);
  });

  test('error case: invalid token 2', () => {
    const res: type.Response = quiz.adminQuizList(null);
    expect(res.status).toStrictEqual(401);
    expect(res.body).toStrictEqual(ERROR);
  });

  test('error case: valid token but does not refer to a currently logged in session', () => {
    quiz.adminAuthLogout(user1);
    const res: type.Response = quiz.adminQuizList(user1);
    expect(res.status).toStrictEqual(403);
    expect(res.body).toStrictEqual(ERROR);
  });

  test('success case: successfully received a list of quizzes', () => {
    let res = quiz.adminQuizList(user1);
    const expectObject: type.QuizList = {
      quizzes: []
    };
    const names: {name : string}[] = [
      { name: 'Science Quiz2023' },
      { name: 'Math Challenge' },
      { name: 'History Trivia' },
      { name: 'Literature Test' },
      { name: 'English Vocabulary' },
      { name: 'Geography Quiz' },
      { name: 'Sports Trivia' },
      { name: 'Music Knowledge' },
      { name: 'General Knowledge' },
      { name: 'Coding Challenge' },
      { name: 'Art Appreciation' },
      { name: 'Movie Trivia' },
      { name: 'Science Fiction Quiz' },
      { name: 'Logic Puzzle' }
    ];

    const sortQuizzes: any = (quiz1: type.QuizDetails, quiz2:type.QuizDetails) => {
      if (JSON.stringify(quiz1) < JSON.stringify(quiz2)) return -1;
      return 1;
    };

    for (const object of names) {
      res = quiz.adminQuizList(user1);
      expect(res.status).toStrictEqual(200);
      expect(res.body.quizzes.sort(sortQuizzes)).toStrictEqual(expectObject.quizzes.sort(sortQuizzes));
      const name: string = object.name;
      const quizId: number = quiz.adminQuizCreate(user1, name, '').body.quizId;
      expectObject.quizzes.push({
        quizId: quizId,
        name: name
      });
    }
    res = quiz.adminQuizList(user1);
    expect(res.status).toStrictEqual(200);
    expect(res.body.quizzes.sort(sortQuizzes)).toStrictEqual(expectObject.quizzes.sort(sortQuizzes));
  });
});

describe('testing for POST route: /v1/admin/quiz', () => {
  const SUCCESS: type.QuizId = { quizId: expect.any(Number) };
  let userToken: string;
  beforeEach(() => {
    userToken = quiz.adminAuthRegister('Yepeng@gmail.com', 'Password1234', 'Yepeng', 'Lin').body.token;
  });

  test.each([
    { token: '' },
    { token: null },
  ])('error case: invalid token structure', ({ token }) => {
    const res: type.Response = quiz.adminQuizCreate(token, 'name', '');
    expect(res.status).toStrictEqual(401);
    expect(res.body).toStrictEqual(ERROR);
  });

  test('error case: valid token structure but does not refer to a logged in session', () => {
    quiz.adminAuthLogout(userToken);
    const res: type.Response = quiz.adminQuizCreate(userToken, 'name', '');
    expect(res.status).toStrictEqual(403);
    expect(res.body).toStrictEqual(ERROR);
  });

  test.each([
    { name: 'Quiz!Name' },
    { name: 'Name_With_Underscore' },
    { name: 'My Quiz@2023' },
    { name: "Jane's Quiz" },
    { name: 'My/Quiz' },
    { name: 'Quiz: Star Wars' },
  ])('error case: invalid name-names containing non-alphanumeric characters', ({ name }) => {
    const res: type.Response = quiz.adminQuizCreate(userToken, name, '');
    expect(res.status).toStrictEqual(400);
    expect(res.body).toStrictEqual(ERROR);
  });

  test.each([
    { name: 'Qz' }, // (less than 3 characters)
    { name: 'This name is very long and certainly exceeds the maximum number of allowed characters' }, // (more than 30 characters)
    { name: 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz' }, // (more than 30 characters)
    { name: 'ab' } // (less than 3 characters)
  ])('error case: invalid name-names less than 3 characters long or more than 30 characters long', ({ name }) => {
    const res: type.Response = quiz.adminQuizCreate(userToken, name, '');
    expect(res.status).toStrictEqual(400);
    expect(res.body).toStrictEqual(ERROR);
  });

  test('error case: invalid name-name is already used by the current logged in user for another quiz', () => {
    quiz.adminQuizCreate(userToken, 'ScienceQuiz2023', '');
    const res: type.Response = quiz.adminQuizCreate(userToken, 'ScienceQuiz2023', '');
    expect(res.status).toStrictEqual(400);
    expect(res.body).toStrictEqual(ERROR);
  });

  test('error case: description is more than 100 characters in length', () => {
    const description = 'The greatest glory in living lies not in never falling, but in rising every time we fall. - Nelson Mandela';
    const res: type.Response = quiz.adminQuizCreate(userToken, 'ScienceQuiz2023', description);
    expect(res.status).toStrictEqual(400);
    expect(res.body).toStrictEqual(ERROR);
  });

  test.each([
    { name: 'Science Quiz2023' },
    { name: 'Math Challenge' },
    { name: 'History Trivia' },
    { name: 'Literature Test' },
  ])('successful quiz creation', ({ name }) => {
    const res: type.Response = quiz.adminQuizCreate(userToken, name, '');
    expect(res.status).toStrictEqual(200);
    expect(res.body).toStrictEqual(SUCCESS);
  });
});

describe('testing for DELETE route: /v1/admin/quiz/{quizId}', () => {
  const SUCCESS: type.Empty = {};
  let user1 : any;
  let user2 : any;
  let quiz1 : any;
  let quiz2 : any;

  beforeEach(() => {
    user1 = quiz.adminAuthRegister('Yepeng@gmail.com', 'Yepeng12321', 'Yepeng', 'Lin').body.token;
    // user2 = adminAuthRegister('Hayden@gmail.com', 'Hayden12321', 'Hayden', 'Smith').body.token;
    quiz1 = quiz.adminQuizCreate(user1, 'GeographyGame', '').body.quizId;
    // quiz2 = adminQuizCreate(user2, 'LiteratureTest', '').body.quizId;
  });

  test('error case: invalid token 1', () => {
    const res: type.Response = quiz.adminQuizRemove('', quiz1);
    expect(res.status).toStrictEqual(401);
    expect(res.body).toStrictEqual(ERROR);
  });

  test('error case: invalid token ', () => {
    const res: type.Response = quiz.adminQuizRemove(null, quiz1);
    expect(res.status).toStrictEqual(401);
    expect(res.body).toStrictEqual(ERROR);
  });

  test('error case: valid token but does not refer to a currently logged in session', () => {
    quiz.adminAuthLogout(user1);
    const res: type.Response = quiz.adminQuizRemove(user1, quiz1);
    expect(res.status).toStrictEqual(403);
    expect(res.body).toStrictEqual(ERROR);
  });

  test('error case: invalid quizId', () => {
    const res: type.Response = quiz.adminQuizRemove(user1, quiz1 + 1);
    expect(res.status).toStrictEqual(400);
    expect(res.body).toStrictEqual(ERROR);
  });

  test('error case: quizId does not refer to a quiz owned by this user', () => {
    user2 = quiz.adminAuthRegister('Hayden@gmail.com', 'Hayden12321', 'Hayden', 'Smith').body.token;
    quiz2 = quiz.adminQuizCreate(user2, 'LiteratureTest', '').body.quizId;

    const res1: type.Response = quiz.adminQuizRemove(user1, quiz2);
    const res2: type.Response = quiz.adminQuizRemove(user2, quiz1);
    expect(res1.body).toStrictEqual(ERROR);
    expect(res1.status).toStrictEqual(400);
    expect(res2.body).toStrictEqual(ERROR);
    expect(res2.status).toStrictEqual(400);
  });

  test('successful removal', () => {
    user2 = quiz.adminAuthRegister('Hayden@gmail.com', 'Hayden12321', 'Hayden', 'Smith').body.token;
    quiz2 = quiz.adminQuizCreate(user2, 'LiteratureTest', '').body.quizId;

    const res1: type.Response = quiz.adminQuizRemove(user1, quiz1);
    const res2: type.Response = quiz.adminQuizRemove(user2, quiz2);

    expect(res1.body).toStrictEqual(SUCCESS);
    expect(res1.status).toStrictEqual(200);
    expect(res2.body).toStrictEqual(SUCCESS);
    expect(res2.status).toStrictEqual(200);
  });
});

describe('testing for GET route: /v1/admin/quiz/{quizId}', () => {
  let user1 : string;
  let user2 : string;
  let quiz1 : number;
  let quiz2 : number;
  let quiz1TimeCreated: number;

  beforeEach(() => {
    user1 = quiz.adminAuthRegister('Yepeng@gmail.com', 'Yepeng12321', 'Yepeng', 'Lin').body.token;
    // user2 = adminAuthRegister('Hayden@gmail.com', 'Hayden12321', 'Hayden', 'Smith').body.token;
    quiz1 = quiz.adminQuizCreate(user1, 'GeographyGame', '').body.quizId;
    quiz1TimeCreated = Math.floor(Date.now() / 1000);
    // quiz2 = adminQuizCreate(user2, 'LiteratureTest', '').body.quizId;
  });

  test('error case: invalid token 1', () => {
    const res: type.Response = quiz.adminQuizInfo('', quiz1);
    expect(res.status).toStrictEqual(401);
    expect(res.body).toStrictEqual(ERROR);
  });

  test('error case: invalid token 2', () => {
    const res: type.Response = quiz.adminQuizInfo(null, quiz1);
    expect(res.status).toStrictEqual(401);
    expect(res.body).toStrictEqual(ERROR);
  });

  test('error case: valid token but does not refer to a currently logged in session', () => {
    quiz.adminAuthLogout(user1);
    const res: type.Response = quiz.adminQuizInfo(user1, quiz1);
    expect(res.status).toStrictEqual(403);
    expect(res.body).toStrictEqual(ERROR);
  });

  test('error case: quizId does not exist', () => {
    const res: type.Response = quiz.adminQuizInfo(user1, quiz1 + 1);
    expect(res.status).toStrictEqual(400);
    expect(res.body).toStrictEqual(ERROR);
  });

  test('error case: quizId does not refer to a quiz owned by this user', () => {
    user2 = quiz.adminAuthRegister('Hayden@gmail.com', 'Hayden12321', 'Hayden', 'Smith').body.token;
    quiz2 = quiz.adminQuizCreate(user2, 'LiteratureTest', '').body.quizId;

    const res1: type.Response = quiz.adminQuizInfo(user1, quiz2);
    const res2: type.Response = quiz.adminQuizInfo(user2, quiz1);
    expect(res1.body).toStrictEqual(ERROR);
    expect(res1.status).toStrictEqual(400);
    expect(res2.body).toStrictEqual(ERROR);
    expect(res2.status).toStrictEqual(400);
  });
  test('success case: received quiz information', () => {
    const res: type.Response = quiz.adminQuizInfo(user1, quiz1);
    expect(res.status).toStrictEqual(200);
    const expectedResponse: type.QuizInfo = {
      quizId: quiz1,
      name: 'GeographyGame',
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: '',
      numQuestions: 0,
      questions: [],
      duration: 0
    };
    expect(res.body).toStrictEqual(expectedResponse);
    expect(res.body.timeCreated).toBeGreaterThanOrEqual(quiz1TimeCreated - 1);
    expect(res.body.timeCreated).toBeLessThanOrEqual(quiz1TimeCreated + 1);
    expect(res.body.timeLastEdited).toBeGreaterThanOrEqual(quiz1TimeCreated - 1);
    expect(res.body.timeLastEdited).toBeLessThanOrEqual(quiz1TimeCreated + 1);
  });
});

describe('testing for PUT route: /v1/admin/quiz/{quizId}/name', () => {
  const SUCCESS: type.Empty = {};
  let user1 : string;
  let user2 : string;
  let quiz1 : number;
  let quiz2 : number;
  let quiz1TimeCreated: number;
  let quiz1TimeLastEdited: number;

  beforeEach(() => {
    user1 = quiz.adminAuthRegister('Yepeng@gmail.com', 'Yepeng12321', 'Yepeng', 'Lin').body.token;
    // user2 = adminAuthRegister('Hayden@gmail.com', 'Hayden12321', 'Hayden', 'Smith').body.token;
    quiz1 = quiz.adminQuizCreate(user1, 'GeographyGame', '').body.quizId;
    quiz1TimeCreated = Math.floor(Date.now() / 1000);
    quiz1TimeLastEdited = quiz1TimeCreated;
    // quiz2 = adminQuizCreate(user2, 'LiteratureTest', '').body.quizId;
  });

  test('error case: invalid token', () => {
    const res: type.Response = quiz.adminQuizNameUpdate('', quiz1, 'Math Challenge');
    expect(res.status).toStrictEqual(401);
    expect(res.body).toStrictEqual(ERROR);

    const info: any = quiz.adminQuizInfo(user1, quiz1).body;
    expect(info.name).toStrictEqual('GeographyGame');
    expect(info.timeLastEdited).toBeGreaterThanOrEqual(quiz1TimeCreated - 1);
    expect(info.timeLastEdited).toBeLessThanOrEqual(quiz1TimeCreated + 1);
  });

  test('error case: invalid token', () => {
    const res: type.Response = quiz.adminQuizNameUpdate(null, quiz1, 'Math Challenge');
    expect(res.status).toStrictEqual(401);
    expect(res.body).toStrictEqual(ERROR);

    const info: any = quiz.adminQuizInfo(user1, quiz1).body;
    expect(info.name).toStrictEqual('GeographyGame');
    expect(info.timeLastEdited).toBeGreaterThanOrEqual(quiz1TimeCreated - 1);
    expect(info.timeLastEdited).toBeLessThanOrEqual(quiz1TimeCreated + 1);
  });

  test('error case: valid token but does not refer to a currently logged in session', () => {
    quiz.adminAuthLogout(user1);
    const res: type.Response = quiz.adminQuizNameUpdate(user1, quiz1, 'Math Challenge');
    expect(res.status).toStrictEqual(403);
    expect(res.body).toStrictEqual(ERROR);

    user1 = quiz.adminAuthLogin('Yepeng@gmail.com', 'Yepeng12321').body.token;
    const info: any = quiz.adminQuizInfo(user1, quiz1).body;
    expect(info.name).toStrictEqual('GeographyGame');
    expect(info.timeLastEdited).toBeGreaterThanOrEqual(quiz1TimeCreated - 1);
    expect(info.timeLastEdited).toBeLessThanOrEqual(quiz1TimeCreated + 1);
  });

  test('error case: quizId does not exist', () => {
    const res: type.Response = quiz.adminQuizNameUpdate(user1, quiz1 + 1, 'Math Challenge');
    expect(res.status).toStrictEqual(400);
    expect(res.body).toStrictEqual(ERROR);

    const info: any = quiz.adminQuizInfo(user1, quiz1).body;
    expect(info.name).toStrictEqual('GeographyGame');
    expect(info.timeLastEdited).toBeGreaterThanOrEqual(quiz1TimeCreated - 1);
    expect(info.timeLastEdited).toBeLessThanOrEqual(quiz1TimeCreated + 1);
  });

  test('error case: quizId does not refer to a quiz owned by this user', () => {
    user2 = quiz.adminAuthRegister('Hayden@gmail.com', 'Hayden12321', 'Hayden', 'Smith').body.token;
    quiz2 = quiz.adminQuizCreate(user2, 'LiteratureTest', '').body.quizId;

    const res1: type.Response = quiz.adminQuizNameUpdate(user1, quiz2, 'Math Challenge');
    const res2: type.Response = quiz.adminQuizNameUpdate(user2, quiz1, 'History Trivia');
    expect(res1.body).toStrictEqual(ERROR);
    expect(res1.status).toStrictEqual(400);
    expect(res2.body).toStrictEqual(ERROR);
    expect(res2.status).toStrictEqual(400);

    const info: any = quiz.adminQuizInfo(user1, quiz1).body;
    expect(info.name).toStrictEqual('GeographyGame');
    expect(info.timeLastEdited).toBeGreaterThanOrEqual(quiz1TimeCreated - 1);
    expect(info.timeLastEdited).toBeLessThanOrEqual(quiz1TimeCreated + 1);
  });

  test.each([
    { name: 'Quiz!Name' },
    { name: 'Name_With_Underscore' },
    { name: 'My Quiz@2023' },
    { name: "Jane's Quiz" },
    { name: 'My/Quiz' },
    { name: 'Quiz: Star Wars' },
  ])('error case: invalid name-names containing non-alphanumeric characters', ({ name }) => {
    const res: type.Response = quiz.adminQuizNameUpdate(user1, quiz1, name);
    expect(res.status).toStrictEqual(400);
    expect(res.body).toStrictEqual(ERROR);

    const info: any = quiz.adminQuizInfo(user1, quiz1).body;
    expect(info.name).toStrictEqual('GeographyGame');
    expect(info.timeLastEdited).toBeGreaterThanOrEqual(quiz1TimeCreated - 1);
    expect(info.timeLastEdited).toBeLessThanOrEqual(quiz1TimeCreated + 1);
  });

  test.each([
    { name: 'Qz' }, // (less than 3 characters)
    { name: 'This name is very long and certainly exceeds the maximum number of allowed characters' }, // (more than 30 characters)
    { name: 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz' }, // (more than 30 characters)
    { name: 'ab' } // (less than 3 characters)
  ])('error case: invalid name-names less than 3 characters long or more than 30 characters long', ({ name }) => {
    const res: type.Response = quiz.adminQuizNameUpdate(user1, quiz1, name);
    expect(res.status).toStrictEqual(400);
    expect(res.body).toStrictEqual(ERROR);

    const info: any = quiz.adminQuizInfo(user1, quiz1).body;
    expect(info.name).toStrictEqual('GeographyGame');
    expect(info.timeLastEdited).toBeGreaterThanOrEqual(quiz1TimeCreated - 1);
    expect(info.timeLastEdited).toBeLessThanOrEqual(quiz1TimeCreated + 1);
  });

  test('error case: invalid name-name is already used by the current logged in user for another quiz', () => {
    quiz2 = quiz.adminQuizCreate(user1, 'ScienceQuiz2023', '').body.quizId;
    const res: type.Response = quiz.adminQuizNameUpdate(user1, quiz1, 'ScienceQuiz2023');
    expect(res.status).toStrictEqual(400);
    expect(res.body).toStrictEqual(ERROR);

    const info: any = quiz.adminQuizInfo(user1, quiz1).body;
    expect(info.name).toStrictEqual('GeographyGame');
    expect(info.timeLastEdited).toBeGreaterThanOrEqual(quiz1TimeCreated - 1);
    expect(info.timeLastEdited).toBeLessThanOrEqual(quiz1TimeCreated + 1);
  });

  test.each([
    { name: 'Science Quiz2023' },
    { name: 'Math Challenge' },
    { name: 'History Trivia' },
    { name: 'Literature Test' },
  ])('successful quiz creation', ({ name }) => {
    const res: type.Response = quiz.adminQuizNameUpdate(user1, quiz1, name);
    quiz1TimeLastEdited = Math.floor(Date.now() / 1000);
    expect(res.status).toStrictEqual(200);
    expect(res.body).toStrictEqual(SUCCESS);

    const info: any = quiz.adminQuizInfo(user1, quiz1).body;
    expect(info.name).toStrictEqual(name);
    expect(info.timeLastEdited).toBeGreaterThanOrEqual(quiz1TimeLastEdited - 1);
    expect(info.timeLastEdited).toBeLessThanOrEqual(quiz1TimeLastEdited + 1);
  });
});

describe('testing for PUT route: /v1/admin/quiz/{quizId}/description', () => {
  const SUCCESS: type.Empty = {};
  let user1 : string;
  let user2 : string;
  let quiz1 : number;
  let quiz2 : number;
  let quiz1TimeCreated: number;
  let quiz1TimeLastEdited: number;

  beforeEach(() => {
    user1 = quiz.adminAuthRegister('Yepeng@gmail.com', 'Yepeng12321', 'Yepeng', 'Lin').body.token;
    // user2 = adminAuthRegister('Hayden@gmail.com', 'Hayden12321', 'Hayden', 'Smith').body.token;
    quiz1 = quiz.adminQuizCreate(user1, 'GeographyGame', '').body.quizId;
    quiz1TimeCreated = Math.floor(Date.now() / 1000);
    quiz1TimeLastEdited = quiz1TimeCreated;
    // quiz2 = adminQuizCreate(user2, 'LiteratureTest', '').body.quizId;
  });

  test('error case: invalid token', () => {
    const res: type.Response = quiz.adminQuizDescriptionUpdate('', quiz1, 'laugh out loud');
    expect(res.status).toStrictEqual(401);
    expect(res.body).toStrictEqual(ERROR);

    const info: any = quiz.adminQuizInfo(user1, quiz1).body;
    expect(info.description).toStrictEqual('');
    expect(info.timeLastEdited).toBeGreaterThanOrEqual(quiz1TimeCreated - 1);
    expect(info.timeLastEdited).toBeLessThanOrEqual(quiz1TimeCreated + 1);
  });

  test('error case: invalid token', () => {
    const res: type.Response = quiz.adminQuizDescriptionUpdate(null, quiz1, 'laugh out loud');
    expect(res.status).toStrictEqual(401);
    expect(res.body).toStrictEqual(ERROR);

    const info: any = quiz.adminQuizInfo(user1, quiz1).body;
    expect(info.description).toStrictEqual('');
    expect(info.timeLastEdited).toBeGreaterThanOrEqual(quiz1TimeCreated - 1);
    expect(info.timeLastEdited).toBeLessThanOrEqual(quiz1TimeCreated + 1);
  });

  test('error case: valid token but does not refer to a currently logged in session', () => {
    quiz.adminAuthLogout(user1);
    const res: type.Response = quiz.adminQuizDescriptionUpdate(user1, quiz1, 'laugh out loud');
    expect(res.status).toStrictEqual(403);
    expect(res.body).toStrictEqual(ERROR);

    user1 = quiz.adminAuthLogin('Yepeng@gmail.com', 'Yepeng12321').body.token;
    const info: any = quiz.adminQuizInfo(user1, quiz1).body;
    expect(info.description).toStrictEqual('');
    expect(info.timeLastEdited).toBeGreaterThanOrEqual(quiz1TimeCreated - 1);
    expect(info.timeLastEdited).toBeLessThanOrEqual(quiz1TimeCreated + 1);
  });

  test('error case: quizId does not exist', () => {
    const res: type.Response = quiz.adminQuizDescriptionUpdate(user1, quiz1 + 1, 'laugh out loud');
    expect(res.status).toStrictEqual(400);
    expect(res.body).toStrictEqual(ERROR);

    const info: any = quiz.adminQuizInfo(user1, quiz1).body;
    expect(info.description).toStrictEqual('');
    expect(info.timeLastEdited).toBeGreaterThanOrEqual(quiz1TimeCreated - 1);
    expect(info.timeLastEdited).toBeLessThanOrEqual(quiz1TimeCreated + 1);
  });

  test('error case: quizId does not refer to a quiz owned by this user', () => {
    user2 = quiz.adminAuthRegister('Hayden@gmail.com', 'Hayden12321', 'Hayden', 'Smith').body.token;
    quiz2 = quiz.adminQuizCreate(user2, 'LiteratureTest', '').body.quizId;

    const res1: type.Response = quiz.adminQuizDescriptionUpdate(user1, quiz2, 'laugh out loud');
    const res2: type.Response = quiz.adminQuizDescriptionUpdate(user2, quiz1, 'laugh out loud');
    expect(res1.body).toStrictEqual(ERROR);
    expect(res1.status).toStrictEqual(400);
    expect(res2.body).toStrictEqual(ERROR);
    expect(res2.status).toStrictEqual(400);

    const info1: any = quiz.adminQuizInfo(user1, quiz1).body;
    expect(info1.description).toStrictEqual('');
    expect(info1.timeLastEdited).toBeGreaterThanOrEqual(quiz1TimeCreated - 1);
    expect(info1.timeLastEdited).toBeLessThanOrEqual(quiz1TimeCreated + 1);

    const info2: any = quiz.adminQuizInfo(user2, quiz2).body;
    expect(info2.description).toStrictEqual('');
    expect(info2.timeLastEdited).toBeGreaterThanOrEqual(quiz1TimeCreated - 1);
    expect(info2.timeLastEdited).toBeLessThanOrEqual(quiz1TimeCreated + 1);
  });

  test('error case: description is more than 100 characters in length', () => {
    const description = 'The greatest glory in living lies not in never falling, but in rising every time we fall. - Nelson Mandela';
    const res: type.Response = quiz.adminQuizDescriptionUpdate(user1, quiz1, description);
    expect(res.status).toStrictEqual(400);
    expect(res.body).toStrictEqual(ERROR);

    const info: any = quiz.adminQuizInfo(user1, quiz1).body;
    expect(info.description).toStrictEqual('');
    expect(info.timeLastEdited).toBeGreaterThanOrEqual(quiz1TimeCreated - 1);
    expect(info.timeLastEdited).toBeLessThanOrEqual(quiz1TimeCreated + 1);
  });

  test.each([
    { description: 'This is a short description for a product.' },
    { description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { description: 'This is a sentence about the weather today.' },
    { description: 'An example of a brief report for a meeting.' },
    { description: 'A summary of the main points of an article.' }
  ])('success case: successful description update', ({ description }) => {
    const res: type.Response = quiz.adminQuizDescriptionUpdate(user1, quiz1, description);
    quiz1TimeLastEdited = Math.floor(Date.now() / 1000);
    expect(res.status).toStrictEqual(200);
    expect(res.body).toStrictEqual(SUCCESS);
    const info: any = quiz.adminQuizInfo(user1, quiz1).body;
    expect(info.description).toStrictEqual(description);
    expect(info.timeLastEdited).toBeGreaterThanOrEqual(quiz1TimeLastEdited - 1);
    expect(info.timeLastEdited).toBeLessThanOrEqual(quiz1TimeLastEdited + 1);
  });
});
// To here is new comment

describe('GET route for /v1/admin/quiz/trash', () => {
  let userToken : string;
  const quizIds : number[] = [];

  beforeEach(() => {
    userToken = quiz.adminAuthRegister('marius@gmail.com', 'Marsbars69', 'Marius', 'Edmonds').body.token;

    quizIds.push(quiz.adminQuizCreate(userToken, 'quiz1name', 'lorem').body.quizId);
    quizIds.push(quiz.adminQuizCreate(userToken, 'quiz2name', 'ipsum').body.quizId);
    quizIds.push(quiz.adminQuizCreate(userToken, 'quiz3name', 'dolor').body.quizId);
    quizIds.push(quiz.adminQuizCreate(userToken, 'quiz4name', 'sit').body.quizId);
    quizIds.push(quiz.adminQuizCreate(userToken, 'quiz5name', 'sit').body.quizId);

    quiz.adminQuizRemove(userToken, quizIds[0]);
    quiz.adminQuizRemove(userToken, quizIds[2]);
    quiz.adminQuizRemove(userToken, quizIds[4]);
  });

  // Check for invalid token and correct error type
  test.each([
    { token: '' },
    { token: null }
  ])('error case: invalid token', (parameter) => {
    const result: type.Response = quiz.adminQuizTrash(parameter.token);
    expect(result.status).toStrictEqual(401);
    expect(result.body).toStrictEqual(ERROR);
  });

  // Check for valid token and correct error type and user not logged in
  test('error case: correct token, but user is not logged in', () => {
    quiz.adminAuthLogout(userToken);

    const result: type.Response = quiz.adminQuizTrash(userToken);
    expect(result.status).toStrictEqual(403);
    expect(result.body).toStrictEqual(ERROR);
  });

  // Trash quiz success
  test('Successful return of trashed quizes', () => {
    const result: type.Response = quiz.adminQuizTrash(userToken);
    expect(result.body).toStrictEqual({
      quizzes: [{ name: 'quiz1name', quizId: expect.any(Number) }, { name: 'quiz3name', quizId: expect.any(Number) }, { name: 'quiz5name', quizId: expect.any(Number) }]
    });
  });
});

describe('testing for route: /v1/admin/quiz/{quizId}/restore', () => {
  const SUCCESS: type.Empty = {};
  let user1 : string;

  beforeEach(() => {
    user1 = quiz.adminAuthRegister('Yepeng@gmail.com', 'Yepeng12321', 'Yepeng', 'Lin').body.token;
  });

  test('error case: Token is not a valid structure--empty', () => {
    const quiz1: number = quiz.adminQuizCreate(user1, 'GeographyGame', '').body.quizId;
    quiz.adminQuizRemove(user1, quiz1);
    const res: type.Response = quiz.adminQuizRestore('', quiz1);
    expect(res.status).toStrictEqual(401);
    expect(res.body).toStrictEqual(ERROR);
  });

  test('error case: Token is not a valid structure--null', () => {
    const quiz1: number = quiz.adminQuizCreate(user1, 'GeographyGame', '').body.quizId;
    quiz.adminQuizRemove(user1, quiz1);
    const res: type.Response = quiz.adminQuizRestore(null, quiz1);
    expect(res.status).toStrictEqual(401);
    expect(res.body).toStrictEqual(ERROR);
  });

  test('error case: valid token but does not refer to a currently logged in session', () => {
    const quiz1: number = quiz.adminQuizCreate(user1, 'GeographyGame', '').body.quizId;
    quiz.adminQuizRemove(user1, quiz1);
    quiz.adminAuthLogout(user1);
    const res: type.Response = quiz.adminQuizRestore(user1, quiz1);
    expect(res.status).toStrictEqual(403);
    expect(res.body).toStrictEqual(ERROR);
  });

  test('error case: Quiz ID does not refer to a valid quiz', () => {
    const quiz1: number = quiz.adminQuizCreate(user1, 'GeographyGame', '').body.quizId;
    quiz.adminQuizRemove(user1, quiz1);
    const res: type.Response = quiz.adminQuizRestore(user1, quiz1 + 1);
    expect(res.status).toStrictEqual(400);
    expect(res.body).toStrictEqual(ERROR);
  });

  test('error case: Quiz ID does not refer to a quiz that this user owns', () => {
    const quiz1: number = quiz.adminQuizCreate(user1, 'GeographyGame', '').body.quizId;
    const user2: string = quiz.adminAuthRegister('Hayden@gmail.com', 'Hayden12321', 'Hayden', 'Smith').body.token;
    const quiz2: number = quiz.adminQuizCreate(user2, 'LiteratureTest', '').body.quizId;
    quiz.adminQuizRemove(user1, quiz1);
    quiz.adminQuizRemove(user2, quiz2);
    let res = quiz.adminQuizRestore(user2, quiz1);
    expect(res.status).toStrictEqual(400);
    expect(res.body).toStrictEqual(ERROR);
    res = quiz.adminQuizRestore(user1, quiz2);
    expect(res.status).toStrictEqual(400);
    expect(res.body).toStrictEqual(ERROR);
  });

  test('error case: Quiz ID refers to a quiz that is not currently in the trash', () => {
    const quiz1: number = quiz.adminQuizCreate(user1, 'GeographyGame', '').body.quizId;
    const res: type.Response = quiz.adminQuizRestore(user1, quiz1);
    expect(res.status).toStrictEqual(400);
    expect(res.body).toStrictEqual(ERROR);
  });

  test('success case: correct behaviour', () => {
    const trashExpectObject: type.QuizList = {
      quizzes: []
    };
    const listExpectObject: type.QuizList = {
      quizzes: []
    };

    const names: {name: string}[] = [
      { name: 'Science Quiz2023' },
      { name: 'Math Challenge' },
      { name: 'History Trivia' },
      { name: 'Literature Test' },
      { name: 'English Vocabulary' },
      { name: 'Geography Quiz' },
      { name: 'Sports Trivia' },
      { name: 'Music Knowledge' },
      { name: 'General Knowledge' },
      { name: 'Coding Challenge' },
      { name: 'Art Appreciation' },
      { name: 'Movie Trivia' },
      { name: 'Science Fiction Quiz' },
      { name: 'Logic Puzzle' }
    ];

    const sortQuizzes: any = (quiz1: type.QuizDetails, quiz2:type.QuizDetails) => {
      if (JSON.stringify(quiz1) < JSON.stringify(quiz2)) return -1;
      return 1;
    };

    for (const object of names) {
      const name: string = object.name;
      const quizId: number = quiz.adminQuizCreate(user1, name, '').body.quizId;
      listExpectObject.quizzes.push({
        quizId: quizId,
        name: name
      });
    }

    for (const object of listExpectObject.quizzes) {
      const quizId: number = object.quizId;
      trashExpectObject.quizzes.push({ ...object });
      quiz.adminQuizRemove(user1, quizId);
      // let index = listExpectObject.quizzes.indexOf(object);
      const index: any = listExpectObject.quizzes.findIndex((item) => {
        return item.quizId === object.quizId;
      });
      listExpectObject.quizzes.splice(index, 1);
    }

    let list = quiz.adminQuizList(user1);
    let trash = quiz.adminQuizTrash(user1);

    expect(list.status).toStrictEqual(200);
    expect(list.body.quizzes.sort(sortQuizzes)).toStrictEqual(listExpectObject.quizzes.sort(sortQuizzes));
    expect(trash.status).toStrictEqual(200);
    expect(trash.body.quizzes.sort(sortQuizzes)).toStrictEqual(trashExpectObject.quizzes.sort(sortQuizzes));

    for (const object of trashExpectObject.quizzes) {
      const quizId: number = object.quizId;
      listExpectObject.quizzes.push({ ...object });
      const res: type.Response = quiz.adminQuizRestore(user1, quizId);
      expect(res.status).toStrictEqual(200);
      expect(res.body).toStrictEqual(SUCCESS);
      // let index = listExpectObject.quizzes.indexOf(object);
      const index: any = trashExpectObject.quizzes.findIndex((item) => {
        return item.quizId === object.quizId;
      });
      trashExpectObject.quizzes.splice(index, 1);
      list = quiz.adminQuizList(user1);
      trash = quiz.adminQuizTrash(user1);
      expect(list.status).toStrictEqual(200);
      expect(list.body.quizzes.sort(sortQuizzes)).toStrictEqual(listExpectObject.quizzes.sort(sortQuizzes));
      expect(trash.status).toStrictEqual(200);
      expect(trash.body.quizzes.sort(sortQuizzes)).toStrictEqual(trashExpectObject.quizzes.sort(sortQuizzes));
    }
  });
});

describe('DELETE route for /v1/admin/quiz/trash/empty', () => {
  const sortQuizzes: any = (quiz1: type.QuizDetails, quiz2:type.QuizDetails) => {
    if (JSON.stringify(quiz1) < JSON.stringify(quiz2)) return -1;
    return 1;
  };

  const SUCCESS: type.Empty = {};
  let user1 : string;

  const names: {name: string}[] = [
    { name: 'Science Quiz2023' },
    { name: 'Math Challenge' },
    { name: 'History Trivia' },
    { name: 'Literature Test' },
    { name: 'English Vocabulary' },
    { name: 'Geography Quiz' },
    { name: 'Sports Trivia' },
    { name: 'Music Knowledge' },
    { name: 'General Knowledge' },
    { name: 'Coding Challenge' },
    { name: 'Art Appreciation' },
    { name: 'Movie Trivia' },
    { name: 'Science Fiction Quiz' },
    { name: 'Logic Puzzle' }
  ];

  beforeEach(() => {
    user1 = quiz.adminAuthRegister('Yepeng@gmail.com', 'Yepeng12321', 'Yepeng', 'Lin').body.token;
  });

  test('error case: Token is not a valid structure--empty', () => {
    const quizId: number = quiz.adminQuizCreate(user1, 'Geography Quiz2023', '').body.quizId;
    quiz.adminQuizRemove(user1, quizId);
    const res: type.Response = quiz.adminQuizEmptyTrash('', [quizId]);
    expect(res.status).toStrictEqual(401);
    expect(res.body).toStrictEqual(ERROR);
  });

  test('error case: Token is not a valid structure--null', () => {
    const quizId: number = quiz.adminQuizCreate(user1, 'Geography Quiz2023', '').body.quizId;
    quiz.adminQuizRemove(user1, quizId);
    const res: type.Response = quiz.adminQuizEmptyTrash(null, [quizId]);
    expect(res.status).toStrictEqual(401);
    expect(res.body).toStrictEqual(ERROR);
  });

  test('error case: valid token but does not refer to a currently logged in session', () => {
    const quizId: number = quiz.adminQuizCreate(user1, 'Geography Quiz2023', '').body.quizId;
    quiz.adminQuizRemove(user1, quizId);
    quiz.adminAuthLogout(user1);
    const res: type.Response = quiz.adminQuizEmptyTrash(user1, [quizId]);
    expect(res.status).toStrictEqual(403);
    expect(res.body).toStrictEqual(ERROR);
  });

  test('error case: One or more of the Quiz IDs is not a valid quiz', () => {
    const quizId1: number = quiz.adminQuizCreate(user1, 'Geography Quiz2023', '').body.quizId;
    quiz.adminQuizRemove(user1, quizId1);
    const res: type.Response = quiz.adminQuizEmptyTrash(user1, [quizId1 + 1]);
    expect(res.status).toStrictEqual(400);
    expect(res.body).toStrictEqual(ERROR);
  });

  test('error case: One or more of the Quiz IDs refers to a quiz that this current user does not own', () => {
    const user2: string = quiz.adminAuthRegister('Hayden@gmail.com', 'Hayden12321', 'Hayden', 'Smith').body.token;
    const user1Quizzes: number[] = [];
    const user2Quizzes: number[] = [];
    const trash1 : type.QuizList = {
      quizzes: []
    };

    const trash2 : type.QuizList = {
      quizzes: []
    };
    for (let i = 0; i < 5; i++) {
      const name: string = names[i].name;
      const quizId: number = quiz.adminQuizCreate(user1, name, '').body.quizId;
      quiz.adminQuizRemove(user1, quizId);
      trash1.quizzes.push({
        quizId: quizId,
        name: name
      });
      user1Quizzes.push(quizId);
    }

    for (let i = 5; i < 10; i++) {
      const name: string = names[i].name;
      const quizId: number = quiz.adminQuizCreate(user2, name, '').body.quizId;
      quiz.adminQuizRemove(user2, quizId);
      trash2.quizzes.push({
        quizId: quizId,
        name: name
      });
      user2Quizzes.push(quizId);
    }

    let res = quiz.adminQuizEmptyTrash(user1, [...user1Quizzes, user2Quizzes[0], user2Quizzes[1]]);
    expect(res.status).toStrictEqual(400);
    expect(res.body).toStrictEqual(ERROR);

    expect(quiz.adminQuizTrash(user1).body.quizzes.sort(sortQuizzes)).toStrictEqual(trash1.quizzes.sort(sortQuizzes));

    res = quiz.adminQuizEmptyTrash(user2, [...user2Quizzes, user1Quizzes[0], user1Quizzes[1]]);
    expect(res.status).toStrictEqual(400);
    expect(res.body).toStrictEqual(ERROR);

    expect(quiz.adminQuizTrash(user2).body.quizzes.sort(sortQuizzes)).toStrictEqual(trash2.quizzes.sort(sortQuizzes));
  });

  test('error case: One or more of the Quiz IDs is not currently in the trash', () => {
    const trash1 : type.QuizList = {
      quizzes: []
    };
    const user1Quizzes : number[] = [];
    for (const object of names) {
      const name: string = object.name;
      const quizId: number = quiz.adminQuizCreate(user1, name, '').body.quizId;
      quiz.adminQuizRemove(user1, quizId);
      trash1.quizzes.push({
        quizId: quizId,
        name: name
      });
      user1Quizzes.push(quizId);
    }
    for (const item of user1Quizzes) {
      quiz.adminQuizRestore(user1, item);
      const res: type.Response = quiz.adminQuizEmptyTrash(user1, [...user1Quizzes]);

      expect(res.status).toStrictEqual(400);
      expect(res.body).toStrictEqual(ERROR);

      // expect(adminQuizTrash(user1).body.quizzes.sort(sortQuizzes)).toStrictEqual(trash1.quizzes.sort(sortQuizzes));
    }
  });

  test('Success case: successfully removed quizzes in trash', () => {
    const trash1 : type.QuizList = {
      quizzes: []
    };
    const user1Quizzes : number[] = [];
    for (const object of names) {
      const name: string = object.name;
      const quizId: number = quiz.adminQuizCreate(user1, name, '').body.quizId;
      quiz.adminQuizRemove(user1, quizId);
      trash1.quizzes.push({
        quizId: quizId,
        name: name
      });
      user1Quizzes.push(quizId);
    }
    for (const item of user1Quizzes) {
      const res: type.Response = quiz.adminQuizEmptyTrash(user1, [item]);

      expect(res.status).toStrictEqual(200);
      expect(res.body).toStrictEqual(SUCCESS);

      const index: any = trash1.quizzes.findIndex((quiz) => {
        return quiz.quizId === item;
      });

      trash1.quizzes.splice(index, 1);
      expect(quiz.adminQuizTrash(user1).body.quizzes.sort(sortQuizzes)).toStrictEqual(trash1.quizzes.sort(sortQuizzes));
    }
  });
});

describe('POST route: /v1/admin/quiz/{quizId}/transfer', () => {
  const sortQuizzes: any = (quiz1: type.QuizDetails, quiz2:type.QuizDetails) => {
    if (JSON.stringify(quiz1) < JSON.stringify(quiz2)) return -1;
    return 1;
  };

  const SUCCESS: type.Empty = {};
  let user1 : string;
  let user2 : string;
  let quizId1: number;

  const names: {name: string}[] = [
    { name: 'Science Quiz2023' },
    { name: 'Math Challenge' },
    { name: 'History Trivia' },
    { name: 'Literature Test' },
    { name: 'English Vocabulary' },
    { name: 'Geography Quiz' },
    { name: 'Sports Trivia' },
    { name: 'Music Knowledge' },
    { name: 'General Knowledge' },
    { name: 'Coding Challenge' },
    { name: 'Art Appreciation' },
    { name: 'Movie Trivia' },
    { name: 'Science Fiction Quiz' },
    { name: 'Logic Puzzle' }
  ];

  beforeEach(() => {
    user1 = quiz.adminAuthRegister('Yepeng@gmail.com', 'Yepeng12321', 'Yepeng', 'Lin').body.token;
    user2 = quiz.adminAuthRegister('Hayden@gmail.com', 'Hayden12321', 'Hayden', 'Smith').body.token;
    quizId1 = quiz.adminQuizCreate(user1, 'Geography Quiz2023', '').body.quizId;
  });

  test('error case: Token is not a valid structure--empty', () => {
    const res: type.Response = quiz.adminQuizTransfer('', quizId1, 'Hayden@gmail.com');
    expect(res.status).toStrictEqual(401);
    expect(res.body).toStrictEqual(ERROR);
  });

  test('error case: Token is not a valid structure--null', () => {
    const res: type.Response = quiz.adminQuizTransfer(null, quizId1, 'Hayden@gmail.com');
    expect(res.status).toStrictEqual(401);
    expect(res.body).toStrictEqual(ERROR);
  });

  test('error case: valid token but does not refer to a currently logged in session', () => {
    quiz.adminAuthLogout(user1);
    const res: type.Response = quiz.adminQuizTransfer(user1, quizId1, 'Hayden@gmail.com');
    expect(res.status).toStrictEqual(403);
    expect(res.body).toStrictEqual(ERROR);
  });

  test('error case: Quiz ID does not refer to a valid quiz', () => {
    const res: type.Response = quiz.adminQuizTransfer(user1, quizId1 + 1, 'Hayden@gmail.com');
    expect(res.status).toStrictEqual(400);
    expect(res.body).toStrictEqual(ERROR);
  });

  test('error: Quiz ID does not refer to a quiz that this user owns', () => {
    const quizId2: number = quiz.adminQuizCreate(user2, 'Science Quiz2023', '').body.quizId;
    let res = quiz.adminQuizTransfer(user1, quizId2, 'Hayden@gmail.com');
    expect(res.status).toStrictEqual(400);
    expect(res.body).toStrictEqual(ERROR);

    res = quiz.adminQuizTransfer(user2, quizId1, 'Hayden@gmail.com');
    expect(res.status).toStrictEqual(400);
    expect(res.body).toStrictEqual(ERROR);
  });

  test('error case: userEmail is not a real user', () => {
    const res: type.Response = quiz.adminQuizTransfer(user1, quizId1, 'Youngbabe@gmail.com');
    expect(res.status).toStrictEqual(400);
    expect(res.body).toStrictEqual(ERROR);
  });

  test('userEmail is the current logged in user', () => {
    quiz.adminAuthLogout(user2);
    const res: type.Response = quiz.adminQuizTransfer(user1, quizId1, 'Yepeng@gmail.com');
    expect(res.status).toStrictEqual(400);
    expect(res.body).toStrictEqual(ERROR);
  });

  test('error case: Quiz ID refers to a quiz that has a name that is already used by the target user', () => {
    quiz.adminQuizCreate(user2, 'Geography Quiz2023', '');
    const res: type.Response = quiz.adminQuizTransfer(user1, quizId1, 'Hayden@gmail.com');
    expect(res.status).toStrictEqual(400);
    expect(res.body).toStrictEqual(ERROR);
  });

  test('success case: successfully transferred quizzes to another user', () => {
    const user1Quizzes : type.QuizList = {
      quizzes: [
        {
          quizId: quizId1,
          name: 'Geography Quiz2023'
        }
      ]
    };
    const user2Quizzes : type.QuizList = {
      quizzes: []
    };

    for (const object of names) {
      const quizId: number = quiz.adminQuizCreate(user1, object.name, '').body.quizId;
      user1Quizzes.quizzes.push({
        quizId: quizId,
        name: object.name
      });
    }

    user1Quizzes.quizzes.forEach((object, index) => {
      const list1: any = quiz.adminQuizList(user1).body;
      const list2: any = quiz.adminQuizList(user2).body;
      expect(list1.quizzes.sort(sortQuizzes)).toStrictEqual(user1Quizzes.quizzes.sort(sortQuizzes));
      expect(list2.quizzes.sort(sortQuizzes)).toStrictEqual(user2Quizzes.quizzes.sort(sortQuizzes));
      const quizId: number = object.quizId;
      const res: type.Response = quiz.adminQuizTransfer(user1, quizId, 'Hayden@gmail.com');
      expect(res.status).toStrictEqual(200);
      expect(res.body).toStrictEqual(SUCCESS);
      user2Quizzes.quizzes.push({ ...object });
      user1Quizzes.quizzes.splice(index, 1);
    });
    const list1: any = quiz.adminQuizList(user1).body;
    const list2: any = quiz.adminQuizList(user2).body;
    expect(list1.quizzes.sort(sortQuizzes)).toStrictEqual(user1Quizzes.quizzes.sort(sortQuizzes));
    expect(list2.quizzes.sort(sortQuizzes)).toStrictEqual(user2Quizzes.quizzes.sort(sortQuizzes));
  });
});

describe('POST route for /v1/admin/quiz/{quizid}/question', () => {
  let userToken : string;
  const quizIds : number[] = [];

  let validAnswers : type.AnswerDetails[];
  let shortAnswer : type.AnswerDetails[];
  let longAnswer : type.AnswerDetails[];
  let answerNameShort : type.AnswerDetails[];
  let answerNameLong : type.AnswerDetails[];
  let answerDuplicates : type.AnswerDetails[];
  let answerNoCorrects : type.AnswerDetails[];
  let beforeInfo : type.QuizInfo;

  beforeEach(() => {
    userToken = quiz.adminAuthRegister('marius@gmail.com', 'Marsbars69', 'Marius', 'Edmonds').body.token;

    quizIds.push(quiz.adminQuizCreate(userToken, 'Geography Game', '').body.quizId);

    validAnswers = [{ answer: '1945', correct: true }, { answer: '1917', correct: false }];
    shortAnswer = [{ answer: '1945', correct: true }];
    longAnswer = [
      { answer: '1945', correct: true }, { answer: '1946', correct: false }, { answer: '1947', correct: false },
      { answer: '1948', correct: false }, { answer: '1949', correct: false }, { answer: '1950', correct: false },
      { answer: '1951', correct: false }, { answer: '1952', correct: false }, { answer: '1953', correct: false },
      { answer: '1954', correct: false }, { answer: '1955', correct: false }, { answer: '1956', correct: false },
    ];
    answerNameShort = [{ answer: '', correct: true }, { answer: '1917', correct: false }];
    answerNameLong = [{ answer: 'this answer is way too long to be a valid question answer', correct: true }, { answer: '1917', correct: false }];
    answerDuplicates = [{ answer: 'duplicate answer', correct: true }, { answer: 'duplicate answer', correct: false }];
    answerNoCorrects = [{ answer: 'no correct answers', correct: false }];
    beforeInfo = quiz.adminQuizInfo(userToken, quizIds[0]).body;
  });

  // Token is invalid
  test.each([
    { token: '' },
    { token: null }
  ])('error case: invalid token', (parameter) => {
    const result: type.Response = quiz.adminQuizQuestionCreate(quizIds[0], parameter.token, 'When was WWII?', 5, 12, validAnswers);
    expect(result.status).toStrictEqual(401);
    expect(result.body).toStrictEqual(ERROR);
  });

  test('error case: correct token, but user is not logged in', () => {
    quiz.adminAuthLogout(userToken);

    const result: type.Response = quiz.adminQuizQuestionCreate(quizIds[0], userToken, 'When was WWII?', 5, 12, validAnswers);
    expect(result.status).toStrictEqual(403);
    expect(result.body).toStrictEqual(ERROR);
  });

  test('error case: user does not own quizId', () => {
    const user2 = quiz.adminAuthRegister('Yepeng@gmail.com', 'Marsbars69', 'Marius', 'Edmonds').body.token;
    expect(user2).toStrictEqual(expect.any(String));
    const quiz2 = quiz.adminQuizCreate(user2, 'LOL Game', '').body.quizId;
    const result: type.Response = quiz.adminQuizQuestionCreate(quiz2, userToken, 'When was WWII?', 5, 12, validAnswers);
    expect(result.status).toStrictEqual(400);
    expect(result.body).toStrictEqual(ERROR);
  });

  test('Question < 5 chars or Question > 50 chars', () => {
    const shortQuestion = 'a';
    const longQuestion = 'veryveryveryveryveryverylonglonglonglonglonglongquestionquestionquestion';

    const result1: type.Response = quiz.adminQuizQuestionCreate(quizIds[0], userToken, shortQuestion, 5, 5, validAnswers);
    const result2: type.Response = quiz.adminQuizQuestionCreate(quizIds[0], userToken, longQuestion, 5, 5, validAnswers);
    expect(result1.status).toStrictEqual(400);
    expect(result2.status).toStrictEqual(400);
    expect(result1.body).toStrictEqual(ERROR);
    expect(result2.body).toStrictEqual(ERROR);
  });

  test('Question answers count < 2 or > 6', () => {
    const shortResult = quiz.adminQuizQuestionCreate(quizIds[0], userToken, 'valid question1', 5, 5, shortAnswer);
    const longResult = quiz.adminQuizQuestionCreate(quizIds[0], userToken, 'valid question2', 5, 5, longAnswer);
    expect(shortResult.status).toStrictEqual(400);
    expect(longResult.status).toStrictEqual(400);
    expect(shortResult.body).toStrictEqual(ERROR);
    expect(longResult.body).toStrictEqual(ERROR);
  });

  test('Question duration <= 0', () => {
    const result: type.Response = quiz.adminQuizQuestionCreate(quizIds[0], userToken, 'valid question1', -1, 5, validAnswers);
    expect(result.status).toStrictEqual(400);
    expect(result.body).toStrictEqual(ERROR);
  });

  test('Sum duration > 180 sec', () => {
    const result1: type.Response = quiz.adminQuizQuestionCreate(quizIds[0], userToken, 'valid question1', 179, 5, validAnswers);
    const result2: type.Response = quiz.adminQuizQuestionCreate(quizIds[0], userToken, 'valid question2', 2, 5, validAnswers);
    expect(result1.body).toStrictEqual({ questionId: expect.any(Number) });
    expect(result1.status).toStrictEqual(200);
    expect(result2.body).toStrictEqual(ERROR);
    expect(result2.status).toStrictEqual(400);
  });

  test('Points are not in 1-10 range', () => {
    const result1: type.Response = quiz.adminQuizQuestionCreate(quizIds[0], userToken, 'valid question1', 30, 11, validAnswers);
    const result2: type.Response = quiz.adminQuizQuestionCreate(quizIds[0], userToken, 'valid question1', 30, 0, validAnswers);
    expect(result1.body).toStrictEqual(ERROR);
    expect(result1.status).toStrictEqual(400);
    expect(result2.body).toStrictEqual(ERROR);
    expect(result2.status).toStrictEqual(400);
  });
  test('Answers are too short/long', () => {
    const result1: type.Response = quiz.adminQuizQuestionCreate(quizIds[0], userToken, 'valid question1', 5, 5, answerNameShort);
    const result2: type.Response = quiz.adminQuizQuestionCreate(quizIds[0], userToken, 'valid question2', 5, 5, answerNameLong);
    expect(result1.body).toStrictEqual(ERROR);
    expect(result1.status).toStrictEqual(400);
    expect(result2.body).toStrictEqual(ERROR);
    expect(result2.status).toStrictEqual(400);
  });

  test('Question contains duplicate answers', () => {
    const result1: type.Response = quiz.adminQuizQuestionCreate(quizIds[0], userToken, 'valid question1', 5, 5, answerDuplicates);
    expect(result1.body).toStrictEqual(ERROR);
    expect(result1.status).toStrictEqual(400);
  });

  test('No correct answers', () => {
    const result: type.Response = quiz.adminQuizQuestionCreate(quizIds[0], userToken, 'valid question1', 5, 5, answerNoCorrects);
    expect(result.body).toStrictEqual(ERROR);
    expect(result.status).toStrictEqual(400);
  });

  test('success case: successfully created questions', () => {
    function sortAnswers(a: type.Answer, b: type.Answer): number {
      return a.answerId - b.answerId;
    }

    function sortQuestions(a: type.Question, b: type.Question): number {
      a.answers.sort(sortAnswers);
      b.answers.sort(sortAnswers);
      return a.questionId - b.questionId;
    }

    function sortQuizzes(a: type.QuizInfo, b: type.QuizInfo): number {
      a.questions.sort(sortQuestions);
      b.questions.sort(sortQuestions);
      return a.quizId - b.quizId;
    }
    const validQuestions = [
      {
        question: 'Who was the first man on moon?',
        duration: 30,
        points: 5,
        answers: [
          {
            answer: 'Neil Armstrong',
            correct: true
          },
          {
            answer: 'Buzz Aldrin',
            correct: false
          }
        ]
      },
      {
        question: 'What is the capital of France?',
        duration: 45,
        points: 3,
        answers: [
          {
            answer: 'Paris',
            correct: true
          },
          {
            answer: 'London',
            correct: false
          }
        ]
      },
      {
        question: 'What is the largest mammal?',
        duration: 45,
        points: 7,
        answers: [
          {
            answer: 'Blue Whale',
            correct: true
          },
          {
            answer: 'Elephant',
            correct: false
          }
        ]
      }
    ];
    const expectObject : type.QuizInfo = {
      quizId: quizIds[0],
      name: 'Geography Game',
      timeCreated: beforeInfo.timeCreated,
      timeLastEdited: expect.any(Number),
      description: '',
      numQuestions: 0,
      questions: [],
      duration: 0
    };
    for (const question of validQuestions) {
      const res: type.Response = quiz.adminQuizQuestionCreate(quizIds[0], userToken, question.question, question.duration, question.points, question.answers);
      const currentTime: number = Math.floor(Date.now() / 1000);
      expect(res.status).toStrictEqual(200);
      expect(res.body).toStrictEqual({ questionId: expect.any(Number) });
      const updatedInfo: any = quiz.adminQuizInfo(userToken, quizIds[0]).body;
      const newQuestion: type.Question = {
        questionId: expect.any(Number),
        question: question.question,
        duration: question.duration,
        points: question.points,
        answers: question.answers.map((answer) => {
          return {
            answerId: expect.any(Number),
            answer: answer.answer,
            colour: expect.any(String),
            correct: answer.correct
          };
        })
      };
      expectObject.numQuestions++;
      expectObject.duration += question.duration;
      expectObject.questions.push(newQuestion);

      const sortedInfo1: any = { ...updatedInfo };
      const sortedInfo2: any = { ...expectObject };
      sortQuizzes(sortedInfo1, sortedInfo2);

      expect(sortedInfo1).toStrictEqual(sortedInfo2);
      expect(updatedInfo.timeLastEdited).toBeGreaterThanOrEqual(currentTime - 1);
      expect(updatedInfo.timeLastEdited).toBeLessThanOrEqual(currentTime + 1);
    }
  });
});

const validQuestions = [
  {
    question: 'Who was the first man on moon?',
    duration: 30,
    points: 5,
    answers: [
      {
        answer: 'Neil Armstrong',
        correct: true
      },
      {
        answer: 'Buzz Aldrin',
        correct: false
      }
    ]
  },
  {
    question: 'What is the capital of France?',
    duration: 45,
    points: 3,
    answers: [
      {
        answer: 'Paris',
        correct: true
      },
      {
        answer: 'London',
        correct: false
      }
    ]
  },
  {
    question: 'What is the largest mammal?',
    duration: 45,
    points: 7,
    answers: [
      {
        answer: 'Blue Whale',
        correct: true
      },
      {
        answer: 'Elephant',
        correct: false
      }
    ]
  }
];

const additionalValidQuestions = [
  {
    question: 'Who painted Mona Lisa?',
    duration: 30,
    points: 5,
    answers: [
      {
        answer: 'Leonardo da Vinci',
        correct: true
      },
      {
        answer: 'Vincent van Gogh',
        correct: false
      }
    ]
  },
  {
    question: 'What is the tallest mountain?',
    duration: 35,
    points: 3,
    answers: [
      {
        answer: 'Mount Everest',
        correct: true
      },
      {
        answer: 'K2',
        correct: false
      }
    ]
  },
  {
    question: 'What is the largest planet?',
    duration: 40,
    points: 7,
    answers: [
      {
        answer: 'Jupiter',
        correct: true
      },
      {
        answer: 'Saturn',
        correct: false
      }
    ]
  }
];

describe('PUT route: /v1/admin/quiz/{quizid}/question/{questionid}', () => {
  const SUCCESS: type.Empty = {};
  let user1 : string;
  let quiz1 : number;
  let question1: number;
  let beforeInfo : type.QuizInfo;
  const question1Body : type.QuestionBody = {
    question: 'What is the capital of France?',
    duration: 30,
    points: 3,
    answers: [
      {
        answer: 'Paris',
        correct: true
      },
      {
        answer: 'London',
        correct: false
      }
    ]
  };

  const shortQuestion = {
    question: 'Hi?',
    duration: 30,
    points: 3,
    answers: [
      {
        answer: 'Hello',
        correct: true
      },
      {
        answer: 'Bye',
        correct: false
      }
    ]
  };

  const longQuestion = {
    question: "In what year was the Declaration of Independence signed, marking the United States' declaration of independence from the Kingdom of Great Britain?",
    duration: 40,
    points: 4,
    answers: [
      {
        answer: '1776',
        correct: true
      },
      {
        answer: '1783',
        correct: false
      }
    ]
  };

  const answerTooMany = {
    question: 'What is the capital of France?',
    duration: 30,
    points: 3,
    answers: [
      {
        answer: 'Paris',
        correct: true
      },
      {
        answer: 'London',
        correct: false
      },
      {
        answer: 'Berlin',
        correct: false
      },
      {
        answer: 'Madrid',
        correct: false
      },
      {
        answer: 'Rome',
        correct: false
      },
      {
        answer: 'Lisbon',
        correct: false
      },
      {
        answer: 'Brussels',
        correct: false
      }
    ]
  };

  const answerTooFew = {
    question: 'What is the capital of France?',
    duration: 30,
    points: 3,
    answers: [
      {
        answer: 'Paris',
        correct: true
      }
    ]
  };

  const pointsTooMany = {
    question: 'Which planet is closest to the sun?',
    duration: 20,
    points: 11,
    answers: [
      {
        answer: 'Mercury',
        correct: true
      },
      {
        answer: 'Venus',
        correct: false
      }
    ]
  };
  const pointsTooFew = {
    question: 'What is the largest ocean on Earth?',
    duration: 20,
    points: 0,
    answers: [
      {
        answer: 'Atlantic Ocean',
        correct: false
      },
      {
        answer: 'Pacific Ocean',
        correct: true
      }
    ]
  };

  const LongDuration1 = {
    question: 'Which planet is closest to the sun?',
    duration: 150,
    points: 2,
    answers: [
      {
        answer: 'Mercury',
        correct: true
      },
      {
        answer: 'Venus',
        correct: false
      }
    ]
  };

  const LongDuration2 = {
    question: 'What is the largest ocean on Earth?',
    duration: 31,
    points: 5,
    answers: [
      {
        answer: 'Atlantic Ocean',
        correct: false
      },
      {
        answer: 'Pacific Ocean',
        correct: true
      }
    ]
  };

  const answerTooShort = {
    question: 'Who is the first president of the United States?',
    duration: 30,
    points: 3,
    answers: [
      {
        answer: '',
        correct: false
      },
      {
        answer: 'George Washington',
        correct: true
      }
    ]
  };

  const answerTooLong = {
    question: 'What is the color of the sky?',
    duration: 40,
    points: 4,
    answers: [
      {
        answer: 'The sky is a beautiful shade of blue during a clear day.',
        correct: false
      },
      {
        answer: 'Blue',
        correct: true
      }
    ]
  };

  const duplicateAnswerQuestions = [
    {
      question: 'What are the primary colors?',
      duration: 30,
      points: 3,
      answers: [
        {
          answer: 'Red',
          correct: true
        },
        {
          answer: 'Blue',
          correct: true
        },
        {
          answer: 'Green',
          correct: false
        },
        {
          answer: 'Red',
          correct: true
        }
      ]
    },

    {
      question: 'What are the states of matter?',
      duration: 40,
      points: 5,
      answers: [
        {
          answer: 'Solid',
          correct: true
        },
        {
          answer: 'Liquid',
          correct: true
        },
        {
          answer: 'Gas',
          correct: true
        },
        {
          answer: 'Plasma',
          correct: true
        },
        {
          answer: 'Liquid',
          correct: false
        }
      ]
    },

    {
      question: 'Who are the founders of Google?',
      duration: 50,
      points: 7,
      answers: [
        {
          answer: 'Larry Page',
          correct: true
        },
        {
          answer: 'Sergey Brin',
          correct: true
        },
        {
          answer: 'Steve Jobs',
          correct: false
        },
        {
          answer: 'Larry Page',
          correct: false
        }
      ]
    }
  ];

  const noRightAnswerQuestions = [
    {
      question: 'What are the primary colors?',
      duration: 30,
      points: 3,
      answers: [
        {
          answer: 'Red',
          correct: false
        },
        {
          answer: 'Blue',
          correct: false
        },
        {
          answer: 'Green',
          correct: false
        },
        {
          answer: 'Yellow',
          correct: false
        }
      ]
    },
    {
      question: 'Who are the founders of Google?',
      duration: 50,
      points: 7,
      answers: [
        {
          answer: 'Steve Jobs',
          correct: false
        },
        {
          answer: 'Mark Zuckerberg',
          correct: false
        },
        {
          answer: 'Bill Gates',
          correct: false
        },
        {
          answer: 'Jeff Bezos',
          correct: false
        }
      ]
    },
    {
      question: 'What is the capital of Australia?',
      duration: 40,
      points: 4,
      answers: [
        {
          answer: 'Sydney',
          correct: false
        },
        {
          answer: 'Melbourne',
          correct: false
        },
        {
          answer: 'Brisbane',
          correct: false
        },
        {
          answer: 'Perth',
          correct: false
        }
      ]
    },
    {
      question: 'What are the states of matter?',
      duration: 45,
      points: 5,
      answers: [
        {
          answer: 'Soft',
          correct: false
        },
        {
          answer: 'Hard',
          correct: false
        },
        {
          answer: 'Liquid',
          correct: false
        },
        {
          answer: 'Gas',
          correct: false
        }
      ]
    },
    {
      question: 'Who was the first person to walk on the moon?',
      duration: 35,
      points: 6,
      answers: [
        {
          answer: 'Neil Armstrong',
          correct: false
        },
        {
          answer: 'Buzz Aldrin',
          correct: false
        },
        {
          answer: 'Yuri Gagarin',
          correct: false
        },
        {
          answer: 'John Glenn',
          correct: false
        }
      ]
    }
  ];

  function sortAnswers(a: type.Answer, b: type.Answer): number {
    return a.answerId - b.answerId;
  }

  function sortQuestions(a: type.Question, b: type.Question): number {
    a.answers.sort(sortAnswers);
    b.answers.sort(sortAnswers);
    return a.questionId - b.questionId;
  }

  function sortQuizzes(a: type.QuizInfo, b: type.QuizInfo): number {
    a.questions.sort(sortQuestions);
    b.questions.sort(sortQuestions);
    return a.quizId - b.quizId;
  }

  const duplicateAns = {
    question: 'What are the primary colors?',
    duration: 30,
    points: 3,
    answers: [
      {
        answer: 'Red',
        correct: true
      },
      {
        answer: 'Blue',
        correct: true
      },
      {
        answer: 'Green',
        correct: false
      },
      {
        answer: 'Red',
        correct: true
      }
    ]
  };
  const noRightAns = {
    question: 'What are the primary colors?',
    duration: 30,
    points: 3,
    answers: [
      {
        answer: 'Red',
        correct: false
      },
      {
        answer: 'Blue',
        correct: false
      },
      {
        answer: 'Green',
        correct: false
      },
      {
        answer: 'Yellow',
        correct: false
      }
    ]
  };
  beforeEach(() => {
    user1 = quiz.adminAuthRegister('Yepeng@gmail.com', 'Yepeng12321', 'Yepeng', 'Lin').body.token;
    quiz1 = quiz.adminQuizCreate(user1, 'Geography Game', '').body.quizId;
    question1 = quiz.adminQuestionCreate(user1, quiz1, question1Body).body.questionId;
    beforeInfo = quiz.adminQuizInfo(user1, quiz1).body;
  });

  test('error case: Token is not a valid structure--empty', () => {
    const res: type.Response = quiz.adminQuizQuestionUpdate('', quiz1, question1, validQuestions[0]);
    expect(res.status).toStrictEqual(401);
    expect(res.body).toStrictEqual(ERROR);

    const updatedInfo: any = quiz.adminQuizInfo(user1, quiz1).body;
    expect(updatedInfo).toStrictEqual(beforeInfo);
  });

  test('error case: Token is not a valid structure--null', () => {
    const res: type.Response = quiz.adminQuizQuestionUpdate(null, quiz1, question1, validQuestions[0]);
    expect(res.status).toStrictEqual(401);
    expect(res.body).toStrictEqual(ERROR);

    const updatedInfo: any = quiz.adminQuizInfo(user1, quiz1).body;
    expect(updatedInfo).toStrictEqual(beforeInfo);
  });

  test('error case: valid token but does not refer to a currently logged in session', () => {
    quiz.adminAuthLogout(user1);
    const res: type.Response = quiz.adminQuizQuestionUpdate(user1, quiz1, question1, validQuestions[0]);
    expect(res.status).toStrictEqual(403);
    expect(res.body).toStrictEqual(ERROR);

    user1 = quiz.adminAuthLogin('Yepeng@gmail.com', 'Yepeng12321').body.token;
    const updatedInfo: any = quiz.adminQuizInfo(user1, quiz1).body;
    expect(updatedInfo).toStrictEqual(beforeInfo);
  });

  test('error case: Quiz ID does not refer to a valid quiz', () => {
    const res: type.Response = quiz.adminQuizQuestionUpdate(user1, quiz1 + 1, question1, validQuestions[1]);
    expect(res.status).toStrictEqual(400);
    expect(res.body).toStrictEqual(ERROR);

    const updatedInfo: any = quiz.adminQuizInfo(user1, quiz1).body;
    expect(updatedInfo).toStrictEqual(beforeInfo);
  });

  test('error:', () => {
    const res: type.Response = quiz.adminQuizQuestionUpdate(user1, quiz1, question1, duplicateAns);
    expect(res.status).toStrictEqual(400);
    expect(res.body).toStrictEqual(ERROR);

    const updatedInfo: any = quiz.adminQuizInfo(user1, quiz1).body;
    expect(updatedInfo).toStrictEqual(beforeInfo);
  });

  test('error case: Quiz ID does not refer to a quiz that this user owns', () => {
    const user2: string = quiz.adminAuthRegister('Hayden@gmail.com', 'Hayden12321', 'Hayden', 'Smith').body.token;
    const quiz2: number = quiz.adminQuizCreate(user2, 'Science Quiz2023', '').body.quizId;
    const question2: number = quiz.adminQuestionCreate(user2, quiz2, validQuestions[1]).body.questionId;

    const quiz2BeforeInfo: any = quiz.adminQuizInfo(user2, quiz2).body;

    let res = quiz.adminQuizQuestionUpdate(user2, quiz1, question1, validQuestions[1]);
    expect(res.status).toStrictEqual(400);
    expect(res.body).toStrictEqual(ERROR);

    const quiz2UpdatedInfo: any = quiz.adminQuizInfo(user2, quiz2).body;
    expect(quiz2UpdatedInfo).toStrictEqual(quiz2BeforeInfo);

    res = quiz.adminQuizQuestionUpdate(user1, quiz2, question2, validQuestions[2]);
    expect(res.status).toStrictEqual(400);
    expect(res.body).toStrictEqual(ERROR);

    const updatedInfo: any = quiz.adminQuizInfo(user1, quiz1).body;
    expect(updatedInfo).toStrictEqual(beforeInfo);
  });

  test('error case: Question Id does not refer to a valid question within this quiz', () => {
    const res: type.Response = quiz.adminQuizQuestionUpdate(user1, quiz1, question1 + 1, validQuestions[0]);
    expect(res.status).toStrictEqual(400);
    expect(res.body).toStrictEqual(ERROR);

    const updatedInfo: any = quiz.adminQuizInfo(user1, quiz1).body;
    expect(updatedInfo).toStrictEqual(beforeInfo);
  });

  test('error case: Question string is less than 5 characters in length or greater than 50 characters in length', () => {
    let res = quiz.adminQuizQuestionUpdate(user1, quiz1, question1, shortQuestion);
    expect(res.status).toStrictEqual(400);
    expect(res.body).toStrictEqual(ERROR);

    let updatedInfo = quiz.adminQuizInfo(user1, quiz1).body;
    expect(updatedInfo).toStrictEqual(beforeInfo);

    res = quiz.adminQuizQuestionUpdate(user1, quiz1, question1, longQuestion);
    expect(res.status).toStrictEqual(400);
    expect(res.body).toStrictEqual(ERROR);

    updatedInfo = quiz.adminQuizInfo(user1, quiz1).body;
    expect(updatedInfo).toStrictEqual(beforeInfo);
  });

  test('error case: The question has more than 6 answers or less than 2 answers', () => {
    let res = quiz.adminQuizQuestionUpdate(user1, quiz1, question1, answerTooMany);
    expect(res.status).toStrictEqual(400);
    expect(res.body).toStrictEqual(ERROR);

    let updatedInfo = quiz.adminQuizInfo(user1, quiz1).body;
    expect(updatedInfo).toStrictEqual(beforeInfo);

    res = res = quiz.adminQuizQuestionUpdate(user1, quiz1, question1, answerTooFew);
    expect(res.status).toStrictEqual(400);
    expect(res.body).toStrictEqual(ERROR);

    updatedInfo = quiz.adminQuizInfo(user1, quiz1).body;
    expect(updatedInfo).toStrictEqual(beforeInfo);
  });

  test.each([
    {
      question: 'Which planet is closest to the sun?',
      duration: 0,
      points: 2,
      answers: [
        {
          answer: 'Mercury',
          correct: true
        },
        {
          answer: 'Venus',
          correct: false
        }
      ]
    },
    {
      question: 'Which planet is closest to the sun?',
      duration: -1,
      points: 2,
      answers: [
        {
          answer: 'Mercury',
          correct: true
        },
        {
          answer: 'Venus',
          correct: false
        }
      ]
    },
    {
      question: 'Which planet is closest to the sun?',
      duration: -100,
      points: 2,
      answers: [
        {
          answer: 'Mercury',
          correct: true
        },
        {
          answer: 'Venus',
          correct: false
        }
      ]
    }
  ])('error case: The question duration is not a positive number', (negativeDuration) => {
    const res: type.Response = quiz.adminQuizQuestionUpdate(user1, quiz1, question1, negativeDuration);
    expect(res.status).toStrictEqual(400);
    expect(res.body).toStrictEqual(ERROR);

    const updatedInfo: any = quiz.adminQuizInfo(user1, quiz1).body;
    expect(updatedInfo).toStrictEqual(beforeInfo);
  });

  test('error:', () => {
    const res: type.Response = quiz.adminQuizQuestionUpdate(user1, quiz1, question1, noRightAns);
    expect(res.status).toStrictEqual(400);
    expect(res.body).toStrictEqual(ERROR);

    const updatedInfo: any = quiz.adminQuizInfo(user1, quiz1).body;
    expect(updatedInfo).toStrictEqual(beforeInfo);
  });

  test('error case: The sum of the question durations in the quiz exceeds 3 minutes', () => {
    quiz.adminQuestionCreate(user1, quiz1, LongDuration1);

    beforeInfo = quiz.adminQuizInfo(user1, quiz1).body;
    let updatedInfo = quiz.adminQuizInfo(user1, quiz1).body;
    const res: type.Response = quiz.adminQuizQuestionUpdate(user1, quiz1, question1, LongDuration2);
    expect(res.status).toStrictEqual(400);
    expect(res.body).toStrictEqual(ERROR);

    updatedInfo = quiz.adminQuizInfo(user1, quiz1).body;
    expect(updatedInfo).toStrictEqual(beforeInfo);
  });

  test('error case: The points awarded for the question are less than 1 or greater than 10', () => {
    let res = quiz.adminQuizQuestionUpdate(user1, quiz1, question1, pointsTooFew);
    expect(res.status).toStrictEqual(400);
    expect(res.body).toStrictEqual(ERROR);

    let updatedInfo = quiz.adminQuizInfo(user1, quiz1).body;
    expect(updatedInfo).toStrictEqual(beforeInfo);

    res = quiz.adminQuizQuestionUpdate(user1, quiz1, question1, pointsTooMany);
    expect(res.status).toStrictEqual(400);
    expect(res.body).toStrictEqual(ERROR);

    updatedInfo = quiz.adminQuizInfo(user1, quiz1).body;
    expect(updatedInfo).toStrictEqual(beforeInfo);
  });

  test('error case: The length of any answer is shorter than 1 character long, or longer than 30 characters long', () => {
    let res = quiz.adminQuizQuestionUpdate(user1, quiz1, question1, answerTooLong);
    expect(res.status).toStrictEqual(400);
    expect(res.body).toStrictEqual(ERROR);

    let updatedInfo = quiz.adminQuizInfo(user1, quiz1).body;
    expect(updatedInfo).toStrictEqual(beforeInfo);

    res = quiz.adminQuizQuestionUpdate(user1, quiz1, question1, answerTooShort);
    expect(res.status).toStrictEqual(400);
    expect(res.body).toStrictEqual(ERROR);

    updatedInfo = quiz.adminQuizInfo(user1, quiz1).body;
    expect(updatedInfo).toStrictEqual(beforeInfo);
  });

  test('error case: Any answer strings are duplicates of one another (within the same question)', () => {
    for (const question of duplicateAnswerQuestions) {
      const res: type.Response = quiz.adminQuestionCreate(user1, quiz1, question);
      expect(res.status).toStrictEqual(400);
      expect(res.body).toStrictEqual(ERROR);

      const updatedInfo: any = quiz.adminQuizInfo(user1, quiz1).body;
      expect(updatedInfo).toStrictEqual(beforeInfo);
    }
  });

  test('error case: There are no correct answers', () => {
    for (const question of noRightAnswerQuestions) {
      const res: type.Response = quiz.adminQuestionCreate(user1, quiz1, question);
      expect(res.status).toStrictEqual(400);
      expect(res.body).toStrictEqual(ERROR);

      const updatedInfo: any = quiz.adminQuizInfo(user1, quiz1).body;
      expect(updatedInfo).toStrictEqual(beforeInfo);
    }
  });

  test('success case: successfully created questions', () => {
    quiz.clear();

    user1 = quiz.adminAuthRegister('Yepeng@gmail.com', 'Yepeng12321', 'Yepeng', 'Lin').body.token;
    quiz1 = quiz.adminQuizCreate(user1, 'Geography Game', '').body.quizId;
    beforeInfo = quiz.adminQuizInfo(user1, quiz1).body;

    for (const question of validQuestions) {
      quiz.adminQuestionCreate(user1, quiz1, question);
    }
    const expectObject: any = quiz.adminQuizInfo(user1, quiz1).body;
    expectObject.timeLastEdited = expect.any(Number);
    // expect(expectObject).toStrictEqual(1);
    let index = 0;
    for (const question of expectObject.questions) {
      const res: type.Response = quiz.adminQuizQuestionUpdate(user1, quiz1, question.questionId, additionalValidQuestions[index]);
      const currentTime: number = Math.floor(Date.now() / 1000);
      const newQuestion : type.Question = {
        questionId: question.questionId,
        question: additionalValidQuestions[index].question,
        duration: additionalValidQuestions[index].duration,
        points: additionalValidQuestions[index].points,
        answers: additionalValidQuestions[index].answers.map((answer) => {
          return {
            answerId: expect.any(Number),
            answer: answer.answer,
            colour: expect.any(String),
            correct: answer.correct
          };
        })
      };

      expectObject.questions.splice(index, 1, newQuestion);
      expectObject.duration += additionalValidQuestions[index].duration - question.duration;
      index++;
      expect(res.status).toStrictEqual(200);
      expect(res.body).toStrictEqual(SUCCESS);
      const updatedInfo: any = quiz.adminQuizInfo(user1, quiz1).body;
      const sortedInfo1: any = { ...updatedInfo };
      const sortedInfo2: any = { ...expectObject };
      sortQuizzes(sortedInfo1, sortedInfo2);
      expect(sortedInfo1).toStrictEqual(sortedInfo2);
      expect(updatedInfo.timeLastEdited).toBeGreaterThanOrEqual(currentTime - 1);
      expect(updatedInfo.timeLastEdited).toBeLessThanOrEqual(currentTime + 1);
    }
  });
});

describe('POST /v1/admin/quiz/{quizid}/question/{questionid}/duplicate route', () => {
  let userToken1 : string;
  let userToken2 : string;

  let quizId1 : number;
  let quizId2 : number;

  const quiz1QIds : number[] = [];
  const quiz2QIds : number[] = [];

  beforeEach(() => {
    // Initialize two users to have 1 quiz each, but only first user has questions
    userToken1 = quiz.adminAuthRegister('marius@gmail.com', 'Marsbars69', 'Marius', 'Edmonds').body.token;
    userToken2 = quiz.adminAuthRegister('yepeng@gmail.com', 'yepeng420', 'Yepeng', 'Lin').body.token;
    quizId1 = quiz.adminQuizCreate(userToken1, 'Geography Game', 'This is a fun quiz').body.quizId;
    quizId2 = quiz.adminQuizCreate(userToken2, 'History Game', 'This is a fun quiz').body.quizId;

    const q1Answers: {answer: string, correct: boolean}[] = [{ answer: '1945', correct: true }, { answer: '1917', correct: false }];
    quiz2QIds.push(quiz.adminQuizQuestionCreate(quizId2, userToken2, 'When was WWII?', 5, 5, q1Answers).body.questionId);

    const q2Answers: {answer: string, correct: boolean}[] = [{ answer: 'Stockholm', correct: true }, { answer: 'Helsinki', correct: false }];
    quiz1QIds.push(quiz.adminQuizQuestionCreate(quizId1, userToken1, 'What is the capital of sweden?', 100, 5, q2Answers).body.questionId);
    const q3Answers: {answer: string, correct: boolean}[] = [{ answer: 'Stockholm', correct: true }, { answer: 'Helsinki', correct: false }];
    quiz1QIds.push(quiz.adminQuizQuestionCreate(quizId1, userToken1, 'What is the capital of sweden?', 5, 5, q3Answers).body.questionId);
    const q4Answers: {answer: string, correct: boolean}[] = [{ answer: 'Stockholm', correct: true }, { answer: 'Helsinki', correct: false }];
    quiz1QIds.push(quiz.adminQuizQuestionCreate(quizId1, userToken1, 'What is the capital of sweden?', 5, 5, q4Answers).body.questionId);
  });

  // Valid token session checking
  test.each([
    { token: '' },
    { token: null }
  ])('error case: invalid token', (parameter) => {
    const result: type.Response = quiz.adminQuizQuestionDuplicate(parameter.token, quizId1, quiz1QIds[1]);
    expect(result.status).toStrictEqual(401);
    expect(result.body).toStrictEqual(ERROR);
  });

  test('error case: correct token, but user is not logged in', () => {
    quiz.adminAuthLogout(userToken1);

    const result: type.Response = quiz.adminQuizQuestionDuplicate(userToken1, quizId1, quiz1QIds[1]);
    expect(result.status).toStrictEqual(403);
    expect(result.body).toStrictEqual(ERROR);
  });

  test('duplicating a question results in > 180 total duration', () => {
    const result: type.Response = quiz.adminQuizQuestionDuplicate(userToken1, quizId1, quiz1QIds[0]);
    expect(result.status).toStrictEqual(400);
    expect(result.body).toStrictEqual(ERROR);
  });
  // Quizid is invalid
  test('Invalid quizid', () => {
    const result: type.Response = quiz.adminQuizQuestionDuplicate(userToken1, -1, quiz1QIds[0]);
    expect(result.body).toStrictEqual(ERROR);
    expect(result.status).toStrictEqual(400);
  });

  // User doesn't own quiz
  test('User does not own specified quiz', () => {
    const result: type.Response = quiz.adminQuizQuestionDuplicate(userToken1, quizId2, quiz1QIds[0]);
    expect(result.body).toStrictEqual(ERROR);
    expect(result.status).toStrictEqual(400);
  });

  // Question id is invalid
  test('Invalid questionId', () => {
    const result: type.Response = quiz.adminQuizQuestionDuplicate(userToken1, quizId1, quiz2QIds[0]);
    expect(result.body).toStrictEqual(ERROR);
    expect(result.status).toStrictEqual(400);
  });

  test('Successfully duplicated quiz question', (done) => {
    quiz.clear();
    function sortAnswers(a: type.Answer, b: type.Answer): number {
      return a.answerId - b.answerId;
    }
    const user1: string = quiz.adminAuthRegister('marius@gmail.com', 'Marsbars69', 'Marius', 'Edmonds').body.token;
    const quiz1: number = quiz.adminQuizCreate(user1, 'COMP1531 is fun', 'title is not true').body.quizId;
    const question1: number = quiz.adminQuestionCreate(user1, quiz1, validQuestions[0]).body.questionId;
    const beforeInfo : type.QuizInfo = quiz.adminQuizInfo(user1, quiz1).body;
    const beforeTime = beforeInfo.timeCreated;
    setTimeout(() => {
      const res: type.Response = quiz.adminQuizQuestionDuplicate(user1, quiz1, question1);
      expect(res.status).toStrictEqual(200);
      expect(res.body.newQuestionId).not.toStrictEqual(question1);

      const afterInfo : type.QuizInfo = quiz.adminQuizInfo(user1, quiz1).body;
      expect(afterInfo.questions.filter((question) => {
        return question.question === validQuestions[0].question;
      }).length).toStrictEqual(2);
      expect(afterInfo.timeLastEdited).toBeGreaterThan(beforeTime);
      expect(afterInfo.timeLastEdited).toBeLessThanOrEqual(beforeTime + 5);

      const index = afterInfo.questions.findIndex((question) => {
        return question.question === validQuestions[0].question;
      });
      expect(afterInfo.questions[index].question).toStrictEqual(afterInfo.questions[index + 1].question);
      expect(afterInfo.questions[index].duration).toStrictEqual(afterInfo.questions[index + 1].duration);
      expect(afterInfo.questions[index].points).toStrictEqual(afterInfo.questions[index + 1].points);
      expect(afterInfo.duration).toStrictEqual(beforeInfo.duration + validQuestions[0].duration);
      expect(afterInfo.numQuestions).toStrictEqual(beforeInfo.numQuestions + 1);
      const expectAnswers : type.Answer[] = beforeInfo.questions[index].answers.map((answer) => {
        return {
          answerId: expect.any(Number),
          answer: answer.answer,
          colour: expect.any(String),
          correct: answer.correct
        };
      });
      expect(afterInfo.questions[index].answers.sort(sortAnswers)).toStrictEqual(expectAnswers.sort(sortAnswers));
      done();
    }, 2000);
  });
});

describe('DELETE route: /v1/admin/quiz/{quizid}/question/{question}', () => {
  const SUCCESS: type.Empty = {};
  let user1 : string;
  let user2 : string;
  let quiz1 : number;
  let quiz2 : number;
  let question1: number;
  let quiz1Info : type.QuizInfo;
  let quiz2Info : type.QuizInfo;

  beforeEach(() => {
    user1 = quiz.adminAuthRegister('Yepeng@gmail.com', 'Yepeng12321', 'Yepeng', 'Lin').body.token;
    user2 = quiz.adminAuthRegister('Hayden@gmail.com', 'Hayden12321', 'Hayden', 'Smith').body.token;
    quiz1 = quiz.adminQuizCreate(user1, 'LiteratureTest', '').body.quizId;
    // quiz2 = adminQuizCreate(user2, 'LiteratureTest', '').body.quizId;
    question1 = quiz.adminQuestionCreate(user1, quiz1, validQuestions[0]).body.questionId;
  });

  test.each([
    { fakeUser: '' },
    { fakeUser: null }
  ])('error case: Token is not a valid structure', ({ fakeUser }) => {
    const res: type.Response = quiz.adminQuizQuestionRemove(fakeUser, quiz1, question1);
    expect(res.status).toStrictEqual(401);
    expect(res.body).toStrictEqual(ERROR);
    quiz1Info = quiz.adminQuizInfo(user1, quiz1).body;
    expect(quiz1Info.questions.find((question) => {
      return question.questionId === question1 && question.question === 'Who was the first man on moon?';
    }) !== undefined);
  });

  test('error case: Provided token is valid structure, but is not for a currently logged in session', () => {
    quiz.adminAuthLogout(user1);
    const res: type.Response = quiz.adminQuizQuestionRemove(user1, quiz1, question1);
    expect(res.status).toStrictEqual(403);
    expect(res.body).toStrictEqual(ERROR);

    user1 = quiz.adminAuthLogin('Yepeng@gmail.com', 'Yepeng12321').body.token;
    quiz1Info = quiz.adminQuizInfo(user1, quiz1).body;
    expect(quiz1Info.questions.find((question) => {
      return question.questionId === question1 && question.question === 'Who was the first man on moon?';
    }) !== undefined);
  });

  test('error case: Quiz ID does not refer to a valid quiz', () => {
    const res: type.Response = quiz.adminQuizQuestionRemove(user1, quiz1 + 1, question1);
    expect(res.status).toStrictEqual(400);
    expect(res.body).toStrictEqual(ERROR);

    quiz1Info = quiz.adminQuizInfo(user1, quiz1).body;
    expect(quiz1Info.questions.find((question) => {
      return question.questionId === question1 && question.question === 'Who was the first man on moon?';
    }) !== undefined);
  });

  test('error case: Quiz ID does not refer to a quiz that this user owns', () => {
    quiz2 = quiz.adminQuizCreate(user2, 'LiteratureTest', '').body.quizId;
    const question2: number = quiz.adminQuestionCreate(user2, quiz2, validQuestions[1]).body.questionId;
    let res = quiz.adminQuizQuestionRemove(user1, quiz2, question2);
    expect(res.status).toStrictEqual(400);
    expect(res.body).toStrictEqual(ERROR);
    res = quiz.adminQuizQuestionRemove(user2, quiz1, question1);
    expect(res.status).toStrictEqual(400);
    expect(res.body).toStrictEqual(ERROR);
    quiz1Info = quiz.adminQuizInfo(user1, quiz1).body;
    quiz2Info = quiz.adminQuizInfo(user2, quiz2).body;

    expect(quiz1Info.questions.find((question) => {
      return question.questionId === question1 && question.question === 'Who was the first man on moon?';
    })).not.toStrictEqual(undefined);

    expect(quiz2Info.questions.find((question) => {
      return question.questionId === question2 && question.question === 'What is the capital of France?';
    })).not.toStrictEqual(undefined);
  });

  test('error case: Question Id does not refer to a valid question within this quiz', () => {
    quiz2 = quiz.adminQuizCreate(user2, 'LiteratureTest', '').body.quizId;
    const question2: number = quiz.adminQuestionCreate(user2, quiz2, validQuestions[1]).body.questionId;

    let res = quiz.adminQuizQuestionRemove(user2, quiz2, question2 + 1);
    expect(res.status).toStrictEqual(400);
    expect(res.body).toStrictEqual(ERROR);

    res = quiz.adminQuizQuestionRemove(user1, quiz1, question1 + 1);
    expect(res.status).toStrictEqual(400);
    expect(res.body).toStrictEqual(ERROR);

    quiz1Info = quiz.adminQuizInfo(user1, quiz1).body;
    quiz2Info = quiz.adminQuizInfo(user2, quiz2).body;

    expect(quiz1Info.questions.find((question) => {
      return question.questionId === question1 && question.question === 'Who was the first man on moon?';
    })).not.toStrictEqual(undefined);

    expect(quiz2Info.questions.find((question) => {
      return question.questionId === question2 && question.question === 'What is the capital of France?';
    })).not.toStrictEqual(undefined);
  });

  test('success case: successfully removed question', () => {
    quiz2 = quiz.adminQuizCreate(user2, 'LiteratureTest', '').body.quizId;
    const question2: number = quiz.adminQuestionCreate(user2, quiz2, validQuestions[1]).body.questionId;
    let res = quiz.adminQuizQuestionRemove(user1, quiz1, question1);
    expect(res.status).toStrictEqual(200);
    expect(res.body).toStrictEqual(SUCCESS);
    res = quiz.adminQuizQuestionRemove(user2, quiz2, question2);
    expect(res.status).toStrictEqual(200);
    expect(res.body).toStrictEqual(SUCCESS);

    quiz1Info = quiz.adminQuizInfo(user1, quiz1).body;
    quiz2Info = quiz.adminQuizInfo(user2, quiz2).body;

    expect(quiz1Info.questions.find((question) => {
      return question.questionId === question1 && question.question === validQuestions[0].question;
    })).toStrictEqual(undefined);

    expect(quiz2Info.questions.find((question) => {
      return question.questionId === question2 && question.question === validQuestions[1].question;
    })).toStrictEqual(undefined);

    const questionId1 : number[] = [];
    const questionId2 : number[] = [];

    validQuestions.forEach((question) => {
      questionId1.push(quiz.adminQuestionCreate(user1, quiz1, question).body.questionId);
    });

    additionalValidQuestions.forEach((question) => {
      questionId2.push(quiz.adminQuestionCreate(user2, quiz2, question).body.questionId);
    });

    questionId1.forEach((id) => {
      res = quiz.adminQuizQuestionRemove(user1, quiz1, id);
      expect(res.status).toStrictEqual(200);
      expect(res.body).toStrictEqual(SUCCESS);

      quiz1Info = quiz.adminQuizInfo(user1, quiz1).body;
      expect(quiz1Info.questions.find((question) => {
        return question.questionId === id && question.question === validQuestions[0].question;
      })).toStrictEqual(undefined);
    });

    questionId2.forEach((id) => {
      res = quiz.adminQuizQuestionRemove(user2, quiz2, id);
      expect(res.status).toStrictEqual(200);
      expect(res.body).toStrictEqual(SUCCESS);

      quiz2Info = quiz.adminQuizInfo(user2, quiz2).body;
      expect(quiz2Info.questions.find((question) => {
        return question.questionId === id && question.question === validQuestions[0].question;
      })).toStrictEqual(undefined);
    });
  });
});

describe('/v1/admin/quiz/{quizid}/question/{questionid}/move', () => {
  let userToken1 : string;
  let userToken2 : string;
  let quizId1 : number;
  let quizId2 : number;

  const quiz1QIds : number[] = [];

  beforeEach(() => {
    // Initialize two users to have 1 quiz each, but only first user has questions
    userToken1 = quiz.adminAuthRegister('marius@gmail.com', 'Marsbars69', 'Marius', 'Edmonds').body.token;
    userToken2 = quiz.adminAuthRegister('yepeng@gmail.com', 'yepeng420', 'Yepeng', 'Lin').body.token;
    quizId1 = quiz.adminQuizCreate(userToken1, 'Geography Game', 'This is a fun quiz').body.quizId;
    quizId2 = quiz.adminQuizCreate(userToken2, 'Geography Game', 'This is a fun quiz').body.quizId;

    const q1Answers: {answer: string, correct: boolean}[] = [{ answer: 'Stockholm', correct: true }, { answer: 'Helsinki', correct: false }];
    quiz1QIds.push(quiz.adminQuizQuestionCreate(quizId1, userToken1, 'What is the capital of sweden?', 5, 5, q1Answers).body.questionId);
    const q2Answers: {answer: string, correct: boolean}[] = [{ answer: 'Stockholm', correct: true }, { answer: 'Helsinki', correct: false }];
    quiz1QIds.push(quiz.adminQuizQuestionCreate(quizId1, userToken1, 'What is the capital of sweden?', 5, 5, q2Answers).body.questionId);
    const q3Answers: {answer: string, correct: boolean}[] = [{ answer: 'Stockholm', correct: true }, { answer: 'Helsinki', correct: false }];
    quiz1QIds.push(quiz.adminQuizQuestionCreate(quizId1, userToken1, 'What is the capital of sweden?', 5, 5, q3Answers).body.questionId);
  });

  // Invalid token
  test.each([
    { token: '' },
    { token: null }
  ])('error case: invalid token', (parameter) => {
    const result: type.Response = quiz.adminQuizQuestionMove(parameter.token, quizId1, quiz1QIds[0], 2);
    expect(result.status).toStrictEqual(401);
    expect(result.body).toStrictEqual(ERROR);
  });

  // User not logged in
  test('error case: correct token, but user is not logged in', () => {
    quiz.adminAuthLogout(userToken1);

    const result: type.Response = quiz.adminQuizQuestionMove(userToken1, quizId1, quiz1QIds[0], 2);
    expect(result.status).toStrictEqual(403);
    expect(result.body).toStrictEqual(ERROR);
  });

  // Quiz is invalid
  test('Invalid quizId', () => {
    const result: type.Response = quiz.adminQuizQuestionMove(userToken1, -1, quiz1QIds[0], 2);
    expect(result.status).toStrictEqual(400);
    expect(result.body).toStrictEqual(ERROR);
  });

  // Quiz exists, but is not owned by user
  test('User does not own specified quiz', () => {
    const result: type.Response = quiz.adminQuizQuestionMove(userToken1, quizId2, quiz1QIds[0], 2);
    expect(result.status).toStrictEqual(400);
    expect(result.body).toStrictEqual(ERROR);
  });

  // Quiz exists, but is not owned by user
  test('Invalid question id', () => {
    const result: type.Response = quiz.adminQuizQuestionMove(userToken1, quizId1, -1, 2);
    expect(result.status).toStrictEqual(400);
    expect(result.body).toStrictEqual(ERROR);
  });

  // Check if new position is valid
  test.each([
    { bound: -1 },
    { bound: quiz1QIds.length }
  ])('NewPosition is < 0 or > n - 1', (arg) => {
    const result: type.Response = quiz.adminQuizQuestionMove(userToken1, quizId1, quiz1QIds[0], arg.bound);
    expect(result.status).toStrictEqual(400);
    expect(result.body).toStrictEqual(ERROR);
  });

  // Make sure new position isn't current
  test('Newposition is current position', () => {
    const result: type.Response = quiz.adminQuizQuestionMove(userToken1, quizId2, quiz1QIds[0], 0);
    expect(result.status).toStrictEqual(400);
    expect(result.body).toStrictEqual(ERROR);
  });

  // Successful move quiz question tests cases:
  // - Move middle to start
  // - Move start to middle
  // - Move middle to end
  test.each([
    { newPosition: 0, quizAtIndexToMove: 1 },
    { newPosition: 1, quizAtIndexToMove: 2 },
    { newPosition: 0, quizAtIndexToMove: 2 }
  ])('Successfully moved quiz', (arg) => {
    const quizIdToMove = quiz1QIds[arg.quizAtIndexToMove];

    // Check return type and status codes
    const destination: type.Response = quiz.adminQuizQuestionMove(userToken1, quizId1, quizIdToMove, arg.newPosition);
    expect(destination.body).toStrictEqual({});
    expect(destination.status).toEqual(200);

    // Check that the question at the new position contains the updated questionId
    const moveResult = quiz.adminQuizInfo(userToken1, quizId1).body.questions[arg.newPosition];
    expect(moveResult.questionId).toEqual(quizIdToMove);
  });

  test.each([
    { positions: [1, 2, 3, 2, 1] },
    { positions: [1, 3, 2, 1, 3] },
    { positions: [2, 1, 3, 1, 2] },
    { positions: [2, 3, 1, 2, 1] },
    { positions: [3, 1, 2, 3, 2] },
    { positions: [3, 2, 1, 2, 3] },
  ])('success, moving multiple times', ({ positions }) => {
    quiz.clear();
    const user1: string = quiz.adminAuthRegister('marius@gmail.com', 'Marsbars69', 'Marius', 'Edmonds').body.token;
    const quiz1: number = quiz.adminQuizCreate(user1, 'COMP1531 is not fun', 'title is true').body.quizId;
    const questionId: number = quiz.adminQuestionCreate(user1, quiz1, additionalValidQuestions[0]).body.questionId;

    for (const question of validQuestions) {
      quiz.adminQuestionCreate(user1, quiz1, question);
    }

    for (const position of positions) {
      const res: type.Response = quiz.adminQuizQuestionMove(user1, quiz1, questionId, position);
      expect(res.status).toStrictEqual(200);
      expect(res.body).toStrictEqual({});

      const afterInfo : type.QuizInfo = quiz.adminQuizInfo(user1, quiz1).body;
      const newPosition = afterInfo.questions.findIndex((question) => {
        return question.questionId === questionId;
      });
      expect(newPosition).toStrictEqual(position);
    }
  });

  test('success: checking timeLastEdited is updated', (done) => {
    quiz.clear();
    const user1: string = quiz.adminAuthRegister('marius@gmail.com', 'Marsbars69', 'Marius', 'Edmonds').body.token;
    const quiz1: number = quiz.adminQuizCreate(user1, 'COMP1531 is not fun', 'title is true').body.quizId;
    const questionId: number = quiz.adminQuestionCreate(user1, quiz1, additionalValidQuestions[0]).body.questionId;

    for (const question of validQuestions) {
      quiz.adminQuestionCreate(user1, quiz1, question);
    }
    const beforeInfo = quiz.adminQuizInfo(user1, quiz1).body;
    setTimeout(() => {
      const res: type.Response = quiz.adminQuizQuestionMove(user1, quiz1, questionId, 2);
      expect(res.status).toStrictEqual(200);
      expect(res.body).toStrictEqual({});

      const afterInfo : type.QuizInfo = quiz.adminQuizInfo(user1, quiz1).body;
      const newPosition = afterInfo.questions.findIndex((question) => {
        return question.questionId === questionId;
      });
      expect(newPosition).toStrictEqual(2);

      expect(beforeInfo.timeLastEdited).toBeLessThan(afterInfo.timeLastEdited);
      expect(beforeInfo.timeLastEdited + 5).toBeGreaterThanOrEqual(afterInfo.timeLastEdited);
      done();
    }, 2000);
  });
});
