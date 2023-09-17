import express from 'express';
import path from 'node:path';

const app = express();
const port = 3001;

// loads files in the static directory
app.use('/email', express.static(path.join(__dirname, 'static')));

// Example get reqest
app.get('/email/img.png', (req) => {
  const data = req.query;
  console.log(data.code);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

export {}; // ignore this line
