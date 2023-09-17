import * as type from './interface';
// ====================================================================

export function findTagId(inputTagId: number, data: type.DataStore) {
  function checkTagId(tag: type.Tag) {
    return tag.tagId === inputTagId;
  }
  return data.tags.find(checkTagId);
}

export function findName(inputName: string, data: type.DataStore) {
  function checkName(tag: type.Tag) {
    return tag.name.toLowerCase() === inputName.toLowerCase();
  }
  return data.tags.find(checkName);
}

export function findItemId(inputTodoItemId: number, data: type.DataStore) {
  function checkTodoItemId(item: type.Item) {
    return item.todoItemId === inputTodoItemId;
  }
  return data.items.find(checkTodoItemId);
}
export function findItemIdwDes(inputDescription: string, data: type.Item[]) {
  function checkTodoItemId(item: type.Item) {
    return item.description.toLowerCase() === inputDescription.toLowerCase();
  }
  return data.find(checkTodoItemId);
}

export function isValidUnixTimestamp(timestamp: number) {
  if (timestamp > 0 && timestamp < ((2 ** 32) - 1)) {
    return true;
  }
  return false;
}
