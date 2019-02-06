const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const elasticsearch = require('elasticsearch');
const router = express.Router();

router.get('/', function(req, res) {
  res.status(200).send("Visit '/populate/sql' to populate the Sqlite db and '/popluate/es' \
    to populate the ElasticSearch db.");
})

router.get('/sql', function(req, res) {
  let db = new sqlite3.Database('./db/sqlite.db', (err) => {
    if (err) { console.error(err.message); res.status(500).send('500 Internal Server Error'); }
    console.log('Connected to the in-memory SQlite database.');
  });

  db.serialize( () => {
    db.run('DROP TABLE IF EXISTS Users;', (err)=> {
      if (err) { console.error(err.message); res.status(500).send('500 Internal Server Error'); }
      console.log('The Users table was dropped.');
    });
    db.run('CREATE TABLE IF NOT EXISTS Users (id INTEGER PRIMARY KEY AUTOINCREMENT, \
      username TEXT UNIQUE, is_advanced INTEGER);', (err)=> {
      if (err) { console.error(err.message); res.status(500).send('500 Internal Server Error'); }
      console.log('The Users table was created.');
    });
    db.run('INSERT INTO Users (username, is_advanced) VALUES(?, ?);', ['foo', 1], (err)=> {
      if (err) { console.error(err.message); res.status(500).send('500 Internal Server Error'); }
      console.log('A row has been inserted.');
    });
    db.run('INSERT INTO Users (username, is_advanced) VALUES(?, ?);', ['bar', 0], (err)=> {
      if (err) { console.error(err.message); res.status(500).send('500 Internal Server Error'); }
      console.log('A row has been inserted.');
    });
    db.run('INSERT INTO Users (username, is_advanced) VALUES(?, ?);', ['baz', 0], (err)=> {
      if (err) { console.error(err.message); res.status(500).send('500 Internal Server Error'); }
      console.log('A row has been inserted.');
    });
    db.run('INSERT INTO Users (username, is_advanced) VALUES(?, ?);', ['buzz', 1], (err)=> {
      if (err) { console.error(err.message); res.status(500).send('500 Internal Server Error'); }
      console.log('A row has been inserted.');
    });

    db.run('DROP TABLE IF EXISTS Indices;', (err)=> {
      if (err) { console.error(err.message); res.status(500).send('500 Internal Server Error'); }
      console.log('The Indices table was dropped.');
    });
    db.run('CREATE TABLE IF NOT EXISTS Indices (id INTEGER PRIMARY KEY AUTOINCREMENT, \
      name TEXT UNIQUE, owner TEXT, description TEXT);', (err)=> {
      if (err) { console.error(err.message); res.status(500).send('500 Internal Server Error'); }
      console.log('The Indices table was created.');
    });
    db.run('INSERT INTO Indices (name, owner, description) VALUES(?, ?, ?);', 
      ['foo_index', 'foo', 'People whose first names start with "f"'], (err)=> {
      if (err) { console.error(err.message); res.status(500).send('500 Internal Server Error'); }
      console.log('A row has been inserted.');
    });
    db.run('INSERT INTO Indices (name, owner, description) VALUES(?, ?, ?);', 
      ['bar_index', 'bar', 'Real people.'], (err)=> {
      if (err) { console.error(err.message); res.status(500).send('500 Internal Server Error'); }
      console.log('A row has been inserted.');
    });
    db.run('INSERT INTO Indices (name, owner, description) VALUES(?, ?, ?);', 
      ['baz_index', 'baz', 'Fictional people.'], (err)=> {
      if (err) { console.error(err.message); res.status(500).send('500 Internal Server Error'); }
      console.log('A row has been inserted.');
    });
    db.run('INSERT INTO Indices (name, owner, description) VALUES(?, ?, ?);', 
      ['buzz_index', 'buzz', 'All people.'], (err)=> {
      if (err) { console.error(err.message); res.status(500).send('500 Internal Server Error'); }
      console.log('A row has been inserted.');
    });

    db.close();
  });
  res.status(200).send("Populate SQL");
})

router.get('/es', function(req, res) {
  let client = elasticsearch.Client({
    host: 'localhost:9200'
  });

  let delete_promise = client.indices.delete({
    index: "*"
  });
  delete_promise.then(function(resp) {
    console.log('Indices deleted.');

    let create_foo_promise = client.indices.create({
      'index': 'foo_index',
    });
    create_foo_promise.then(function(resp) {
      console.log('foo_index created.');
      client.index({
        'index': 'foo_index',
        'type': 'docs',
        'body': {
          'first_name': 'fred',
          'last_name': 'flintstone',
          'location': 'bedrock'
        }
      }, (err, resp) => {
        if (err) { console.error(err.message); res.status(500).send('500 Internal Server Error'); }
        console.log("Document in foo_index created.");
      });
    });
    let create_bar_promise = client.indices.create({
      index: 'bar_index',
    });
    create_bar_promise.then(function(resp) {
      console.log('bar_index created.');
      client.index({
        'index': 'bar_index',
        'type': 'docs',
        'body': {
          'first_name': 'fred',
          'last_name': 'rogers',
          'location': 'land of make-believe'
        }
      }, (err, resp) => {
        if (err) { console.error(err.message); res.status(500).send('500 Internal Server Error'); }
        console.log("Document in bar_index created.");
      });
    });
    let create_baz_promise = client.indices.create({
      index: 'baz_index',
    });
    create_baz_promise.then(function(resp) {
      console.log('baz_index created.');
      client.index({
        'index': 'baz_index',
        'type': 'docs',
        'body': {
          'first_name': 'fred',
          'last_name': 'flintstone',
          'location': 'bedrock'
        }
      }, (err, resp) => {
        if (err) { console.error(err.message); res.status(500).send('500 Internal Server Error'); }
        console.log("Document in baz_index created.");
      });
    });
    let create_buzz_promise = client.indices.create({
      index: 'buzz_index',
    });
    create_buzz_promise.then(function(resp) {
      console.log('buzz_index created.');
      client.index({
        'index': 'buzz_index',
        'type': 'docs',
        'body': {
          'first_name': 'fred',
          'last_name': 'flintstone',
          'location': 'bedrock'
        }
      }, (err, resp) => {
        if (err) { console.error(err.message); res.status(500).send('500 Internal Server Error'); }
        console.log("Document in buzz_index created.");
      });
      client.index({
        'index': 'buzz_index',
        'type': 'docs',
        'body': {
          'first_name': 'fred',
          'last_name': 'rogers',
          'location': 'land of make-believe'
        }
      }, (err, resp) => {
        if (err) { console.error(err.message); res.status(500).send('500 Internal Server Error'); }
        console.log("Document in buzz_index created.");
      });
    });
  });

  res.status(200).send('Populate Elasticsearch');
});

module.exports = router;
