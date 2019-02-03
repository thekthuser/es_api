const express = require('express')
const app = express()
const port = 3000

var routes = require('./routes/routes');
var populate_routes = require('./routes/populate');

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
app.use('/', routes);
app.use('/populate', populate_routes);

module.exports = app;
