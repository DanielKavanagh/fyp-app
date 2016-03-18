/**
 * Created by Daniel on 17/03/2016.
 *
 */

'use strict';

var async = require('async');
var mysql = require('mysql');
var pool = require('../models/mysqldb.js');
var fs = require('fs');

async.waterfall([
    getTeams,
    calculateHFA
], function (err, result) {
    if (err) {

    }
});

function getTeams(callback) {
    pool.getConnection(function (err, connection) {
        connection.query('SELECT * FROM team ' +
            'WHERE team_name != "UNK"', function (err, teams) {
                if (err) {
                    return callback(err);
                }

                callback(null, teams, connection);
            });
    });
}

function calculateHFA(teams, connection, callback) {
    var featureArray = [];

    async.each(teams, function (team, callback) {
        
    }, function (err) {
        if (err) {
            return callback(err);
        }

        callback(null);
    });

}