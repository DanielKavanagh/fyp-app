var express = require('express');
var router = express.Router();

var model = require('../models/predictions');

/* GET all predictions */
router.get('/predictions/', function(req, res, next) {
    model.getAll(function (err, rows) {
        if (err) {
            return next(err);
        }

        res.json(rows);
    });
});

router.get('/predictions/:season-:week', function (req, res, next) {
    var season = req.params.season,
        week = req.params.week;

    console.log('Got Request for ' + season + '-' + week)

    model.getByWeekAndSeason(season, week, function (err, rows) {
        if (err) {
            return next(err);
        }

        console.log('got it');

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
