// This is here to give the tests a little more time to run
const SECONDS = 1000;
jest.setTimeout(180 * SECONDS);

// import * as hf from '../server/helperfunction';
import * as hf from '../server/route';
import * as typeV2 from '../interfaceV2';
import HTTPError from 'http-errors';

beforeEach(() => {
  hf.clear();
});

afterEach(() => {
  hf.clear();
});

describe('testing for GET route: /v2/admin/quiz/list', () => {
  let user1 : string;
  beforeEach(() => {
    user1 = hf.adminAuthRegister('Yepeng@gmail.com', 'Yepeng12321', 'Yepeng', 'Lin').body.token;
  });

  test('error case: invalid token 1', () => {
    expect(() => hf.adminQuizListV2('')).toThrow(HTTPError[401]);
  });

  test('error case: invalid token 2', () => {
    expect(() => hf.adminQuizListV2(null)).toThrow(HTTPError[401]);
  });

  test('error case: valid token but does not refer to a currently logged in session', () => {
    hf.adminAuthLogoutV2(user1);
    expect(() => hf.adminQuizListV2(user1)).toThrow(HTTPError[403]);
  });

  test('success case: successfully received a list of quizzes', () => {
    let res = hf.adminQuizListV2(user1);
    const expectObject: typeV2.QuizList = {
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

    const sortQuizzes: any = (quiz1: typeV2.QuizDetails, quiz2:typeV2.QuizDetails) => {
      if (JSON.stringify(quiz1) < JSON.stringify(quiz2)) return -1;
      return 1;
    };

    for (const object of names) {
      res = hf.adminQuizListV2(user1);
      expect(res.quizzes.sort(sortQuizzes)).toStrictEqual(expectObject.quizzes.sort(sortQuizzes));
      const name: string = object.name;
      const quizId: number = hf.adminQuizCreateV2(user1, name, '').quizId;
      expectObject.quizzes.push({
        quizId: quizId,
        name: name
      });
    }
    res = hf.adminQuizListV2(user1);
    expect(res.quizzes.sort(sortQuizzes)).toStrictEqual(expectObject.quizzes.sort(sortQuizzes));
  });
});

describe('testing for POST route: /v1/admin/quiz', () => {
  const SUCCESS: typeV2.QuizId = { quizId: expect.any(Number) };
  let userToken: string;
  beforeEach(() => {
    userToken = hf.adminAuthRegister('Yepeng@gmail.com', 'Password1234', 'Yepeng', 'Lin').body.token;
  });

  test.each([
    { token: '' },
    { token: null },
  ])('error case: invalid token structure', ({ token }) => {
    expect(() => hf.adminQuizCreateV2(token, 'name', '')).toThrow(HTTPError[401]);
  });

  test('error case: valid token structure but does not refer to a logged in session', () => {
    hf.adminAuthLogoutV2(userToken);
    expect(() => hf.adminQuizCreateV2(userToken, 'name', '')).toThrow(HTTPError[403]);
  });

  test.each([
    { name: 'Quiz!Name' },
    { name: 'Name_With_Underscore' },
    { name: 'My Quiz@2023' },
    { name: "Jane's Quiz" },
    { name: 'My/Quiz' },
    { name: 'Quiz: Star Wars' },
  ])('error case: invalid name-names containing non-alphanumeric characters', ({ name }) => {
    expect(() => hf.adminQuizCreateV2(userToken, name, '')).toThrow(HTTPError[400]);
  });

  test.each([
    { name: 'Qz' }, // (less than 3 characters)
    { name: 'This name is very long and certainly exceeds the maximum number of allowed characters' }, // (more than 30 characters)
    { name: 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz' }, // (more than 30 characters)
    { name: 'ab' } // (less than 3 characters)
  ])('error case: invalid name-names less than 3 characters long or more than 30 characters long', ({ name }) => {
    expect(() => hf.adminQuizCreateV2(userToken, name, '')).toThrow(HTTPError[400]);
  });

  test('error case: invalid name-name is already used by the current logged in user for another quiz', () => {
    hf.adminQuizCreateV2(userToken, 'ScienceQuiz2023', '');
    expect(() => hf.adminQuizCreateV2(userToken, 'ScienceQuiz2023', '')).toThrow(HTTPError[400]);
  });

  test('error case: description is more than 100 characters in length', () => {
    const description = 'The greatest glory in living lies not in never falling, but in rising every time we fall. - Nelson Mandela';
    expect(() => hf.adminQuizCreateV2(userToken, 'ScienceQuiz2023', description)).toThrow(HTTPError[400]);
  });

  test.each([
    { name: 'Science Quiz2023' },
    { name: 'Math Challenge' },
    { name: 'History Trivia' },
    { name: 'Literature Test' },
  ])('successful quiz creation', ({ name }) => {
    const res: typeV2.Response = hf.adminQuizCreateV2(userToken, name, '');
    expect(res).toStrictEqual(SUCCESS);
  });
});

describe('testing for DELETE route: /v1/admin/quiz/{quizId}', () => {
  const SUCCESS: typeV2.Empty = {};
  let user1 : any;
  let user2 : any;
  let quiz1 : any;
  let quiz2 : any;

  beforeEach(() => {
    user1 = hf.adminAuthRegister('Yepeng@gmail.com', 'Yepeng12321', 'Yepeng', 'Lin').body.token;
    // user2 = adminAuthRegister('Hayden@gmail.com', 'Hayden12321', 'Hayden', 'Smith').body.token;
    quiz1 = hf.adminQuizCreateV2(user1, 'GeographyGame', '').quizId;
    // quiz2 = adminQuizCreateV2(user2, 'LiteratureTest', '').body.quizId;
  });

  test('error case: invalid token 1', () => {
    expect(() => hf.adminQuizRemoveV2('', quiz1)).toThrow(HTTPError[401]);
  });

  test('error case: invalid token ', () => {
    expect(() => hf.adminQuizRemoveV2(null, quiz1)).toThrow(HTTPError[401]);
  });

  test('error case: valid token but does not refer to a currently logged in session', () => {
    hf.adminAuthLogoutV2(user1);
    expect(() => hf.adminQuizRemoveV2(user1, quiz1)).toThrow(HTTPError[403]);
  });

  test('error case: invalid quizId', () => {
    expect(() => hf.adminQuizRemoveV2(user1, quiz1 + 1)).toThrow(HTTPError[400]);
  });

  test('error case: quizId does not refer to a quiz owned by this user', () => {
    user2 = hf.adminAuthRegister('Hayden@gmail.com', 'Hayden12321', 'Hayden', 'Smith').body.token;
    quiz2 = hf.adminQuizCreateV2(user2, 'LiteratureTest', '').quizId;

    expect(() => hf.adminQuizRemoveV2(user1, quiz2)).toThrow(HTTPError[400]);
    expect(() => hf.adminQuizRemoveV2(user2, quiz1)).toThrow(HTTPError[400]);
  });

  test('successful removal', () => {
    user2 = hf.adminAuthRegister('Hayden@gmail.com', 'Hayden12321', 'Hayden', 'Smith').body.token;
    quiz2 = hf.adminQuizCreateV2(user2, 'LiteratureTest', '').quizId;

    const res1: typeV2.Response = hf.adminQuizRemoveV2(user1, quiz1);
    const res2: typeV2.Response = hf.adminQuizRemoveV2(user2, quiz2);
    expect(res1).toStrictEqual(SUCCESS);
    expect(res2).toStrictEqual(SUCCESS);
  });
});

describe('testing for GET route: /v1/admin/quiz/{quizId}', () => {
  let user1 : string;
  let user2 : string;
  let quiz1 : number;
  let quiz2 : number;
  let quiz1TimeCreated: number;

  beforeEach(() => {
    user1 = hf.adminAuthRegister('Yepeng@gmail.com', 'Yepeng12321', 'Yepeng', 'Lin').body.token;
    // user2 = adminAuthRegister('Hayden@gmail.com', 'Hayden12321', 'Hayden', 'Smith').body.token;
    quiz1 = hf.adminQuizCreateV2(user1, 'GeographyGame', '').quizId;
    quiz1TimeCreated = Math.floor(Date.now() / 1000);
    // quiz2 = adminQuizCreateV2(user2, 'LiteratureTest', '').body.quizId;
  });

  test('error case: invalid token 1', () => {
    expect(() => hf.adminQuizInfoV2('', quiz1)).toThrow(HTTPError[401]);
  });

  test('error case: invalid token 2', () => {
    expect(() => hf.adminQuizInfoV2(null, quiz1)).toThrow(HTTPError[401]);
  });

  test('error case: valid token but does not refer to a currently logged in session', () => {
    hf.adminAuthLogoutV2(user1);
    expect(() => hf.adminQuizInfoV2(user1, quiz1)).toThrow(HTTPError[403]);
  });

  test('error case: quizId does not exist', () => {
    expect(() => hf.adminQuizInfoV2(user1, quiz1 + 1)).toThrow(HTTPError[400]);
  });

  test('error case: quizId does not refer to a quiz owned by this user', () => {
    user2 = hf.adminAuthRegister('Hayden@gmail.com', 'Hayden12321', 'Hayden', 'Smith').body.token;
    quiz2 = hf.adminQuizCreateV2(user2, 'LiteratureTest', '').quizId;

    expect(() => hf.adminQuizInfoV2(user1, quiz2)).toThrow(HTTPError[400]);
    expect(() => hf.adminQuizInfoV2(user2, quiz1)).toThrow(HTTPError[400]);
  });
  test('success case: received quiz information', () => {
    const res: any = hf.adminQuizInfoV2(user1, quiz1);
    const expectedResponse: typeV2.QuizInfo = {
      quizId: quiz1,
      name: 'GeographyGame',
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: '',
      numQuestions: 0,
      questions: [],
      duration: 0,
      thumbnailUrl: expect.any(String),
    };
    expect(res).toStrictEqual(expectedResponse);
    expect(res.timeCreated).toBeGreaterThanOrEqual(quiz1TimeCreated - 1);
    expect(res.timeCreated).toBeLessThanOrEqual(quiz1TimeCreated + 1);
    expect(res.timeLastEdited).toBeGreaterThanOrEqual(quiz1TimeCreated - 1);
    expect(res.timeLastEdited).toBeLessThanOrEqual(quiz1TimeCreated + 1);
  });
});

describe('testing for PUT route: /v1/admin/quiz/{quizId}/name', () => {
  const SUCCESS: typeV2.Empty = {};
  let user1 : string;
  let user2 : string;
  let quiz1 : number;
  let quiz2 : number;
  let quiz1TimeCreated: number;
  let quiz1TimeLastEdited: number;

  beforeEach(() => {
    user1 = hf.adminAuthRegister('Yepeng@gmail.com', 'Yepeng12321', 'Yepeng', 'Lin').body.token;
    // user2 = adminAuthRegister('Hayden@gmail.com', 'Hayden12321', 'Hayden', 'Smith').body.token;
    quiz1 = hf.adminQuizCreateV2(user1, 'GeographyGame', '').quizId;
    quiz1TimeCreated = Math.floor(Date.now() / 1000);
    quiz1TimeLastEdited = quiz1TimeCreated;
    // quiz2 = adminQuizCreateV2(user2, 'LiteratureTest', '').body.quizId;
  });

  test('error case: invalid token', () => {
    expect(() => hf.adminQuizNameUpdateV2('', quiz1, 'Math Challenge')).toThrow(HTTPError[401]);

    const info: any = hf.adminQuizInfoV2(user1, quiz1);
    expect(info.name).toStrictEqual('GeographyGame');
    expect(info.timeLastEdited).toBeGreaterThanOrEqual(quiz1TimeCreated - 1);
    expect(info.timeLastEdited).toBeLessThanOrEqual(quiz1TimeCreated + 1);
  });

  test('error case: invalid token', () => {
    expect(() => hf.adminQuizNameUpdateV2(null, quiz1, 'Math Challenge')).toThrow(HTTPError[401]);

    const info: any = hf.adminQuizInfoV2(user1, quiz1);
    expect(info.name).toStrictEqual('GeographyGame');
    expect(info.timeLastEdited).toBeGreaterThanOrEqual(quiz1TimeCreated - 1);
    expect(info.timeLastEdited).toBeLessThanOrEqual(quiz1TimeCreated + 1);
  });

  test('error case: valid token but does not refer to a currently logged in session', () => {
    hf.adminAuthLogoutV2(user1);
    expect(() => hf.adminQuizNameUpdateV2(user1, quiz1, 'Math Challenge')).toThrow(HTTPError[403]);

    user1 = hf.adminAuthLogin('Yepeng@gmail.com', 'Yepeng12321').body.token;
    const info: any = hf.adminQuizInfoV2(user1, quiz1);
    expect(info.name).toStrictEqual('GeographyGame');
    expect(info.timeLastEdited).toBeGreaterThanOrEqual(quiz1TimeCreated - 1);
    expect(info.timeLastEdited).toBeLessThanOrEqual(quiz1TimeCreated + 1);
  });

  test('error case: quizId does not exist', () => {
    expect(() => hf.adminQuizNameUpdateV2(user1, quiz1 + 1, 'Math Challenge')).toThrow(HTTPError[400]);

    const info: any = hf.adminQuizInfoV2(user1, quiz1);
    expect(info.name).toStrictEqual('GeographyGame');
    expect(info.timeLastEdited).toBeGreaterThanOrEqual(quiz1TimeCreated - 1);
    expect(info.timeLastEdited).toBeLessThanOrEqual(quiz1TimeCreated + 1);
  });

  test('error case: quizId does not refer to a quiz owned by this user', () => {
    user2 = hf.adminAuthRegister('Hayden@gmail.com', 'Hayden12321', 'Hayden', 'Smith').body.token;
    quiz2 = hf.adminQuizCreateV2(user2, 'LiteratureTest', '').quizId;

    expect(() => hf.adminQuizNameUpdateV2(user1, quiz2, 'Math Challenge')).toThrow(HTTPError[400]);
    expect(() => hf.adminQuizNameUpdateV2(user2, quiz1, 'History Trivia')).toThrow(HTTPError[400]);

    const info: any = hf.adminQuizInfoV2(user1, quiz1);
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
    expect(() => hf.adminQuizNameUpdateV2(user1, quiz1, name)).toThrow(HTTPError[400]);

    const info: any = hf.adminQuizInfoV2(user1, quiz1);
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
    expect(() => hf.adminQuizNameUpdateV2(user1, quiz1, name)).toThrow(HTTPError[400]);

    const info: any = hf.adminQuizInfoV2(user1, quiz1);
    expect(info.name).toStrictEqual('GeographyGame');
    expect(info.timeLastEdited).toBeGreaterThanOrEqual(quiz1TimeCreated - 1);
    expect(info.timeLastEdited).toBeLessThanOrEqual(quiz1TimeCreated + 1);
  });

  test('error case: invalid name-name is already used by the current logged in user for another quiz', () => {
    quiz2 = hf.adminQuizCreateV2(user1, 'ScienceQuiz2023', '').quizId;
    expect(() => hf.adminQuizNameUpdateV2(user1, quiz1, 'ScienceQuiz2023')).toThrow(HTTPError[400]);

    const info: any = hf.adminQuizInfoV2(user1, quiz1);
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
    const res: typeV2.Response = hf.adminQuizNameUpdateV2(user1, quiz1, name);
    quiz1TimeLastEdited = Math.floor(Date.now() / 1000);
    expect(res).toStrictEqual(SUCCESS);

    const info: any = hf.adminQuizInfoV2(user1, quiz1);
    expect(info.name).toStrictEqual(name);
    expect(info.timeLastEdited).toBeGreaterThanOrEqual(quiz1TimeLastEdited - 1);
    expect(info.timeLastEdited).toBeLessThanOrEqual(quiz1TimeLastEdited + 1);
  });
});

describe('testing for PUT route: /v1/admin/quiz/{quizId}/description', () => {
  const SUCCESS: typeV2.Empty = {};
  let user1 : string;
  let user2 : string;
  let quiz1 : number;
  let quiz2 : number;
  let quiz1TimeCreated: number;
  let quiz1TimeLastEdited: number;

  beforeEach(() => {
    user1 = hf.adminAuthRegister('Yepeng@gmail.com', 'Yepeng12321', 'Yepeng', 'Lin').body.token;
    // user2 = adminAuthRegister('Hayden@gmail.com', 'Hayden12321', 'Hayden', 'Smith').body.token;
    quiz1 = hf.adminQuizCreateV2(user1, 'GeographyGame', '').quizId;
    quiz1TimeCreated = Math.floor(Date.now() / 1000);
    quiz1TimeLastEdited = quiz1TimeCreated;
    // quiz2 = adminQuizCreateV2(user2, 'LiteratureTest', '').body.quizId;
  });

  test('error case: invalid token', () => {
    expect(() => hf.adminQuizDescriptionUpdateV2('', quiz1, 'laugh out loud')).toThrow(HTTPError[401]);

    const info: any = hf.adminQuizInfoV2(user1, quiz1);
    expect(info.description).toStrictEqual('');
    expect(info.timeLastEdited).toBeGreaterThanOrEqual(quiz1TimeCreated - 1);
    expect(info.timeLastEdited).toBeLessThanOrEqual(quiz1TimeCreated + 1);
  });

  test('error case: invalid token', () => {
    expect(() => hf.adminQuizDescriptionUpdateV2(null, quiz1, 'laugh out loud')).toThrow(HTTPError[401]);

    const info: any = hf.adminQuizInfoV2(user1, quiz1);
    expect(info.description).toStrictEqual('');
    expect(info.timeLastEdited).toBeGreaterThanOrEqual(quiz1TimeCreated - 1);
    expect(info.timeLastEdited).toBeLessThanOrEqual(quiz1TimeCreated + 1);
  });

  test('error case: valid token but does not refer to a currently logged in session', () => {
    hf.adminAuthLogoutV2(user1);
    expect(() => hf.adminQuizDescriptionUpdateV2(user1, quiz1, 'laugh out loud')).toThrow(HTTPError[403]);

    user1 = hf.adminAuthLogin('Yepeng@gmail.com', 'Yepeng12321').body.token;
    const info: any = hf.adminQuizInfoV2(user1, quiz1);
    expect(info.description).toStrictEqual('');
    expect(info.timeLastEdited).toBeGreaterThanOrEqual(quiz1TimeCreated - 1);
    expect(info.timeLastEdited).toBeLessThanOrEqual(quiz1TimeCreated + 1);
  });

  test('error case: quizId does not exist', () => {
    expect(() => hf.adminQuizDescriptionUpdateV2(user1, quiz1 + 1, 'laugh out loud')).toThrow(HTTPError[400]);

    const info: any = hf.adminQuizInfoV2(user1, quiz1);
    expect(info.description).toStrictEqual('');
    expect(info.timeLastEdited).toBeGreaterThanOrEqual(quiz1TimeCreated - 1);
    expect(info.timeLastEdited).toBeLessThanOrEqual(quiz1TimeCreated + 1);
  });

  test('error case: quizId does not refer to a quiz owned by this user', () => {
    user2 = hf.adminAuthRegister('Hayden@gmail.com', 'Hayden12321', 'Hayden', 'Smith').body.token;
    quiz2 = hf.adminQuizCreateV2(user2, 'LiteratureTest', '').quizId;

    expect(() => hf.adminQuizDescriptionUpdateV2(user1, quiz2, 'laugh out loud')).toThrow(HTTPError[400]);
    expect(() => hf.adminQuizDescriptionUpdateV2(user2, quiz1, 'laugh out loud')).toThrow(HTTPError[400]);

    const info1: any = hf.adminQuizInfoV2(user1, quiz1);
    expect(info1.description).toStrictEqual('');
    expect(info1.timeLastEdited).toBeGreaterThanOrEqual(quiz1TimeCreated - 1);
    expect(info1.timeLastEdited).toBeLessThanOrEqual(quiz1TimeCreated + 1);

    const info2: any = hf.adminQuizInfoV2(user2, quiz2);
    expect(info2.description).toStrictEqual('');
    expect(info2.timeLastEdited).toBeGreaterThanOrEqual(quiz1TimeCreated - 1);
    expect(info2.timeLastEdited).toBeLessThanOrEqual(quiz1TimeCreated + 1);
  });

  test('error case: description is more than 100 characters in length', () => {
    const description = 'The greatest glory in living lies not in never falling, but in rising every time we fall. - Nelson Mandela';
    expect(() => hf.adminQuizDescriptionUpdateV2(user1, quiz1, description)).toThrow(HTTPError[400]);

    const info: any = hf.adminQuizInfoV2(user1, quiz1);
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
    const res: typeV2.Response = hf.adminQuizDescriptionUpdateV2(user1, quiz1, description);
    quiz1TimeLastEdited = Math.floor(Date.now() / 1000);
    expect(res).toStrictEqual(SUCCESS);
    const info: any = hf.adminQuizInfoV2(user1, quiz1);
    expect(info.description).toStrictEqual(description);
    expect(info.timeLastEdited).toBeGreaterThanOrEqual(quiz1TimeLastEdited - 1);
    expect(info.timeLastEdited).toBeLessThanOrEqual(quiz1TimeLastEdited + 1);
  });
});
// // To here is new comment

describe('GET route for /v2/admin/quiz/trash', () => {
  let userToken : string;
  const quizIds : number[] = [];

  beforeEach(() => {
    userToken = hf.adminAuthRegister('marius@gmail.com', 'Marsbars69', 'Marius', 'Edmonds').body.token;

    quizIds.push(hf.adminQuizCreateV2(userToken, 'quiz1name', 'lorem').quizId);
    quizIds.push(hf.adminQuizCreateV2(userToken, 'quiz2name', 'ipsum').quizId);
    quizIds.push(hf.adminQuizCreateV2(userToken, 'quiz3name', 'dolor').quizId);
    quizIds.push(hf.adminQuizCreateV2(userToken, 'quiz4name', 'sit').quizId);
    quizIds.push(hf.adminQuizCreateV2(userToken, 'quiz5name', 'sit').quizId);

    hf.adminQuizRemoveV2(userToken, quizIds[0]);
    hf.adminQuizRemoveV2(userToken, quizIds[2]);
    hf.adminQuizRemoveV2(userToken, quizIds[4]);
  });

  // Check for invalid token and correct error type
  test.each([
    { token: '' },
    { token: null }
  ])('error case: invalid token', (parameter) => {
    expect(() => hf.adminQuizTrashV2(parameter.token)).toThrow(HTTPError[401]);
  });

  // Check for valid token and correct error type and user not logged in
  test('error case: correct token, but user is not logged in', () => {
    hf.adminAuthLogoutV2(userToken);
    expect(() => hf.adminQuizTrashV2(userToken)).toThrow(HTTPError[403]);
  });

  // Trash quiz success
  test('Successful return of trashed quizes', () => {
    const result: typeV2.Response = hf.adminQuizTrashV2(userToken);
    expect(result).toStrictEqual({
      quizzes: [{ name: 'quiz1name', quizId: expect.any(Number) }, { name: 'quiz3name', quizId: expect.any(Number) }, { name: 'quiz5name', quizId: expect.any(Number) }]
    });
  });
});

describe('testing for route: /v1/admin/quiz/{quizId}/restore', () => {
  const SUCCESS: typeV2.Empty = {};
  let user1 : string;

  beforeEach(() => {
    user1 = hf.adminAuthRegister('Yepeng@gmail.com', 'Yepeng12321', 'Yepeng', 'Lin').body.token;
  });

  test('error case: Token is not a valid structure--empty', () => {
    const quiz1: number = hf.adminQuizCreateV2(user1, 'GeographyGame', '').quizId;
    hf.adminQuizRemoveV2(user1, quiz1);
    expect(() => hf.adminQuizRestoreV2('', quiz1)).toThrow(HTTPError[401]);
  });

  test('error case: Token is not a valid structure--null', () => {
    const quiz1: number = hf.adminQuizCreateV2(user1, 'GeographyGame', '').quizId;
    hf.adminQuizRemoveV2(user1, quiz1);
    expect(() => hf.adminQuizRestoreV2(null, quiz1)).toThrow(HTTPError[401]);
  });

  test('error case: valid token but does not refer to a currently logged in session', () => {
    const quiz1: number = hf.adminQuizCreateV2(user1, 'GeographyGame', '').quizId;
    hf.adminQuizRemoveV2(user1, quiz1);
    hf.adminAuthLogoutV2(user1);
    expect(() => hf.adminQuizRestoreV2(user1, quiz1)).toThrow(HTTPError[403]);
  });

  test('error case: Quiz ID does not refer to a valid quiz', () => {
    const quiz1: number = hf.adminQuizCreateV2(user1, 'GeographyGame', '').quizId;
    hf.adminQuizRemoveV2(user1, quiz1);
    expect(() => hf.adminQuizRestoreV2(user1, quiz1 + 1)).toThrow(HTTPError[400]);
  });

  test('error case: Quiz ID does not refer to a quiz that this user owns', () => {
    const quiz1: number = hf.adminQuizCreateV2(user1, 'GeographyGame', '').quizId;
    const user2: string = hf.adminAuthRegister('Hayden@gmail.com', 'Hayden12321', 'Hayden', 'Smith').body.token;
    const quiz2: number = hf.adminQuizCreateV2(user2, 'LiteratureTest', '').quizId;
    hf.adminQuizRemoveV2(user1, quiz1);
    hf.adminQuizRemoveV2(user2, quiz2);

    expect(() => hf.adminQuizRestoreV2(user2, quiz1)).toThrow(HTTPError[400]);
    expect(() => hf.adminQuizRestoreV2(user1, quiz2)).toThrow(HTTPError[400]);
  });

  test('error case: Quiz ID refers to a quiz that is not currently in the trash', () => {
    const quiz1: number = hf.adminQuizCreateV2(user1, 'GeographyGame', '').quizId;
    expect(() => hf.adminQuizRestoreV2(user1, quiz1)).toThrow(HTTPError[400]);
  });

  test('success case: correct behaviour', () => {
    const trashExpectObject: typeV2.QuizList = {
      quizzes: []
    };
    const listExpectObject: typeV2.QuizList = {
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

    const sortQuizzes: any = (quiz1: typeV2.QuizDetails, quiz2:typeV2.QuizDetails) => {
      if (JSON.stringify(quiz1) < JSON.stringify(quiz2)) return -1;
      return 1;
    };

    for (const object of names) {
      const name: string = object.name;
      const quizId: number = hf.adminQuizCreateV2(user1, name, '').quizId;
      listExpectObject.quizzes.push({
        quizId: quizId,
        name: name
      });
    }

    for (const object of listExpectObject.quizzes) {
      const quizId: number = object.quizId;
      trashExpectObject.quizzes.push({ ...object });
      hf.adminQuizRemoveV2(user1, quizId);
      // let index = listExpectObject.quizzes.indexOf(object);
      const index: any = listExpectObject.quizzes.findIndex((item) => {
        return item.quizId === object.quizId;
      });
      listExpectObject.quizzes.splice(index, 1);
    }

    let list = hf.adminQuizListV2(user1);
    let trash = hf.adminQuizTrashV2(user1);

    expect(list.quizzes.sort(sortQuizzes)).toStrictEqual(listExpectObject.quizzes.sort(sortQuizzes));
    expect(trash.quizzes.sort(sortQuizzes)).toStrictEqual(trashExpectObject.quizzes.sort(sortQuizzes));

    for (const object of trashExpectObject.quizzes) {
      const quizId: number = object.quizId;
      listExpectObject.quizzes.push({ ...object });
      const res: typeV2.Response = hf.adminQuizRestoreV2(user1, quizId);
      expect(res).toStrictEqual(SUCCESS);
      // let index = listExpectObject.quizzes.indexOf(object);
      const index: any = trashExpectObject.quizzes.findIndex((item) => {
        return item.quizId === object.quizId;
      });
      trashExpectObject.quizzes.splice(index, 1);
      list = hf.adminQuizListV2(user1);
      trash = hf.adminQuizTrashV2(user1);
      expect(list.quizzes.sort(sortQuizzes)).toStrictEqual(listExpectObject.quizzes.sort(sortQuizzes));
      expect(trash.quizzes.sort(sortQuizzes)).toStrictEqual(trashExpectObject.quizzes.sort(sortQuizzes));
    }
  });
});

describe('DELETE route for /v2/admin/quiz/trash/empty', () => {
  const sortQuizzes: any = (quiz1: typeV2.QuizDetails, quiz2:typeV2.QuizDetails) => {
    if (JSON.stringify(quiz1) < JSON.stringify(quiz2)) return -1;
    return 1;
  };

  const SUCCESS: typeV2.Empty = {};
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
    user1 = hf.adminAuthRegister('Yepeng@gmail.com', 'Yepeng12321', 'Yepeng', 'Lin').body.token;
  });

  test('error case: Token is not a valid structure--empty', () => {
    const quizId: number = hf.adminQuizCreateV2(user1, 'Geography Quiz2023', '').quizId;
    hf.adminQuizRemoveV2(user1, quizId);
    expect(() => hf.adminQuizEmptyTrashV2('', [quizId])).toThrow(HTTPError[401]);
  });

  test('error case: Token is not a valid structure--null', () => {
    const quizId: number = hf.adminQuizCreateV2(user1, 'Geography Quiz2023', '').quizId;
    hf.adminQuizRemoveV2(user1, quizId);
    expect(() => hf.adminQuizEmptyTrashV2(null, [quizId])).toThrow(HTTPError[401]);
  });

  test('error case: valid token but does not refer to a currently logged in session', () => {
    const quizId: number = hf.adminQuizCreateV2(user1, 'Geography Quiz2023', '').quizId;
    hf.adminQuizRemoveV2(user1, quizId);
    hf.adminAuthLogoutV2(user1);
    expect(() => hf.adminQuizEmptyTrashV2(user1, [quizId])).toThrow(HTTPError[403]);
  });

  test('error case: One or more of the Quiz IDs is not a valid quiz', () => {
    const quizId1: number = hf.adminQuizCreateV2(user1, 'Geography Quiz2023', '').quizId;
    hf.adminQuizRemoveV2(user1, quizId1);
    expect(() => hf.adminQuizEmptyTrashV2(user1, [quizId1 + 1])).toThrow(HTTPError[400]);
  });

  test('error case: One or more of the Quiz IDs refers to a quiz that this current user does not own', () => {
    const user2: string = hf.adminAuthRegister('Hayden@gmail.com', 'Hayden12321', 'Hayden', 'Smith').body.token;
    const user1Quizzes: number[] = [];
    const user2Quizzes: number[] = [];
    const trash1 : typeV2.QuizList = {
      quizzes: []
    };

    const trash2 : typeV2.QuizList = {
      quizzes: []
    };
    for (let i = 0; i < 5; i++) {
      const name: string = names[i].name;
      const quizId: number = hf.adminQuizCreateV2(user1, name, '').quizId;
      hf.adminQuizRemoveV2(user1, quizId);
      trash1.quizzes.push({
        quizId: quizId,
        name: name
      });
      user1Quizzes.push(quizId);
    }

    for (let i = 5; i < 10; i++) {
      const name: string = names[i].name;
      const quizId: number = hf.adminQuizCreateV2(user2, name, '').quizId;
      hf.adminQuizRemoveV2(user2, quizId);
      trash2.quizzes.push({
        quizId: quizId,
        name: name
      });
      user2Quizzes.push(quizId);
    }

    expect(() => hf.adminQuizEmptyTrashV2(user1, [...user1Quizzes, user2Quizzes[0], user2Quizzes[1]])).toThrow(HTTPError[400]);

    expect(hf.adminQuizTrashV2(user1).quizzes.sort(sortQuizzes)).toStrictEqual(trash1.quizzes.sort(sortQuizzes));

    expect(() => hf.adminQuizEmptyTrashV2(user2, [...user2Quizzes, user1Quizzes[0], user1Quizzes[1]])).toThrow(HTTPError[400]);

    expect(hf.adminQuizTrashV2(user2).quizzes.sort(sortQuizzes)).toStrictEqual(trash2.quizzes.sort(sortQuizzes));
  });

  test('error case: One or more of the Quiz IDs is not currently in the trash', () => {
    const trash1 : typeV2.QuizList = {
      quizzes: []
    };
    const user1Quizzes : number[] = [];
    for (const object of names) {
      const name: string = object.name;
      const quizId: number = hf.adminQuizCreateV2(user1, name, '').quizId;
      hf.adminQuizRemoveV2(user1, quizId);
      trash1.quizzes.push({
        quizId: quizId,
        name: name
      });
      user1Quizzes.push(quizId);
    }
    for (const item of user1Quizzes) {
      hf.adminQuizRestoreV2(user1, item);
      expect(() => hf.adminQuizEmptyTrashV2(user1, [...user1Quizzes])).toThrow(HTTPError[400]);

      // expect(adminQuizTrashV2(user1).body.quizzes.sort(sortQuizzes)).toStrictEqual(trash1.quizzes.sort(sortQuizzes));
    }
  });

  test('Success case: successfully removed quizzes in trash', () => {
    const trash1 : typeV2.QuizList = {
      quizzes: []
    };
    const user1Quizzes : number[] = [];
    for (const object of names) {
      const name: string = object.name;
      const quizId: number = hf.adminQuizCreateV2(user1, name, '').quizId;
      hf.adminQuizRemoveV2(user1, quizId);
      trash1.quizzes.push({
        quizId: quizId,
        name: name
      });
      user1Quizzes.push(quizId);
    }
    for (const item of user1Quizzes) {
      const res: typeV2.Response = hf.adminQuizEmptyTrashV2(user1, [item]);

      expect(res).toStrictEqual(SUCCESS);

      const index: any = trash1.quizzes.findIndex((quiz) => {
        return quiz.quizId === item;
      });

      trash1.quizzes.splice(index, 1);
      expect(hf.adminQuizTrashV2(user1).quizzes.sort(sortQuizzes)).toStrictEqual(trash1.quizzes.sort(sortQuizzes));
    }
  });
});

describe('POST route: /v2/admin/quiz/{quizId}/transfer', () => {
  const sortQuizzes: any = (quiz1: typeV2.QuizDetails, quiz2:typeV2.QuizDetails) => {
    if (JSON.stringify(quiz1) < JSON.stringify(quiz2)) return -1;
    return 1;
  };

  const SUCCESS: typeV2.Empty = {};
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
    user1 = hf.adminAuthRegister('Yepeng@gmail.com', 'Yepeng12321', 'Yepeng', 'Lin').body.token;
    user2 = hf.adminAuthRegister('Hayden@gmail.com', 'Hayden12321', 'Hayden', 'Smith').body.token;
    quizId1 = hf.adminQuizCreateV2(user1, 'Geography Quiz2023', '').quizId;
  });

  test('error case: Token is not a valid structure--empty', () => {
    expect(() => hf.adminQuizTransferV2('', quizId1, 'Hayden@gmail.com')).toThrow(HTTPError[401]);
  });

  test('error case: Token is not a valid structure--null', () => {
    expect(() => hf.adminQuizTransferV2(null, quizId1, 'Hayden@gmail.com')).toThrow(HTTPError[401]);
  });

  test('error case: valid token but does not refer to a currently logged in session', () => {
    hf.adminAuthLogoutV2(user1);
    expect(() => hf.adminQuizTransferV2(user1, quizId1, 'Hayden@gmail.com')).toThrow(HTTPError[403]);
  });

  test('error case: Quiz ID does not refer to a valid quiz', () => {
    expect(() => hf.adminQuizTransferV2(user1, quizId1 + 1, 'Hayden@gmail.com')).toThrow(HTTPError[400]);
  });

  test('error: Quiz ID does not refer to a quiz that this user owns', () => {
    const quizId2: number = hf.adminQuizCreateV2(user2, 'Science Quiz2023', '').quizId;
    expect(() => hf.adminQuizTransferV2(user1, quizId2, 'Hayden@gmail.com')).toThrow(HTTPError[400]);
    expect(() => hf.adminQuizTransferV2(user2, quizId1, 'Hayden@gmail.com')).toThrow(HTTPError[400]);
  });

  test('error case: userEmail is not a real user', () => {
    expect(() => hf.adminQuizTransferV2(user1, quizId1, 'Youngbabe@gmail.com')).toThrow(HTTPError[400]);
  });

  test('userEmail is the current logged in user', () => {
    hf.adminAuthLogoutV2(user2);
    expect(() => hf.adminQuizTransferV2(user1, quizId1, 'Yepeng@gmail.com')).toThrow(HTTPError[400]);
  });

  test('error case: Quiz ID refers to a quiz that has a name that is already used by the target user', () => {
    hf.adminQuizCreateV2(user2, 'Geography Quiz2023', '');
    expect(() => hf.adminQuizTransferV2(user1, quizId1, 'Hayden@gmail.com')).toThrow(HTTPError[400]);
  });

  test('success case: successfully transferred quizzes to another user', () => {
    const user1Quizzes : typeV2.QuizList = {
      quizzes: [
        {
          quizId: quizId1,
          name: 'Geography Quiz2023'
        }
      ]
    };
    const user2Quizzes : typeV2.QuizList = {
      quizzes: []
    };

    for (const object of names) {
      const quizId: number = hf.adminQuizCreateV2(user1, object.name, '').quizId;
      user1Quizzes.quizzes.push({
        quizId: quizId,
        name: object.name
      });
    }

    user1Quizzes.quizzes.forEach((object, index) => {
      const list1: any = hf.adminQuizListV2(user1);
      const list2: any = hf.adminQuizListV2(user2);
      expect(list1.quizzes.sort(sortQuizzes)).toStrictEqual(user1Quizzes.quizzes.sort(sortQuizzes));
      expect(list2.quizzes.sort(sortQuizzes)).toStrictEqual(user2Quizzes.quizzes.sort(sortQuizzes));
      const quizId: number = object.quizId;
      const res: typeV2.Response = hf.adminQuizTransferV2(user1, quizId, 'Hayden@gmail.com');
      expect(res).toStrictEqual(SUCCESS);
      user2Quizzes.quizzes.push({ ...object });
      user1Quizzes.quizzes.splice(index, 1);
    });
    const list1: any = hf.adminQuizListV2(user1);
    const list2: any = hf.adminQuizListV2(user2);
    expect(list1.quizzes.sort(sortQuizzes)).toStrictEqual(user1Quizzes.quizzes.sort(sortQuizzes));
    expect(list2.quizzes.sort(sortQuizzes)).toStrictEqual(user2Quizzes.quizzes.sort(sortQuizzes));
  });
});

// // TODO: Create test cases for image url
describe('POST route for /v1/admin/quiz/{quizid}/question', () => {
  let userToken : string;
  const quizIds : number[] = [];

  let validAnswers : typeV2.AnswerDetails[];
  let shortAnswer : typeV2.AnswerDetails[];
  let longAnswer : typeV2.AnswerDetails[];
  let answerNameShort : typeV2.AnswerDetails[];
  let answerNameLong : typeV2.AnswerDetails[];
  let answerDuplicates : typeV2.AnswerDetails[];
  let answerNoCorrects : typeV2.AnswerDetails[];
  let beforeInfo : typeV2.QuizInfo;

  let validUrl : string;
  let invalidUrl : string;
  let invalidFormatUrl : string;
  let emptyUrl : string;

  beforeEach(() => {
    userToken = hf.adminAuthRegister('marius@gmail.com', 'Marsbars69', 'Marius', 'Edmonds').body.token;

    quizIds.push(hf.adminQuizCreateV2(userToken, 'Geography Game', '').quizId);

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
    beforeInfo = hf.adminQuizInfoV2(userToken, quizIds[0]);

    // Make sure this url still works
    validUrl = 'https://i.imgur.com/4CJ1TaY.png';
    invalidFormatUrl = 'https://i.imgur.com/jlFgGpe.jpeg';
    invalidUrl = 'this is not a valid url';
    emptyUrl = '';
  });

  // Token is invalid
  test.each([
    { token: '' },
    { token: null }
  ])('error case: invalid token', (parameter) => {
    expect(() => hf.adminQuizQuestionCreateV2(quizIds[0], parameter.token, 'When was WWII?', 5, 12, validAnswers, validUrl)).toThrow(HTTPError[401]);
  });

  test('error case: correct token, but user is not logged in', () => {
    hf.adminAuthLogoutV2(userToken);
    expect(() => hf.adminQuizQuestionCreateV2(quizIds[0], userToken, 'When was WWII?', 5, 12, validAnswers, validUrl)).toThrow(HTTPError[403]);
  });

  test('Question < 5 chars or Question > 50 chars', () => {
    const shortQuestion = 'a';
    const longQuestion = 'veryveryveryveryveryverylonglonglonglonglonglongquestionquestionquestion';

    expect(() => hf.adminQuizQuestionCreateV2(quizIds[0], userToken, shortQuestion, 5, 5, validAnswers, validUrl)).toThrow(HTTPError[400]);
    expect(() => hf.adminQuizQuestionCreateV2(quizIds[0], userToken, longQuestion, 5, 5, validAnswers, validUrl)).toThrow(HTTPError[400]);
  });

  test('Question answers count < 2 or > 6', () => {
    expect(() => hf.adminQuizQuestionCreateV2(quizIds[0], userToken, 'valid question1', 5, 5, shortAnswer, validUrl)).toThrow(HTTPError[400]);
    expect(() => hf.adminQuizQuestionCreateV2(quizIds[0], userToken, 'valid question2', 5, 5, longAnswer, validUrl)).toThrow(HTTPError[400]);
  });

  test('Question duration <= 0', () => {
    expect(() => hf.adminQuizQuestionCreateV2(quizIds[0], userToken, 'valid question1', -1, 5, validAnswers, validUrl)).toThrow(HTTPError[400]);
  });

  test('Sum duration > 180 sec', () => {
    const result1: typeV2.Response = hf.adminQuizQuestionCreateV2(quizIds[0], userToken, 'valid question1', 179, 5, validAnswers, validUrl);
    expect(result1).toStrictEqual({ questionId: expect.any(Number) });

    expect(() => hf.adminQuizQuestionCreateV2(quizIds[0], userToken, 'valid question2', 2, 5, validAnswers, validUrl)).toThrow(HTTPError[400]);
  });

  test('Points are not in 1-10 range', () => {
    expect(() => hf.adminQuizQuestionCreateV2(quizIds[0], userToken, 'valid question1', 30, 11, validAnswers, validUrl)).toThrow(HTTPError[400]);
    expect(() => hf.adminQuizQuestionCreateV2(quizIds[0], userToken, 'valid question1', 30, 0, validAnswers, validUrl)).toThrow(HTTPError[400]);
  });
  test('Answers are too short/long', () => {
    expect(() => hf.adminQuizQuestionCreateV2(quizIds[0], userToken, 'valid question1', 5, 5, answerNameShort, validUrl)).toThrow(HTTPError[400]);
    expect(() => hf.adminQuizQuestionCreateV2(quizIds[0], userToken, 'valid question2', 5, 5, answerNameLong, validUrl)).toThrow(HTTPError[400]);
  });

  test('Question contains duplicate answers', () => {
    expect(() => hf.adminQuizQuestionCreateV2(quizIds[0], userToken, 'valid question1', 5, 5, answerDuplicates, validUrl)).toThrow(HTTPError[400]);
  });

  test('No correct answers', () => {
    expect(() => hf.adminQuizQuestionCreateV2(quizIds[0], userToken, 'valid question1', 5, 5, answerNoCorrects, validUrl)).toThrow(HTTPError[400]);
  });

  test('Thumbnail is an empty string', () => {
    expect(() => hf.adminQuizQuestionCreateV2(quizIds[0], userToken, 'valid question1', 5, 5, validAnswers, emptyUrl)).toThrow(HTTPError[400]);
  });

  test('Thumbnail url does not return to a valid file', () => {
    expect(() => hf.adminQuizQuestionCreateV2(quizIds[0], userToken, 'valid question1', 5, 5, validAnswers, invalidUrl)).toThrow(HTTPError[400]);
  });

  test('Thumbnail url is not of .png or .jpg formatting', () => {
    expect(() => hf.adminQuizQuestionCreateV2(quizIds[0], userToken, 'valid question1', 5, 5, validAnswers, invalidFormatUrl)).toThrow(HTTPError[400]);
  });

  // Need to check that thumbnailUrl is the correct url
  test('success case: successfully created questions', () => {
    function sortAnswers(a: typeV2.Answer, b: typeV2.Answer): number {
      return a.answerId - b.answerId;
    }

    function sortQuestions(a: typeV2.Question, b: typeV2.Question): number {
      a.answers.sort(sortAnswers);
      b.answers.sort(sortAnswers);
      return a.questionId - b.questionId;
    }

    function sortQuizzes(a: typeV2.QuizInfo, b: typeV2.QuizInfo): number {
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
        ],
        thumbnailUrl: 'https://i.imgur.com/4CJ1TaY.png',
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
        ],
        thumbnailUrl: 'https://i.imgur.com/4CJ1TaY.png',
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
        ],
        thumbnailUrl: 'https://i.imgur.com/4CJ1TaY.png',
      }
    ];
    const expectObject : typeV2.QuizInfo = {
      quizId: quizIds[0],
      name: 'Geography Game',
      timeCreated: beforeInfo.timeCreated,
      timeLastEdited: expect.any(Number),
      description: '',
      numQuestions: 0,
      questions: [],
      duration: 0,
      thumbnailUrl: expect.any(String),
    };
    for (const question of validQuestions) {
      const res: typeV2.Response = hf.adminQuizQuestionCreateV2(quizIds[0], userToken, question.question, question.duration, question.points, question.answers, validUrl);
      const currentTime: number = Math.floor(Date.now() / 1000);
      expect(res).toStrictEqual({ questionId: expect.any(Number) });
      const updatedInfo: any = hf.adminQuizInfoV2(userToken, quizIds[0]);
      const newQuestion: typeV2.Question = {
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
        }),
        thumbnailUrl: expect.any(String),
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

const validQuestions : typeV2.QuestionBody[] = [
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
    ],
    thumbnailUrl: 'https://i.imgur.com/4CJ1TaY.png',
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
    ],
    thumbnailUrl: 'https://i.imgur.com/4CJ1TaY.png',
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
    ],
    thumbnailUrl: 'https://i.imgur.com/4CJ1TaY.png',
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
    ],
    thumbnailUrl: 'https://i.imgur.com/4CJ1TaY.png',
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
    ],
    thumbnailUrl: 'https://i.imgur.com/4CJ1TaY.png',
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
    ],
    thumbnailUrl: 'https://i.imgur.com/4CJ1TaY.png',
  }
];

// describe('PUT route: /v1/admin/quiz/{quizid}/question/{questionid}', () => {
//   const SUCCESS: typeV2.Empty = {};
//   let user1 : string;
//   let quiz1 : number;
//   let question1: number;
//   let beforeInfo : typeV2.QuizInfo;
//   const question1Body : typeV2.QuestionBody = {
//     question: 'What is the capital of France?',
//     duration: 30,
//     points: 3,
//     answers: [
//       {
//         answer: 'Paris',
//         correct: true
//       },
//       {
//         answer: 'London',
//         correct: false
//       }
//     ]
//   };

//   const shortQuestion = {
//     question: 'Hi?',
//     duration: 30,
//     points: 3,
//     answers: [
//       {
//         answer: 'Hello',
//         correct: true
//       },
//       {
//         answer: 'Bye',
//         correct: false
//       }
//     ]
//   };

//   const longQuestion = {
//     question: "In what year was the Declaration of Independence signed, marking the United States' declaration of independence from the Kingdom of Great Britain?",
//     duration: 40,
//     points: 4,
//     answers: [
//       {
//         answer: '1776',
//         correct: true
//       },
//       {
//         answer: '1783',
//         correct: false
//       }
//     ]
//   };

//   const answerTooMany = {
//     question: 'What is the capital of France?',
//     duration: 30,
//     points: 3,
//     answers: [
//       {
//         answer: 'Paris',
//         correct: true
//       },
//       {
//         answer: 'London',
//         correct: false
//       },
//       {
//         answer: 'Berlin',
//         correct: false
//       },
//       {
//         answer: 'Madrid',
//         correct: false
//       },
//       {
//         answer: 'Rome',
//         correct: false
//       },
//       {
//         answer: 'Lisbon',
//         correct: false
//       },
//       {
//         answer: 'Brussels',
//         correct: false
//       }
//     ]
//   };

//   const answerTooFew = {
//     question: 'What is the capital of France?',
//     duration: 30,
//     points: 3,
//     answers: [
//       {
//         answer: 'Paris',
//         correct: true
//       }
//     ]
//   };

//   const pointsTooMany = {
//     question: 'Which planet is closest to the sun?',
//     duration: 20,
//     points: 11,
//     answers: [
//       {
//         answer: 'Mercury',
//         correct: true
//       },
//       {
//         answer: 'Venus',
//         correct: false
//       }
//     ]
//   };
//   const pointsTooFew = {
//     question: 'What is the largest ocean on Earth?',
//     duration: 20,
//     points: 0,
//     answers: [
//       {
//         answer: 'Atlantic Ocean',
//         correct: false
//       },
//       {
//         answer: 'Pacific Ocean',
//         correct: true
//       }
//     ]
//   };

//   const LongDuration1 = {
//     question: 'Which planet is closest to the sun?',
//     duration: 150,
//     points: 2,
//     answers: [
//       {
//         answer: 'Mercury',
//         correct: true
//       },
//       {
//         answer: 'Venus',
//         correct: false
//       }
//     ]
//   };

//   const LongDuration2 = {
//     question: 'What is the largest ocean on Earth?',
//     duration: 31,
//     points: 5,
//     answers: [
//       {
//         answer: 'Atlantic Ocean',
//         correct: false
//       },
//       {
//         answer: 'Pacific Ocean',
//         correct: true
//       }
//     ]
//   };

//   const answerTooShort = {
//     question: 'Who is the first president of the United States?',
//     duration: 30,
//     points: 3,
//     answers: [
//       {
//         answer: '',
//         correct: false
//       },
//       {
//         answer: 'George Washington',
//         correct: true
//       }
//     ]
//   };

//   const answerTooLong = {
//     question: 'What is the color of the sky?',
//     duration: 40,
//     points: 4,
//     answers: [
//       {
//         answer: 'The sky is a beautiful shade of blue during a clear day.',
//         correct: false
//       },
//       {
//         answer: 'Blue',
//         correct: true
//       }
//     ]
//   };

//   const duplicateAnswerQuestions = [
//     {
//       question: 'What are the primary colors?',
//       duration: 30,
//       points: 3,
//       answers: [
//         {
//           answer: 'Red',
//           correct: true
//         },
//         {
//           answer: 'Blue',
//           correct: true
//         },
//         {
//           answer: 'Green',
//           correct: false
//         },
//         {
//           answer: 'Red',
//           correct: true
//         }
//       ]
//     },

//     {
//       question: 'What are the states of matter?',
//       duration: 40,
//       points: 5,
//       answers: [
//         {
//           answer: 'Solid',
//           correct: true
//         },
//         {
//           answer: 'Liquid',
//           correct: true
//         },
//         {
//           answer: 'Gas',
//           correct: true
//         },
//         {
//           answer: 'Plasma',
//           correct: true
//         },
//         {
//           answer: 'Liquid',
//           correct: false
//         }
//       ]
//     },

//     {
//       question: 'Who are the founders of Google?',
//       duration: 50,
//       points: 7,
//       answers: [
//         {
//           answer: 'Larry Page',
//           correct: true
//         },
//         {
//           answer: 'Sergey Brin',
//           correct: true
//         },
//         {
//           answer: 'Steve Jobs',
//           correct: false
//         },
//         {
//           answer: 'Larry Page',
//           correct: false
//         }
//       ]
//     }
//   ];

//   const noRightAnswerQuestions = [
//     {
//       question: 'What are the primary colors?',
//       duration: 30,
//       points: 3,
//       answers: [
//         {
//           answer: 'Red',
//           correct: false
//         },
//         {
//           answer: 'Blue',
//           correct: false
//         },
//         {
//           answer: 'Green',
//           correct: false
//         },
//         {
//           answer: 'Yellow',
//           correct: false
//         }
//       ]
//     },
//     {
//       question: 'Who are the founders of Google?',
//       duration: 50,
//       points: 7,
//       answers: [
//         {
//           answer: 'Steve Jobs',
//           correct: false
//         },
//         {
//           answer: 'Mark Zuckerberg',
//           correct: false
//         },
//         {
//           answer: 'Bill Gates',
//           correct: false
//         },
//         {
//           answer: 'Jeff Bezos',
//           correct: false
//         }
//       ]
//     },
//     {
//       question: 'What is the capital of Australia?',
//       duration: 40,
//       points: 4,
//       answers: [
//         {
//           answer: 'Sydney',
//           correct: false
//         },
//         {
//           answer: 'Melbourne',
//           correct: false
//         },
//         {
//           answer: 'Brisbane',
//           correct: false
//         },
//         {
//           answer: 'Perth',
//           correct: false
//         }
//       ]
//     },
//     {
//       question: 'What are the states of matter?',
//       duration: 45,
//       points: 5,
//       answers: [
//         {
//           answer: 'Soft',
//           correct: false
//         },
//         {
//           answer: 'Hard',
//           correct: false
//         },
//         {
//           answer: 'Liquid',
//           correct: false
//         },
//         {
//           answer: 'Gas',
//           correct: false
//         }
//       ]
//     },
//     {
//       question: 'Who was the first person to walk on the moon?',
//       duration: 35,
//       points: 6,
//       answers: [
//         {
//           answer: 'Neil Armstrong',
//           correct: false
//         },
//         {
//           answer: 'Buzz Aldrin',
//           correct: false
//         },
//         {
//           answer: 'Yuri Gagarin',
//           correct: false
//         },
//         {
//           answer: 'John Glenn',
//           correct: false
//         }
//       ]
//     }
//   ];

//   function sortAnswers(a: typeV2.Answer, b: typeV2.Answer): number {
//     return a.answerId - b.answerId;
//   }

//   function sortQuestions(a: typeV2.Question, b: typeV2.Question): number {
//     a.answers.sort(sortAnswers);
//     b.answers.sort(sortAnswers);
//     return a.questionId - b.questionId;
//   }

//   function sortQuizzes(a: typeV2.QuizInfo, b: typeV2.QuizInfo): number {
//     a.questions.sort(sortQuestions);
//     b.questions.sort(sortQuestions);
//     return a.quizId - b.quizId;
//   }

//   beforeEach(() => {
//     user1 = hf.adminAuthRegister('Yepeng@gmail.com', 'Yepeng12321', 'Yepeng', 'Lin').body.token;
//     quiz1 = hf.adminQuizCreateV2(user1, 'Geography Game', '').body.quizId;
//     question1 = hf.adminQuestionCreateV2(user1, quiz1, question1Body).body.questionId;
//     beforeInfo = hf.adminQuizInfoV2(user1, quiz1).body;
//   });

//   test('error case: Token is not a valid structure--empty', () => {
//     expect(() => hf.adminQuizQuestionUpdateV2('', quiz1, question1, validQuestions[0], /*Image URL*/)).toThrow(HTTPError[401]);

//     const updatedInfo: any = hf.adminQuizInfoV2(user1, quiz1).body;
//     expect(updatedInfo).toStrictEqual(beforeInfo);

//   });

//   test('error case: Token is not a valid structure--null', () => {
//     expect(() => hf.adminQuizQuestionUpdateV2(null, quiz1, question1, validQuestions[0], /*Image URL*/)).toThrow(HTTPError[401]);

//     const updatedInfo: any = hf.adminQuizInfoV2(user1, quiz1).body;
//     expect(updatedInfo).toStrictEqual(beforeInfo);
//   });

//   test('error case: valid token but does not refer to a currently logged in session', () => {
//     hf.adminAuthLogoutV2(user1);
//     expect(() => hf.adminQuizQuestionUpdateV2(user1, quiz1, question1, validQuestions[0], /*Image URL*/)).toThrow(HTTPError[403]);

//     user1 = hf.adminAuthLogin('Yepeng@gmail.com', 'Yepeng12321').body.token;
//     const updatedInfo: any = hf.adminQuizInfoV2(user1, quiz1).body;
//     expect(updatedInfo).toStrictEqual(beforeInfo);
//   });

//   test('error case: Quiz ID does not refer to a valid quiz', () => {
//     expect(() => hf.adminQuizQuestionUpdateV2(user1, quiz1 + 1, question1, validQuestions[1], /*Image URL*/)).toThrow(HTTPError[400]);

//     const updatedInfo: any = hf.adminQuizInfoV2(user1, quiz1).body;
//     expect(updatedInfo).toStrictEqual(beforeInfo);
//   });

//   test('error case: Quiz ID does not refer to a quiz that this user owns', () => {
//     const user2: string = hf.adminAuthRegister('Hayden@gmail.com', 'Hayden12321', 'Hayden', 'Smith').body.token;
//     const quiz2: number = hf.adminQuizCreateV2(user2, 'Science Quiz2023', '').body.quizId;
//     const question2: number = hf.adminQuestionCreateV2(user2, quiz2, validQuestions[1]).body.questionId;

//     const quiz2BeforeInfo: any = hf.adminQuizInfoV2(user2, quiz2).body;

//     expect(() => hf.adminQuizQuestionUpdateV2(user2, quiz1, question1, validQuestions[1], /*Image URL*/)).toThrow(HTTPError[400]);

//     const quiz2UpdatedInfo: any = hf.adminQuizInfoV2(user2, quiz2).body;
//     expect(quiz2UpdatedInfo).toStrictEqual(quiz2BeforeInfo);

//     expect(() => hf.adminQuizQuestionUpdateV2(user1, quiz2, question2, validQuestions[2], /*Image URL*/)).toThrow(HTTPError[400]);

//     const updatedInfo: any = hf.adminQuizInfoV2(user1, quiz1).body;
//     expect(updatedInfo).toStrictEqual(beforeInfo);
//   });

//   test('error case: Question Id does not refer to a valid question within this quiz', () => {
//     expect(() => hf.adminQuizQuestionUpdateV2(user1, quiz1, question1 + 1, validQuestions[0], /*Image URL*/)).toThrow(HTTPError[400]);

//     const updatedInfo: any = hf.adminQuizInfoV2(user1, quiz1).body;
//     expect(updatedInfo).toStrictEqual(beforeInfo);
//   });

//   test('error case: Question string is less than 5 characters in length or greater than 50 characters in length', () => {
//     expect(() => hf.adminQuizQuestionUpdateV2(user1, quiz1, question1, shortQuestion, /*Image URL*/)).toThrow(HTTPError[400]);

//     let updatedInfo = hf.adminQuizInfoV2(user1, quiz1).body;
//     expect(updatedInfo).toStrictEqual(beforeInfo);

//     expect(() => hf.adminQuizQuestionUpdateV2(user1, quiz1, question1, longQuestion, /*Image URL*/)).toThrow(HTTPError[400]);

//     updatedInfo = hf.adminQuizInfoV2(user1, quiz1).body;
//     expect(updatedInfo).toStrictEqual(beforeInfo);
//   });

//   test('error case: The question has more than 6 answers or less than 2 answers', () => {
//     expect(() => hf.adminQuizQuestionUpdateV2(user1, quiz1, question1, answerTooMany, /*Image URL*/)).toThrow(HTTPError[400]);

//     let updatedInfo = hf.adminQuizInfoV2(user1, quiz1).body;
//     expect(updatedInfo).toStrictEqual(beforeInfo);

//     expect(() => hf.adminQuizQuestionUpdateV2(user1, quiz1, question1, answerTooFew, /*Image URL*/)).toThrow(HTTPError[400]);

//     updatedInfo = hf.adminQuizInfoV2(user1, quiz1).body;
//     expect(updatedInfo).toStrictEqual(beforeInfo);
//   });

//   test.each([
//     {
//       question: 'Which planet is closest to the sun?',
//       duration: 0,
//       points: 2,
//       answers: [
//         {
//           answer: 'Mercury',
//           correct: true
//         },
//         {
//           answer: 'Venus',
//           correct: false
//         }
//       ]
//     },
//     {
//       question: 'Which planet is closest to the sun?',
//       duration: -1,
//       points: 2,
//       answers: [
//         {
//           answer: 'Mercury',
//           correct: true
//         },
//         {
//           answer: 'Venus',
//           correct: false
//         }
//       ]
//     },
//     {
//       question: 'Which planet is closest to the sun?',
//       duration: -100,
//       points: 2,
//       answers: [
//         {
//           answer: 'Mercury',
//           correct: true
//         },
//         {
//           answer: 'Venus',
//           correct: false
//         }
//       ]
//     }
//   ])('error case: The question duration is not a positive number', (negativeDuration) => {
//     expect(() => hf.adminQuizQuestionUpdateV2(user1, quiz1, question1, negativeDuration, /*Image URL*/)).toThrow(HTTPError[400]);

//     const updatedInfo: any = hf.adminQuizInfoV2(user1, quiz1).body;
//     expect(updatedInfo).toStrictEqual(beforeInfo);
//   });

//   test('error case: The sum of the question durations in the quiz exceeds 3 minutes', () => {
//     hf.adminQuestionCreateV2(user1, quiz1, LongDuration1);

//     beforeInfo = hf.adminQuizInfoV2(user1, quiz1).body;
//     let updatedInfo = hf.adminQuizInfoV2(user1, quiz1).body;
//     expect(() => hf.adminQuizQuestionUpdateV2(user1, quiz1, question1, LongDuration2, /*Image URL*/)).toThrow(HTTPError[400]);

//     updatedInfo = hf.adminQuizInfoV2(user1, quiz1).body;
//     expect(updatedInfo).toStrictEqual(beforeInfo);
//   });

//   test('error case: The points awarded for the question are less than 1 or greater than 10', () => {
//     expect(() => hf.adminQuizQuestionUpdateV2(user1, quiz1, question1, pointsTooFew, /*Image URL*/)).toThrow(HTTPError[400]);

//     let updatedInfo = hf.adminQuizInfoV2(user1, quiz1).body;
//     expect(updatedInfo).toStrictEqual(beforeInfo);

//     expect(() => hf.adminQuizQuestionUpdateV2(user1, quiz1, question1, pointsTooMany, /*Image URL*/)).toThrow(HTTPError[400]);

//     updatedInfo = hf.adminQuizInfoV2(user1, quiz1).body;
//     expect(updatedInfo).toStrictEqual(beforeInfo);
//   });

//   test('error case: The length of any answer is shorter than 1 character long, or longer than 30 characters long', () => {
//     expect(() => hf.adminQuizQuestionUpdateV2(user1, quiz1, question1, answerTooLong, /*Image URL*/)).toThrow(HTTPError[400]);

//     let updatedInfo = hf.adminQuizInfoV2(user1, quiz1).body;
//     expect(updatedInfo).toStrictEqual(beforeInfo);

//     expect(() => hf.adminQuizQuestionUpdateV2(user1, quiz1, question1, answerTooShort, /*Image URL*/)).toThrow(HTTPError[400]);

//     updatedInfo = hf.adminQuizInfoV2(user1, quiz1).body;
//     expect(updatedInfo).toStrictEqual(beforeInfo);
//   });

//   test('error case: Any answer strings are duplicates of one another (within the same question)', () => {
//     for (const question of duplicateAnswerQuestions) {
//       expect(() => hf.adminQuestionCreateV2(user1, quiz1, question)).toThrow(HTTPError[400]);

//       const updatedInfo: any = hf.adminQuizInfoV2(user1, quiz1).body;
//       expect(updatedInfo).toStrictEqual(beforeInfo);
//     }
//   });

//   test('error case: There are no correct answers', () => {
//     for (const question of noRightAnswerQuestions) {
//       expect(() => hf.adminQuestionCreateV2(user1, quiz1, question)).toThrow(HTTPError[400]);

//       const updatedInfo: any = hf.adminQuizInfoV2(user1, quiz1).body;
//       expect(updatedInfo).toStrictEqual(beforeInfo);
//     }
//   });

//   test('success case: successfully created questions', () => {
//     hf.clear();

//     user1 = hf.adminAuthRegister('Yepeng@gmail.com', 'Yepeng12321', 'Yepeng', 'Lin').body.token;
//     quiz1 = hf.adminQuizCreateV2(user1, 'Geography Game', '').body.quizId;
//     beforeInfo = hf.adminQuizInfoV2(user1, quiz1).body;

//     for (const question of validQuestions) {
//       hf.adminQuestionCreateV2(user1, quiz1, question);
//     }
//     const expectObject: any = hf.adminQuizInfoV2(user1, quiz1).body;
//     expectObject.timeLastEdited = expect.any(Number);
//     // expect(expectObject).toStrictEqual(1);
//     let index = 0;
//     for (const question of expectObject.questions) {
//       const res: typeV2.Response = hf.adminQuizQuestionUpdateV2(user1, quiz1, question.questionId, additionalValidQuestions[index], /*Image URL*/);
//       const currentTime: number = Math.floor(Date.now() / 1000);
//       const newQuestion : typeV2.Question = {
//         questionId: question.questionId,
//         question: additionalValidQuestions[index].question,
//         duration: additionalValidQuestions[index].duration,
//         points: additionalValidQuestions[index].points,
//         answers: additionalValidQuestions[index].answers.map((answer) => {
//           return {
//             answerId: expect.any(Number),
//             answer: answer.answer,
//             colour: expect.any(String),
//             correct: answer.correct
//           };
//         })
//       };

//       expectObject.questions.splice(index, 1, newQuestion);
//       expectObject.duration += additionalValidQuestions[index].duration - question.duration;
//       index++;
//       expect(res.body).toStrictEqual(SUCCESS);
//       const updatedInfo: any = hf.adminQuizInfoV2(user1, quiz1).body;
//       const sortedInfo1: any = { ...updatedInfo };
//       const sortedInfo2: any = { ...expectObject };
//       sortQuizzes(sortedInfo1, sortedInfo2);
//       expect(sortedInfo1).toStrictEqual(sortedInfo2);
//       expect(updatedInfo.timeLastEdited).toBeGreaterThanOrEqual(currentTime - 1);
//       expect(updatedInfo.timeLastEdited).toBeLessThanOrEqual(currentTime + 1);
//     }
//   });
// });

// // TODO: More test cases for image URL
describe('POST /v1/admin/quiz/{quizid}/question/{questionid}/duplicate route', () => {
  let userToken1 : string;
  let userToken2 : string;

  let quizId1 : number;
  let quizId2 : number;

  const quiz1QIds : number[] = [];
  const quiz2QIds : number[] = [];

  beforeEach(() => {
    // Initialize two users to have 1 quiz each, but only first user has questions
    userToken1 = hf.adminAuthRegister('marius@gmail.com', 'Marsbars69', 'Marius', 'Edmonds').body.token;
    userToken2 = hf.adminAuthRegister('yepeng@gmail.com', 'yepeng420', 'Yepeng', 'Lin').body.token;
    quizId1 = hf.adminQuizCreateV2(userToken1, 'Geography Game', 'This is a fun quiz').quizId;
    quizId2 = hf.adminQuizCreateV2(userToken2, 'History Game', 'This is a fun quiz').quizId;

    const q1Answers: {answer: string, correct: boolean}[] = [{ answer: '1945', correct: true }, { answer: '1917', correct: false }];
    quiz2QIds.push(hf.adminQuizQuestionCreateV2(quizId2, userToken2, 'When was WWII?', 5, 5, q1Answers, 'https://i.imgur.com/4CJ1TaY.png').questionId);

    const q2Answers: {answer: string, correct: boolean}[] = [{ answer: 'Stockholm', correct: true }, { answer: 'Helsinki', correct: false }];
    quiz1QIds.push(hf.adminQuizQuestionCreateV2(quizId1, userToken1, 'What is the capital of sweden?', 5, 5, q2Answers, 'https://i.imgur.com/4CJ1TaY.png').questionId);
    const q3Answers: {answer: string, correct: boolean}[] = [{ answer: 'Stockholm', correct: true }, { answer: 'Helsinki', correct: false }];
    quiz1QIds.push(hf.adminQuizQuestionCreateV2(quizId1, userToken1, 'What is the capital of sweden?', 5, 5, q3Answers, 'https://i.imgur.com/4CJ1TaY.png').questionId);
    const q4Answers: {answer: string, correct: boolean}[] = [{ answer: 'Stockholm', correct: true }, { answer: 'Helsinki', correct: false }];
    quiz1QIds.push(hf.adminQuizQuestionCreateV2(quizId1, userToken1, 'What is the capital of sweden?', 5, 5, q4Answers, 'https://i.imgur.com/4CJ1TaY.png').questionId);
  });

  // Valid token session checking
  test.each([
    { token: '' },
    { token: null }
  ])('error case: invalid token', (parameter) => {
    expect(() => hf.adminQuizQuestionDuplicateV2(parameter.token, quizId1, quiz1QIds[1])).toThrow(HTTPError[401]);
  });

  test('error case: correct token, but user is not logged in', () => {
    hf.adminAuthLogoutV2(userToken1);
    expect(() => hf.adminQuizQuestionDuplicateV2(userToken1, quizId1, quiz1QIds[1])).toThrow(HTTPError[403]);
  });

  // Quizid is invalid
  test('Invalid quizid', () => {
    expect(() => hf.adminQuizQuestionDuplicateV2(userToken1, -1, quiz1QIds[0])).toThrow(HTTPError[400]);
  });

  // User doesn't own quiz
  test('User does not own specified quiz', () => {
    expect(() => hf.adminQuizQuestionDuplicateV2(userToken1, quizId2, quiz1QIds[0])).toThrow(HTTPError[400]);
  });

  // Question id is invalid
  test('Invalid questionId', () => {
    expect(() => hf.adminQuizQuestionDuplicateV2(userToken1, quizId1, -1)).toThrow(HTTPError[400]);
  });

  test('Successfully duplicated quiz question', (done) => {
    hf.clear();
    function sortAnswers(a: typeV2.Answer, b: typeV2.Answer): number {
      return a.answerId - b.answerId;
    }
    const user1: string = hf.adminAuthRegister('marius@gmail.com', 'Marsbars69', 'Marius', 'Edmonds').body.token;
    const quiz1: number = hf.adminQuizCreateV2(user1, 'COMP1531 is fun', 'title is not true').quizId;
    const question1: number = hf.adminQuestionCreateV2(user1, quiz1, validQuestions[0]).questionId;
    const beforeInfo : typeV2.QuizInfo = hf.adminQuizInfoV2(user1, quiz1);
    const beforeTime = beforeInfo.timeCreated;
    // setTimeout(() => {
    const testAfterDelay = () => {
      const res = hf.adminQuizQuestionDuplicateV2(user1, quiz1, question1);
      expect(res.newQuestionId).not.toStrictEqual(question1);
      const afterInfo : typeV2.QuizInfo = hf.adminQuizInfoV2(user1, quiz1);
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
      const expectAnswers : typeV2.Answer[] = beforeInfo.questions[index].answers.map((answer) => {
        return {
          answerId: expect.any(Number),
          answer: answer.answer,
          colour: expect.any(String),
          correct: answer.correct
        };
      });
      expect(afterInfo.questions[index].answers.sort(sortAnswers)).toStrictEqual(expectAnswers.sort(sortAnswers));
      done();
    };
    setTimeout(testAfterDelay, 500);
  });
});

// TODO: When removing a quesiton, we must also remove thumbnail
describe('DELETE route: /v2/admin/quiz/{quizid}/question/{question}', () => {
  const SUCCESS: typeV2.Empty = {};
  let user1 : string;
  let user2 : string;
  let quiz1 : number;
  let quiz2 : number;
  let question1: number;
  let quiz1Info : typeV2.QuizInfo;
  let quiz2Info : typeV2.QuizInfo;

  beforeEach(() => {
    user1 = hf.adminAuthRegister('Yepeng@gmail.com', 'Yepeng12321', 'Yepeng', 'Lin').body.token;
    user2 = hf.adminAuthRegister('Hayden@gmail.com', 'Hayden12321', 'Hayden', 'Smith').body.token;
    quiz1 = hf.adminQuizCreateV2(user1, 'LiteratureTest', '').quizId;
    // quiz2 = adminQuizCreateV2(user2, 'LiteratureTest', '').quizId;
    question1 = hf.adminQuestionCreateV2(user1, quiz1, validQuestions[0]).questionId;
  });

  test.each([
    { fakeUser: '' },
    { fakeUser: null }
  ])('error case: Token is not a valid structure', ({ fakeUser }) => {
    expect(() => hf.adminQuizQuestionRemoveV2(fakeUser, quiz1, question1)).toThrow(HTTPError[401]);

    quiz1Info = hf.adminQuizInfoV2(user1, quiz1);
    expect(quiz1Info.questions.find((question) => {
      return question.questionId === question1 && question.question === 'Who was the first man on moon?';
    }) !== undefined);
  });

  test('error case: Provided token is valid structure, but is not for a currently logged in session', () => {
    hf.adminAuthLogoutV2(user1);
    expect(() => hf.adminQuizQuestionRemoveV2(user1, quiz1, question1)).toThrow(HTTPError[403]);

    user1 = hf.adminAuthLogin('Yepeng@gmail.com', 'Yepeng12321').body.token;
    quiz1Info = hf.adminQuizInfoV2(user1, quiz1);
    expect(quiz1Info.questions.find((question) => {
      return question.questionId === question1 && question.question === 'Who was the first man on moon?';
    }) !== undefined);
  });

  test('error case: Quiz ID does not refer to a valid quiz', () => {
    expect(() => hf.adminQuizQuestionRemoveV2(user1, quiz1 + 1, question1)).toThrow(HTTPError[400]);

    quiz1Info = hf.adminQuizInfoV2(user1, quiz1);
    expect(quiz1Info.questions.find((question) => {
      return question.questionId === question1 && question.question === 'Who was the first man on moon?';
    }) !== undefined);
  });

  test('error case: Quiz ID does not refer to a quiz that this user owns', () => {
    quiz2 = hf.adminQuizCreateV2(user2, 'LiteratureTest', '').quizId;
    const question2: number = hf.adminQuestionCreateV2(user2, quiz2, validQuestions[1]).questionId;

    expect(() => hf.adminQuizQuestionRemoveV2(user1, quiz2, question2)).toThrow(HTTPError[400]);
    expect(() => hf.adminQuizQuestionRemoveV2(user2, quiz1, question1)).toThrow(HTTPError[400]);

    quiz1Info = hf.adminQuizInfoV2(user1, quiz1);
    quiz2Info = hf.adminQuizInfoV2(user2, quiz2);

    expect(quiz1Info.questions.find((question) => {
      return question.questionId === question1 && question.question === 'Who was the first man on moon?';
    })).not.toStrictEqual(undefined);

    expect(quiz2Info.questions.find((question) => {
      return question.questionId === question2 && question.question === 'What is the capital of France?';
    })).not.toStrictEqual(undefined);
  });

  test('error case: Question Id does not refer to a valid question within this quiz', () => {
    quiz2 = hf.adminQuizCreateV2(user2, 'LiteratureTest', '').quizId;
    const question2: number = hf.adminQuestionCreateV2(user2, quiz2, validQuestions[1]).questionId;

    expect(() => hf.adminQuizQuestionRemoveV2(user2, quiz2, question2 + 1)).toThrow(HTTPError[400]);
    expect(() => hf.adminQuizQuestionRemoveV2(user1, quiz1, question1 + 1)).toThrow(HTTPError[400]);

    quiz1Info = hf.adminQuizInfoV2(user1, quiz1);
    quiz2Info = hf.adminQuizInfoV2(user2, quiz2);

    expect(quiz1Info.questions.find((question) => {
      return question.questionId === question1 && question.question === 'Who was the first man on moon?';
    })).not.toStrictEqual(undefined);

    expect(quiz2Info.questions.find((question) => {
      return question.questionId === question2 && question.question === 'What is the capital of France?';
    })).not.toStrictEqual(undefined);
  });

  test('success case: successfully removed question', () => {
    quiz2 = hf.adminQuizCreateV2(user2, 'LiteratureTest', '').quizId;
    const question2: number = hf.adminQuestionCreateV2(user2, quiz2, validQuestions[1]).questionId;
    let res = hf.adminQuizQuestionRemoveV2(user1, quiz1, question1);
    expect(res).toStrictEqual(SUCCESS);
    res = hf.adminQuizQuestionRemoveV2(user2, quiz2, question2);
    expect(res).toStrictEqual(SUCCESS);

    quiz1Info = hf.adminQuizInfoV2(user1, quiz1);
    quiz2Info = hf.adminQuizInfoV2(user2, quiz2);

    expect(quiz1Info.questions.find((question) => {
      return question.questionId === question1 && question.question === validQuestions[0].question;
    })).toStrictEqual(undefined);

    expect(quiz2Info.questions.find((question) => {
      return question.questionId === question2 && question.question === validQuestions[1].question;
    })).toStrictEqual(undefined);

    const questionId1 : number[] = [];
    const questionId2 : number[] = [];

    validQuestions.forEach((question) => {
      questionId1.push(hf.adminQuestionCreateV2(user1, quiz1, question).questionId);
    });

    additionalValidQuestions.forEach((question) => {
      questionId2.push(hf.adminQuestionCreateV2(user2, quiz2, question).questionId);
    });

    questionId1.forEach((id) => {
      res = hf.adminQuizQuestionRemoveV2(user1, quiz1, id);
      expect(res).toStrictEqual(SUCCESS);

      quiz1Info = hf.adminQuizInfoV2(user1, quiz1);
      expect(quiz1Info.questions.find((question) => {
        return question.questionId === id && question.question === validQuestions[0].question;
      })).toStrictEqual(undefined);
    });

    questionId2.forEach((id) => {
      res = hf.adminQuizQuestionRemoveV2(user2, quiz2, id);
      expect(res).toStrictEqual(SUCCESS);

      quiz2Info = hf.adminQuizInfoV2(user2, quiz2);
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
    userToken1 = hf.adminAuthRegister('marius@gmail.com', 'Marsbars69', 'Marius', 'Edmonds').body.token;
    userToken2 = hf.adminAuthRegister('yepeng@gmail.com', 'yepeng420', 'Yepeng', 'Lin').body.token;
    quizId1 = hf.adminQuizCreateV2(userToken1, 'Geography Game', 'This is a fun quiz').quizId;
    quizId2 = hf.adminQuizCreateV2(userToken2, 'Geography Game', 'This is a fun quiz').quizId;

    const q1Answers: {answer: string, correct: boolean}[] = [{ answer: 'Stockholm', correct: true }, { answer: 'Helsinki', correct: false }];
    quiz1QIds.push(hf.adminQuizQuestionCreateV2(quizId1, userToken1, 'What is the capital of sweden?', 5, 5, q1Answers, 'https://i.imgur.com/4CJ1TaY.png').questionId);
    const q2Answers: {answer: string, correct: boolean}[] = [{ answer: 'Stockholm', correct: true }, { answer: 'Helsinki', correct: false }];
    quiz1QIds.push(hf.adminQuizQuestionCreateV2(quizId1, userToken1, 'What is the capital of sweden?', 5, 5, q2Answers, 'https://i.imgur.com/4CJ1TaY.png').questionId);
    const q3Answers: {answer: string, correct: boolean}[] = [{ answer: 'Stockholm', correct: true }, { answer: 'Helsinki', correct: false }];
    quiz1QIds.push(hf.adminQuizQuestionCreateV2(quizId1, userToken1, 'What is the capital of sweden?', 5, 5, q3Answers, 'https://i.imgur.com/4CJ1TaY.png').questionId);
  });

  // Invalid token
  test.each([
    { token: '' },
    { token: null }
  ])('error case: invalid token', (parameter) => {
    expect(() => hf.adminQuizQuestionMoveV2(parameter.token, quizId1, quiz1QIds[0], 2)).toThrow(HTTPError[401]);
  });

  // User not logged in
  test('error case: correct token, but user is not logged in', () => {
    hf.adminAuthLogoutV2(userToken1);
    expect(() => hf.adminQuizQuestionMoveV2(userToken1, quizId1, quiz1QIds[0], 2)).toThrow(HTTPError[403]);
  });

  // Quiz is invalid
  test('Invalid quizId', () => {
    expect(() => hf.adminQuizQuestionMoveV2(userToken1, -1, quiz1QIds[0], 2)).toThrow(HTTPError[400]);
  });

  // Quiz exists, but is not owned by user
  test('User does not own specified quiz', () => {
    expect(() => hf.adminQuizQuestionMoveV2(userToken1, quizId2, quiz1QIds[0], 2)).toThrow(HTTPError[400]);
  });

  // Quiz exists, but is not owned by user
  test('Invalid question id', () => {
    expect(() => hf.adminQuizQuestionMoveV2(userToken1, quizId1, -1, 2)).toThrow(HTTPError[400]);
  });

  // Check if new position is valid
  test.each([
    { bound: -1 },
    { bound: quiz1QIds.length }
  ])('NewPosition is < 0 or > n - 1', (arg) => {
    expect(() => hf.adminQuizQuestionMoveV2(userToken1, quizId1, quiz1QIds[0], arg.bound)).toThrow(HTTPError[400]);
  });

  // Make sure new position isn't current
  test('Newposition is current position', () => {
    expect(() => hf.adminQuizQuestionMoveV2(userToken1, quizId2, quiz1QIds[0], 0)).toThrow(HTTPError[400]);
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
    const destination: typeV2.Response = hf.adminQuizQuestionMoveV2(userToken1, quizId1, quizIdToMove, arg.newPosition);
    expect(destination).toStrictEqual({});

    // Check that the question at the new position contains the updated questionId
    const moveResult = hf.adminQuizInfoV2(userToken1, quizId1).questions[arg.newPosition];
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
    hf.clear();
    const user1: string = hf.adminAuthRegister('marius@gmail.com', 'Marsbars69', 'Marius', 'Edmonds').body.token;
    const quiz1: number = hf.adminQuizCreateV2(user1, 'COMP1531 is not fun', 'title is true').quizId;
    const questionId: number = hf.adminQuestionCreateV2(user1, quiz1, additionalValidQuestions[0]).questionId;

    for (const question of validQuestions) {
      hf.adminQuestionCreateV2(user1, quiz1, question);
    }

    for (const position of positions) {
      const res: typeV2.Response = hf.adminQuizQuestionMoveV2(user1, quiz1, questionId, position);
      expect(res).toStrictEqual({});

      const afterInfo : typeV2.QuizInfo = hf.adminQuizInfoV2(user1, quiz1);
      const newPosition = afterInfo.questions.findIndex((question) => {
        return question.questionId === questionId;
      });
      expect(newPosition).toStrictEqual(position);
    }
  });

  test('success: checking timeLastEdited is updated', (done) => {
    hf.clear();
    const user1: string = hf.adminAuthRegister('marius@gmail.com', 'Marsbars69', 'Marius', 'Edmonds').body.token;
    const quiz1: number = hf.adminQuizCreateV2(user1, 'COMP1531 is not fun', 'title is true').quizId;
    const questionId: number = hf.adminQuestionCreateV2(user1, quiz1, additionalValidQuestions[0]).questionId;

    for (const question of validQuestions) {
      hf.adminQuestionCreateV2(user1, quiz1, question);
    }
    const beforeInfo = hf.adminQuizInfoV2(user1, quiz1);
    setTimeout(() => {
      const res: typeV2.Response = hf.adminQuizQuestionMoveV2(user1, quiz1, questionId, 2);
      expect(res).toStrictEqual({});

      const afterInfo : typeV2.QuizInfo = hf.adminQuizInfoV2(user1, quiz1);
      const newPosition = afterInfo.questions.findIndex((question) => {
        return question.questionId === questionId;
      });
      expect(newPosition).toStrictEqual(2);

      // Fix time edited later
      expect(beforeInfo.timeLastEdited).toBeLessThan(afterInfo.timeLastEdited);
      expect(beforeInfo.timeLastEdited + 5).toBeGreaterThanOrEqual(afterInfo.timeLastEdited);
      done();
    }, 2000);
  });
});

describe('PUT route: /v2/admin/quiz/{quizid}/question/{questionid}', () => {
  const SUCCESS: typeV2.Empty = {};
  let user1 : string;
  let quiz1 : number;
  let question1: number;
  let beforeInfo : typeV2.QuizInfo;
  const question1Body : typeV2.QuestionBody = {
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
    ],
    thumbnailUrl: 'https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png',
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
    ],
    thumbnailUrl: 'https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png'
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
    ],
    thumbnailUrl: 'https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png'
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
    ],
    thumbnailUrl: 'https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png'
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
    ],
    thumbnailUrl: 'https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png'
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
    ],
    thumbnailUrl: 'https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png'
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
    ],
    thumbnailUrl: 'https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png'
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
    ],
    thumbnailUrl: 'https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png'
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
    ],
    thumbnailUrl: 'https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png'
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
    ],
    thumbnailUrl: 'https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png'
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
    ],
    thumbnailUrl: 'https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png'
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
      ],
      thumbnailUrl: 'https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png'
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
      ],
      thumbnailUrl: 'https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png'
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
      ],
      thumbnailUrl: 'https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png'
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
      ],
      thumbnailUrl: 'https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png'
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
      ],
      thumbnailUrl: 'https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png'
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
      ],
      thumbnailUrl: 'https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png'
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
      ],
      thumbnailUrl: 'https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png'
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
      ],
      thumbnailUrl: 'https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png'
    }
  ];

  function sortAnswers(a: typeV2.Answer, b: typeV2.Answer): number {
    return a.answerId - b.answerId;
  }

  function sortQuestions(a: typeV2.Question, b: typeV2.Question): number {
    a.answers.sort(sortAnswers);
    b.answers.sort(sortAnswers);
    return a.questionId - b.questionId;
  }

  function sortQuizzes(a: typeV2.QuizInfo, b: typeV2.QuizInfo): number {
    a.questions.sort(sortQuestions);
    b.questions.sort(sortQuestions);
    return a.quizId - b.quizId;
  }

  beforeEach(() => {
    user1 = hf.adminAuthRegister('Yepeng@gmail.com', 'Yepeng12321', 'Yepeng', 'Lin').body.token;
    quiz1 = hf.adminQuizCreateV2(user1, 'Geography Game', '').quizId;
    question1 = hf.adminQuestionCreateV2(user1, quiz1, question1Body).questionId;
    beforeInfo = hf.adminQuizInfoV2(user1, quiz1);
  });

  test('error case: Token is not a valid structure--empty', () => {
    expect(() => hf.adminQuizQuestionUpdateV2('', quiz1, question1, validQuestions[0])).toThrow(HTTPError[401]);

    const updatedInfo: any = hf.adminQuizInfoV2(user1, quiz1);
    expect(updatedInfo).toStrictEqual(beforeInfo);
  });

  test('error case: Token is not a valid structure--null', () => {
    expect(() => hf.adminQuizQuestionUpdateV2(null, quiz1, question1, validQuestions[0] /* Image URL */)).toThrow(HTTPError[401]);

    const updatedInfo: any = hf.adminQuizInfoV2(user1, quiz1);
    expect(updatedInfo).toStrictEqual(beforeInfo);
  });

  test('error case: valid token but does not refer to a currently logged in session', () => {
    hf.adminAuthLogoutV2(user1);
    expect(() => hf.adminQuizQuestionUpdateV2(user1, quiz1, question1, validQuestions[0]).toThrow(HTTPError[403]));

    user1 = hf.adminAuthLogin('Yepeng@gmail.com', 'Yepeng12321').body.token;
    const updatedInfo: any = hf.adminQuizInfoV2(user1, quiz1);
    expect(updatedInfo).toStrictEqual(beforeInfo);
  });

  test('error case: Quiz ID does not refer to a valid quiz', () => {
    expect(() => hf.adminQuizQuestionUpdateV2(user1, quiz1 + 1, question1, validQuestions[1])).toThrow(HTTPError[400]);

    const updatedInfo: any = hf.adminQuizInfoV2(user1, quiz1);
    expect(updatedInfo).toStrictEqual(beforeInfo);
  });

  test('error case: Quiz ID does not refer to a quiz that this user owns', () => {
    const user2: string = hf.adminAuthRegister('Hayden@gmail.com', 'Hayden12321', 'Hayden', 'Smith').body.token;
    const quiz2: number = hf.adminQuizCreateV2(user2, 'Science Quiz2023', '').quizId;
    const question2: number = hf.adminQuestionCreateV2(user2, quiz2, validQuestions[1]).questionId;

    const quiz2BeforeInfo: any = hf.adminQuizInfoV2(user2, quiz2);

    expect(() => hf.adminQuizQuestionUpdateV2(user2, quiz1, question1, validQuestions[1])).toThrow(HTTPError[400]);

    const quiz2UpdatedInfo: any = hf.adminQuizInfoV2(user2, quiz2);
    expect(quiz2UpdatedInfo).toStrictEqual(quiz2BeforeInfo);

    expect(() => hf.adminQuizQuestionUpdateV2(user1, quiz2, question2, validQuestions[2] /* Image URL */)).toThrow(HTTPError[400]);

    const updatedInfo: any = hf.adminQuizInfoV2(user1, quiz1);
    expect(updatedInfo).toStrictEqual(beforeInfo);
  });

  test('error case: Question Id does not refer to a valid question within this quiz', () => {
    expect(() => hf.adminQuizQuestionUpdateV2(user1, quiz1, question1 + 1, validQuestions[0])).toThrow(HTTPError[400]);

    const updatedInfo: any = hf.adminQuizInfoV2(user1, quiz1);
    expect(updatedInfo).toStrictEqual(beforeInfo);
  });

  test('error case: Question string is less than 5 characters in length or greater than 50 characters in length', () => {
    expect(() => hf.adminQuizQuestionUpdateV2(user1, quiz1, question1, shortQuestion)).toThrow(HTTPError[400]);

    let updatedInfo = hf.adminQuizInfoV2(user1, quiz1);
    expect(updatedInfo).toStrictEqual(beforeInfo);

    expect(() => hf.adminQuizQuestionUpdateV2(user1, quiz1, question1, longQuestion)).toThrow(HTTPError[400]);

    updatedInfo = hf.adminQuizInfoV2(user1, quiz1);
    expect(updatedInfo).toStrictEqual(beforeInfo);
  });

  test('error case: The question has more than 6 answers or less than 2 answers', () => {
    expect(() => hf.adminQuizQuestionUpdateV2(user1, quiz1, question1, answerTooMany)).toThrow(HTTPError[400]);

    let updatedInfo = hf.adminQuizInfoV2(user1, quiz1);
    expect(updatedInfo).toStrictEqual(beforeInfo);

    expect(() => hf.adminQuizQuestionUpdateV2(user1, quiz1, question1, answerTooFew)).toThrow(HTTPError[400]);

    updatedInfo = hf.adminQuizInfoV2(user1, quiz1);
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
      ],
      thumbnailUrl: 'https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png'
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
      ],
      thumbnailUrl: 'https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png'
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
      ],
      thumbnailUrl: 'https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png'
    }
  ])('error case: The question duration is not a positive number', (negativeDuration) => {
    expect(() => hf.adminQuizQuestionUpdateV2(user1, quiz1, question1, negativeDuration)).toThrow(HTTPError[400]);

    const updatedInfo: any = hf.adminQuizInfoV2(user1, quiz1);
    expect(updatedInfo).toStrictEqual(beforeInfo);
  });

  test('error case: The sum of the question durations in the quiz exceeds 3 minutes', () => {
    hf.adminQuestionCreateV2(user1, quiz1, LongDuration1);

    beforeInfo = hf.adminQuizInfoV2(user1, quiz1);
    let updatedInfo = hf.adminQuizInfoV2(user1, quiz1);
    expect(() => hf.adminQuizQuestionUpdateV2(user1, quiz1, question1, LongDuration2)).toThrow(HTTPError[400]);

    updatedInfo = hf.adminQuizInfoV2(user1, quiz1);
    expect(updatedInfo).toStrictEqual(beforeInfo);
  });

  test('error case: The points awarded for the question are less than 1 or greater than 10', () => {
    expect(() => hf.adminQuizQuestionUpdateV2(user1, quiz1, question1, pointsTooFew)).toThrow(HTTPError[400]);

    let updatedInfo = hf.adminQuizInfoV2(user1, quiz1);
    expect(updatedInfo).toStrictEqual(beforeInfo);

    expect(() => hf.adminQuizQuestionUpdateV2(user1, quiz1, question1, pointsTooMany)).toThrow(HTTPError[400]);

    updatedInfo = hf.adminQuizInfoV2(user1, quiz1);
    expect(updatedInfo).toStrictEqual(beforeInfo);
  });

  test('error case: The length of any answer is shorter than 1 character long, or longer than 30 characters long', () => {
    expect(() => hf.adminQuizQuestionUpdateV2(user1, quiz1, question1, answerTooLong)).toThrow(HTTPError[400]);

    let updatedInfo = hf.adminQuizInfoV2(user1, quiz1);
    expect(updatedInfo).toStrictEqual(beforeInfo);

    expect(() => hf.adminQuizQuestionUpdateV2(user1, quiz1, question1, answerTooShort)).toThrow(HTTPError[400]);

    updatedInfo = hf.adminQuizInfoV2(user1, quiz1);
    expect(updatedInfo).toStrictEqual(beforeInfo);
  });

  test('error case: Any answer strings are duplicates of one another (within the same question)', () => {
    for (const question of duplicateAnswerQuestions) {
      expect(() => hf.adminQuestionCreateV2(user1, quiz1, question)).toThrow(HTTPError[400]);

      const updatedInfo: any = hf.adminQuizInfoV2(user1, quiz1);
      expect(updatedInfo).toStrictEqual(beforeInfo);
    }
  });

  test('error case: There are no correct answers', () => {
    for (const question of noRightAnswerQuestions) {
      expect(() => hf.adminQuestionCreateV2(user1, quiz1, question)).toThrow(HTTPError[400]);

      const updatedInfo: any = hf.adminQuizInfoV2(user1, quiz1);
      expect(updatedInfo).toStrictEqual(beforeInfo);
    }
  });

  test('success case: successfully updated questions', () => {
    hf.clear();

    user1 = hf.adminAuthRegister('Yepeng@gmail.com', 'Yepeng12321', 'Yepeng', 'Lin').body.token;
    quiz1 = hf.adminQuizCreateV2(user1, 'Geography Game', '').quizId;
    beforeInfo = hf.adminQuizInfoV2(user1, quiz1);

    for (const question of validQuestions) {
      hf.adminQuestionCreateV2(user1, quiz1, question);
    }
    const expectObject: any = hf.adminQuizInfoV2(user1, quiz1);
    expectObject.timeLastEdited = expect.any(Number);
    // expect(expectObject).toStrictEqual(1);
    let index = 0;
    for (const question of expectObject.questions) {
      const res: typeV2.Response = hf.adminQuizQuestionUpdateV2(user1, quiz1, question.questionId, additionalValidQuestions[index]);
      const currentTime: number = Math.floor(Date.now() / 1000);
      const newQuestion : typeV2.Question = {
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
        }),
        thumbnailUrl: expect.any(String),
      };

      expectObject.questions.splice(index, 1, newQuestion);
      expectObject.duration += additionalValidQuestions[index].duration - question.duration;
      index++;
      expectObject.timeLastEdited = expect.any(Number);
      expect(res).toStrictEqual(SUCCESS);
      const updatedInfo: any = hf.adminQuizInfoV2(user1, quiz1);
      const sortedInfo1: any = JSON.parse(JSON.stringify(updatedInfo));
      const sortedInfo2: any = { ...expectObject };
      sortedInfo2.timeLastEdited = expect.any(Number);
      sortQuizzes(sortedInfo1, sortedInfo2);
      expect(sortedInfo1).toStrictEqual(sortedInfo2);
      expect(updatedInfo.timeLastEdited).toBeGreaterThanOrEqual(currentTime - 1);
      expect(updatedInfo.timeLastEdited).toBeLessThanOrEqual(currentTime + 1);
    }
  });
});

describe('v1/admin/quiz/{quizid}/thumbnail', () => {
  let user1 : string;
  let quiz1 : number;
  const imageUrl = 'https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-980x653.jpg';

  beforeEach(() => {
    user1 = hf.adminAuthRegister('Yepeng@gmail.com', 'Yepeng12321', 'Yepeng', 'Lin').body.token;
    quiz1 = hf.adminQuizCreateV2(user1, 'LiteratureTest', '').quizId;
  });

  describe('error cases:', () => {
    test.each([
      '',
      null,
    ])('Token is not a valid structure', (invalidToken) => {
      expect(() => hf.adminQuizThumbnailUpdate(invalidToken, quiz1, imageUrl)).toThrow(HTTPError[401]);
    });

    test('Provided token is valid structure, but is not for a currently logged in session', () => {
      hf.adminAuthLogoutV2(user1);
      expect(() => hf.adminQuizThumbnailUpdate(user1, quiz1, imageUrl)).toThrow(HTTPError[403]);
    });

    test('Quiz ID does not refer to a valid quiz', () => {
      expect(() => hf.adminQuizThumbnailUpdate(user1, quiz1 + 1, imageUrl)).toThrow(HTTPError[400]);
    });

    test('Quiz ID does not refer to a quiz that this user owns', () => {
      const user2 = hf.adminAuthRegister('Hayden@gmail.com', 'Hayden12321', 'Hayden', 'Smith').body.token;
      const quiz2 = hf.adminQuizCreateV2(user2, 'Literature', '').quizId;
      expect(() => hf.adminQuizThumbnailUpdate(user1, quiz2, imageUrl)).toThrow(HTTPError[400]);
      expect(() => hf.adminQuizThumbnailUpdate(user2, quiz1, imageUrl)).toThrow(HTTPError[400]);
    });

    test.each([
      'https://chat.openai.com/',
      'https://www.youtube.com/',
    ])('imgUrl when fetched does not return a valid file', (invalidUrl) => {
      expect(() => hf.adminQuizThumbnailUpdate(user1, quiz1, invalidUrl)).toThrow(HTTPError[400]);
    });

    test.each([
      'https://cdn.cloudflare.steamstatic.com/client/installer/steam.dmg',
      'https://origin-a.akamaihd.net/Origin-Client-Download/origin/live/OriginThinSetup.exe'
    ])('imgUrl when fetch is not a JPG or PNG image', (invalidUrl) => {
      expect(() => hf.adminQuizThumbnailUpdate(user1, quiz1, invalidUrl)).toThrow(HTTPError[400]);
    });
  });
  describe('success case:', () => {
    test.each([
      'https://i.imgur.com/4CJ1TaY.png',
      'https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-980x653.jpg'
    ])('successfully downloaded image files', (validUrl) => {
      expect(hf.adminQuizThumbnailUpdate(user1, quiz1, validUrl)).toStrictEqual({});
    });
  });
});
