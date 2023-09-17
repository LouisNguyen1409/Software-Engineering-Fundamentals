/**
 * This is a placeholder test file for you to write your tests.
 * Feel free to ignore/edit/remove this file and write your tests elsewhere if you wish.
 *
 * You are highly encouraged to look at the sample tests written in src/echo.test.ts!
 */

import { postCreate, postComment, postList, clear, postDetail, postUpdate } from './testHelper';
import { Post } from './dataStore';
import { PostCreateReturn } from './interface';

const ERROR = { error: expect.any(String) };
const POSTID = { postId: expect.any(Number) };
const COMMENTID = { commentId: expect.any(Number) };
const EMPTY = { posts: [] };

beforeEach(() => {
  clear();
});

describe('Test for clear', () => {
  let postId1: PostCreateReturn;
  let postId2: PostCreateReturn;
  beforeEach(() => {
    postId1 = postCreate('Louis', 'Example 1', 'Marshall speaker').body;
    postId2 = postCreate('Dylan', 'Example 2', 'LG monitor').body;
  });

  test('Test clear posts', () => {
    clear();
    expect(postList().status).toStrictEqual(200);
    expect(postList().body).toStrictEqual(EMPTY);
  });

  test('Test clear posts with comments', () => {
    postComment('Jac', 'Good speaker for chill musics', postId1.postId);
    postComment('Marius', 'Good monitor for coding', postId2.postId);
    clear();
    expect(postList().status).toStrictEqual(200);
    expect(postList().body).toStrictEqual(EMPTY);
  });

  test('Test clear return', () => {
    expect(clear().status).toStrictEqual(200);
    expect(clear().body).toStrictEqual({});
  });
});

describe('Test for postCreate', () => {
  test('Test for empty sender', () => {
    expect(postCreate('', 'Example 1', 'Marshall speaker').status).toStrictEqual(400);
    expect(postCreate('', 'Example 1', 'Marshall speaker').body).toStrictEqual(ERROR);
  });

  test('Test for empty title', () => {
    expect(postCreate('Louis', '', 'Marshall speaker').status).toStrictEqual(400);
    expect(postCreate('Louis', '', 'Marshall speaker').body).toStrictEqual(ERROR);
  });

  test('Test for empty content', () => {
    expect(postCreate('Louis', 'Example 1', '').status).toStrictEqual(400);
    expect(postCreate('Louis', 'Example 1', '').body).toStrictEqual(ERROR);
  });

  test('Test for valid input', () => {
    expect(postCreate('Louis', 'Example 1', 'Marshall speaker').status).toStrictEqual(200);
    expect(postCreate('Louis', 'Example 1', 'Marshall speaker').body).toStrictEqual(POSTID);
  });
});

describe('Test for postComment', () => {
  let postId: PostCreateReturn;
  beforeEach(() => {
    postId = postCreate('Louis', 'Example 1', 'Marshall speaker').body;
  });

  test('Test for empty sender', () => {
    expect(postComment('', 'Good speaker for chill musics', postId.postId).status).toStrictEqual(400);
    expect(postComment('', 'Good speaker for chill musics', postId.postId).body).toStrictEqual(ERROR);
  });

  test('Test for empty comment', () => {
    expect(postComment('Louis', '', postId.postId).status).toStrictEqual(400);
    expect(postComment('Louis', '', postId.postId).body).toStrictEqual(ERROR);
  });

  test('Test for invalid postId', () => {
    expect(postComment('Louis', 'Good speaker for chill musics', -100).status).toStrictEqual(400);
    expect(postComment('Louis', 'Good speaker for chill musics', -100).body).toStrictEqual(ERROR);
  });

  test('Test for valid input', () => {
    expect(postComment('Louis', 'Good speaker for chill musics', postId.postId).status).toStrictEqual(200);
    expect(postComment('Louis', 'Good speaker for chill musics', postId.postId).body).toStrictEqual(COMMENTID);
  });
});

describe('Test for postDetail', () => {
  let postId: PostCreateReturn;
  let expectedTimeP: number;
  beforeEach(() => {
    expectedTimeP = Math.floor(Date.now() / 1000);
    postId = postCreate('Louis', 'Example 1', 'Marshall speaker').body;
  });

  test('Test for invalid postId', () => {
    expect(postDetail(-100).status).toStrictEqual(400);
    expect(postDetail(-100).body).toStrictEqual(ERROR);
  });

  test('Test for valid input', () => {
    const expectedTimeC1: number = Math.floor(Date.now() / 1000);
    postComment('Jac', 'Good speaker for chill musics', postId.postId);
    postComment('Marius', 'Bad speaker for rap musics', postId.postId);
    postComment('Dylan', 'Good speaker for rock musics', postId.postId);
    const post: Post = postDetail(postId.postId).body.post;
    expect(post.timeSent).toBeGreaterThanOrEqual(expectedTimeP);
    expect(post.comments[0].timeSent).toBeGreaterThanOrEqual(expectedTimeC1);
    expect(post.comments[1].timeSent).toBeGreaterThanOrEqual(expectedTimeC1);
    expect(post.comments[2].timeSent).toBeGreaterThanOrEqual(post.comments[1].timeSent);
    expect(postDetail(postId.postId).status).toStrictEqual(200);
    expect(post).toStrictEqual({
      postId: postId.postId,
      sender: post.sender,
      title: post.title,
      timeSent: expect.any(Number),
      content: post.content,
      comments: [
        {
          commentId: post.comments[0].commentId,
          sender: post.comments[0].sender,
          comment: post.comments[0].comment,
          timeSent: expect.any(Number),
        },
        {
          commentId: post.comments[1].commentId,
          sender: post.comments[1].sender,
          comment: post.comments[1].comment,
          timeSent: expect.any(Number),
        },
        {
          commentId: post.comments[2].commentId,
          sender: post.comments[2].sender,
          comment: post.comments[2].comment,
          timeSent: expect.any(Number),
        }
      ]
    });
  });
});

describe('Test for postUpdate', () => {
  let postId: PostCreateReturn;
  let expectedTimeP: number;
  beforeEach(() => {
    expectedTimeP = Math.floor(Date.now() / 1000);
    postId = postCreate('Louis', 'Example 1', 'Marshall speaker').body;
  });

  test('Test for empty sender', () => {
    expect(postUpdate('', 'Example 2', 'LG Monitor', postId.postId).status).toStrictEqual(400);
    expect(postUpdate('', 'Example 2', 'LG Monitor', postId.postId).body).toStrictEqual(ERROR);
  });

  test('Test for empty title', () => {
    expect(postUpdate('Dylan', '', 'LG Monitor', postId.postId).status).toStrictEqual(400);
    expect(postUpdate('Dylan', '', 'LG Monitor', postId.postId).body).toStrictEqual(ERROR);
  });

  test('Test for empty content', () => {
    expect(postUpdate('Dylan', 'Example 2', '', postId.postId).status).toStrictEqual(400);
    expect(postUpdate('Dylan', 'Example 2', '', postId.postId).body).toStrictEqual(ERROR);
  });

  test('Test for invalid postId', () => {
    expect(postUpdate('Dylan', 'Example 2', 'LG Monitor', -100).status).toStrictEqual(400);
    expect(postUpdate('Dylan', 'Example 2', 'LG Monitor', -100).body).toStrictEqual(ERROR);
  });

  test('Test for valid input', () => {
    expect(postUpdate('Dylan', 'Example 2', 'LG Monitor', postId.postId).status).toStrictEqual(200);
    expect(postUpdate('Dylan', 'Example 2', 'LG Monitor', postId.postId).body).toStrictEqual({});
  });

  test('Test for postDetail', () => {
    postUpdate('Dylan', 'Example 2', 'LG Monitor', postId.postId);
    const post: Post = postDetail(postId.postId).body.post;
    expect(post.timeSent).toBeGreaterThanOrEqual(expectedTimeP);
    expect(postDetail(postId.postId).status).toStrictEqual(200);
    expect(post).toStrictEqual({
      postId: postId.postId,
      sender: post.sender,
      title: post.title,
      timeSent: expect.any(Number),
      content: post.content,
      comments: post.comments,
    });
  });
});

describe('Test for postList', () => {
  test('Test for empty posts', () => {
    expect(postList().status).toStrictEqual(200);
    expect(postList().body).toStrictEqual(EMPTY);
  });

  test('Test for non-empty posts', () => {
    const expectedTimeP1: number = Math.floor(Date.now() / 1000);
    const postId1: PostCreateReturn = postCreate('Louis', 'Example 1', 'Marshall speaker').body;
    const postId2: PostCreateReturn = postCreate('Dylan', 'Example 2', 'LG monitor').body;
    const expectedTimeC1: number = Math.floor(Date.now() / 1000);
    postComment('Jac', 'Good speaker for chill musics', postId1.postId);
    const expectedTimeC2: number = Math.floor(Date.now() / 1000);
    postComment('Marius', 'Good monitor for coding', postId2.postId);
    const post1: Post = postDetail(postId1.postId).body.post;
    const post2: Post = postDetail(postId2.postId).body.post;
    const list: Post = postList().body.posts;
    expect(post1.timeSent).toBeGreaterThanOrEqual(expectedTimeP1);
    expect(post2.timeSent).toBeGreaterThanOrEqual(expectedTimeP1);

    expect(post1.comments[0].timeSent).toBeGreaterThanOrEqual(expectedTimeC1);
    expect(post2.comments[0].timeSent).toBeGreaterThanOrEqual(expectedTimeC2);
    expect(postList().status).toStrictEqual(200);
    expect(postList().body).toStrictEqual({
      posts: [
        {
          postId: list[0].postId,
          sender: list[0].sender,
          title: list[0].title,
          timeSent: expect.any(Number),
          content: list[0].content,
          comments: [
            {
              commentId: list[0].comments[0].commentId,
              sender: list[0].comments[0].sender,
              comment: list[0].comments[0].comment,
              timeSent: expect.any(Number),
            }
          ]
        },
        {
          postId: list[1].postId,
          sender: list[1].sender,
          title: list[1].title,
          timeSent: list[1].timeSent,
          content: list[1].content,
          comments: [
            {
              commentId: list[1].comments[0].commentId,
              sender: list[1].comments[0].sender,
              comment: list[1].comments[0].comment,
              timeSent: expect.any(Number),
            }
          ]
        }
      ]
    });
  });
});
