const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const elasticsearch = require('elasticsearch');
const fetch = require('node-fetch');

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
  let username = req.params.username.toLowerCase();
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

router.get('/_search/:index', function(req, res, next) {
  let client = elasticsearch.Client({
    host: 'localhost:9200'
  });
  let index = req.params.index.toLowerCase();
  let db = new sqlite3.Database('./db/sqlite.db', (err) => {
    if (err) { console.error(err.message); res.status(500).send('500 Internal Server Error'); }
    console.log('Connected to the in-memory SQlite database.');
  });
  db.serialize( () => {

    //assume user 'foo'
    let user = 'foo';
    let index = req.params.index.toLowerCase();
    //assume http://localhost:3000
    let indices = fetch('http://localhost:3000/users/' + user);
    indices.then(function (resp) {
      resp.json().then(function(resp2) {
        let allowed = false;
        resp2.forEach(function(ind) {
          if (index == ind.name) {
            allowed = true;
          }
        });
        if (!allowed) {
          // this is broken, i think it's because the fetch above sends a response
          console.error('Unauthorized index.'); res.status(401).send('401 Unauthorized');
          //res.send('401 Unauthorized.');
          //next('401 Unauthorized.');
        }
      });
    });
    /*
    let test_search = client.search({
      index: 'foo_index',
      q: 'first_name:fred'
    });
    test_search.then(function(resp) {
      console.log('AAAAAAAAAAAAAAAA');
      console.log(resp);
      console.log('BBBBBBBBBBBBBBB');
      console.log(resp.hits);
      console.log('CCCCCCCCCCCCC');
      console.log(resp.hits.hits[0]);
      console.log('DDDDDDDDDDDDDD');
      console.log(resp.hits.hits[0]._source);
    });
    */


    res.send('_search');
    db.close();
  });
});

module.exports = router;
