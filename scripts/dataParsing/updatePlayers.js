/**
 * Created by Daniel on 03/03/2016.
 */

'use strict';

//Script dependencies
var request = require('request');
var async = require('async');
var mysql = require('mysql');
var cheerio = require('cheerio');
var mkdirp = require('mkdirp');
var fs = require('fs');

var Player = require('../../models/player.js');
var pool = require('../../models/mysqldb.js');

//Global variables
var baseUrl = 'http://www.nfl.com',
    gsisProfileUrl = 'http://www.nfl.com/players/profile?id=',
    rosterUrl = 'http://www.nfl.com/players/profile?id=';

function findByURL(array, url) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].player_profile_url === url) {
            return array[i];
        }
    }

    return null;
}

function loadPlayerJSON(callback) {
    fs.readFile('/home/vagrant/fyp/fyp-app/jsonData/players.json', 'utf-8',
        function (err, content) {
            if (err) {
                return console.log(err);
            }

            callback(null, JSON.parse(content));
        });
}

function getPlayerProfileIDs(players, callback) {


    async.eachLimit(Object.keys(players), 1, function (player, callback) {
        if (!(players[player].hasOwnProperty('player_profile_url'))) {

            console.log('Requesting: (' + player + ')');
            var reqURL = gsisProfileUrl + player;

            request({
                url: reqURL,
                method: 'HEAD'
            }, function (err, resp) {
                if (err) {
                    console.log('Error: Saving changes to players.json');
                    fs.writeFile('/home/vagrant/fyp/fyp-app/jsonData/players.json', JSON.stringify(players),
                        { flags: 'wx' }, function (err) {
                            if (err) {
                                return console.log(err);
                            }

                            return console.log(err);
                        });
                }

                players[player].player_profile_url = baseUrl
                    + resp.client._httpMessage.path;

                console.log(players[player]);

                console.log('Waiting');

                fs.writeFile('/home/vagrant/fyp/fyp-app/jsonData/players.json', JSON.stringify(players),
                    { flags: 'wx' }, function (err) {
                        if (err) {
                            return console.log(err);
                        }

                        setTimeout(function () {
                            callback();
                        }, Math.floor(Math.random() * (5000 - 500 + 1)) + 500);

                    });
            });
        } else {
            callback();
        }


    }, function (err) {
        if (err) {
            return console.log(err);
        }

        callback(null, players);
    });

}

function savePlayerJSON(players, callback) {
    fs.writeFile('/home/vagrant/fyp/fyp-app/jsonData/players.json', JSON.stringify(players),
        { flags: 'wx' }, function (err) {
            if (err) {
                return console.log(err);
            }

            callback(null, players);
        });
}

function getTeamAbbrs(players, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            return console.log(err);
        }

        connection.query('SELECT team_id, team_abbr FROM team' +
            ' WHERE team_abbr != "UNK"', function (err, teams) {
                if (err) {
                    return console.log(err);
                }

                connection.release();
                callback(null, teams, players);
            });
    });
}

function checkTeamRosters(teams, players, callback) {

    async.eachLimit(teams, 1, function (team, callback) {

        console.log('Getting Team Roster (' + team.team_abbr + ')');

        request(rosterUrl + team.team_abbr, function (err, resp, body) {
            if (err) {
                return console.log(err);
            }

            var $ = cheerio.load(body);

            $('#team-stats-wrapper').children('#result').children()
                .last('tbody').children().each(function () {

                    var playerUrl = $(this).children().eq(1).children().attr('href'),
                        splitUrl = playerUrl.split('/'),
                        playerName = $(this).children().eq(1).text().trim().split(', '),
                        playerHeight = $(this).children().eq(4).text().trim().split('\''),
                        uniformNum = $(this).children().eq(0).text().trim();

                    var posInArray = null;

                    var playerArr = Object.keys(players);

                    if (posInArray = (findByURL(playerArr, baseUrl + playerUrl)) !== null) {
                        //Player was found in mapping
                        console.log('Found Player');
                        console.log(playerArr[posInArray]);
                    } else {
                        console.log('Player not found');
                    }

                    playerHeight[1] = playerHeight[1].replace('"', '');


                    if (isNaN(parseInt(uniformNum, 10))) {
                        uniformNum = 0;
                    } else {
                        uniformNum = parseInt(uniformNum, 10);
                    }

                    //var playerObj = new Player({
                    //    player_id: parseInt(splitUrl[3], 10),
                    //    team_id: team.team_id,
                    //    player_first_name: playerName[1],
                    //    player_last_name: playerName[0],
                    //    player_position: $(this).children().eq(2).text().trim(),
                    //    player_dob: $(this).children().eq(6).text().trim(),
                    //    player_weight_lb: parseInt($(this).children().eq(5).text().trim(), 10),
                    //    player_height_cm: Math.round((parseInt(playerHeight[0], 10) * 30.48)
                    //        + parseInt(playerHeight[1] * 2.54, 10)),
                    //    player_college: $(this).children().eq(8).text().trim(),
                    //    player_years_exp: parseInt($(this).children().eq(7).text().trim(), 10),
                    //    player_uniform_num: uniformNum,
                    //    player_status: $(this).children().eq(3).text().trim(),
                    //    player_profile_url: baseURL + playerUrl
                    //});

                });

            callback();
        });

    }, function (err) {
        if (err) {
            return console.log(err);
        }

        callback(null);
    });
}

function main() {

    async.waterfall([
        loadPlayerJSON,
        getPlayerProfileIDs,
        savePlayerJSON,
        getTeamAbbrs,
        checkTeamRosters
    ], function (err) {
        if (err) {
            return console.log(err);
        }
    });
}

main();
