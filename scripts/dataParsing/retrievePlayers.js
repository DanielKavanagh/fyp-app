/**
 * Created by Daniel on 10/02/2016.
 * TODO: Add @callback comments for each callback, documenting their params/function
 *
 */

'use strict';

//Import dependencies
var request     = require('request');
var async       = require('async');
var mysql       = require('mysql');
var cheerio     = require('cheerio');

//Initialise database connection
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

var baseURL = 'http://www.nfl.com';
var baseRosterURL = 'http://www.nfl.com/teams/roster?team=';
var baseProfileURL = 'http://www.nfl.com/players/profile?id=';

/**
 * getTeams retrieves the team name abbreviations from the database.
 * The callback function is called when the query returns successfully.
 * @param {function} callback - Callback which sends the async waterfall to the next function
 * @return {string[]} teamList - Array containing team abbreviations*/
function getTeams(callback) {
    connection.query('SELECT team_id, team_abbr FROM team WHERE team_id = 1', function (err, teamArray) {
        if (err) {
            return console.log(err);
        }

        if (teamArray.length === 0) {
            return console.log('Query - No Teams Returned');
        }

        callback(null, teamArray);
    });
}

/**
 * Using an array of team name abbreviations, retrieves the team rosters from nfl.com
 * The player profile identifiers are then scraped from the HTML and returned.
 * @param {string[]} teamList - Array containing team abbreviations*/
function getTeamRosters(teamArray, callback) {
    async.eachLimit(teamArray, 1, function (team, teamCallback) {
        console.log('Doing Request');
        async.waterfall([
            function (callback) {
                var playerArray = [];
                request(baseRosterURL + team.team_abbr, function (err, response, body) {
                    if (err) {
                        return console.log(err);
                    }

                    var $ = cheerio.load(body);
                    var playerObj = {};

                    $('#team-stats-wrapper').children('#result').children().last('tbody').children().each(function () {
                        playerObj = {};

                        var playerUrl = $(this).children().eq(1).children().attr('href');
                        var splitUrl = playerUrl.split('/');
                        var playerName = $(this).children().eq(1).text().trim().split(', ');
                        var playerHeight = $(this).children().eq(4).text().trim().split('\'');
                        playerHeight[1] = playerHeight[1].replace('"', '');
                        playerObj.player_id = parseInt(splitUrl[3], 10);
                        playerObj.team_id = team.team_id;
                        playerObj.first_name = playerName[1];
                        playerObj.last_name = playerName[0];
                        playerObj.position = $(this).children().eq(2).text().trim();
                        playerObj.dob = $(this).children().eq(6).text().trim();
                        playerObj.weight_lb = parseInt($(this).children().eq(5).text().trim(), 10);
                        playerObj.height_cm = Math.round((parseInt(playerHeight[0], 10) * 30.48) + parseInt(playerHeight[1] * 2.54, 10));
                        playerObj.college = $(this).children().eq(8).text().trim();
                        playerObj.years_exp = parseInt($(this).children().eq(7).text().trim(), 10);
                        var uniformNum = $(this).children().eq(0).text().trim();
                        playerObj.status = $(this).children().eq(3).text().trim();
                        playerObj.profile_url = baseURL + playerUrl;

                        if (isNaN(parseInt(uniformNum))) {
                            playerObj.uniform_num = 0;
                        } else {
                            playerObj.uniform_num = parseInt(uniformNum, 10);
                        }

                        playerArray.push(playerObj);
                    });

                    callback(null, playerArray);
                });
            },
            function (playerArray, callback) {
                async.eachLimit(playerArray, 1, function (player, playerCallback) {
                    console.log('Querying Profile for: ' + player.player_id);
                    request(baseProfileURL + player.player_id, function (err, resp, body) {
                        var $ = cheerio.load(body);
                        var gsis = $('*').html().match(/GSIS\s+ID:\s+([0-9-]+)/);
                        player.gsis = gsis[1];

                        console.log(player)

                        connection.query('INSERT IGNORE INTO player SET ?', player,
                            function (err) {
                                if (err) {
                                    return connection.rollback(function () {
                                        throw err;
                                    });
                                }
                                setTimeout(function () {
                                    playerCallback();
                                }, 2000);
                            });


                    });
                }, function (err, result) {
                    if (err) {
                        return console.log(err);
                    }

                    callback(null);
                });
            }
        ], function (err, result) {
            console.log('Team Roster Completed, pausing...');
            setTimeout(function () {
                teamCallback();
            }, 15000);
        });



            //
            //
            //
            //
            //    process.nextTick(function () {
            //        request(baseProfileURL + playerObj.player_id, function (err, resp, body) {
            //            if (err) {
            //                return console.log(err);
            //            }
            //            console.log(playerObj);
            //            var $ = cheerio.load(body);
            //            var gsis = $('*').html().match(/GSIS\s+ID:\s+([0-9-]+)/);
            //            playerObj.gsis = gsis[1];
            //
            //            //console.log(playerObj);
            //
            //            //connection.query('INSERT INTO player SET ?', playerObj,
            //            //    function (err) {
            //            //        if (err) {
            //            //
            //            //        }
            //            //    });
            //        });
            //    });
            //
            //});
    },
        function (err) {
            if (err) {
                return console.log(err);
            }

            callback(null);
        });
}

function main() {
    async.waterfall([
            getTeams,
            getTeamRosters
        ],
        function (err) {
            if (err) {
                return console.log(err);
            }

            connection.end(function (err) {
                if (err) {
                    return console.log(err);
                }

                return console.log('Database Connection Closed...');
            });
        });
}

main();