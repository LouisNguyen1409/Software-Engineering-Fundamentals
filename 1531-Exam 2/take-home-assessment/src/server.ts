import express, { json, Request, Response } from 'express';
import morgan from 'morgan';
import config from './config.json';
import cors from 'cors';
import errorHandler from 'middleware-http-errors';
import * as fc from './implementation';

// Set up web app
const app = express();
// Use middleware that allows us to access the JSON body of requests
app.use(json());
// Use middleware that allows for access from other domains
app.use(cors());

const PORT: number = parseInt(process.env.PORT || config.port);
const HOST: string = process.env.IP || 'localhost';

// for logging errors (print to terminal)
app.use(morgan('dev'));

// ====================================================================
//  ================= WORK IS DONE BELOW THIS LINE ===================
// ====================================================================

// Example get request
app.get('/example/route', (req: Request, res: Response) => {
  return res.json({ message: 'Hi' });
});

// ======================= PROTECTED ROUTES ===========================

app.delete('/clear', (req: Request, res: Response) => {
  const result = fc.clear();
  return res.json(result);
});

app.get('/tag/list', (req: Request, res: Response) => {
  const result = fc.getTagList();
  return res.json(result);
});

app.get('/tag', (req: Request, res: Response) => {
  const tagId: number = parseInt(req.query.tagId.toString());
  const result = fc.getTagName(tagId);
  return res.json(result);
});

app.delete('/tag', (req: Request, res: Response) => {
  const tagId: number = parseInt(req.query.tagId.toString());
  const result = fc.deleteTag(tagId);
  return res.json(result);
});

app.post('/tag', (req: Request, res: Response) => {
  const name: string = req.body.name.toString();
  const result = fc.createNewTag(name);
  return res.json(result);
});

app.get('/todo/item', (req: Request, res: Response) => {
  const itemId: number = parseInt(req.query.itemId.toString());
  const result = fc.getDetailTodoItem(itemId);
  return res.json(result);
});

app.delete('/todo/item', (req: Request, res: Response) => {
  const itemId: number = parseInt(req.query.itemId.toString());
  const result = fc.deleteTodoItem(itemId);
  return res.json(result);
});

app.post('/todo/item', (req: Request, res: Response) => {
  let { description, parentId } = req.body;
  if (JSON.parse(parentId) !== null) {
    parentId = parseInt(parentId);
  } else {
    parentId = JSON.parse(parentId);
  }
  const result = fc.createTodoItem(description, parentId);
  return res.json(result);
});

app.put('/todo/item', (req: Request, res: Response) => {
  let { itemId, description, tagIds, status, parentId, deadline } = req.body;
  if (JSON.parse(parentId) !== null) {
    parentId = parseInt(parentId);
  } else {
    parentId = JSON.parse(parentId);
  }
  if (JSON.parse(deadline) !== null) {
    deadline = parseInt(deadline);
  } else {
    deadline = JSON.parse(deadline);
  }
  tagIds = JSON.parse(JSON.stringify(tagIds));
  const result = fc.updateTodoItem(itemId, description, tagIds, status, parentId, deadline);
  return res.json(result);
});

app.get('/todo/list', (req: Request, res: Response) => {
  let parentId: any = req.query.parentId.toString();
  if (JSON.parse(parentId) !== null) {
    parentId = parseInt(parentId);
  } else {
    parentId = JSON.parse(parentId);
  }
  const tagIds: any = JSON.parse(req.query.tagIds as string);
  let status: any = JSON.parse(JSON.stringify(req.query.status));
  if (status === 'null') {
    status = null;
  }
  const result = fc.getListTodoItems(parentId, tagIds, status);
  return res.json(result);
});

app.post('/todo/item/bulk', (req: Request, res: Response) => {
  const bulkString: string = req.body.bulkString;
  const result = fc.createMultipleTodoItems(bulkString);
  return res.json(result);
});

app.get('/summary', (req: Request, res: Response) => {
  let step: any = req.query.step.toString();
  if (JSON.parse(step) !== null) {
    step = parseInt(step);
  } else {
    step = JSON.parse(step);
  }
  const result = fc.getSummary(step);
  return res.json(result);
});

app.get('/notifications', (req: Request, res: Response) => {
  const result = fc.getNotification();
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
  server.close(() => console.log('Shutting down server gracefully.'));
});
