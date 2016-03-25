/**
 * Created by Daniel on 21/02/2016.
 */

'use strict';

var mysql = require('mysql');
var pool = require('../middleware/dbPool');

var Team = function (data) {
    this.team = data;
};

Team.prototype.getAttribute = function (attribute) {
    return this[attribute];
};

Team.prototype.setAttribute = function (attribute, value) {
    this[attribute] = value;
};

Team.prototype.insert = function (callback) {

};

Team.prototype.delete = function (callback) {

};

Team.prototype.findByID = function (id, callback) {

};

exports.getAllTeams = function (callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            return callback(err);
        }

        connection.query('SELECT * FROM team WHERE team_abbr != "UNK"',
            function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null, result);
            });
    });
};

exports.findByAbbr = function (abbr, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            return callback(err);
        }

        connection.query('SELECT * FROM team WHERE team_abbr = ?', [abbr],
            function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null, result);
            });
    });
};

