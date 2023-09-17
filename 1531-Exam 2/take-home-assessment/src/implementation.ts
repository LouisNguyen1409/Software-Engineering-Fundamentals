import { setData, getData } from './dataStore';
import * as type from './interface';
import * as hp from './helper';
import HTTPError from 'http-errors';

const ERROR = 400;
const TIME_OUT = 1000;
const MAX_ITEMS = 50;
const LENGTH_MAX = 10;
const LENGTH_MIN = 1;
export function clear() {
  const data: type.DataStore = getData();
  data.items = [];
  data.tags = [];
  data.notifications = [];
  data.todoItemId = 0;
  data.tagId = 0;
  setData(data);
  return {};
}

export function getTagList() {
  const data: type.DataStore = getData();
  const returnTags = [];
  for (const tag of data.tags) {
    returnTags.push({
      tagId: tag.tagId,
      name: tag.name,
    });
  }
  return { tags: returnTags };
}

export function getTagName(tagId: number) {
  const data: type.DataStore = getData();
  const tag = hp.findTagId(tagId, data);
  if (tag === undefined) {
    throw HTTPError(ERROR, 'tagId does not exist');
  }
  return { name: tag.name };
}

export function deleteTag(tagId: number) {
  const data: type.DataStore = getData();
  const tag = hp.findTagId(tagId, data);
  if (tag === undefined) {
    throw HTTPError(ERROR, 'tagId does not exist');
  }
  for (const itemId of tag.itemIds) {
    const item = hp.findItemId(itemId, data);
    item.tagIds = item.tagIds.filter((id: number) => id !== tagId);
  }
  data.tags = data.tags.filter((tag: type.Tag) => tag.tagId !== tagId);
  setData(data);
  return {};
}

export function createNewTag(name: string) {
  const data: type.DataStore = getData();
  if (name.length < LENGTH_MIN) {
    throw HTTPError(ERROR, 'name is shorter than 1 character');
  }

  if (name.length > LENGTH_MAX) {
    throw HTTPError(ERROR, 'name is longer than 10 characters');
  }

  if (hp.findName(name, data) !== undefined) {
    throw HTTPError(ERROR, 'name already exists');
  }

  const tag: type.Tag = {
    tagId: data.tagId,
    name: name,
    itemIds: [],
  };
  data.tagId++;
  data.tags.push(tag);
  setData(data);
  return { tagId: tag.tagId };
}

export function getDetailTodoItem(todoItemId: number) {
  const data: type.DataStore = getData();
  const item = hp.findItemId(todoItemId, data);
  if (item === undefined) {
    throw HTTPError(ERROR, 'todoItemId does not exist');
  }
  return {
    item: {
      description: item.description,
      tagIds: item.tagIds,
      status: item.status,
      parentId: item.parentId,
      score: item.score,
    }
  };
}

export function deleteTodoItem(todoItemId: number) {
  const data: type.DataStore = getData();
  const item = hp.findItemId(todoItemId, data);
  if (item === undefined) {
    throw HTTPError(ERROR, 'todoItemId does not exist');
  }
  const deleteIds = [todoItemId];
  while (deleteIds.length !== 0) {
    const currentId = deleteIds.pop();
    const currentItem = hp.findItemId(currentId, data);
    for (const child of currentItem.childrenIds) {
      deleteIds.push(child);
    }
    for (const tagId of currentItem.tagIds) {
      const tag = hp.findTagId(tagId, data);
      tag.itemIds = tag.itemIds.filter((id: number) => id !== currentItem.todoItemId);
      if (tag.itemIds.length === 0) {
        deleteTag(tag.tagId);
      }
    }
    data.notifications = data.notifications.filter((notification: type.Notification) => notification.todoItemId !== currentItem.todoItemId);
    data.items = data.items.filter((item: type.Item) => item.todoItemId !== currentItem.todoItemId);
  }
  setData(data);
  return {};
}

export function createTodoItem(description: string, parentId: number) {
  const data: type.DataStore = getData();
  if (data.items.length >= MAX_ITEMS) {
    throw HTTPError(ERROR, 'There are already 50 todo items generated');
  }
  if (description.length < LENGTH_MIN) {
    throw HTTPError(ERROR, 'description is shorter than 1 character');
  }
  const parent = hp.findItemId(parentId, data);
  if (parentId !== null && parent === undefined) {
    throw HTTPError(ERROR, 'parentId does not refer to a different, existing todo item.');
  }
  const itemSameDes = hp.findItemIdwDes(description, data.items);
  if (itemSameDes !== undefined) {
    if (itemSameDes.parentId === parentId) {
      throw HTTPError(ERROR, 'description already exists for that parent');
    }
  }
  if (parentId !== null) {
    parent.childrenIds.push(data.todoItemId);
  }
  const item: type.Item = {
    todoItemId: data.todoItemId,
    description: description,
    status: 'TODO',
    tagIds: [],
    parentId: parentId,
    childrenIds: [],
    score: 'NA',
    currentTime: Math.floor(Date.now() / TIME_OUT),
    deadline: null,
  };
  data.todoItemId++;
  data.items.push(item);
  setData(data);
  return { todoItemId: item.todoItemId };
}

export function updateTodoItem(todoItemId: number, description: string, tagIds: number[], status: string, parentId: number, deadline: number) {
  const data: type.DataStore = getData();

  const item = hp.findItemId(todoItemId, data);
  if (item === undefined) {
    throw HTTPError(ERROR, 'todoItemId does not exist');
  }
  if (description.length < LENGTH_MIN) {
    throw HTTPError(ERROR, 'description is shorter than 1 character');
  }

  const parent = hp.findItemId(parentId, data);
  if (parent === undefined && parentId !== null) {
    throw HTTPError(ERROR, 'parentId is not a valid todoItemId');
  }
  const itemSameDes = hp.findItemIdwDes(description, data.items);
  if (itemSameDes !== undefined) {
    if (itemSameDes.parentId === parentId) {
      throw HTTPError(ERROR, 'description already exists for that parent');
    }
  }

  if (status === null || Object.values(type.Status).includes(status) === false) {
    throw HTTPError(ERROR, 'status is not a valid enum of statuses');
  }

  for (const tagId of tagIds) {
    const tag = hp.findTagId(tagId, data);
    if (tag === undefined) {
      throw HTTPError(ERROR, 'tagId is not a valid tagId');
    }
  }
  if (parentId === todoItemId) {
    throw HTTPError(ERROR, "parentId refers to this todo list item's ID");
  }
  let currentId = parentId;
  while (currentId !== null && currentId !== todoItemId) {
    const currentItem = hp.findItemId(currentId, data);
    currentId = currentItem.parentId;
  }
  if (currentId === todoItemId) {
    throw HTTPError(ERROR, 'parentId creates a cycle');
  }
  if (deadline !== null && hp.isValidUnixTimestamp(deadline) === false) {
    throw HTTPError(ERROR, 'deadline is not null and is not a valid unix timestamp');
  }
  if (deadline !== null) {
    deadline = parseInt(deadline.toString());
  }
  for (const tagId of item.tagIds) {
    if (tagIds.includes(tagId) === false) {
      const tag = hp.findTagId(tagId, data);
      tag.itemIds = tag.itemIds.filter((id: number) => id !== todoItemId);
      if (tag.itemIds.length === 0) {
        deleteTag(tag.tagId);
      }
    }
  }

  if (item.parentId !== parentId && item.parentId !== null && parentId !== null) {
    const oldParent = hp.findItemId(item.parentId, data);
    oldParent.childrenIds = oldParent.childrenIds.filter((id: number) => id !== todoItemId);
    const newParent = hp.findItemId(parentId, data);
    newParent.childrenIds.push(todoItemId);
  }
  if (status !== item.status) {
    const notification: type.Notification = {
      todoItemId: todoItemId,
      todoItemDescription: description,
      statusBefore: item.status,
      statusAfter: status as type.StatusType,
      statusChangeTimestamp: Math.floor(Date.now() / TIME_OUT),
    };
    data.notifications.push(notification);
    for (let i = 0; i < data.notifications.length; i++) {
      if (data.notifications[i].todoItemId === todoItemId) {
        data.notifications[i].todoItemDescription = description;
      }
    }
  }
  for (const tagId of tagIds) {
    const tag: type.Tag = hp.findTagId(tagId, data);
    data.tags[data.tags.indexOf(tag)].itemIds.push(todoItemId);
  }
  item.deadline = deadline;
  item.description = description;
  item.tagIds = tagIds;
  item.status = status as type.StatusType;
  item.currentTime = Math.floor(Date.now() / TIME_OUT);
  item.parentId = parentId;
  if (status as type.StatusType !== 'DONE') {
    item.score = 'NA';
  } else if (deadline === null) {
    item.score = 'HIGH';
  } else if (status as type.StatusType === 'DONE' && deadline > Math.floor(Date.now() / TIME_OUT)) {
    item.score = 'HIGH';
  } else if (status as type.StatusType === 'DONE' && deadline < Math.floor(Date.now() / TIME_OUT)) {
    item.score = 'LOW';
  } else {
    item.score = 'HIGH';
  }
  setData(data);
  return {};
}

export function getListTodoItems(parentId: number, tagIds: any, status: string | null) {
  const data: type.DataStore = getData();
  if (status !== null && Object.values(type.Status).includes(JSON.parse(status)) === false) {
    throw HTTPError(ERROR, 'status is not null and is not a valid enum of statuses');
  }

  if (tagIds !== null && tagIds.length === 0) {
    throw HTTPError(ERROR, 'tagIds is not null and is empty');
  }

  if (tagIds !== null) {
    for (const tagId of tagIds) {
      const tag = hp.findTagId(tagId, data);
      if (tag === undefined) {
        throw HTTPError(ERROR, 'tagIds is not null and contains a tagId that is not a valid tagId');
      }
    }
  }

  const parent = hp.findItemId(parentId, data);
  if (parentId !== null && parent === undefined) {
    throw HTTPError(ERROR, 'parentId is not null and is not a valid todoItemId');
  }

  let sortItems = data.items.filter((item: type.Item) => item.parentId === parentId);
  if (tagIds !== null) {
    for (const tagId of tagIds) {
      sortItems = sortItems.filter((item: type.Item) => item.tagIds.includes(tagId));
    }
  }

  if (status !== null) {
    sortItems = sortItems.filter((item: type.Item) => item.status === JSON.parse(status));
  }
  const returnItems = [];
  for (const item of sortItems) {
    returnItems.push({
      description: item.description,
      tagIds: item.tagIds,
      status: item.status,
      parentId: item.parentId,
      score: item.score,
    });
  }
  return { todoItems: returnItems };
}

export function createMultipleTodoItems(bulkString: string) {
  const data: type.DataStore = getData();
  const bulkArray = bulkString.split('|');
  const itemArray = [];
  if (data.items.length + bulkArray.length > MAX_ITEMS) {
    throw HTTPError(ERROR, 'Processing this bulk creation will generate more than 50 todo items');
  }
  for (const item of bulkArray) {
    itemArray.push(item.split(';'));
  }
  const itemObject = [];
  for (const item of itemArray) {
    for (const element of item) {
      item.splice(item.indexOf(element), 1, element.trim());
    }
    let newItem: any = {};
    if (item.length === 4) {
      newItem = {
        description: item[0],
        status: item[2],
        tagIds: item[3].split(','),
      };
      if (item[1] === ' ' || item[1] === 'null' || item[1] === null) {
        item[1] = null;
        newItem.parentId = item[1];
      } else {
        newItem.parentId = parseInt(item[1]);
      }
    } else if (item.length === 3) {
      if (item[1] === null || item[1] === ' ' || item[1] === 'null') {
        newItem = {
          description: item[0],
          parentId: null,
          status: item[2],
          tagIds: [],
        };
      } else if (isNaN(parseInt(item[1])) === false) {
        newItem = {
          description: item[0],
          parentId: parseInt(item[1]),
          status: item[2],
          tagIds: [],
        };
      } else {
        newItem = {
          description: item[0],
          parentId: null,
          status: item[1],
          tagIds: item[2].split(','),
        };
      }
      // } else if (isNaN(parseInt(item[1])) === true) {
      //   newItem = {
      //     description: item[0],
      //     parentId: null,
      //     status: item[1],
      //     tagIds: item[2].split(','),
      //   };
      // }
    } else if (item.length === 2) {
      newItem = {
        description: item[0],
        parentId: null,
        status: item[1],
        tagIds: [],
      };
    }
    itemObject.push(newItem);
  }
  for (const item of itemObject) {
    if (item.description.length < LENGTH_MIN) {
      throw HTTPError(ERROR, 'description is shorter than 1 character');
    }
    let itemSameDes = hp.findItemIdwDes(item.description, data.items);
    if (itemSameDes !== undefined) {
      if (itemSameDes.parentId === item.parentId) {
        throw HTTPError(ERROR, 'description already exists for that parent');
      } else {
        continue;
      }
    }
    const index = itemObject.indexOf(item);
    for (const item2 of itemObject) {
      if (item2.description === item.description && itemObject.indexOf(item2) !== index) {
        itemSameDes = item2;
      } else {
        continue;
      }
    }
    const parent = hp.findItemId(item.parentId, data);
    if (item.parentId !== null && parent === undefined) {
      throw HTTPError(ERROR, 'parentId is not a valid todoItemId');
    }

    if (item.status === null || Object.values(type.Status).includes(item.status) === false) {
      throw HTTPError(ERROR, 'status is not a valid enum of statuses');
    }
    for (const tagName of item.tagIds) {
      item.tagIds.splice(item.tagIds.indexOf(tagName), 1, tagName.trim());
    }
    const tagIds = [];
    for (const tagName of item.tagIds) {
      if (tagName < LENGTH_MIN) {
        throw HTTPError(ERROR, 'name shorter than 1 character');
      }
      if (tagName.length > LENGTH_MAX) {
        throw HTTPError(ERROR, 'name longer than 10 characters');
      }
      const tag = hp.findName(tagName, data);
      if (tag === undefined) {
        const newTag = createNewTag(tagName);
        tagIds.push(newTag.tagId);
      } else {
        tagIds.push(tag.tagId);
      }
    }
    item.tagIds = tagIds;
  }
  const newIds = [];
  for (const item of itemObject) {
    const itemId = createTodoItem(item.description, item.parentId);
    newIds.push(itemId.todoItemId);
    const newItem = hp.findItemId(itemId.todoItemId, data);
    newItem.status = item.status;
    newItem.tagIds = item.tagIds;
    for (const tagId of item.tagIds) {
      const tag = hp.findTagId(tagId, data);
      tag.itemIds.push(itemId.todoItemId);
    }
  }
  setData(data);
  return { todoItemIds: newIds };
}

export function getSummary(step: number) {
  const data: type.DataStore = getData();
  const validSteps = [null, 1, 2, 3, 4];
  if (validSteps.includes(step) === false) {
    throw HTTPError(ERROR, 'Step is not one of { null, 1, 2, 3, 4 }, as there are a max of 50 items to get.');
  }
  data.items = data.items.sort((a: type.Item, b: type.Item) => b.currentTime - a.currentTime);
  const returnIds = [];
  if (step === null) {
    step = 0;
  }
  for (let i = step * 10; i < (step + 1) * 10; i++) {
    if (data.items[i] === undefined) {
      break;
    }
    returnIds.push(data.items[i].todoItemId);
  }
  return { todoItemIds: returnIds };
}

export function getNotification() {
  const data: type.DataStore = getData();
  return { notifications: data.notifications };
}
