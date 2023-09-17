/**
 * You may choose to write your functions here, or make new files as you see fit.
 *
 * When marking your work, we will only be sending requests to your server and checking the response,
 * so any "functions" or code that you write here will not be directly assessed.
 */

import { Post, DataStore, getData, setData } from './dataStore';
import { ErrorObject, PostCreateReturn, CommentCreateReturn, ListReturn, PostDetailReturn } from './interface';

function findPostId (postId: number): Post {
  const data: DataStore = getData();
  function isId (entries: Post) {
    return entries.postId === postId;
  }
  return data.posts.find(isId);
}

export function postCreate (sender: string, title: string, content: string): PostCreateReturn | ErrorObject {
  // Check if sender, title, content is empty
  if (sender === '') {
    return { error: 'sender field is empty.' };
  }

  if (title === '') {
    return { error: 'title field is empty.' };
  }

  if (content === '') {
    return { error: 'content field is empty.' };
  }

  // Run postCreate if all fields valid
  const data: DataStore = getData();
  const postId: number = data.posts.length;
  const timeSent: number = Math.floor(Date.now() / 1000);

  data.posts.push({
    postId: postId,
    sender: sender,
    title: title,
    timeSent: timeSent,
    content: content,
    comments: [],
  });

  setData(data);
  return { postId: postId };
}

export function postComment (sender: string, comment: string, postId: number): CommentCreateReturn | ErrorObject {
  // Check if sender, comment is empty
  if (sender === '') {
    return { error: 'sender field is empty.' };
  }

  if (comment === '') {
    return { error: 'comment field is empty.' };
  }

  // Check if postId is valid
  const postInfo = findPostId(postId);
  if (postInfo === undefined) {
    return { error: 'postid does not refer to a valid post.' };
  }

  // Run postComment if all fields valid
  const data: DataStore = getData();
  const commentId: number = postInfo.comments.length;
  const timeSent: number = Math.floor(Date.now() / 1000);

  data.posts[postId].comments.push({
    commentId: commentId,
    sender: sender,
    comment: comment,
    timeSent: timeSent
  });

  setData(data);
  return { commentId: commentId };
}

export function postDetail (postId: number): PostDetailReturn | ErrorObject {
  const data: DataStore = getData();
  // Check if postId is valid
  const postInfo = findPostId(postId);
  if (postInfo === undefined) {
    return { error: 'postid does not refer to a valid post. 2' };
  }

  // sort comments by timeSent
  data.posts[postId].comments.sort((a, b) => b.timeSent - a.timeSent);
  setData(data);
  return { post: data.posts[postId] };
}

export function postUpdate (sender: string, title: string, content: string, postId: number): object | ErrorObject {
  const data: DataStore = getData();
  // Check if postId is valid
  const postInfo = findPostId(postId);
  if (postInfo === undefined) {
    return { error: 'postid does not refer to a valid post.' };
  }
  // Check if sender, title, content is empty
  if (sender === '') {
    return { error: 'sender field is empty.' };
  }

  if (title === '') {
    return { error: 'title field is empty.' };
  }

  if (content === '') {
    return { error: 'content field is empty.' };
  }

  // Run postUpdate if all fields valid
  data.posts[postId].sender = sender;
  data.posts[postId].title = title;
  data.posts[postId].content = content;
  setData(data);
  return {};
}

export function postList (): ListReturn {
  const data: DataStore = getData();
  data.posts.sort((a, b) => b.timeSent - a.timeSent);
  setData(data);
  return { posts: data.posts };
}

export function clear (): object {
  let data: DataStore = getData();
  data = {
    posts: [],
  };
  setData(data);
  return {};
}
