/**
 * This is a stub dataStore - you can ignore or edit and use it as you please!
 */

interface Comments {
  commentId: number;
  sender: string;
  comment: string;
  timeSent: number;
}

export interface Post {
  postId: number;
  sender: string;
  title: string;
  timeSent: number;
  content: string;
  comments: Comments[];
}

export interface DataStore {
  posts: Post[];
}

let dataStore: DataStore = {
  posts: [],
};

export function getData (): DataStore {
  return dataStore;
}

export function setData (inputData: DataStore) {
  dataStore = inputData;
}
