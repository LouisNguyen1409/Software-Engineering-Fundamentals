import * as type from './interface';

let data: type.DataStore = {
  items: [],
  tags: [],
  notifications: [],
  tagId: 0,
  todoItemId: 0,
};

export function setData(inputData: type.DataStore) {
  data = inputData;
}

export function getData(): type.DataStore {
  return data;
}
