/* Load modules */
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

/* Database configuration */
const database = require('./app/config/dbconfig');

/* Init database */
database.init();

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'localhost');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
});

/* Init server listening */
const port = process.argv[2] || 3000;
app.listen(port, function() {
    console.log("Server listening on port : " + port);
});

/* Express configuration */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* Router configuration */
app.use('/api', require('./app/routes/router'));
app.use('/', express.static('static'));

app.use(function(req, res, next) {
    res.status(404).send("Sorry can't find that!")
});