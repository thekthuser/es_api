const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

router.get('/', function(req, res) {
  res.send('index');
})

router.get('/users', function(req, res) {
  let db = new sqlite3.Database('./db/sqlite.db', (err) => {
    if (err) { console.error(err.message); res.status(500).send('500 Internal Server Error'); }
    console.log('Connected to the in-memory SQlite database.');
  });
  db.serialize( () => {
    db.all('SELECT * FROM Users;', [], (err, rows) => {
      if (err) { console.error(err.message); res.status(500).send('500 Internal Server Error'); }
      res.send(rows);
    });
    db.close();
  });
})

module.exports = router;
