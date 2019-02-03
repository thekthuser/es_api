var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.send("Visit '/populate/sql' to populate the Sqlite db and '/popluate/es' \
    to populate the ElasticSearch db.");
})

module.exports = router;
