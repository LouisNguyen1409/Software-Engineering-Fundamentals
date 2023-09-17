export interface Payload {
  [key: string]: any;
}

export const Status = {
  TODO: 'TODO',
  INPROGRESS: 'INPROGRESS',
  BLOCKED: 'BLOCKED',
  DONE: 'DONE',
};

export type StatusType = 'TODO' | 'INPROGRESS' | 'BLOCKED' | 'DONE';

export const Score = {
  LOW: 'LOW',
  NA: 'NA',
  HIGH: 'HIGH',
};

export type ScoreType = 'LOW' | 'NA' | 'HIGH';

export interface Item {
  todoItemId: number,
  description: string,
  tagIds: number[],
  status: StatusType,
  parentId: number | null,
  childrenIds: number[],
  score: ScoreType,
  currentTime: number
  deadline: number | null,
}

export interface Tag {
  tagId: number,
  name: string,
  itemIds: number[],
}

export interface Notification {
  todoItemId: number,
  todoItemDescription: string,
  statusBefore: StatusType,
  statusAfter: StatusType,
  statusChangeTimestamp: number,
}

export interface DataStore {
  items: Item[],
  tags: Tag[],
  notifications: Notification[],
  tagId: number,
  todoItemId: number,
}
