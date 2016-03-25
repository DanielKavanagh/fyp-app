/**
 * Created by Daniel on 24/03/2016.
 */

'use strict';

var async = require('async');
var request = require('request');
var express = require('express');
var router = express.Router();

router.route('/predictions/:season-:week')
    .get(function (req, res) {
        async.parallel([
            function (callback) {
                request('http://localhost:3000/api/predictions/' + req.params.season +
                    '-' + req.params.week, function (err, resp, body) {
                        console.log(err);
                        if (err || resp.statusCode != 200) {
                            next(error);
                        }

                        callback(null, {predictions: JSON.parse(body)});
                    });
            },
            function (callback) {
                async.waterfall([
                    function (callback) {
                        request('http://localhost:3000/api/predictions/seasons/',
                            function (err, resp, body) {
                                if (err) {
                                    return res.status(resp.statusCode).send({
                                        error: err
                                    });
                                }

                                callback(null, {seasons: JSON.parse(body)});
                            });
                    },
                    function (seasons, callback) {

                        async.each(seasons.seasons, function (season, callback) {
                            request('http://localhost:3000/api/predictions/' +
                                season.game_year + '/weeks/', function (err, resp, body) {
                                    if (err) {
                                        return callback(err);
                                    }

                                    var weeksArr = [];

                                    JSON.parse(body).forEach(function (week) {
                                        weeksArr.push(week.week);
                                    });

                                    season.weeks = weeksArr;

                                    callback();
                                });
                        }, function (err) {
                            if (err) {
                                return callback(err);
                            }

                            callback(null, seasons);
                        });
                    }
                ], function (err, result) {
                    if (err) {
                        return res.status(500).send({
                            error: err
                        });
                    }

                    callback(null, result);
                });
            }
        ], function (err, result) {
            if (err) {
                return res.status(400).send({
                    error: 'Something Went Wrong :('
                });
            }

            var data = {
                predictions: result[0].predictions,
                seasons: result[1].seasons,
                currSeason: req.params.season,
                currWeek: req.params.week
            };

            res.render('predictions', data);
        });
    });

module.exports = router;