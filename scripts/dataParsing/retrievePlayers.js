/**
 * Created by Daniel on 10/02/2016.
 * TODO: Add @callback comments for each callback, documenting their params/function
 *
 */

'use strict';

/* Import dependencies */
var request     = require('request');
var async       = require('async');
var mysql       = require('mysql');
var cheerio     = require('cheerio');

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

/**
 * getTeams retrieves the team name abbreviations from the database.
 * The callback function is called when the query returns successfully.
 * @param {function} callback - Callback which sends the async waterfall to the next function
 * @return {string[]} teamList - Array containing team abbreviations*/
function getTeams(callback) {
    connection.query('SELECT team_id, team_abbr FROM team WHERE team_abbr = "PHI"', function (err, teamArray) {
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
    var playerObj = {};

    async.eachLimit(teamArray, 1, function (team, teamCallback) {
        console.log('Doing Request');
        request(baseRosterURL + team.team_abbr, function (err, response, body) {
            if (err) {
                return console.log(err);
            }

            var $ = cheerio.load(body);

            $('#team-stats-wrapper').children('#result').children().last('tbody').children().each(function () {

                var playerUrl = $(this).children().eq(1).children().attr('href');
                var splitUrl = playerUrl.split('/');

                var playerName = $(this).children().eq(1).text().trim().split(', ');

                var playerHeight = $(this).children().eq(4).text().trim().split('\'');
                playerHeight[1] = playerHeight[1].replace('"', '');

                playerObj.player_id = parseInt(splitUrl[3], 10);
                playerObj.team_id = team.team_id;
                playerObj.player_first_name = playerName[1];
                playerObj.player_last_name = playerName[0];
                playerObj.player_position = $(this).children().eq(2).text().trim();
                playerObj.player_dob = $(this).children().eq(6).text().trim();
                playerObj.player_weight_lb = parseInt($(this).children().eq(5).text().trim(), 10);
                playerObj.player_height_cm = Math.round((parseInt(playerHeight[0], 10) * 30.48) + parseInt(playerHeight[1] * 2.54, 10));
                playerObj.player_college = $(this).children().eq(8).text().trim();
                playerObj.player_years_exp = parseInt($(this).children().eq(7).text().trim(), 10);

                var uniformNum = $(this).children().eq(0).text().trim();

                if (isNaN(parseInt(uniformNum))) {
                    playerObj.player_uniform_num = 0;
                } else {
                    playerObj.player_uniform_num = parseInt(uniformNum, 10);
                }

                playerObj.player_status = $(this).children().eq(3).text().trim();
                playerObj.player_profile_url = baseURL + playerUrl;

                console.log(playerObj);

                connection.query('INSERT INTO player SET ?', playerObj,
                    function (err) {
                        if (err) {
                            return connection.rollback(function () {
                                throw err;
                            });
                        }

                        teamCallback();
                    });

            });




        });
    },
        function (err) {
            if (err) {
                return console.log(err);
            }

            callback(null);
        });
}

/**
 * Using an array of player profile strings, retrieve the player information from nfl.com,
 * and insert it into the database.
 * @param {string[]} playerArray - Array of player profile identifiers */
//function getPlayers(playerArray, callback) {
//    async.eachLimit(playerArray, 1, function (player, playerCallback) {
//        var playerObj = {};
//        console.log('Request: ' + baseProfileURL + player);
//        request(baseProfileURL + player, function (err, response, body) {
//            if (err) {
//                return console.log(err);
//            }
//
//            var $ = cheerio.load(body);
//
//            console.log(typeof player);
//
//            connection.query('SELECT team_id FROM team WHERE team_abbr = ?', [$('#playerTeam').attr('content')], function (err, result) {
//                playerObj.player_id = parseInt(player);
//                playerObj.team_id = result[0].team_id;
//                playerObj.player_name = $('.player-name').text().trim();
//                var playerNumber = $('.player-number').text().trim().split(' ');
//                playerObj.player_position = playerNumber[1];
//                var dobString = $('.player-info').children('p').eq(3).text().trim().split(' ');
//                playerObj.player_dob = dobString[1];
//                var physicalString = $('.player-info').children('p').eq(2).text().trim().split(' ');
//                playerObj.player_weight_lb = parseInt(physicalString[4], 10);
//                var heightString = physicalString[1].trim().split('-');
//                playerObj.player_height_cm = Math.round((parseInt(heightString[0], 10) * 30.48) + parseInt(heightString[1] * 2.54, 10));
//                var playerCollege = $('.player-info').children('p').eq(4).text().trim().split(' ');
//                playerObj.player_college = playerCollege[1];
//                var playerExperience = $('.player-info').children('p').eq(5).text().trim().split(' ');
//                if (playerExperience[1] === 'Rookie') {
//                    playerObj.player_years_exp = 0;
//                } else {
//                    playerObj.player_years_exp = parseInt(playerExperience[1], 10);
//                }
//
//                console.log(playerObj);
//
//                setTimeout(function () {
//                    console.log('Waiting...');
//                    playerCallback();
//                }, 1500);
//            });
//        });
//
//
//    },
//        function (err) {
//            if (err) {
//                return console.log(err);
//            }
//
//            callback(null);
//        });
//}

function main() {
    async.waterfall([
        getTeams,
        getTeamRosters
        //getPlayers
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