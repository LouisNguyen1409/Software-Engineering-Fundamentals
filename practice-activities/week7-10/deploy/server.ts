import express, { Request, Response } from 'express';
import { getNamesAges, editNameAge, clearNamesAges, addNameAge } from './namesAges';
import morgan from 'morgan';
import errorHandler from 'middleware-http-errors';

// Set up web app + port number
const app = express();

app.use(express.json());

// Example get request
app.get('/getnamesages', (req: Request, res: Response) => {
  res.json(getNamesAges(parseInt(req.query.minAge as string)));
});

app.post('/addnameage', (req: Request, res: Response) => {
  res.json(addNameAge(req.body.name, req.body.dob));
});

app.put('/editnameage', (req: Request, res: Response) => {
  res.json(editNameAge(req.body.name, req.body.dob));
});

app.delete('/clear', (req: Request, res: Response) => {
  res.json(clearNamesAges());
});

// uses the custom logging
app.use(morgan('dev'));

// uses the error handling function
app.use(errorHandler());

// start server
const PORT = parseInt(process.env.PORT) || 8080;
app.listen(PORT, process.env.HTTP, () => {
  console.log(`⚡️ Server listening on port ${PORT}`);
});
