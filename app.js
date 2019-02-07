const express = require('express')
const app = express()
const port = 3000

let routes = require('./routes/routes');
let populate_routes = require('./routes/populate');

app.listen(port, () => console.log(`Listening on port ${port}!`))
app.set('view engine', 'ejs');
app.use(express.static('public'))
app.use('/', routes);
app.use('/populate', populate_routes);

module.exports = app;
