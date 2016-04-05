/**
 * Contains the model functions for retrieving predictions from the database
 * */

'use strict';

var db = require('../db');

/**
 * Model to retrieve all predictions from the database
 *
 * @param {function} callback - The requests callback function
 */
exports.getAll = function (callback) {
    db.getConnection(function (err, connection) {
        if (err) {
            return callback(err);
        }

        var sql = 'SELECT p.prediction_id, g.game_id, p.predicted_winner_id,' +
            'p.actual_winner_id, p.probability,' +
            'ht.team_id as home_team_id, ht.team_abbr as home_team_abbr,' +
            'ht.team_name as home_team_name,' +
            'at.team_id as away_team_id, at.team_name as away_team_name,' +
            'at.team_abbr as away_team_abbr ' +
            'FROM prediction p ' +
            'JOIN game g ON p.game_id = g.game_id ' +
            'JOIN team ht ON g.home_team_id = ht.team_id ' +
            'JOIN team at ON g.away_team_id = at.team_id ';

        connection.query(sql, function (err, rows) {
            if (err) {
                return callback(err);
            }
            
            connection.release();
            callback(null, rows);
        });
    });
}

/**
 * Gets a set of predictions for a specific season and week
 *
 * @param {integer} season - The requested season
 * @param {integer} week - The requested week
 * @param {function} callback - The requests callback function
 * */
exports.getByWeekAndSeason = function (season, week, callback) {
    db.getConnection(function (err, connection) {
        if (err) {
            return callback(err);
        }

        var sql = 'SELECT p.prediction_id, g.game_id, p.predicted_winner_id,' +
            'p.actual_winner_id, p.probability,' +
            'ht.team_id as home_team_id, ht.team_abbr as home_team_abbr,' +
            'ht.team_name as home_team_name,' +
            'at.team_id as away_team_id, at.team_name as away_team_name,' +
            'at.team_abbr as away_team_abbr ' +
            'FROM prediction p ' +
            'JOIN game g ON p.game_id = g.game_id ' +
            'JOIN team ht ON g.home_team_id = ht.team_id ' +
            'JOIN team at ON g.away_team_id = at.team_id ' +
            'WHERE (g.game_year = ? AND g.game_week = ?)';

        connection.query(sql, [season, week], function (err, rows) {
            if (err) {
                return callback(err);
            }

            connection.release();
            callback(null, rows);
        });
    });
};

/**
 * Gets the set of predictions for a specific season
 *
 * @param {integer} season - The requested season
 * @param {function} callback - The requests callback function
 * */
exports.getBySeason = function (season, callback) {
    db.getConnection(function (err, connection) {
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

        connection.query(sql, [season], function (err, rows) {
            if (err) {
                return callback(err);
            }

            connection.release();
            callback(null, rows);
        });
    });
};

/**
 * Gets the seasons for which predictions are available
 *
 * @param {function} callback - The requests callback function
 * */
exports.getAvailableSeasons = function (callback) {
    db.getConnection(function (err, connection) {
        if (err) {
            return callback(err);
        }

        var sql = 'SELECT g.game_year as season FROM prediction p ' +
            'JOIN game g ON p.game_id = g.game_id ' +
            'GROUP BY g.game_year ' +
            'ORDER BY g.game_year desc';


        connection.query(sql, function (err, results) {
            if (err) {
                return callback(err);
            }

            connection.release();
            callback(null, results);
        });
    });
};


/**
 * Gets the available prediction weeks for a given season
 *
 * @param {integer} season - The requested season
 * @param {function} callback - The requests callback function
 * */
exports.getAvailableSeasonWeeks = function (season, callback) {
    db.getConnection(function (err, connection) {
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
            
            connection.release();
            callback(null, results);
        });
    });
};