/**
 * Created by Daniel on 23/03/2016.
 */

'use strict';

var fs = require('fs');
var pool = require('../middleware/dbPool');

exports.getByWeekAndSeason = function (season, week, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            return callback(err);
        }

        var sql = 'SELECT p.prediction_id, g.game_id, p.predicted_winner_id,' +
            'p.actual_winner_id, p.probability,' +
            'ht.team_id as home_team_id, ht.team_abbr as home_team_abbr,' +
            'ht.team_name as home_team_name,' +
            'at.team_id as away_team_id, at.team_abbr as away_team_abbr,' +
            'at.team_name as away_team_abbr ' +
            'FROM prediction p ' +
            'JOIN game g ON p.game_id = g.game_id ' +
            'JOIN team ht ON g.home_team_id = ht.team_id ' +
            'JOIN team at ON g.away_team_id = at.team_id ' +
            'WHERE (g.game_year = ? AND g.game_week = ?)';

        connection.query(sql, [season, week], function (err, results) {
            if (err) {
                return callback(err);
            }

            if (results.length === 0) {
                return callback('No Data Returned');
            }

            callback(null, results);
        });
    });
};

exports.getBySeason = function (season, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            return callback(err);
        }

        var sql = 'SELECT p.prediction_id, g.game_id, p.predicted_winner_id,' +
            'p.actual_winner_id, p.probability,' +
            'ht.team_id as home_team_id, ht.team_abbr as home_team_abbr,' +
            'ht.team_name as home_team_name,' +
            'at.team_id as away_team_id, at.team_abbr as away_team_abbr,' +
            'at.team_name as away_team_abbr ' +
            'FROM prediction p ' +
            'JOIN game g ON p.game_id = g.game_id ' +
            'JOIN team ht ON g.home_team_id = ht.team_id ' +
            'JOIN team at ON g.away_team_id = at.team_id ' +
            'WHERE g.game_year = ?';

        connection.query(sql, [season], function (err, results) {
            if (err) {
                return callback(err);
            }

            if (results.length === 0) {
                return callback('No Data Returned');
            }

            callback(null, results);
        });
    });
};

exports.getAvailableSeasons = function (callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            return callback(err);
        }

        var sql = 'SELECT g.game_year FROM prediction p ' +
            'JOIN game g ON p.game_id = g.game_id ' +
            'GROUP BY g.game_year';


        connection.query(sql, function (err, results) {
            if (err) {
                return callback(err);
            }

            if (results.length === 0) {
                return callback('No Data Returned');
            }

            callback(null, results);
        });
    });
};

exports.getAvailableSeasonWeeks = function (season, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            return callback(err);
        }

        var sql = 'SELECT g.game_week as week FROM prediction p ' +
            'JOIN game g ON p.game_id = g.game_id ' +
            'WHERE g.game_year = ? ' +
            'GROUP BY g.game_week';


        connection.query(sql, [season], function (err, results) {
            if (err) {
                return callback(err);
            }

            if (results.length === 0) {
                return callback('No Data Returned');
            }

            callback(null, results);
        });
    });
};

