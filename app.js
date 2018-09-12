var express = require('express');
var path = require('path');
var bodyParser = require("body-parser");

var api = require("./routes/api.v1.routes");

var config = require('config');
//var expressJWT = require('express-jwt');

//var cors = require('cors')


var app = express();

////// Conection a la db /////////
const db = require('./db/db');
db.connect()


// authoriser le cross origine pour communiquer avec l'app
//app.use(cors())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//app.use('/api/v1', expressJWT({secret: config.jwt.secret }).unless({path: ['/api/v1/auth']}), api); // authentifaication bar web tocken
app.use('/api/v1', api);

app.use(express.static('public'))

app.get("/", function(req, res) {
  res.status(200).send("Home page!")
});

/// catch Authorization errors
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({status: 'error', msg: 'Jeton invalide', url: req.url});
    }
});


var server = app.listen(3000, function () {
    console.log("App running on port.", server.address().port);
});


module.exports = app; // for testing
