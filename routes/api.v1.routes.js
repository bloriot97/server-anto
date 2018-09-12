var express = require('express'),
    router = express.Router();

var config = require('../config/config.js');

require("./user.routes.js")(router);
require("./message.routes.js")(router);


router.get("/", function(req, res) {
  res.status(200).send("API v1")
});

/*
router.get("/sensors", getOffsetLimit, function(req, res) {
  Sensor.getSensors(req.query.offset ,req.query.limit , (err, list) => {
    return res.json( list );
  })
});
*/

module.exports = router;
