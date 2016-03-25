/**
 * Created by Daniel on 23/03/2016.
 */

'use strict';

var express = require('express');
var router = express.Router();

var prediction = require('../../models/prediction');

router.route('/api/predictions/seasons/')
    .get(function (req, res) {
        prediction.getAvailableSeasons(function (err, result) {
            if (err) {
                return res.status(500).send({
                    error: err
                });
            }

            res.json(result);
        });
    });

router.route('/api/predictions/:season-:week')
    .get(function (req, res) {
        var season = Math.floor(req.params.season),
            week = Math.floor(req.params.week);

        if (Number.isInteger(season) === false || Number.isInteger(week) === false) {
            return res.status(400).send({
                error: 'Season & Week must be valid integers'
            });
        }

        prediction.getByWeekAndSeason(season, week, function (err, result) {
            console.log(err);
            if (err) {
                return res.status(500).send({
                    error: err
                });
            }

            res.json(result);
        });
    });

router.route('/api/predictions/:season')
    .get(function (req, res) {
        var season = Math.floor(req.params.season);

        if (Number.isInteger(season) === false) {
            return res.status(400).send({
                error: 'Season must be a valid integer'
            });
        }

        prediction.getBySeason(season, function (err, result) {
            if (err) {
                return res.status(500).send({
                    error: err
                });
            }

            res.json(result);
        });

    });

router.route('/api/predictions/:season/weeks')
    .get(function (req, res) {
        var season = Math.floor(req.params.season);

        if (Number.isInteger(season) === false) {
            return res.status(400).send({
                error: 'Season must be a valid integer'
            });
        }

        prediction.getAvailableSeasonWeeks(season, function (err, result) {
            if (err) {
                return res.status(500).send({
                    error: err
                });
            }

            res.json(result);
        });

    });


//Returns the latest n predictions
router.route('/api/predictions/latest/:num')
    .get(function (req, res) {
        var numParam =  Math.floor(req.params.num);

        if (Number.isInteger(numParam) === false) {
            return res.status(400).send({
                error: 'Parameter must be a valid integer'
            });
        }

        if (numParam > 16 || numParam <= 0) {
            return res.status(400).send({
                error: 'Parameter must be between 1-16'
            });
        }

        prediction.getLatest(numParam, function (err, result) {
            if (err) {
                return res.status(500).send({
                    error: err
                });
            }

            res.json(result);
        });
    });



module.exports = router;