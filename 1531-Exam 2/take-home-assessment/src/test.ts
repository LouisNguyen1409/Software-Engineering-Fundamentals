import HTTPError from 'http-errors';
const sleep = require('atomic-sleep');
import request, { HttpVerb } from 'sync-request';
import { port, url } from './config.json';
import * as type from './interface';

const TIME_OUT = 1000;
const ERROR = 400;
const SERVER_URL = `${url}:${port}`;
function requestHelper(method: HttpVerb, path: string, payload: type.Payload) {
  let qs = {};
  let json = {};
  if (['GET', 'DELETE'].includes(method.toUpperCase())) {
    qs = payload;
  } else {
    // PUT/POST
    json = payload;
  }
  const res = request(method, `${SERVER_URL}${path}`, { qs, json });

  let responseBody: any;
  try {
    responseBody = JSON.parse(res.body.toString());
  } catch (err: any) {
    if (res.statusCode === 200) {
      throw HTTPError(500, `Non-jsonifiable body despite code 200: '${res.body}'.`);
    }
    responseBody = { error: `Failed to parse JSON: '${err.message}'` };
  }

  const errorMessage = `[${res.statusCode}] ` + responseBody?.error || responseBody || 'No message specified!';

  switch (res.statusCode) {
    case ERROR:
      throw HTTPError(res.statusCode, errorMessage);
    case 404: // NOT_FOUND
      throw HTTPError(res.statusCode, `Cannot find '${url}' [${method}]\nReason: ${errorMessage}\n\nCheck that your server.ts have the correct path AND method`);
    case 500: // INTERNAL_SERVER_ERROR
      throw HTTPError(res.statusCode, errorMessage + '\n\nYour server crashed. Check the server log!\n');
    default:
      if (res.statusCode !== 200) {
        throw HTTPError(res.statusCode, errorMessage + `\n\nSorry, no idea! Look up the status code ${res.statusCode} online!\n`);
      }
  }
  return responseBody;
}

// ======================= PROTECTED ROUTES ===========================

function getExampleRoute() {
  return requestHelper('GET', '/example/route', {});
}

function clear() {
  return requestHelper('DELETE', '/clear', {});
}

function getTagList() {
  return requestHelper('GET', '/tag/list', {});
}

function getTagName(tagId: number) {
  return requestHelper('GET', '/tag', { tagId: tagId });
}

function deleteTag(tagId: number) {
  return requestHelper('DELETE', '/tag', { tagId: tagId });
}

function createNewTag(name: string) {
  return requestHelper('POST', '/tag', { name: name });
}

function getDetailTodoItem(itemId: number) {
  return requestHelper('GET', '/todo/item', { itemId: itemId });
}

function deleteTodoItem(itemId: number) {
  return requestHelper('DELETE', '/todo/item', { itemId: itemId });
}

function createTodoItem(description: string, parentId: number) {
  return requestHelper('POST', '/todo/item', { description: description, parentId: JSON.stringify(parentId) });
}

function updateTodoItem(itemId: number, description: string, tagIds: number[], status: any, parentId: number, deadline: any) {
  return requestHelper('PUT', '/todo/item', { itemId: itemId, description: description, tagIds: tagIds, status: status, parentId: JSON.stringify(parentId), deadline: JSON.stringify(deadline) });
}

function getListTodoItems(parentId: number, tagIds: number[], status: any) {
  return requestHelper('GET', '/todo/list', { parentId: JSON.stringify(parentId), tagIds: JSON.stringify(tagIds), status: JSON.stringify(status) });
}

function createMultipleTodoItems(bulkString: string) {
  return requestHelper('POST', '/todo/item/bulk', { bulkString: bulkString });
}

function getSummary(step: number) {
  return requestHelper('GET', '/summary', { step: JSON.stringify(step) });
}

function getNotification() {
  return requestHelper('GET', '/notifications', {});
}

// ======================= TESTS ===========================

beforeEach(() => {
  clear();
});

describe('DELETE, /clear', () => {
  test('successful case', () => {
    const idsArray = createMultipleTodoItems('My Task ; null; TODO ; tagName1, tagName2, tagName3 | My Task 2 ; INPROGRESS ; tagName3, tagName2').todoItemIds;
    expect(getDetailTodoItem(idsArray[0]).item).toStrictEqual({
      description: 'My Task',
      tagIds: [expect.any(Number), expect.any(Number), expect.any(Number)],
      status: 'TODO',
      parentId: null,
      score: 'NA',
    });
    expect(getDetailTodoItem(idsArray[1]).item).toStrictEqual({
      description: 'My Task 2',
      tagIds: [expect.any(Number), expect.any(Number)],
      status: 'INPROGRESS',
      parentId: null,
      score: 'NA',
    });
    clear();
    expect(() => getDetailTodoItem(idsArray[0])).toThrow(HTTPError[ERROR]);
    expect(() => getDetailTodoItem(idsArray[1])).toThrow(HTTPError[ERROR]);
  });
});

describe('GET, /tag/list', () => {
  test('successful case', () => {
    const tageId1 = createNewTag('tagName1').tagId;
    const tageId2 = createNewTag('tagName2').tagId;
    const tageId3 = createNewTag('tagName3').tagId;
    expect(getTagList().tags).toStrictEqual([
      { tagId: tageId1, name: 'tagName1' },
      { tagId: tageId2, name: 'tagName2' },
      { tagId: tageId3, name: 'tagName3' },
    ]);
  });
});

describe('GET, /tag', () => {
  test('tagId does not exist', () => {
    createNewTag('tagName1');
    expect(() => getTagName(99999999)).toThrow(HTTPError[ERROR]);
  });
  test('successful case', () => {
    const tagId = createNewTag('tagName1').tagId;
    const tagId2 = createNewTag('tagName2').tagId;
    expect(getTagName(tagId)).toStrictEqual({ name: 'tagName1' });
    expect(getTagName(tagId2)).toStrictEqual({ name: 'tagName2' });
  });
});

describe('DELETE, /tag', () => {
  test('tagId does not exist', () => {
    createNewTag('tagName1');
    expect(() => deleteTag(99999999)).toThrow(HTTPError[ERROR]);
  });
  test('successful case', () => {
    const tagId = createNewTag('tagName1').tagId;
    const tagId2 = createNewTag('tagName2').tagId;
    expect(deleteTag(tagId)).toStrictEqual({});
    expect(getTagList().tags).toStrictEqual([{ tagId: 1, name: 'tagName2' }]);
    expect(deleteTag(tagId2)).toStrictEqual({});
    expect(getTagList().tags).toStrictEqual([]);
  });
  test('successful case - delete tagId from todoItem', () => {
    const todoItemId = createTodoItem('My Task', null).todoItemId;
    const tagId = createNewTag('tagName1').tagId;
    const tagId2 = createNewTag('tagName2').tagId;
    const tagId3 = createNewTag('tagName3').tagId;
    expect(updateTodoItem(todoItemId, 'My Task Update', [tagId, tagId2, tagId3], 'TODO', null, null)).toStrictEqual({});
    expect(getDetailTodoItem(todoItemId).item).toStrictEqual({
      description: 'My Task Update',
      tagIds: [expect.any(Number), expect.any(Number), expect.any(Number)],
      status: 'TODO',
      parentId: null,
      score: 'NA',
    });
    expect(getTagList().tags).toStrictEqual([
      { tagId: tagId, name: 'tagName1' },
      { tagId: tagId2, name: 'tagName2' },
      { tagId: tagId3, name: 'tagName3' },
    ]);
    expect(deleteTag(tagId)).toStrictEqual({});
    expect(getDetailTodoItem(todoItemId).item).toStrictEqual({
      description: 'My Task Update',
      tagIds: [expect.any(Number), expect.any(Number)],
      status: 'TODO',
      parentId: null,
      score: 'NA',
    });
    expect(getTagList().tags).toStrictEqual([
      { tagId: 1, name: 'tagName2' },
      { tagId: 2, name: 'tagName3' },
    ]);
  });
});

describe('POST, /tag', () => {
  test('name is less than 1 character', () => {
    expect(() => createNewTag('')).toThrow(HTTPError[ERROR]);
  });
  test('name is more than 10 characters', () => {
    expect(() => createNewTag('12345678901')).toThrow(HTTPError[ERROR]);
  });
  test('name already exists', () => {
    createNewTag('tagName1');
    expect(() => createNewTag('tagName1')).toThrow(HTTPError[ERROR]);
  });
  test('successful case', () => {
    const tagId1 = createNewTag('tagName1');
    const tagId2 = createNewTag('tagName2');
    const tagId3 = createNewTag('tagName3');
    expect(tagId1).toStrictEqual({ tagId: 0 });
    expect(tagId2).toStrictEqual({ tagId: 1 });
    expect(tagId3).toStrictEqual({ tagId: 2 });
    expect(getTagList().tags).toStrictEqual([
      { tagId: tagId1.tagId, name: 'tagName1' },
      { tagId: tagId2.tagId, name: 'tagName2' },
      { tagId: tagId3.tagId, name: 'tagName3' },
    ]);
  });
});

describe('GET, /todo/item', () => {
  test('todoItemId does not exist', () => {
    createTodoItem('My Task', null);
    expect(() => getDetailTodoItem(99999999)).toThrow(HTTPError[ERROR]);
  });
  test('successful case', () => {
    const todoItemId = createTodoItem('My Task', null).todoItemId;
    const todoItemId2 = createTodoItem('My Task 2', todoItemId).todoItemId;
    expect(getDetailTodoItem(todoItemId)).toStrictEqual({
      item: {
        description: 'My Task',
        tagIds: [],
        status: 'TODO',
        parentId: null,
        score: 'NA',
      },
    });
    expect(getDetailTodoItem(todoItemId2)).toStrictEqual({
      item: {
        description: 'My Task 2',
        tagIds: [],
        status: 'TODO',
        parentId: todoItemId,
        score: 'NA',
      },
    });
  });
});

describe('DELETE, /todo/item', () => {
  test('todoItemId does not exist', () => {
    createTodoItem('My Task', null);
    expect(() => deleteTodoItem(99999999)).toThrow(HTTPError[ERROR]);
  });
  test('successful case', () => {
    const todoItemId1 = createTodoItem('My Task', null).todoItemId;
    const idsArray1 = createMultipleTodoItems(`My Task 2; ${todoItemId1}; INPROGRESS; tagName1, tagName2 | My Task 3; ${todoItemId1}; BLOCKED; tagName2, tagName3`).todoItemIds;
    const idsArray2 = createMultipleTodoItems(`My Task 4; ${idsArray1[0]}; DONE; tagName1, tagName4 | My Task 5; ${idsArray1[0]}; TODO; tagName2, tagName5`).todoItemIds;
    const idsArray3 = createMultipleTodoItems(`My Task 6; ${idsArray1[1]}; INPROGRESS; tagName1, tagName6 | My Task 7; ${idsArray1[1]}; BLOCKED; tagName2, tagName7`).todoItemIds;
    const todoItemId8 = createTodoItem('My Task 8', idsArray2[0]).todoItemId;
    expect(deleteTodoItem(todoItemId1)).toStrictEqual({});
    expect(() => getDetailTodoItem(todoItemId1)).toThrow(HTTPError[ERROR]);
    expect(() => getDetailTodoItem(idsArray1[0])).toThrow(HTTPError[ERROR]);
    expect(() => getDetailTodoItem(idsArray1[1])).toThrow(HTTPError[ERROR]);
    expect(() => getDetailTodoItem(idsArray2[0])).toThrow(HTTPError[ERROR]);
    expect(() => getDetailTodoItem(idsArray2[1])).toThrow(HTTPError[ERROR]);
    expect(() => getDetailTodoItem(idsArray3[0])).toThrow(HTTPError[ERROR]);
    expect(() => getDetailTodoItem(idsArray3[1])).toThrow(HTTPError[ERROR]);
    expect(() => getDetailTodoItem(todoItemId8)).toThrow(HTTPError[ERROR]);
    expect(getTagList().tags).toStrictEqual([]);
  });
  test('successful case - delete tagId from todoItem', () => {
    const todoItemId = createTodoItem('My Task', null).todoItemId;
    const todoItemId2 = createTodoItem('My Task 2', null).todoItemId;
    const tagId = createNewTag('tagName1').tagId;
    const tagId2 = createNewTag('tagName2').tagId;
    const tagId3 = createNewTag('tagName3').tagId;
    expect(updateTodoItem(todoItemId, 'My Task Update', [tagId, tagId2, tagId3], 'TODO', null, null)).toStrictEqual({});
    expect(updateTodoItem(todoItemId2, 'My Task Update 2', [tagId, tagId2, tagId3], 'TODO', null, null)).toStrictEqual({});
    expect(deleteTodoItem(todoItemId)).toStrictEqual({});
    expect(getTagList().tags).toStrictEqual([
      { tagId: tagId, name: 'tagName1' },
      { tagId: tagId2, name: 'tagName2' },
      { tagId: tagId3, name: 'tagName3' },
    ]);
    expect(deleteTodoItem(todoItemId2)).toStrictEqual({});
    expect(getTagList().tags).toStrictEqual([]);
  });
});

describe('POST, /todo/item', () => {
  test('description is less than 1 character', () => {
    expect(() => createTodoItem('', null)).toThrow(HTTPError[ERROR]);
  });
  test('parentId does not exist', () => {
    expect(() => createTodoItem('My Task', 99999999)).toThrow(HTTPError[ERROR]);
  });
  test('same description and parentId already exists', () => {
    createTodoItem('My Task', null);
    expect(() => createTodoItem('My Task', null)).toThrow(HTTPError[ERROR]);
  });
  test('same description and different parentId already exists', () => {
    const todoItem1 = createTodoItem('My Task', null).todoItemId;
    createTodoItem('My Task', todoItem1);
    expect(getDetailTodoItem(todoItem1).item).toStrictEqual({
      description: 'My Task',
      tagIds: [],
      status: 'TODO',
      parentId: null,
      score: 'NA',
    });
  });
  test('Already have 50 items', () => {
    for (let i = 0; i < 50; i++) {
      createTodoItem(`My Task ${i}`, null);
    }
    expect(() => createTodoItem('My Task 51', null)).toThrow(HTTPError[ERROR]);
  });
  test('sucessful case', () => {
    const todoItemId = createTodoItem('My Task', null).todoItemId;
    expect(getDetailTodoItem(todoItemId).item).toStrictEqual({
      description: 'My Task',
      tagIds: [],
      status: 'TODO',
      parentId: null,
      score: 'NA',
    });
  });
});

describe('PUT, /todo/item', () => {
  test('todoItemId does not exist', () => {
    createTodoItem('My Task', null);
    expect(() => updateTodoItem(99999999, 'My Task Update', [], 'TODO', null, null)).toThrow(HTTPError[ERROR]);
  });
  test('description is less than 1 character', () => {
    const todoItemId = createTodoItem('My Task', null).todoItemId;
    expect(() => updateTodoItem(todoItemId, '', [], 'TODO', null, null)).toThrow(HTTPError[ERROR]);
  });
  test('parentId does not exist', () => {
    const todoItemId = createTodoItem('My Task', null).todoItemId;
    expect(() => updateTodoItem(todoItemId, 'My Task Update', [], 'TODO', 99999999, null)).toThrow(HTTPError[ERROR]);
  });
  test('same description and parentId already exists', () => {
    const todoItemId = createTodoItem('My Task', null).todoItemId;
    const todoItemId2 = createTodoItem('My Task 2', null).todoItemId;
    expect(() => updateTodoItem(todoItemId, 'My Task 2', [], 'TODO', null, null)).toThrow(HTTPError[ERROR]);
    expect(() => updateTodoItem(todoItemId2, 'My Task', [], 'TODO', null, null)).toThrow(HTTPError[ERROR]);
  });
  test('same description and different parentId already exists', () => {
    const todoItemId = createTodoItem('My Task', null).todoItemId;
    const todoItemId2 = createTodoItem('My Task 2', null).todoItemId;
    updateTodoItem(todoItemId, 'My Task 2', [], 'TODO', todoItemId2, null);
    expect(getDetailTodoItem(todoItemId).item).toStrictEqual({
      description: 'My Task 2',
      tagIds: [],
      status: 'TODO',
      parentId: todoItemId2,
      score: 'NA',
    });
  });
  test('status is not valid', () => {
    const todoItemId = createTodoItem('My Task', null).todoItemId;
    expect(() => updateTodoItem(todoItemId, 'My Task Update', [], 'INVALID', null, null)).toThrow(HTTPError[ERROR]);
  });
  test('tagId does not exist', () => {
    const todoItemId = createTodoItem('My Task', null).todoItemId;
    expect(() => updateTodoItem(todoItemId, 'My Task Update', [99999999], 'TODO', null, null)).toThrow(HTTPError[ERROR]);
  });
  test('parentId refers to itself', () => {
    const todoItemId = createTodoItem('My Task', null).todoItemId;
    expect(() => updateTodoItem(todoItemId, 'My Task Update', [], 'TODO', todoItemId, null)).toThrow(HTTPError[ERROR]);
  });
  test('parentId create cycle', () => {
    const todoItemId = createTodoItem('My Task', null).todoItemId;
    const todoItemId2 = createTodoItem('My Task 2', todoItemId).todoItemId;
    const todoItemId3 = createTodoItem('My Task 3', todoItemId2).todoItemId;
    expect(() => updateTodoItem(todoItemId, 'My Task Update', [], 'TODO', todoItemId3, null)).toThrow(HTTPError[ERROR]);
  });
  test('deadline is not valid as negative', () => {
    const todoItemId = createTodoItem('My Task', null).todoItemId;
    expect(() => updateTodoItem(todoItemId, 'My Task Update', [], 'TODO', null, -102)).toThrow(HTTPError[ERROR]);
  });
  test('deadline is not valid as positive', () => {
    const todoItemId = createTodoItem('My Task', null).todoItemId;
    expect(() => updateTodoItem(todoItemId, 'My Task Update', [], 'TODO', null, 2 ** 32)).toThrow(HTTPError[ERROR]);
  });
  test('successful case - change score from NA to HIGH with null', () => {
    const todoItemId = createTodoItem('My Task', null).todoItemId;
    expect(updateTodoItem(todoItemId, 'My Task Update', [], 'DONE', null, null)).toStrictEqual({});
    expect(getDetailTodoItem(todoItemId).item).toStrictEqual({
      description: 'My Task Update',
      tagIds: [],
      status: 'DONE',
      parentId: null,
      score: 'HIGH',
    });
    expect(getNotification().notifications).toStrictEqual([
      {
        todoItemId: todoItemId,
        todoItemDescription: 'My Task Update',
        statusBefore: 'TODO',
        statusAfter: 'DONE',
        statusChangeTimestamp: expect.any(Number),
      },
    ]);
  });
  test('successful case - change score from NA to HIGH with before deadline', () => {
    const todoItemId = createTodoItem('My Task', null).todoItemId;
    expect(updateTodoItem(todoItemId, 'My Task Update', [], 'DONE', null, Math.floor((Date.now() + 60000) / TIME_OUT))).toStrictEqual({});
    expect(getDetailTodoItem(todoItemId).item).toStrictEqual({
      description: 'My Task Update',
      tagIds: [],
      status: 'DONE',
      parentId: null,
      score: 'HIGH',
    });
    expect(getNotification().notifications).toStrictEqual([
      {
        todoItemId: todoItemId,
        todoItemDescription: 'My Task Update',
        statusBefore: 'TODO',
        statusAfter: 'DONE',
        statusChangeTimestamp: expect.any(Number),
      },
    ]);
  });
  test('successful case - change score from NA to LOW', () => {
    const todoItemId = createTodoItem('My Task', null).todoItemId;
    expect(updateTodoItem(todoItemId, 'My Task Update', [], 'DONE', null, Math.floor((Date.now() - 100000) / TIME_OUT))).toStrictEqual({});
    expect(getDetailTodoItem(todoItemId).item).toStrictEqual({
      description: 'My Task Update',
      tagIds: [],
      status: 'DONE',
      parentId: null,
      score: 'LOW',
    });
    expect(getNotification().notifications).toStrictEqual([
      {
        todoItemId: todoItemId,
        todoItemDescription: 'My Task Update',
        statusBefore: 'TODO',
        statusAfter: 'DONE',
        statusChangeTimestamp: expect.any(Number),
      },
    ]);
  });
  test('successful case - change score from HIGH to NA', () => {
    const todoItemId = createTodoItem('My Task', null).todoItemId;
    expect(updateTodoItem(todoItemId, 'My Task Update 1', [], 'DONE', null, Math.floor((Date.now() + 100000) / TIME_OUT))).toStrictEqual({});
    expect(getDetailTodoItem(todoItemId).item).toStrictEqual({
      description: 'My Task Update 1',
      tagIds: [],
      status: 'DONE',
      parentId: null,
      score: 'HIGH',
    });
    expect(getNotification().notifications).toStrictEqual([
      {
        todoItemId: todoItemId,
        todoItemDescription: 'My Task Update 1',
        statusBefore: 'TODO',
        statusAfter: 'DONE',
        statusChangeTimestamp: expect.any(Number),
      },
    ]);
    expect(updateTodoItem(todoItemId, 'My Task Update 2', [], 'BLOCKED', null, null)).toStrictEqual({});
    expect(getDetailTodoItem(todoItemId).item).toStrictEqual({
      description: 'My Task Update 2',
      tagIds: [],
      status: 'BLOCKED',
      parentId: null,
      score: 'NA',
    });
    expect(getNotification().notifications).toStrictEqual([
      {
        todoItemId: todoItemId,
        todoItemDescription: 'My Task Update 2',
        statusBefore: 'TODO',
        statusAfter: 'DONE',
        statusChangeTimestamp: expect.any(Number),
      },
      {
        todoItemId: todoItemId,
        todoItemDescription: 'My Task Update 2',
        statusBefore: 'DONE',
        statusAfter: 'BLOCKED',
        statusChangeTimestamp: expect.any(Number),
      },
    ]);
  });
  test('successful case - change score from LOW to NA', () => {
    const todoItemId = createTodoItem('My Task', null).todoItemId;
    expect(updateTodoItem(todoItemId, 'My Task Update', [], 'DONE', null, Math.floor((Date.now() - 100000) / TIME_OUT))).toStrictEqual({});
    expect(getDetailTodoItem(todoItemId).item).toStrictEqual({
      description: 'My Task Update',
      tagIds: [],
      status: 'DONE',
      parentId: null,
      score: 'LOW',
    });
    expect(getNotification().notifications).toStrictEqual([
      {
        todoItemId: todoItemId,
        todoItemDescription: 'My Task Update',
        statusBefore: 'TODO',
        statusAfter: 'DONE',
        statusChangeTimestamp: expect.any(Number),
      },
    ]);
    expect(updateTodoItem(todoItemId, 'My Task Update 2', [], 'INPROGRESS', null, Math.floor((Date.now() - 100000) / TIME_OUT))).toStrictEqual({});
    expect(getDetailTodoItem(todoItemId).item).toStrictEqual({
      description: 'My Task Update 2',
      tagIds: [],
      status: 'INPROGRESS',
      parentId: null,
      score: 'NA',
    });
    expect(getNotification().notifications).toStrictEqual([
      {
        todoItemId: todoItemId,
        todoItemDescription: 'My Task Update 2',
        statusBefore: 'TODO',
        statusAfter: 'DONE',
        statusChangeTimestamp: expect.any(Number),
      },
      {
        todoItemId: todoItemId,
        todoItemDescription: 'My Task Update 2',
        statusBefore: 'DONE',
        statusAfter: 'INPROGRESS',
        statusChangeTimestamp: expect.any(Number),
      },
    ]);
  });
  test('successful case - change score from LOW to HIGH', () => {
    const todoItemId = createTodoItem('My Task', null).todoItemId;
    expect(updateTodoItem(todoItemId, 'My Task Update', [], 'DONE', null, Math.floor((Date.now() - 100000) / TIME_OUT))).toStrictEqual({});
    expect(getDetailTodoItem(todoItemId).item).toStrictEqual({
      description: 'My Task Update',
      tagIds: [],
      status: 'DONE',
      parentId: null,
      score: 'LOW',
    });
    expect(getNotification().notifications).toStrictEqual([
      {
        todoItemId: todoItemId,
        todoItemDescription: 'My Task Update',
        statusBefore: 'TODO',
        statusAfter: 'DONE',
        statusChangeTimestamp: expect.any(Number),
      },
    ]);
    expect(updateTodoItem(todoItemId, 'My Task Update 2', [], 'DONE', null, Math.floor((Date.now() + 100000) / TIME_OUT))).toStrictEqual({});
    expect(getDetailTodoItem(todoItemId).item).toStrictEqual({
      description: 'My Task Update 2',
      tagIds: [],
      status: 'DONE',
      parentId: null,
      score: 'HIGH',
    });
    expect(getNotification().notifications).toStrictEqual([
      {
        todoItemId: todoItemId,
        todoItemDescription: 'My Task Update',
        statusBefore: 'TODO',
        statusAfter: 'DONE',
        statusChangeTimestamp: expect.any(Number),
      },
      // {
      //   todoItemId: todoItemId,
      //   todoItemDescription: 'My Task Update 2',
      //   statusBefore: 'DONE',
      //   statusAfter: 'DONE',
      //   statusChangeTimestamp: expect.any(Number),
      // },
    ]);
  });
  test('successful case - change score from HIGH to LOW', () => {
    const todoItemId = createTodoItem('My Task', null).todoItemId;
    expect(updateTodoItem(todoItemId, 'My Task Update 1', [], 'DONE', null, Math.floor((Date.now() + 100000) / TIME_OUT))).toStrictEqual({});
    expect(getDetailTodoItem(todoItemId).item).toStrictEqual({
      description: 'My Task Update 1',
      tagIds: [],
      status: 'DONE',
      parentId: null,
      score: 'HIGH',
    });
    expect(getNotification().notifications).toStrictEqual([
      {
        todoItemId: todoItemId,
        todoItemDescription: 'My Task Update 1',
        statusBefore: 'TODO',
        statusAfter: 'DONE',
        statusChangeTimestamp: expect.any(Number),
      },
    ]);
    expect(updateTodoItem(todoItemId, 'My Task Update 2', [], 'DONE', null, Math.floor((Date.now() - 100000) / TIME_OUT))).toStrictEqual({});
    expect(getDetailTodoItem(todoItemId).item).toStrictEqual({
      description: 'My Task Update 2',
      tagIds: [],
      status: 'DONE',
      parentId: null,
      score: 'LOW',
    });
    expect(getNotification().notifications).toStrictEqual([
      {
        todoItemId: todoItemId,
        todoItemDescription: 'My Task Update 1',
        statusBefore: 'TODO',
        statusAfter: 'DONE',
        statusChangeTimestamp: expect.any(Number),
      },
      // {
      //   todoItemId: todoItemId,
      //   todoItemDescription: 'My Task Update 2',
      //   statusBefore: 'DONE',
      //   statusAfter: 'DONE',
      //   statusChangeTimestamp: expect.any(Number),
      // },
    ]);
  });
  test('successful case - delete tags', () => {
    const todoItemId = createTodoItem('My Task', null).todoItemId;
    const tagId1 = createNewTag('tagName1').tagId;
    const tagId2 = createNewTag('tagName2').tagId;
    const tagId3 = createNewTag('tagName3').tagId;
    expect(updateTodoItem(todoItemId, 'My Task Update', [tagId1, tagId2, tagId3], 'TODO', null, null)).toStrictEqual({});
    expect(getDetailTodoItem(todoItemId).item).toStrictEqual({
      description: 'My Task Update',
      tagIds: [expect.any(Number), expect.any(Number), expect.any(Number)],
      status: 'TODO',
      parentId: null,
      score: 'NA',
    });
    expect(getTagList().tags).toStrictEqual([
      { tagId: tagId1, name: 'tagName1' },
      { tagId: tagId2, name: 'tagName2' },
      { tagId: tagId3, name: 'tagName3' },
    ]);
    expect(updateTodoItem(todoItemId, 'My Task Update 2', [tagId1, tagId3], 'TODO', null, null)).toStrictEqual({});
    expect(getDetailTodoItem(todoItemId).item).toStrictEqual({
      description: 'My Task Update 2',
      tagIds: [expect.any(Number), expect.any(Number)],
      status: 'TODO',
      parentId: null,
      score: 'NA',
    });
    expect(getTagList().tags).toStrictEqual([
      { tagId: tagId1, name: 'tagName1' },
      { tagId: tagId3, name: 'tagName3' },
    ]);
  });
  test('successful case - dont delete tags', () => {
    const todoItemId = createTodoItem('My Task', null).todoItemId;
    const tagId1 = createNewTag('tagName1').tagId;
    const tagId2 = createNewTag('tagName2').tagId;
    const tagId3 = createNewTag('tagName3').tagId;
    expect(updateTodoItem(todoItemId, 'My Task Update', [tagId1, tagId2, tagId3], 'TODO', null, null)).toStrictEqual({});
    expect(getDetailTodoItem(todoItemId).item).toStrictEqual({
      description: 'My Task Update',
      tagIds: [expect.any(Number), expect.any(Number), expect.any(Number)],
      status: 'TODO',
      parentId: null,
      score: 'NA',
    });
    expect(getTagList().tags).toStrictEqual([
      { tagId: tagId1, name: 'tagName1' },
      { tagId: tagId2, name: 'tagName2' },
      { tagId: tagId3, name: 'tagName3' },
    ]);
    expect(updateTodoItem(todoItemId, 'My Task Update 2', [tagId1, tagId2, tagId3], 'TODO', null, null)).toStrictEqual({});
    expect(getDetailTodoItem(todoItemId).item).toStrictEqual({
      description: 'My Task Update 2',
      tagIds: [expect.any(Number), expect.any(Number), expect.any(Number)],
      status: 'TODO',
      parentId: null,
      score: 'NA',
    });
    expect(getTagList().tags).toStrictEqual([
      { tagId: tagId1, name: 'tagName1' },
      { tagId: tagId2, name: 'tagName2' },
      { tagId: tagId3, name: 'tagName3' },
    ]);
  });
  test('successful case - dont delete tags', () => {
    const todoItemId = createTodoItem('My Task', null).todoItemId;
    const todoItemId2 = createTodoItem('My Task 2', todoItemId).todoItemId;
    const tagId1 = createNewTag('tagName1').tagId;
    const tagId2 = createNewTag('tagName2').tagId;
    const tagId3 = createNewTag('tagName3').tagId;
    expect(updateTodoItem(todoItemId, 'My Task Update', [tagId1, tagId2, tagId3], 'TODO', null, null)).toStrictEqual({});
    expect(updateTodoItem(todoItemId2, 'My Task Update 2', [tagId1, tagId2, tagId3], 'TODO', null, null)).toStrictEqual({});
    expect(getDetailTodoItem(todoItemId).item).toStrictEqual({
      description: 'My Task Update',
      tagIds: [expect.any(Number), expect.any(Number), expect.any(Number)],
      status: 'TODO',
      parentId: null,
      score: 'NA',
    });
    expect(getDetailTodoItem(todoItemId2).item).toStrictEqual({
      description: 'My Task Update 2',
      tagIds: [expect.any(Number), expect.any(Number), expect.any(Number)],
      status: 'TODO',
      parentId: null,
      score: 'NA',
    });
    expect(getTagList().tags).toStrictEqual([
      { tagId: tagId1, name: 'tagName1' },
      { tagId: tagId2, name: 'tagName2' },
      { tagId: tagId3, name: 'tagName3' },
    ]);
    expect(updateTodoItem(todoItemId, 'My Task Update 3', [tagId1, tagId2], 'TODO', null, null)).toStrictEqual({});
    expect(getTagList().tags).toStrictEqual([
      { tagId: tagId1, name: 'tagName1' },
      { tagId: tagId2, name: 'tagName2' },
      { tagId: tagId3, name: 'tagName3' },
    ]);
  });
  test('successful case - connect parent and children', () => {
    const todoItemId = createTodoItem('My Task', null).todoItemId;
    const todoItemId2 = createTodoItem('My Task 2', todoItemId).todoItemId;
    const todoItemId3 = createTodoItem('My Task 3', null).todoItemId;
    const todoItemId4 = createTodoItem('My Task 4', todoItemId3).todoItemId;
    expect(updateTodoItem(todoItemId2, 'My Task Update 2', [], 'TODO', todoItemId3, null)).toStrictEqual({});
    expect(updateTodoItem(todoItemId4, 'My Task Update 3', [], 'TODO', todoItemId, null)).toStrictEqual({});
    expect(updateTodoItem(todoItemId3, 'My Task Update 3', [], 'TODO', todoItemId4, null)).toStrictEqual({});
  });
  test('successful case - DONE on deadline', () => {
    const todoItemId = createTodoItem('My Task', null).todoItemId;
    expect(updateTodoItem(todoItemId, 'My Task Update', [], 'DONE', null, Math.floor(Date.now() / TIME_OUT))).toStrictEqual({});
    expect(getDetailTodoItem(todoItemId).item).toStrictEqual({
      description: 'My Task Update',
      tagIds: [],
      status: 'DONE',
      parentId: null,
      score: 'HIGH',
    });
  });
});

describe('GET, /todo/list', () => {
  test('status is not valid', () => {
    const tagId = createNewTag('tagName1').tagId;
    expect(() => getListTodoItems(null, [tagId], 'INVALID')).toThrow(HTTPError[ERROR]);
  });
  test('tagId does not exist', () => {
    expect(() => getListTodoItems(null, [99999999], 'TODO')).toThrow(HTTPError[ERROR]);
  });
  test('tagId is empty', () => {
    expect(() => getListTodoItems(null, [], 'TODO')).toThrow(HTTPError[ERROR]);
  });
  test('parentId does not exist', () => {
    const tagId = createNewTag('tagName1').tagId;
    expect(() => getListTodoItems(99999999, [tagId], 'TODO')).toThrow(HTTPError[ERROR]);
  });
  test('successful case - no filter', () => {
    const todoItemId1 = createTodoItem('My Task', null).todoItemId;
    const idsArray1 = createMultipleTodoItems(`My Task 2; ${todoItemId1}; INPROGRESS; tagName1, tagName2 | My Task 3; ${todoItemId1}; BLOCKED; tagName2, tagName3`).todoItemIds;
    const idsArray2 = createMultipleTodoItems(`My Task 4; ${idsArray1[0]}; DONE; tagName1, tagName4 | My Task 5; ${idsArray1[0]}; TODO; tagName2, tagName5`).todoItemIds;
    const idsArray3 = createMultipleTodoItems(`My Task 6; ${idsArray1[1]}; INPROGRESS; tagName1, tagName6 | My Task 7; ${idsArray1[1]}; BLOCKED; tagName2, tagName7`).todoItemIds;
    const todoItemId8 = createTodoItem('My Task 8', idsArray2[0]).todoItemId;
    expect(getListTodoItems(todoItemId1, null, null).todoItems).toStrictEqual([
      {
        description: 'My Task 2',
        tagIds: [expect.any(Number), expect.any(Number)],
        status: 'INPROGRESS',
        parentId: todoItemId1,
        score: 'NA',
      },
      {
        description: 'My Task 3',
        tagIds: [expect.any(Number), expect.any(Number)],
        status: 'BLOCKED',
        parentId: todoItemId1,
        score: 'NA',
      },
    ]);
    expect(getListTodoItems(idsArray1[0], null, null).todoItems).toStrictEqual([
      {
        description: 'My Task 4',
        tagIds: [expect.any(Number), expect.any(Number)],
        status: 'DONE',
        parentId: idsArray1[0],
        score: 'NA',
      },
      {
        description: 'My Task 5',
        tagIds: [expect.any(Number), expect.any(Number)],
        status: 'TODO',
        parentId: idsArray1[0],
        score: 'NA',
      },
    ]);
    expect(getListTodoItems(idsArray1[1], null, null).todoItems).toStrictEqual([
      {
        description: 'My Task 6',
        tagIds: [expect.any(Number), expect.any(Number)],
        status: 'INPROGRESS',
        parentId: idsArray1[1],
        score: 'NA',
      },
      {
        description: 'My Task 7',
        tagIds: [expect.any(Number), expect.any(Number)],
        status: 'BLOCKED',
        parentId: idsArray1[1],
        score: 'NA',
      },
    ]);
    expect(getListTodoItems(idsArray2[0], null, null).todoItems).toStrictEqual([
      {
        description: 'My Task 8',
        tagIds: [],
        status: 'TODO',
        parentId: idsArray2[0],
        score: 'NA',
      },
    ]);
    expect(getListTodoItems(idsArray2[1], null, null).todoItems).toStrictEqual([]);
    expect(getListTodoItems(idsArray3[0], null, null).todoItems).toStrictEqual([]);
    expect(getListTodoItems(idsArray3[1], null, null).todoItems).toStrictEqual([]);
    expect(getListTodoItems(todoItemId8, null, null).todoItems).toStrictEqual([]);
  });
  test('successful case - filter by status', () => {
    const todoItemId1 = createTodoItem('My Task', null).todoItemId;
    createMultipleTodoItems(`My Task 2; ${todoItemId1}; INPROGRESS; tagName1, tagName2 | My Task 3; ${todoItemId1}; BLOCKED; tagName2, tagName3`);
    expect(getListTodoItems(todoItemId1, null, 'TODO').todoItems).toStrictEqual([]);
    expect(getListTodoItems(todoItemId1, null, 'INPROGRESS').todoItems).toStrictEqual([
      {
        description: 'My Task 2',
        tagIds: [expect.any(Number), expect.any(Number)],
        status: 'INPROGRESS',
        parentId: todoItemId1,
        score: 'NA',
      },
    ]);
    expect(getListTodoItems(todoItemId1, null, 'BLOCKED').todoItems).toStrictEqual([
      {
        description: 'My Task 3',
        tagIds: [expect.any(Number), expect.any(Number)],
        status: 'BLOCKED',
        parentId: todoItemId1,
        score: 'NA',
      },
    ]);
    expect(getListTodoItems(todoItemId1, null, 'DONE').todoItems).toStrictEqual([]);
  });
  test('successful case - filter by tagId', () => {
    const todoItemId1 = createTodoItem('My Task', null).todoItemId;
    createMultipleTodoItems(`My Task 2; ${todoItemId1}; INPROGRESS; tagName1, tagName2 | My Task 3; ${todoItemId1}; BLOCKED; tagName2, tagName3`);
    expect(getListTodoItems(todoItemId1, [0], null).todoItems).toStrictEqual([
      {
        description: 'My Task 2',
        tagIds: [expect.any(Number), expect.any(Number)],
        status: 'INPROGRESS',
        parentId: todoItemId1,
        score: 'NA',
      },
    ]);
    expect(getListTodoItems(todoItemId1, [1], null).todoItems).toStrictEqual([
      {
        description: 'My Task 2',
        tagIds: [expect.any(Number), expect.any(Number)],
        status: 'INPROGRESS',
        parentId: todoItemId1,
        score: 'NA',
      },
      {
        description: 'My Task 3',
        tagIds: [expect.any(Number), expect.any(Number)],
        status: 'BLOCKED',
        parentId: todoItemId1,
        score: 'NA',
      },
    ]);
    expect(getListTodoItems(todoItemId1, [2], null).todoItems).toStrictEqual([
      {
        description: 'My Task 3',
        tagIds: [expect.any(Number), expect.any(Number)],
        status: 'BLOCKED',
        parentId: todoItemId1,
        score: 'NA',
      },
    ]);
  });
});

describe('POST, /todo/bulk', () => {
  test('Already have 50 items', () => {
    for (let i = 0; i < 50; i++) {
      createTodoItem(`My Task ${i}`, null);
    }
    expect(() => createMultipleTodoItems('My Task 51 ; null ; TODO ; tagName1, tagName2, tagName3')).toThrow(HTTPError[ERROR]);
  });
  test('Already have 45 items, create 6 items', () => {
    for (let i = 0; i < 45; i++) {
      createTodoItem(`My Task ${i}`, null);
    }
    expect(() => createMultipleTodoItems('My Task 46 ; null ; TODO ; tagName1, tagName2, tagName3 | My Task 47 ; null ; TODO ; tagName1, tagName2, tagName3 | My Task 48 ; null ; TODO ; tagName1, tagName2, tagName3 | My Task 49 ; null ; TODO ; tagName1, tagName2, tagName3 | My Task 50 ; null ; TODO ; tagName1, tagName2, tagName3 | My Task 51 ; null ; TODO ; tagName1, tagName2, tagName3')).toThrow(HTTPError[ERROR]);
  });
  test('description is less than 1 character', () => {
    expect(() => createMultipleTodoItems(' ; null ; TODO ; tagName1, tagName2, tagName3')).toThrow(HTTPError[ERROR]);
  });
  test('parentId does not exist', () => {
    expect(() => createMultipleTodoItems('My Task ; 99999999 ; TODO ; tagName1, tagName2, tagName3')).toThrow(HTTPError[ERROR]);
  });
  test('same description and parentId already exists', () => {
    createTodoItem('My Task', null);
    expect(() => createMultipleTodoItems('My Task ; null ; TODO ; tagName1, tagName2, tagName3')).toThrow(HTTPError[ERROR]);
  });
  test('same description and parentId already in the string', () => {
    const todoItemId = createTodoItem('My Task', null).todoItemId;
    expect(() => createMultipleTodoItems(`My Task1 ; ${todoItemId} ; TODO ; tagName1, tagName2, tagName3 | My Task1 ; ${todoItemId} ; TODO ; tagName1, tagName2, tagName3`)).toThrow(HTTPError[ERROR]);
  });
  test('status is not valid', () => {
    expect(() => createMultipleTodoItems('My Task ; null ; INVALID ; tagName1, tagName2, tagName3')).toThrow(HTTPError[ERROR]);
  });
  test('tagName length is more than 10 characters', () => {
    expect(() => createMultipleTodoItems('My Task ; null ; TODO ; tagName12345678901, tagName2, tagName3')).toThrow(HTTPError[ERROR]);
  });
  test('tagName length is less than 1 character', () => {
    expect(() => createMultipleTodoItems('My Task ; null ; TODO ; , tagName2, tagName3')).toThrow(HTTPError[ERROR]);
  });
  test('success case - with tag does not exist', () => {
    const todoItemId1 = createTodoItem('My Task', null).todoItemId;
    const idsArray = createMultipleTodoItems(`My Task 1 ; ${todoItemId1} ; TODO ; tagName1, tagName2, tagName3 | My Task 2 ; ${todoItemId1} ; TODO ; tagName1, tagName2, tagName3`);
    expect(idsArray).toStrictEqual({ todoItemIds: [expect.any(Number), expect.any(Number)] });
    expect(getDetailTodoItem(idsArray.todoItemIds[0]).item).toStrictEqual({
      description: 'My Task 1',
      tagIds: [expect.any(Number), expect.any(Number), expect.any(Number)],
      status: 'TODO',
      parentId: todoItemId1,
      score: 'NA',
    });
    expect(getDetailTodoItem(idsArray.todoItemIds[1]).item).toStrictEqual({
      description: 'My Task 2',
      tagIds: [expect.any(Number), expect.any(Number), expect.any(Number)],
      status: 'TODO',
      parentId: todoItemId1,
      score: 'NA',
    });
    expect(getTagList().tags).toStrictEqual([
      { tagId: expect.any(Number), name: 'tagName1' },
      { tagId: expect.any(Number), name: 'tagName2' },
      { tagId: expect.any(Number), name: 'tagName3' },
    ]);
  });
  test('success case - with tag already exist', () => {
    const todoItemId1 = createTodoItem('My Task', null).todoItemId;
    const tagId1 = createNewTag('tagName1').tagId;
    const tagId2 = createNewTag('tagName2').tagId;
    const tagId3 = createNewTag('tagName3').tagId;
    const idsArray = createMultipleTodoItems(`My Task 1 ; ${todoItemId1} ; TODO ; tagName1, tagName2, tagName3 | My Task 2 ; ${todoItemId1} ; TODO ; tagName1, tagName2, tagName3`);
    expect(idsArray).toStrictEqual({ todoItemIds: [expect.any(Number), expect.any(Number)] });
    expect(getDetailTodoItem(idsArray.todoItemIds[0]).item).toStrictEqual({
      description: 'My Task 1',
      tagIds: [expect.any(Number), expect.any(Number), expect.any(Number)],
      status: 'TODO',
      parentId: todoItemId1,
      score: 'NA',
    });
    expect(getDetailTodoItem(idsArray.todoItemIds[1]).item).toStrictEqual({
      description: 'My Task 2',
      tagIds: [expect.any(Number), expect.any(Number), expect.any(Number)],
      status: 'TODO',
      parentId: todoItemId1,
      score: 'NA',
    });
    expect(getTagList().tags).toStrictEqual([
      { tagId: tagId1, name: 'tagName1' },
      { tagId: tagId2, name: 'tagName2' },
      { tagId: tagId3, name: 'tagName3' },
    ]);
  });
  test('success case - with 3 elements', () => {
    const todoItem1 = createTodoItem('My Task', null).todoItemId;
    const idsArray = createMultipleTodoItems(`My Task 1 ; null ; TODO | My Task 2 ; ${todoItem1} ; TODO`);
    expect(idsArray).toStrictEqual({ todoItemIds: [expect.any(Number), expect.any(Number)] });
    expect(getDetailTodoItem(idsArray.todoItemIds[0]).item).toStrictEqual({
      description: 'My Task 1',
      tagIds: [],
      status: 'TODO',
      parentId: null,
      score: 'NA',
    });
    expect(getDetailTodoItem(idsArray.todoItemIds[1]).item).toStrictEqual({
      description: 'My Task 2',
      tagIds: [],
      status: 'TODO',
      parentId: todoItem1,
      score: 'NA',
    });
  });
  test('success case - with 2 elements', () => {
    const idsArray = createMultipleTodoItems('My Task 1 ; TODO | My Task 2; TODO');
    expect(idsArray).toStrictEqual({ todoItemIds: [expect.any(Number), expect.any(Number)] });
    expect(getDetailTodoItem(idsArray.todoItemIds[0]).item).toStrictEqual({
      description: 'My Task 1',
      tagIds: [],
      status: 'TODO',
      parentId: null,
      score: 'NA',
    });
    expect(getDetailTodoItem(idsArray.todoItemIds[1]).item).toStrictEqual({
      description: 'My Task 2',
      tagIds: [],
      status: 'TODO',
      parentId: null,
      score: 'NA',
    });
  });
  test('same description dont same parent already exists', () => {
    const todoItem1 = createTodoItem('My Task', null).todoItemId;
    const idsArray = createMultipleTodoItems(`My Task 1 ; null ; TODO | My Task ; ${todoItem1} ; TODO`);
    expect(idsArray).toStrictEqual({ todoItemIds: [expect.any(Number), expect.any(Number)] });
  });
  test('same description same dont same parent in the string', () => {
    const todoItem1 = createTodoItem('My Task', null).todoItemId;
    const idsArray = createMultipleTodoItems(`My Task 1 ; null ; TODO | My Task 1 ; ${todoItem1} ; TODO`);
    expect(idsArray).toStrictEqual({ todoItemIds: [expect.any(Number), expect.any(Number)] });
  });
});

describe('GET, /summary', () => {
  test('step is not valid', () => {
    expect(() => getSummary(5)).toThrow(HTTPError[ERROR]);
  });
  test('successful case', () => {
    const idsArray: any = [];
    for (let i = 0; i < 49; i++) {
      idsArray.push(createTodoItem(`My Task ${i}`, null).todoItemId);
      sleep(TIME_OUT);
    }
    expect(getSummary(null)).toStrictEqual({
      todoItemIds: [idsArray[48], idsArray[47], idsArray[46], idsArray[45], idsArray[44], idsArray[43], idsArray[42], idsArray[41], idsArray[40], idsArray[39]]
    });
    expect(getSummary(1)).toStrictEqual({
      todoItemIds: [idsArray[38], idsArray[37], idsArray[36], idsArray[35], idsArray[34], idsArray[33], idsArray[32], idsArray[31], idsArray[30], idsArray[29]]
    });
    expect(getSummary(2)).toStrictEqual({
      todoItemIds: [idsArray[28], idsArray[27], idsArray[26], idsArray[25], idsArray[24], idsArray[23], idsArray[22], idsArray[21], idsArray[20], idsArray[19]]
    });
    expect(getSummary(3)).toStrictEqual({
      todoItemIds: [idsArray[18], idsArray[17], idsArray[16], idsArray[15], idsArray[14], idsArray[13], idsArray[12], idsArray[11], idsArray[10], idsArray[9]]
    });
    expect(getSummary(4)).toStrictEqual({
      todoItemIds: [idsArray[8], idsArray[7], idsArray[6], idsArray[5], idsArray[4], idsArray[3], idsArray[2], idsArray[1], idsArray[0]]
    });
  });
});

describe('GET, /notification', () => {
  test('successful case with 1 notification', () => {
    const todoItemId = createTodoItem('My Task', null).todoItemId;
    expect(updateTodoItem(todoItemId, 'My Task Update', [], 'DONE', null, null)).toStrictEqual({});
    expect(getNotification().notifications).toStrictEqual([
      {
        todoItemId: todoItemId,
        todoItemDescription: 'My Task Update',
        statusBefore: 'TODO',
        statusAfter: 'DONE',
        statusChangeTimestamp: expect.any(Number),
      },
    ]);
  });
  test('successful case with 2 notifications from 1 todoItem', () => {
    const todoItemId = createTodoItem('My Task', null).todoItemId;
    expect(updateTodoItem(todoItemId, 'My Task Update 1', [], 'DONE', null, null)).toStrictEqual({});
    expect(updateTodoItem(todoItemId, 'My Task Update 2', [], 'BLOCKED', null, null)).toStrictEqual({});
    expect(getNotification().notifications).toStrictEqual([
      {
        todoItemId: todoItemId,
        todoItemDescription: 'My Task Update 2',
        statusBefore: 'TODO',
        statusAfter: 'DONE',
        statusChangeTimestamp: expect.any(Number),
      },
      {
        todoItemId: todoItemId,
        todoItemDescription: 'My Task Update 2',
        statusBefore: 'DONE',
        statusAfter: 'BLOCKED',
        statusChangeTimestamp: expect.any(Number),
      },
    ]);
  });
  test('successful case with 2 notifications from 2 todoItems', () => {
    const todoItemId1 = createTodoItem('My Task', null).todoItemId;
    const todoItemId2 = createTodoItem('My Task 2', null).todoItemId;
    expect(updateTodoItem(todoItemId1, 'My Task Update 1', [], 'DONE', null, null)).toStrictEqual({});
    expect(updateTodoItem(todoItemId2, 'My Task Update 2', [], 'BLOCKED', null, null)).toStrictEqual({});
    expect(getNotification().notifications).toStrictEqual([
      {
        todoItemId: todoItemId1,
        todoItemDescription: 'My Task Update 1',
        statusBefore: 'TODO',
        statusAfter: 'DONE',
        statusChangeTimestamp: expect.any(Number),
      },
      {
        todoItemId: todoItemId2,
        todoItemDescription: 'My Task Update 2',
        statusBefore: 'TODO',
        statusAfter: 'BLOCKED',
        statusChangeTimestamp: expect.any(Number),
      },
    ]);
  });
});

describe('example', () => {
  test('example', () => {
    expect(getExampleRoute()).toStrictEqual({ message: 'Hi' });
  });
});
