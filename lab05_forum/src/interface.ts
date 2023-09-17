import { Post } from './dataStore';

export interface ErrorObject {
    error: string;
}

export interface PostCreateReturn {
    postId: number;
}

export interface CommentCreateReturn {
    commentId: number;
}

export interface PostDetailReturn {
    post: Post;
}

export interface ListReturn {
    posts: Post[];
}
