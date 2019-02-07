const assert = require("assert");
const tools = require("../tools/tools");
const request = require('supertest');
const express = require('express');
const port = 3030
const app = express();

let routes = require('../routes/routes');
let populate_routes = require('../routes/populate');

let server = app.listen(port, () => console.log(`Listening on port ${port}!`))
app.set('view engine', 'ejs');
app.use(express.static('public'))
app.use('/', routes);
app.use('/populate', populate_routes);

describe('GET /', function() {
  it('returns /', function(done) {
    request(app)
      .get('/')
      .expect(200)
      .end((err, res) => {
         if (err) {
           return done(err);
         }
          assert(res.text.includes('Welcome to the es_api!'));
         return done();
      });
  });
});

describe('GET JSON', function() {
  beforeEach(function(done) {
    new Promise(function(resolve, reject) {
      request(app)
        .put('/populate/sql')
        .expect(201);
      request(app)
        .put('/populate/es')
        .expect(201)
      resolve(done());
    }).then(function(resp) {
      return resp;
    });
  });

  it('GET /users', function(done) {
    request(app)
      .get('/users')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
         if (err) {
           return done(err);
         }
          assert(res.text.includes('foo'));
          assert(res.text.includes('bar'));
          assert(res.text.includes('baz'));
          assert(res.text.includes('buzz'));
         return done();
      });
  });

  it('GET /users/:username', function(done) {
    request(app)
      .get('/users/foo')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
         if (err) {
           return done(err);
         }
          assert(res.text.includes('foo_index'));
          assert(res.text.includes('bar_index'));
          assert(res.text.includes('baz_index'));
         return done();
      });
  });

  it('GET bad username /users/:username', function(done) {
    request(app)
      .get('/users/not_a_user')
      .expect(404)
      .end((err, res) => {
         if (err) {
           return done(err);
         }
         return done();
      });
  });

  it('GET /_search/:index', function(done) {
    request(app)
      .get('/_search/foo_index/?q="first_name:fred"')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
         if (err) {
           return done(err);
         }
          assert(res.text.includes('full_name'));
          assert(res.text.includes('fred flintstone'));
          assert(res.text.includes('bedrock'));
         return done();
      });
  });

  it('GET disallowed index /_search/:index', function(done) {
    request(app)
      .get('/_search/buzz_index/?q="first_name:fred"')
      .expect(401)
      .end((err, res) => {
         if (err) {
           return done(err);
         }
         return done();
      });
  });

});

