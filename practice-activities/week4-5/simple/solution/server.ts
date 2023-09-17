import express from 'express';

const app = express();
const port = 3001;

let names = [];

app.use(express.json());

app.get('/names', (req, res) => {
  res.json({
    names: names,
  });
});

app.post('/names/add', (req, res) => {
  const name = req.body.name;
  names.push(name);
  res.json({});
});

app.post('/names/remove', (req, res) => {
  const name = req.body.name;
  console.log(names, name);
  names = names.filter(n => n !== name);
  console.log(names);
  res.json({});
});

app.delete('/names', (req, res) => {
  names = [];
  res.json({});
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
