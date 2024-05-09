const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api', (req, res) => {
  res.json({ message: 'Hello from server!' });
});

app.get('/api/news', (req, res) => {
  fs.readFile('backend/output.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      res.status(500).json({ error: 'An error occurred reading output.json' });
    } else {
      res.json(JSON.parse(data));
    }
  });
});

app.listen(5000, () => {
    console.log('Server listening on http://localhost:5000');
});