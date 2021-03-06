var express = require('express');
var router = express.Router();

var model = require('../models/predictions');

/**
 * API route to get all predictions */
router.get('/predictions/', function(req, res, next) {
    model.getAll(function (err, rows) {
        if (err) {
            return next(err);
        }

        res.json(rows);
    });
});

/**
 * API route that returns all available seasons which have predictions
 * */
router.get('/predictions/seasons/', function (req, res, next) {
    model.getAvailableSeasons(function (err, rows) {
        if (err) {
            return next(err);
        }

        res.json(rows);
    });
});


router.get('/predictions/:season-:week', function (req, res, next) {
    var season = req.params.season,
        week = req.params.week;

    model.getByWeekAndSeason(season, week, function (err, rows) {
        if (err) {
            return next(err);
        }

        res.json(rows);
    });
});

router.get('/predictions/:season', function (req, res, next) {
    model.getBySeason(req.params.season, function (err, rows) {
        if (err) {
            return next(err);
        }

        res.json(rows);
    });
});

module.exports = router;
