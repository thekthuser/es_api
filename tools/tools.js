const sqlite3 = require('sqlite3').verbose();
const express = require('express');

module.exports = {

  getUserIndices: function(user) {
    let resp = new Promise(function(resolve, reject) {
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
            if ((user.is_advanced && !row.is_advanced) || 
              (user.is_advanced && (row.owner == user.username)) || 
              (!user.is_advanced && (row.owner == user.username))) {
              delete row.is_advanced;
              indices.push(row);
            }
          });
          resolve(indices);
        });
        db.close();
      });
    });
    return resp;
  },

  getAllUsers: function() {
    let resp = new Promise(function(resolve, reject) {
      let db = new sqlite3.Database('./db/sqlite.db', (err) => {
        if (err) { console.error(err.message); res.status(500).send('500 Internal Server Error'); }
        console.log('Connected to the in-memory SQlite database.');
      });
      db.serialize( () => {


        db.all('SELECT * FROM Users;', [], (err, rows) => {
          if (err) { console.error(err.message); res.status(500).send('500 Internal Server Error'); }
          resolve(rows);
        });




        db.close();
      });
    });
    return resp;
  },

}
