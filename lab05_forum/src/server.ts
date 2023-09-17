import express, { json, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { echo } from './echo';
import { port, url } from './config.json';
import { postCreate, postComment, postDetail, postList, clear, postUpdate } from './forum';
import YAML from 'yamljs';
import swaggerUi from 'swagger-ui-express';
import { ErrorObject, PostCreateReturn, CommentCreateReturn, PostDetailReturn } from './interface';

const PORT: number = parseInt(process.env.PORT || port);
const HOST: string = process.env.IP || '127.0.0.1';

const app = express();
const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Use middleware that allows for access from other domains (needed for frontend to connect)
app.use(cors());
// Use middleware that allows us to access the JSON body of requests
app.use(json());
// Use middleware to log (print to terminal) incoming HTTP requests (OPTIONAL)
app.use(morgan('dev'));

// Root URL
app.get('/', (req: Request, res: Response) => {
  console.log('Print to terminal: someone accessed our root url!');
  res.json(
    {
      message: "Welcome to Lab05 Forum Server's root URL!",
    }
  );
});

/**
 * READ THIS ROUTE AS WELL AS
 * - echo.ts
 * - echo.test.ts
 * BEFORE STARTING!!!
 */
app.get('/echo/echo', (req: Request, res: Response) => {
  // For GET/DELETE requests, data are passed in a query string.
  // You will need to typecast for GET/DELETE requests.
  const message = req.query.message as string;

  // Logic of the echo function is abstracted away in a different
  // file called echo.ts.
  const response = echo(message);

  // If { error: 'some relevant error' } is returned, we parse the status to 400.
  // Later in the course we will explore throwing/raising exceptions which will simplify this process
  if ('error' in response) {
    // Note also that the 'return' statement is necessary here since res.json() alone does not terminate
    // this route, and we don't want to risk sending a response twice.
    return res.status(400).json(response);
  }
  res.json(echo(message));
});

app.post('/post/create', (req: Request, res: Response) => {
  const { sender, title, content } = req.body;
  const response: PostCreateReturn | ErrorObject = postCreate(sender, title, content);

  if ('error' in response) {
    return res.status(400).json(response);
  }
  res.json(response);
});

app.post('/post/:postid/comment', (req: Request, res: Response) => {
  const postId: number = parseInt(req.params.postid);
  const { sender, comment } = req.body;
  const response: CommentCreateReturn | ErrorObject = postComment(sender, comment, postId);
  if ('error' in response) {
    return res.status(400).json(response);
  }
  res.json(response);
});

app.get('/posts/list', (req: Request, res: Response) => {
  res.json(postList());
});

app.get('/post/:postid', (req: Request, res: Response) => {
  const postId: number = parseInt(req.params.postid);
  const response: PostDetailReturn | ErrorObject = postDetail(postId);
  if ('error' in response) {
    return res.status(400).json(response);
  }
  res.json(response);
});

app.put('/post/:postid', (req: Request, res: Response) => {
  const postId: number = parseInt(req.params.postid);
  const { sender, title, content } = req.body;
  const response: object| ErrorObject = postUpdate(sender, title, content, postId);
  if ('error' in response) {
    return res.status(400).json(response);
  }
  res.json(response);
});

app.delete('/clear', (req: Request, res: Response) => {
  res.json(clear());
});

/**
 * Start server
 */
const server = app.listen(PORT, HOST, () => {
  console.log(`Express Server started and awaiting requests at the URL: '${url}:${PORT}'`);
});

/**
 * Handle Ctrl+C gracefully
 */
process.on('SIGINT', () => {
  server.close(() => {
    console.log('Shutting down server gracefully.');
    process.exit();
  });
});
