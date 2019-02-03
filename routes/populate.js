const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();

router.get('/', function(req, res) {
  res.send("Visit '/populate/sql' to populate the Sqlite db and '/popluate/es' \
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
  res.send("Populate SQL");
})

module.exports = router;
