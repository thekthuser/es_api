const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const elasticsearch = require('elasticsearch');
const fetch = require('node-fetch');
const tools = require('../tools/tools');

router.get('/', function(req, res) {
  res.send('index');
})

router.get('/users', function(req, res) {
  new Promise(function(resolve, reject) {
    resolve(tools.getAllUsers());
  }).then(function(resp) {
    res.send(resp);
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
      new Promise(function(resolve, reject) {
        resolve(tools.getUserIndices(user));
      }).then(function(resp) {
        console.log('got the response back!!');
        console.log(resp);
        res.send(resp);
      });
    });

  });
});

//TODO remove this 'next' when 401 below is fixed
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

    //TODO: check user exists
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
          //TODO: this is broken, i think it's because the fetch above sends a response
          console.error('Unauthorized index.'); res.status(401).send('401 Unauthorized');
          //res.send('401 Unauthorized.');
          //next('401 Unauthorized.');
        }
      });
    });

    let query_terms = req.query.q.replace(/"/g, '')
    query_terms = query_terms.split(':');
    let docs_search = client.search({
      index: index,
      q: query_terms[0] + ':' + query_terms[1]
    });
    docs_search.then(function(resp) {
      let results = {'results': []};
      resp.hits.hits.forEach(function(person) {
        results.results.push({'id': person._id, 'full_name': person._source.first_name + ' ' + person._source.last_name, 'location': person._source.location});
      });
      res.send(results);
    });

    db.close();
  });
});

module.exports = router;
