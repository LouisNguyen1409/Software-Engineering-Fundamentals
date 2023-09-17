import request, { HttpVerb } from 'sync-request';
import { port, url } from './config.json';

const SERVER_URL = `${url}:${port}`;

function helperFunctions (method: HttpVerb, path: string, info: object) {
  let qs: object = {};
  let json: object = {};
  if (['GET', 'DELETE'].includes(method)) {
    qs = info;
  } else {
    json = info;
  }
  const res = request(method, `${SERVER_URL}${path}`, { qs, json });
  return { body: JSON.parse(res.body.toString()), status: res.statusCode };
}

export function clear () {
  return helperFunctions('DELETE', '/clear', {});
}
export function postCreate (sender: string, title: string, content: string) {
  return helperFunctions('POST', '/post/create', {
    sender: sender,
    title: title,
    content: content,
  });
}
export function postComment (sender: string, comment: string, postId: number) {
  return helperFunctions('POST', `/post/${postId}/comment`, {
    sender: sender,
    comment: comment,
  });
}
export function postDetail (postId: number) {
  return helperFunctions('GET', `/post/${postId}`, {});
}
export function postUpdate (sender: string, title: string, content: string, postId: number) {
  return helperFunctions('PUT', `/post/${postId}`, {
    sender: sender,
    title: title,
    content: content,
  });
}
export function postList () {
  return helperFunctions('GET', '/posts/list', {});
}
