import express, { json, Request, Response } from 'express';
import cors from 'cors';

// OPTIONAL: Use middleware to log (print to terminal) incoming HTTP requests
import morgan from 'morgan';

// Importing the example implementation for echo in echo.js
import { echo } from './echo';
import { port, url } from './config.json';

// COMP1531 middleware - must use AFTER declaring your routes
import errorHandler from 'middleware-http-errors';
import * as quiz from './quiz';

const PORT: number = parseInt(process.env.PORT || port);
const HOST: string = process.env.IP || '127.0.0.1';

const app = express();

// Use middleware that allows for access from other domains (needed for frontend to connect)
app.use(cors());
// Use middleware that allows us to access the JSON body of requests
app.use(json());
// (OPTIONAL) Use middleware to log (print to terminal) incoming HTTP requests
app.use(morgan('dev'));

// Root URL
app.get('/', (req: Request, res: Response) => {
  console.log('Print to terminal: someone accessed our root url!');
  res.json({ message: "Welcome to Lab08 Quiz Server's root URL!" });
});

app.get('/echo/echo', (req: Request, res: Response) => {
  // For GET/DELETE request, parameters are passed in a query string.
  // You will need to typecast for GET/DELETE requests.
  const message = req.query.message as string;

  // Logic of the echo function is abstracted away in a different
  // file called echo.ts.
  res.json(echo(message));
});

app.delete('/clear', (req: Request, res: Response) => {
  res.json(quiz.clear());
});

app.post('/quiz/create', (req: Request, res: Response) => {
  // Extract the lab08quizsecret string from the request's headers.
  const { lab08quizsecret } = req.headers;

  // For PUT/POST requests, data is transfered through the JSON body
  const { quizTitle, quizSynopsis } = req.body;

  const response = quiz.createQuiz(quizTitle, quizSynopsis, lab08quizsecret);
  res.json(response);
});

app.get('/quiz/:quizid', (req: Request, res: Response) => {
  // Here's another way to extract the secret (compared to /quiz/create)
  const lab08quizsecret = req.headers.lab08quizsecret;
  const quizId = parseInt(req.params.quizid);

  const response = quiz.quizDetails(quizId, lab08quizsecret);
  return res.json(response);
});

app.put('/quiz/:quizid', (req: Request, res: Response) => {
  const lab08quizsecret = req.headers.lab08quizsecret;
  const { quizTitle, quizSynopsis } = req.body;
  const quizId = parseInt(req.params.quizid);
  const response = quiz.editQuiz(quizId, quizTitle, quizSynopsis, lab08quizsecret);
  return res.json(response);
});

app.delete('/quiz/:quizid', (req: Request, res: Response) => {
  const lab08quizsecret = req.headers.lab08quizsecret;
  const quizId = parseInt(req.params.quizid);
  const response = quiz.deleteQuiz(quizId, lab08quizsecret);
  return res.json(response);
});

app.get('/quizzes/list', (req: Request, res: Response) => {
  const lab08quizsecret = req.headers.lab08quizsecret;
  const response = quiz.quizList(lab08quizsecret);
  return res.json(response);
});

app.post('/quiz/:quizid/question', (req: Request, res: Response) => {
  const lab08quizsecret = req.headers.lab08quizsecret;
  const quizId = parseInt(req.params.quizid);
  const { questionString, questionType, answers } = req.body;
  const response = quiz.questionCreate(quizId, questionString, questionType, answers, lab08quizsecret);
  return res.json(response);
});

app.put('/question/:questionid', (req: Request, res: Response) => {
  const lab08quizsecret = req.headers.lab08quizsecret;
  const questionId = parseInt(req.params.questionid);
  const { questionString, questionType, answers } = req.body;
  const response = quiz.questionEdit(questionId, questionString, questionType, answers, lab08quizsecret);
  return res.json(response);
});

app.delete('/question/:questionid', (req: Request, res: Response) => {
  const lab08quizsecret = req.headers.lab08quizsecret;
  const questionId = parseInt(req.params.questionid);
  const response = quiz.questionDelete(questionId, lab08quizsecret);
  return res.json(response);
});

app.delete('/quiz/:quizid/schedule/remove', (req: Request, res: Response) => {
  const lab08quizsecret = req.headers.lab08quizsecret;
  const quizId = parseInt(req.params.quizid);
  const secondsFromNow = parseInt(req.query.secondsFromNow.toString());
  const response = quiz.quizRemoveSchedule(quizId, secondsFromNow, lab08quizsecret);
  return res.json(response);
});

app.post('/quiz/:quizid/schedule/remove/abort', (req: Request, res: Response) => {
  const lab08quizsecret = req.headers.lab08quizsecret;
  const quizId = parseInt(req.params.quizid);
  const response = quiz.quizScheduleRemoveAbort(quizId, lab08quizsecret);
  return res.json(response);
});

// COMP1531 middleware - must use AFTER declaring your routes
app.use(errorHandler());

/**
 * Start server
 */
const server = app.listen(PORT, HOST, () => {
  console.log(`Express Server started and awaiting requests at the URL: '${url}:${PORT}'`);
});

/**
 * For coverage, handle Ctrl+C gracefully
 */
process.on('SIGINT', () => {
  server.close(() => {
    console.log('Shutting down server gracefully.');
    process.exit();
  });
});
