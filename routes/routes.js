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
});

router.get('/users/:username', function(req, res) {
  username = req.params.username;
  let db = new sqlite3.Database('./db/sqlite.db', (err) => {
    if (err) { console.error(err.message); res.status(500).send('500 Internal Server Error'); }
    console.log('Connected to the in-memory SQlite database.');
  });
  db.serialize( () => {
    db.all('SELECT Indices.id, Indices.name, Indices.owner, Indices.description, \
      Users.is_advanced FROM Indices LEFT JOIN Users ON Indices.owner = Users.username;', 
      [], (err, rows) => {
      if (err) { console.error(err.message); res.status(500).send('500 Internal Server Error'); }
      let indices = [];
      rows.forEach((row) => {
        console.log('owner: ' + row.owner + ' username: ' + username);
        if (!row.is_advanced || (row.is_advanced && row.owner == username)) {
          delete row.is_advanced;
          indices.push(row);
        }
      });
      res.send(indices);
    });
    db.close();
  });
});

module.exports = router;
