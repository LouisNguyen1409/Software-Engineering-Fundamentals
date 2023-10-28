import express, { /* application, */ json, Request, Response } from 'express';
import { echo } from './implementation/echo';
import morgan from 'morgan';
import config from './config.json';
import cors from 'cors';
import errorHandler from 'middleware-http-errors';
// import HTTPError from 'http-errors';
import YAML from 'yaml';
import sui from 'swagger-ui-express';
import fs from 'fs';
import * as auth from './implementation/auth';
import * as authV2 from './implementation/authV2';
import * as quiz from './implementation/quiz';
import * as quizV2 from './implementation/quizV2';
import * as other from './implementation/other';
import * as session from './implementation/session';
import * as player from './implementation/player';
import { isValidToken, findAuthUserId, HTTPTokenHandler } from './server/helperfunction';
import * as type from './interface';
import * as dataBase from './dataStore';
import path from 'path';
import HTTPError from 'http-errors';
// import * as hf from './server/helperfunction';

// Set up web app
const app = express();
// Use middleware that allows us to access the JSON body of requests
app.use(json());
// Use middleware that allows for access from other domains
app.use(cors());
// for producing the docs that define the API
const file = fs.readFileSync('./swagger.yaml', 'utf8');
app.get('/', (req: Request, res: Response) => res.redirect('/docs'));
/* istanbul ignore next */
app.use('/docs', sui.serve, sui.setup(YAML.parse(file), { swaggerOptions: { docExpansion: config.expandDocs ? 'full' : 'list' } }));
app.use('/images', express.static('images'));
app.use('/csvReport', express.static(path.join(__dirname, '/csv')));
const PORT: number = parseInt(process.env.PORT || config.port);
const HOST: string = process.env.IP || 'localhost';

// for logging errors (print to terminal)
app.use(morgan('dev'));

app.use('/images', express.static(path.join(__dirname, '../images')));
app.use('/results', express.static(path.join(__dirname, '../results')));

// ====================================================================
//  ================= WORK IS DONE BELOW THIS LINE ===================
// ====================================================================

function errorHandle(data : any, res : Response) {
  if ('error' in data) {
    throw HTTPError(400, 'error');
  }
}

app.get('/echo', (req: Request, res: Response) => {
  const data = req.query.echo as string;
  return res.json(echo(data));
});

/**
 * Written by Louis, Marius
 * Register a new user
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @returns {JSON} - JSON object
 */
app.post('/v1/admin/auth/register', (req: Request, res: Response) => {
  const { email, password, nameFirst, nameLast } = req.body;
  const result: type.ReturnToken | type.ErrorMsg = auth.adminAuthRegister(email, password, nameFirst, nameLast);

  errorHandle(result, res);
  res.json(result);
});

/**
 * Written by Louis, Marius
 * Register a new user
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @returns {JSON} - JSON object
 */
app.post('/v1/admin/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result: type.ReturnToken | type.ErrorMsg = auth.adminAuthLogin(email, password);

  errorHandle(result, res);
  res.json(result);
});

/**
 * Written by Louis, Marius
 * Register a new user
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @returns {JSON} - JSON object
 */
app.get('/v1/admin/user/details', (req: Request, res: Response) => {
  if (isValidToken(req.query.token) === false) {
    return res.status(401).json({ error: 'Token is not a valid structure.' });
  }
  const token: string = req.query.token.toString();
  const authUserId: any = findAuthUserId(token);
  if (authUserId === undefined) {
    return res.status(403).json({ error: 'Provided token is valid structure, but is not for a currently logged in session.' });
  }
  const result: type.UserDetails | type.ErrorMsg = auth.adminUserDetails(authUserId);
  errorHandle(result, res);
  res.json(result);
});

/**
 * Written by Marius
 * Get's the details of a quiz author
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @returns {JSON} - JSON object
 */
app.get('/v2/admin/user/details', (req: Request, res: Response) => {
  const token = req.headers.token.toString();
  const authUserId = findAuthUserId(token);
  HTTPTokenHandler(token, authUserId, false);
  const result: type.ErrorMsg | type.UserDetails = authV2.adminUserDetailsV2(authUserId);
  res.json(result);
});

app.get('/v1/admin/quiz/list', (req: Request, res: Response) => {
  if (!isValidToken(req.query.token)) {
    return res.status(401).json({ error: 'token structure is invalid' });
  }
  const token = req.query.token.toString();
  const authUserId: any = findAuthUserId(token);

  if (authUserId === undefined) {
    return res.status(403).json({ error: 'token is not for a currently logged in session' });
  }

  const result = quiz.adminQuizList(authUserId);

  errorHandle(result, res);
  return res.json(result);
});

app.get('/v2/admin/quiz/list', (req: Request, res: Response) => {
  const token = req.headers.token.toString();
  const authUserId = findAuthUserId(token);
  HTTPTokenHandler(token, authUserId);
  const result = quizV2.adminQuizListV2(authUserId);
  return res.json(result);
});

app.get('/v1/admin/quiz/trash', (req: Request, res: Response) => {
  if (isValidToken(req.query.token) === false) {
    return res.status(401).json({ error: 'Token is not a valid structure.' });
  }
  const token = req.query.token.toString();
  const authUserId: any = findAuthUserId(token);
  if (authUserId === undefined) {
    return res.status(403).json({ error: 'Provided token is valid structure, but is not for a currently logged in session.' });
  }

  const result = quiz.adminQuizTrash(authUserId);

  errorHandle(result, res);
  res.json(result);
});

app.get('/v2/admin/quiz/trash', (req: Request, res: Response) => {
  const token = req.headers.token.toString();
  const authUserId = findAuthUserId(token);
  HTTPTokenHandler(token, authUserId);

  const result = quizV2.adminQuizTrashV2(authUserId);
  res.json(result);
});

app.post('/v1/admin/quiz', (req: Request, res: Response) => {
  const { name, description } = req.body;
  if (!isValidToken(req.body.token)) {
    return res.status(401).json({ error: 'token structure is invalid' });
  }
  const token = req.body.token.toString();
  const authUserId: any = findAuthUserId(token);

  if (authUserId === undefined) {
    return res.status(403).json({ error: 'token is not for a currently logged in session' });
  }

  const result = quiz.adminQuizCreate(authUserId, name, description);

  errorHandle(result, res);
  return res.json(result);
});

app.post('/v2/admin/quiz', (req: Request, res: Response) => {
  // if (req.header.token === undefined) console.log('ay man', req.header);
  const token = req.headers.token.toString();
  const authUserId = findAuthUserId(token);
  HTTPTokenHandler(token, authUserId);
  const { name, description } = req.body;
  const result = quizV2.adminQuizCreateV2(authUserId, name, description);
  return res.json(result);
});

app.delete('/v1/admin/quiz/:quizId', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  if (!isValidToken(req.query.token)) {
    return res.status(401).json({ error: 'token structure is invalid' });
  }
  const token = req.query.token.toString();
  const authUserId: any = findAuthUserId(token);

  if (authUserId === undefined) {
    return res.status(403).json({ error: 'token is not for a currently logged in session' });
  }

  const result = quiz.adminQuizRemove(authUserId, quizId);

  errorHandle(result, res);
  return res.json(result);
});

app.delete('/v2/admin/quiz/:quizId', (req: Request, res: Response) => {
  const token = req.headers.token.toString();
  const quizId = parseInt(req.params.quizId);
  const authUserId = findAuthUserId(token);
  HTTPTokenHandler(token, authUserId);

  const result = quizV2.adminQuizRemoveV2(authUserId, quizId);
  return res.json(result);
});

app.get('/v1/admin/quiz/:quizId', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);

  if (!isValidToken(req.query.token)) {
    return res.status(401).json({ error: 'token structure is invalid' });
  }
  const token = req.query.token.toString();
  const authUserId: any = findAuthUserId(token);

  if (authUserId === undefined) {
    return res.status(403).json({ error: 'token is not for a currently logged in session' });
  }

  const result = quiz.adminQuizInfo(authUserId, quizId);

  errorHandle(result, res);
  return res.json(result);
});

app.get('/v2/admin/quiz/:quizId', (req: Request, res: Response) => {
  const token = req.headers.token.toString();
  const quizId = parseInt(req.params.quizId);
  const authUserId = findAuthUserId(token);
  HTTPTokenHandler(token, authUserId);

  const result = quizV2.adminQuizInfoV2(authUserId, quizId);
  return res.json(result);
});

app.put('/v1/admin/quiz/:quizId/name', (req: Request, res: Response) => {
  const { name } = req.body;
  const quizId = parseInt(req.params.quizId);

  if (!isValidToken(req.body.token)) {
    return res.status(401).json({ error: 'token structure is invalid' });
  }
  const token: string = req.body.token.toString();
  const authUserId: any = findAuthUserId(token);

  if (authUserId === undefined) {
    return res.status(403).json({ error: 'token is not for a currently logged in session' });
  }

  const result = quiz.adminQuizNameUpdate(authUserId, quizId, name);

  errorHandle(result, res);
  return res.json(result);
});

app.put('/v2/admin/quiz/:quizId/name', (req: Request, res: Response) => {
  const token = req.headers.token.toString();
  const quizId = parseInt(req.params.quizId);
  const authUserId = findAuthUserId(token);
  HTTPTokenHandler(token, authUserId);
  const { name } = req.body;
  const result = quizV2.adminQuizNameUpdateV2(authUserId, quizId, name);
  return res.json(result);
});

// adminQuizDescriptionUpdate()
app.put('/v1/admin/quiz/:quizId/description', (req: Request, res: Response) => {
  const { description } = req.body;
  const quizId = parseInt(req.params.quizId);

  if (!isValidToken(req.body.token)) {
    return res.status(401).json({ error: 'token structure is invalid' });
  }
  const token: string = req.body.token.toString();
  const authUserId: any = findAuthUserId(token);

  if (authUserId === undefined) {
    return res.status(403).json({ error: 'token is not for a currently logged in session' });
  }

  const result = quiz.adminQuizDescriptionUpdate(authUserId, quizId, description);

  errorHandle(result, res);
  return res.json(result);
});

app.put('/v2/admin/quiz/:quizId/description', (req: Request, res: Response) => {
  const token = req.headers.token.toString();
  const quizId = parseInt(req.params.quizId);
  const authUserId = findAuthUserId(token);
  HTTPTokenHandler(token, authUserId);

  const { description } = req.body;
  const result = quizV2.adminQuizDescriptionUpdateV2(authUserId, quizId, description);
  return res.json(result);
});
// clear()
/**
 * Written by Louis, Marius
 * Register a new user
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @returns {JSON} - JSON object
 */
app.delete('/v1/clear', (req: Request, res: Response) => {
  const result = other.clear();
  return res.status(200).json(result);
});

/**
 * Written by Louis, Marius
 * Register a new user
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @returns {JSON} - JSON object
 */
app.post('/v1/admin/auth/logout', (req: Request, res: Response) => {
  if (isValidToken(req.body.token) === false) {
    return res.status(401).json({ error: 'Token is not a valid structure.' });
  }
  const token: string = req.body.token.toString();
  if (findAuthUserId(token) === undefined) {
    return res.status(400).json({ error: 'This token is for a user who has already logged out' });
  }
  const result: type.Empty | type.ErrorMsg = auth.adminAuthLogout(token);
  errorHandle(result, res);
  res.json(result);
});

/**
 * Written by Marius
 * Logging out for author users (v2 route)
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @returns {JSON} - JSON object
 */
app.post('/v2/admin/auth/logout', (req: Request, res: Response) => {
  const token = req.headers.token.toString();
  const authUserId = findAuthUserId(token);
  HTTPTokenHandler(token, authUserId, true);

  const result: type.Empty | type.ErrorMsg = authV2.adminAuthLogoutV2(token.toString());
  res.json(result);
});

/**
 * Written by Louis, Marius
 * Register a new user
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @returns {JSON} - JSON object
 */
app.put('/v1/admin/user/details', (req: Request, res: Response) => {
  const { email, nameFirst, nameLast } = req.body;
  if (isValidToken(req.body.token) === false) {
    return res.status(401).json({ error: 'Token is not a valid structure.' });
  }
  const token: string = req.body.token.toString();
  const authUserId: any = findAuthUserId(token);
  if (authUserId === undefined) {
    return res.status(403).json({ error: 'Provided token is valid structure, but is not for a currently logged in session.' });
  }
  const result: type.Empty | type.ErrorMsg = auth.adminUserDetailsUpdate(authUserId, email, nameFirst, nameLast);
  errorHandle(result, res);
  res.json(result);
});

/**
 * Written by Marius
 * Update details of an auther user (v2 route)
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @returns {JSON} - JSON object
 */
app.put('/v2/admin/user/details', (req: Request, res: Response) => {
  const token = req.headers.token.toString();
  const authUserId = findAuthUserId(token);
  HTTPTokenHandler(token, authUserId);
  const { email, nameFirst, nameLast } = req.body;

  const result: type.Empty | type.ErrorMsg = authV2.adminUserDetailsUpdateV2(authUserId, email, nameFirst, nameLast);
  res.json(result);
});

/**
 * Written by Louis, Marius
 * Register a new user
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @returns {JSON} - JSON object
 */
app.put('/v1/admin/user/password', (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  if (isValidToken(req.body.token) === false) {
    return res.status(401).json({ error: 'Token is not a valid structure.' });
  }
  const token: string = req.body.token.toString();
  const authUserId: any = findAuthUserId(token);
  if (authUserId === undefined) {
    return res.status(403).json({ error: 'Provided token is valid structure, but is not for a currently logged in session.' });
  }
  const result: type.Empty | type.ErrorMsg = auth.adminUserPasswordUpdate(authUserId, oldPassword, newPassword);
  errorHandle(result, res);
  res.json(result);
});

/**
 * Written by Marius
 * Update auther user password (v2 route)
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @returns {JSON} - JSON object
 */
app.put('/v2/admin/user/password', (req: Request, res: Response) => {
  const token = req.headers.token.toString();
  const authUserId = findAuthUserId(token);
  HTTPTokenHandler(token, authUserId);
  const { oldPassword, newPassword } = req.body;
  const result: type.Empty | type.ErrorMsg = authV2.adminUserPasswordUpdateV2(authUserId, oldPassword, newPassword);
  res.json(result);
});

// OLD V1 ROUTE
app.post('/v1/admin/quiz/:quizId/restore', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  if (!isValidToken(req.body.token)) {
    return res.status(401).json({ error: 'token structure is invalid' });
  }
  const token = req.body.token.toString();
  const authUserId: any = findAuthUserId(token);

  if (authUserId === undefined) {
    return res.status(403).json({ error: 'token is not for a currently logged in session' });
  }

  const result = quiz.adminQuizRestore(authUserId, quizId);
  errorHandle(result, res);
  return res.json(result);
});

app.post('/v2/admin/quiz/:quizId/restore', (req: Request, res: Response) => {
  const token = req.headers.token.toString();
  const quizId = parseInt(req.params.quizId);
  const authUserId = findAuthUserId(token);
  HTTPTokenHandler(token, authUserId);

  const result = quizV2.adminQuizRestoreV2(authUserId, quizId);
  return res.json(result);
});

app.delete('/v1/admin/quiz/trash/empty', (req: Request, res: Response) => {
  const { token, quizIds } = req.query;

  if (!isValidToken(token)) {
    return res.status(401).json({ error: 'token structure is invalid' });
  }
  const authUserId: any = findAuthUserId(token.toString());

  if (authUserId === undefined) {
    return res.status(403).json({ error: 'token is not for a currently logged in session' });
  }

  const quizIdsAsNumbers = JSON.parse(quizIds as string);

  const result = quiz.adminQuizEmptyTrash(authUserId, quizIdsAsNumbers);
  errorHandle(result, res);
  return res.json(result);
});

app.delete('/v2/admin/quiz/trash/empty', (req: Request, res: Response) => {
  const token = req.headers.token.toString();
  const authUserId = findAuthUserId(token);
  HTTPTokenHandler(token, authUserId);
  const quizIds : string = req.query.quizIds as string;
  const quizIdsAsNumbers = JSON.parse(quizIds);
  const result = quizV2.adminQuizEmptyTrashV2(authUserId, quizIdsAsNumbers);
  return res.json(result);
});

app.post('/v1/admin/quiz/:quizId/transfer', (req: Request, res: Response) => {
  const { token, userEmail } = req.body;
  const quizId = parseInt(req.params.quizId);

  if (!isValidToken(token)) {
    return res.status(401).json({ error: 'token structure is invalid' });
  }
  const authUserId: any = findAuthUserId(token);

  if (authUserId === undefined) {
    return res.status(403).json({ error: 'token is not for a currently logged in session' });
  }

  const result = quiz.adminQuizTransfer(authUserId, quizId, userEmail);

  errorHandle(result, res);
  return res.json(result);
});

app.post('/v2/admin/quiz/:quizId/transfer', (req: Request, res: Response) => {
  const token = req.headers.token.toString();
  const { userEmail } = req.body;
  const quizId = parseInt(req.params.quizId);
  const authUserId = findAuthUserId(token);
  HTTPTokenHandler(token, authUserId);
  const result = quizV2.adminQuizTransferV2(authUserId, quizId, userEmail);
  return res.json(result);
});

app.post('/v1/admin/quiz/:quizid/question', (req: Request, res: Response) => {
  if (!isValidToken(req.body.token)) {
    return res.status(401).json({ error: 'token structure is invalid' });
  }
  const token : string = req.body.token.toString();
  const authUserId: number = findAuthUserId(token);

  if (authUserId === undefined) {
    return res.status(403).json({ error: 'token is not for a currently logged in session' });
  }

  const { question, duration, points, answers } = req.body.questionBody;
  const quizId : number = parseInt(req.params.quizid);

  const result = quiz.adminQuizQuestionCreate(authUserId, quizId, question, duration, points, answers);
  errorHandle(result, res);
  return res.json(result);
});

app.post('/v2/admin/quiz/:quizid/question', (req: Request, res: Response) => {
  const token = req.headers.token.toString();
  const authUserId = findAuthUserId(token);
  HTTPTokenHandler(token, authUserId);
  const quizId : number = parseInt(req.params.quizid);
  const { question, duration, points, answers, thumbnailUrl } = req.body.questionBody;
  const result = quizV2.adminQuizQuestionCreateV2(authUserId, quizId, question, duration, points, answers, thumbnailUrl);
  return res.json(result);
});

app.put('/v1/admin/quiz/:quizid/question/:questionid', (req: Request, res: Response) => {
  const { token, questionBody } = req.body;
  const quizId : number = parseInt(req.params.quizid);
  const questionId : number = parseInt(req.params.questionid);
  // return res.json({quizId: questionBody});
  if (isValidToken(token) === false) {
    return res.status(401).json({ error: 'Token is not a valid structure.' });
  }
  const authUserId: number = findAuthUserId(token);
  if (authUserId === undefined) {
    return res.status(403).json({ error: 'Provided token is valid structure, but is not for a currently logged in session.' });
  }
  const result = quiz.adminQuizQuestionUpdate(authUserId, quizId, questionId, questionBody);
  errorHandle(result, res);
  return res.json(result);
});

// TODO: Yepeng to fix

app.put('/v2/admin/quiz/:quizid/question/:questionid', (req: Request, res: Response) => {
  const token = req.headers.token.toString();
  const authUserId = findAuthUserId(token);
  HTTPTokenHandler(token, authUserId);
  const quizId : number = parseInt(req.params.quizid);
  const questionId : number = parseInt(req.params.questionid);
  const questionBody = req.body.questionBody;
  // const servingUrl = hf.requestImage(`${questionBody.question}`, questionBody.thumbnailUrl);
  const result = quizV2.adminQuizQuestionUpdateV2(authUserId, quizId, questionId, questionBody, questionBody.thumbnailUrl);
  return res.json(result);
});

app.put('/v1/admin/quiz/:quizid/question/:questionid/move', (req: Request, res: Response) => {
  const { token, newPosition } = req.body;
  const quizId : number = parseInt(req.params.quizid);
  const questionId : number = parseInt(req.params.questionid);

  if (isValidToken(token) === false) {
    return res.status(401).json({ error: 'Token is not a valid structure.' });
  }
  const authUserId : number = findAuthUserId(token);
  if (authUserId === undefined) {
    return res.status(403).json({ error: 'Provided token is valid structure, but is not for a currently logged in session.' });
  }

  const result = quiz.adminQuizQuestionMove(authUserId, quizId, questionId, newPosition);

  errorHandle(result, res);
  return res.json(result);
});

app.put('/v2/admin/quiz/:quizid/question/:questionid/move', (req: Request, res: Response) => {
  const token = req.headers.token.toString();
  const authUserId = findAuthUserId(token);
  HTTPTokenHandler(token, authUserId);
  const quizId : number = parseInt(req.params.quizid);
  const questionId : number = parseInt(req.params.questionid);
  const newPosition = req.body.newPosition;

  const result = quizV2.adminQuizQuestionMoveV2(authUserId, quizId, questionId, newPosition);
  return res.json(result);
});

app.delete('/v1/admin/quiz/:quizid/question/:questionid', (req: Request, res: Response) => {
  const token = req.query.token.toString();
  const quizId : number = parseInt(req.params.quizid);
  const questionId : number = parseInt(req.params.questionid);

  if (isValidToken(token) === false) {
    return res.status(401).json({ error: 'Token is not a valid structure.' });
  }
  const authUserId: any = findAuthUserId(token);
  if (authUserId === undefined) {
    return res.status(403).json({ error: 'Provided token is valid structure, but is not for a currently logged in session.' });
  }

  const result = quiz.adminQuizQuestionRemove(authUserId, quizId, questionId);

  errorHandle(result, res);
  return res.json(result);
});

app.delete('/v2/admin/quiz/:quizid/question/:questionid', (req: Request, res: Response) => {
  const token = req.headers.token.toString();
  const authUserId = findAuthUserId(token);
  HTTPTokenHandler(token, authUserId);
  const quizId : number = parseInt(req.params.quizid);
  const questionId : number = parseInt(req.params.questionid);
  const result = quizV2.adminQuizQuestionRemoveV2(authUserId, quizId, questionId);
  return res.json(result);
});

app.post('/v1/admin/quiz/:quizid/question/:questionid/duplicate', (req: Request, res: Response) => {
  if (!isValidToken(req.body.token)) {
    return res.status(401).json({ error: 'token structure is invalid' });
  }
  const token : string = req.body.token.toString();
  const authUserId: number = findAuthUserId(token);

  if (authUserId === undefined) {
    return res.status(403).json({ error: 'token is not for a currently logged in session' });
  }

  const quizId : number = parseInt(req.params.quizid);
  const questionId : number = parseInt(req.params.questionid);

  const result = quiz.adminQuizQuestionDuplicate(authUserId, quizId, questionId);
  errorHandle(result, res);
  return res.json(result);
});

app.post('/v2/admin/quiz/:quizid/question/:questionid/duplicate', (req: Request, res: Response) => {
  const token = req.headers.token.toString();
  const authUserId = findAuthUserId(token);
  HTTPTokenHandler(token, authUserId);
  const quizId : number = parseInt(req.params.quizid);
  const questionId : number = parseInt(req.params.questionid);
  const result = quizV2.adminQuizQuestionDuplicateV2(authUserId, quizId, questionId);
  return res.json(result);
});

// NEW ITERATION 3 ROUTES

app.put('/v1/admin/quiz/:quizid/thumbnail', (req: Request, res: Response) => {
  const token = req.headers.token.toString();
  const quizId = parseInt(req.params.quizid);
  const authUserId = findAuthUserId(token);
  HTTPTokenHandler(token, authUserId);
  const thumbnail = req.body.imgUrl;
  const result = quizV2.adminQuizThumbnailUpdate(authUserId, quizId, thumbnail);
  return res.json(result);
});

app.get('/v1/admin/quiz/:quizid/sessions', (req: Request, res: Response) => {
  const token = req.headers.token.toString();
  const quizId = parseInt(req.params.quizid);
  const authUserId = findAuthUserId(token);
  HTTPTokenHandler(token, authUserId);
  // const result = 'hello there';
  const result = session.adminQuizViewSessions(authUserId, quizId);
  return res.json(result);
});

app.post('/v1/admin/quiz/:quizid/session/start', (req: Request, res: Response) => {
  const token = req.headers.token.toString();
  const quizId = parseInt(req.params.quizid);
  const authUserId = findAuthUserId(token);
  HTTPTokenHandler(token, authUserId);
  const autoStartNum = req.body.autoStartNum;
  const result = session.adminQuizSessionStart(authUserId, quizId, autoStartNum);
  return res.json(result);
});

app.get('/v1/admin/quiz/:quizid/session/:sessionid', (req: Request, res: Response) => {
  const token = req.headers.token.toString();
  const quizId = parseInt(req.params.quizid);
  const sessionId = parseInt(req.params.sessionid);
  const authUserId = findAuthUserId(token);
  HTTPTokenHandler(token, authUserId);
  const result = session.adminQuizSessionStatus(quizId, sessionId, authUserId);
  return res.json(result);
});

app.put('/v1/admin/quiz/:quizid/session/:sessionid', (req: Request, res: Response) => {
  const token = req.headers.token.toString();
  const quizId = parseInt(req.params.quizid);
  const sessionId = parseInt(req.params.sessionid);
  const authUserId = findAuthUserId(token);
  HTTPTokenHandler(token, authUserId);
  const action = req.body.action;
  const result = session.adminQuizSessionUpdate(authUserId, quizId, sessionId, action);
  return res.json(result);
});

app.get('/v1/admin/quiz/:quizid/session/:sessionid/results', (req: Request, res: Response) => {
  const token = req.headers.token.toString();
  const quizId = parseInt(req.params.quizid);
  const sessionId = parseInt(req.params.sessionid);
  const authUserId = findAuthUserId(token);
  HTTPTokenHandler(token, authUserId);
  const result = session.adminQuizSessionResults(quizId, sessionId, authUserId);
  return res.json(result);
});

app.get('/v1/admin/quiz/:quizid/session/:sessionid/results/csv', (req: Request, res: Response) => {
  const token = req.headers.token.toString();
  const quizId = parseInt(req.params.quizid);
  const sessionId = parseInt(req.params.sessionid);
  const authUserId = findAuthUserId(token);
  HTTPTokenHandler(token, authUserId);
  const result = session.adminQuizSessionResultsCSV(quizId, sessionId, authUserId);
  return res.json(result);
});

app.post('/v1/player/join', (req: Request, res: Response) => {
  let { sessionId, name } = req.body;
  sessionId = parseInt(sessionId);
  const result = player.playerJoin(sessionId, name);
  return res.json(result);
});

app.get('/v1/player/:playerid', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerid);
  const result = player.playerStatus(playerId);
  return res.json(result);
});

app.get('/v1/player/:playerid/question/:questionposition', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerid);
  const questionPosition = parseInt(req.params.questionposition);
  const result = player.playerQuestion(playerId, questionPosition);
  return res.json(result);
});

app.put('/v1/player/:playerid/question/:questionposition/answer', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerid);
  const questionPosition = parseInt(req.params.questionposition);
  const { answerIds } = req.body;
  const result = player.playerAnswer(playerId, questionPosition, answerIds);
  return res.json(result);
});

app.get('/v1/player/:playerid/question/:questionposition/results', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerid);
  const questionPosition = parseInt(req.params.questionposition);
  const result = player.playerQuestionResult(playerId, questionPosition);
  return res.json(result);
});

app.get('/v1/player/:playerid/results', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerid);
  const result = player.playerSessionResult(playerId);
  return res.json(result);
});

app.get('/v1/player/:playerid/chat', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerid);
  const result = player.playerSessionChat(playerId);
  return res.json(result);
});

app.post('/v1/player/:playerid/chat', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerid);
  const { message } = req.body;
  const result = player.playerSessionSendChat(playerId, message);
  return res.json(result);
});
// ====================================================================
//  ================= WORK IS DONE ABOVE THIS LINE ===================
// ====================================================================

// For handling errors
app.use(errorHandler());

// start server
const server = app.listen(PORT, HOST, () => {
  // DO NOT CHANGE THIS LINE
  console.log(`⚡️ Server started on port ${PORT} at ${HOST}`);
});

// For coverage, handle Ctrl+C gracefully
process.on('SIGINT', () => {
  dataBase.saveData();
  server.close(() => console.log('Shutting down server gracefully.'));
});

/*
  1. Create tests for thumbnail url in quiz info
  2. Fix naming for images so quiz duplicate duplicates images also
  3. settimeout bug in quiz duplicate v2
*/
