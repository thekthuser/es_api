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
  let username = req.params.username;
  let db = new sqlite3.Database('./db/sqlite.db', (err) => {
    if (err) { console.error(err.message); res.status(500).send('500 Internal Server Error'); }
    console.log('Connected to the in-memory SQlite database.');
  });
  db.serialize( () => {

    let user_promise = new Promise(function(resolve, reject) {
      db.get('SELECT * FROM Users WHERE username = ?', [username], (err, row) => {
      if (err) { console.error(err.message); res.status(500).send('500 Internal Server Error'); }
      resolve(row);
      });
    });
    user_promise.then(function(user) {
      if (!user) {
        console.error('User does not exist.');
        res.status(404).send('User does not exist.');
      }

      db.all('SELECT Indices.id, Indices.name, Indices.owner, Indices.description, \
        Users.is_advanced FROM Indices LEFT JOIN Users ON Indices.owner = Users.username;', 
        [], (err, rows) => {
        if (err) { console.error(err.message); res.status(500).send('500 Internal Server Error'); }
        let indices = [];
        rows.forEach((row) => {
          if ((user.is_advanced && !row.is_advanced) || 
            (user.is_advanced && (row.owner == user.username)) || 
            (!user.is_advanced && (row.owner == user.username))) {
            delete row.is_advanced;
            indices.push(row);
          }
        });
        res.send(indices);
      });

      db.close();
    });

  });
});

router.get('/_search/:index', function(req, res) {
  let index = req.params.index;
  let db = new sqlite3.Database('./db/sqlite.db', (err) => {
    if (err) { console.error(err.message); res.status(500).send('500 Internal Server Error'); }
    console.log('Connected to the in-memory SQlite database.');
  });
  db.serialize( () => {

    // function return indices has access too, check in there
    let index_promise = new Promise(function(resolve, reject) {
      Response.fetch('/');
    });


    res.send('_search');
    db.close();
  });
});

module.exports = router;
