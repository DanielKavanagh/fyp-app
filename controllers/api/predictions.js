/**
 * Created by Daniel on 23/03/2016.
 */

'use strict';

var db = require('../../middleware/dbPool');
var express = require('express');
var router = express.Router();

var Prediction = require('../../models/prediction.js');

router.route('/api/predictions/')
    .get(function (req, res) {
        res.send('hi!');
    });

router.route('/api/predictions/:id')
    .get(function (req, res) {

    });

//Returns the latest n predictions
router.route('/api/predictions/latest/:num')
    .get(function (req, res) {
        if (req.params.num > 16) {
            res.status(500).send({
                error: '/latest can only return up to 16 predictions'
            });
        }

        Prediction.getLatest(10, function (err, predictions) {
            if (err) {
                res.send(err);
            }
            res.send(predictions);
        });
    });



module.exports = router;