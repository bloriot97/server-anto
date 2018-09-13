const router = require('express').Router();


// const config = require('config');

require('./user.routes.js')(router);
require('./message.routes.js')(router);


router.get('/', (req, res) => {
  res.status(200).send('API v1');
});


/*
router.get("/sensors", getOffsetLimit, function(req, res) {
  Sensor.getSensors(req.query.offset ,req.query.limit , (err, list) => {
    return res.json( list );
  })
});
*/

module.exports = router;
