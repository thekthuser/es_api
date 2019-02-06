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
  new Promise(function(resolve, reject) {
    resolve(tools.getUser(username));
  }).then(function(user) {
    if (!user) {
      console.error('User does not exist.');
      res.status(404).send('User does not exist.');
    }
    new Promise(function(resolve, reject) {
      resolve(tools.getUserIndices(user));
    }).then(function(resp) {
      res.send(resp);
    });
  });
});

router.get('/_search/:index', function(req, res) {
  let client = elasticsearch.Client({
    host: 'localhost:9200'
  });
  //assume user 'foo'
  let username = 'foo';
  let index_name = req.params.index.toLowerCase();

  new Promise(function(resolve, reject) {
    resolve(tools.getUser(username));
  }).then(function(user) {
    if (!user) {
      console.error('User does not exist.');
      res.status(404).send('User does not exist.');
    }
    new Promise(function(resolve, reject) {
      resolve(tools.getUserIndices(user));
    }).then(function(indices) {
      let allowed = false;
      indices.forEach(function(ind) {
        if (index_name == ind.name) {
          allowed = true;
        }
      });
      if (!allowed) {
        console.error('Unauthorized index.'); res.status(401).send('401 Unauthorized');
      }
    });
  });

  let query_terms = req.query.q.replace(/"/g, '')
  query_terms = query_terms.split(':');
  let docs_search = client.search({
    index: index_name,
    q: query_terms[0] + ':' + query_terms[1]
  });
  docs_search.then(function(resp) {
    let results = {'results': []};
    resp.hits.hits.forEach(function(person) {
      results.results.push({'id': person._id, 'full_name': person._source.first_name + 
        ' ' + person._source.last_name, 'location': person._source.location});
    });
    res.status(200).send(results);
  });
});

module.exports = router;
