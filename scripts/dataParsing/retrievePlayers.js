/**
 * Created by Daniel on 10/02/2016.
 * TODO: Add @callback comments for each callback, documenting their params/function
 *
 */

'use strict';

//Import dependencies
var request = require('request');
var async = require('async');
var mysql = require('mysql');
var cheerio = require('cheerio');
var Player = require('../../models/player.js');
var pool = require('../../models/mysqldb.js');

//Global variables
var baseURL = 'http://www.nfl.com';
var baseRosterURL = 'http://www.nfl.com/teams/roster?team=';
var baseProfileURL = 'http://www.nfl.com/players/profile?id=';

function getTeams(callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            return console.log(err);
        }

        connection.query('SELECT team_id, team_abbr FROM team' +
            ' WHERE team_abbr = "KC"', function (err, teams) {
                if (err) {
                    return console.log(err);
                }

                connection.release();
                callback(null, teams);
            });
    });
}

function parseTeamRoster(teams, callback) {
    var playerArr = [];

    async.eachLimit(teams, 1, function (team, callback) {
        console.log('Getting Team Roster (' + team.team_abbr + ')');
        request(baseRosterURL + team.team_abbr, function (err, resp, body) {
            if (err) {
                return console.log(err);
            }

            var $ = cheerio.load(body);

            $('#team-stats-wrapper').children('#result').children()
                .last('tbody').children().each(function () {
                    var playerUrl = $(this).children().eq(1).children().attr('href');
                    var splitUrl = playerUrl.split('/');
                    var playerName = $(this).children().eq(1).text().trim().split(', ');
                    var playerHeight = $(this).children().eq(4).text().trim().split('\'');
                    playerHeight[1] = playerHeight[1].replace('"', '');
                    var uniformNum = $(this).children().eq(0).text().trim();

                    if (isNaN(parseInt(uniformNum))) {
                        uniformNum = 0;
                    } else {
                        uniformNum = parseInt(uniformNum, 10);
                    }

                    var playerObj = new Player({
                        player_id: parseInt(splitUrl[3], 10),
                        team_id: team.team_id,
                        player_first_name: playerName[1],
                        player_last_name: playerName[0],
                        player_position: $(this).children().eq(2).text().trim(),
                        player_dob: $(this).children().eq(6).text().trim(),
                        player_weight_lb: parseInt($(this).children().eq(5).text().trim(), 10),
                        player_height_cm: Math.round((parseInt(playerHeight[0], 10) * 30.48)
                            + parseInt(playerHeight[1] * 2.54, 10)),
                        player_college: $(this).children().eq(8).text().trim(),
                        player_years_exp: parseInt($(this).children().eq(7).text().trim(), 10),
                        player_uniform_num: uniformNum,
                        player_status: $(this).children().eq(3).text().trim(),
                        player_profile_url: baseURL + playerUrl
                    });

                    playerArr.push(playerObj);
                });

            callback();
        });
    }, function (err) {
        if (err) {
            return console.log(err);
        }

        callback(null, playerArr);
    });
}

function parseRosterProfiles(playerArr, callback) {
    async.eachLimit(playerArr, 2, function (player, callback) {
        console.log('Requesting Profile (' + player.player.player_id + ')');
        request(baseProfileURL + player.player.player_id, function (err, resp, body) {
            if (err) {
                return console.log(err);
            }

            var $ = cheerio.load(body);
            var gsis = $('*').html().match(/GSIS\s+ID:\s+([0-9-]+)/);

            player.player.player_gsis = gsis[1];

            setTimeout(function() {
                console.log('Waiting...');
                callback();
            }, 2500);
        });
    }, function (err) {
        if (err) {
            return console.log(err);
        }

        callback(null, playerArr);
    });
}

function savePlayerJSON(playerArr, callback) {

}

function insertPlayers(playerArr, callback) {
    pool.getConnection(function(err, connection) {
        if (err) {
            return console.log(err);
        }

        async.each(playerArr, function (player, callback) {
            player.insert(connection, function (err, result) {
                if (err) {
                    return console.log(err);
                }

                console.log('Inserted Player (' + player.player.player_id + ')');
                callback();
            });
        }, function (err) {
            if (err) {
                return console.log(err);
            }
        });
    });
}

function main() {
    async.waterfall([
        getTeams,
        parseTeamRoster,
        parseRosterProfiles,
        savePlayerJSON,
        insertPlayers
    ], function (err) {
        if (err) {
            return console.log(err);
        }
    });
}

main();