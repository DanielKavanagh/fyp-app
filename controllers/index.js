/**
 * Created by Daniel on 24/03/2016.
 */

'use strict';

var http = require('http');
var request = require('request');
var async = require('async');
var express = require('express');
var router = express.Router();


router.route('/')
    .get(function (req, res) {
        async.parallel({
            predictions: function (callback) {
                request('http://localhost:3000/api/predictions/latest/8',
                    function (err, resp, body) {
                        if (err) {
                            return console.log(err);
                        }

                        callback(null, JSON.parse(body));
                    });
            }
        }, function (err, results) {
            if (err) {
                return res.status(500).send(err);
            }

            res.render('index', results);
        });
    });

module.exports = router;