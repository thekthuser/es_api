const express = require('express')
const app = express()
const port = 3000

var routes = require('./routes/routes');

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
app.use('/', routes);

module.exports = app;
