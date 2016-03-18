'use strict';

var express = require('express');
var app = express();
var router = express.Router();

var port = process.env.PORT || 3000;

router.route('/players')
    .get(function (req, res) {
        res.json({message: 'hello'});
    });

router.route('/players/:id')
    .get(function (req, res) {

    });

app.use('/', router);

app.listen(port);
console.log('Server Started: ' + port);
