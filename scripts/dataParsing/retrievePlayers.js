/**
 * Created by Daniel on 10/02/2016.
 */

'use strict';

/* Import dependencies */
var request = require('request');
var async = require('async');
var mysql = require('mysql');

var baseRosterURL = 'http://www.nfl.com/teams/roster?team=';
var baseProfileURL = 'http://www.nfl.com/players/profile?id=';

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root123',
    database: 'FYP_DB'
});

connection.connect(function (err) {
    if (err) {
        console.log('Could not connect to DB');
    } else {
        console.log('Connected successfully!');
    }
});

function getTeams(callback) {
    connection.query('SELECT team_abbr FROM team WHERE team_abbr != "UNK"', function (err, results) {
        if (err) {
            return console.log(err);
        }

        callback(null, results);
    });
}

function getTeamRosters(teams, callback) {
    async.each(teams, function (team, teamCallback) {
        request(baseRosterURL + team.team_abbr, function (err, response, body) {
            if (err) {
                return console.log(err);
            }

            console.log(typeof body);
            teamCallback();
        });
    },
        function (err) {
            if (err) {
                return console.log(err);
            }

            callback();
        });
}

function getPlayer() {

}

function main() {
    async.waterfall([
        getTeams,
        getTeamRosters,
        getPlayer
    ],
        function (err) {
            if (err) {
                return console.log(err);
            }
        });
}

main();