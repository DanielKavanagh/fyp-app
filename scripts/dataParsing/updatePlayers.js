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
    rosterUrl = 'http://www.nfl.com/teams/roster?team=';

function findByURL(array, url) {
    var keyArray = Object.keys(array);

    for (var i = 0; i < keyArray.length; i++) {
        if (array[keyArray[i]].player_profile_url === url) {
            return keyArray[i];
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
            var rosterPlayers = $('#team-stats-wrapper').children('#result').children()
                .last('tbody').children();

            async.eachLimit(rosterPlayers, 1, function (rosterPlayer, callback) {
                var playerURL = $(rosterPlayer).children().eq(1).children().attr('href'),
                    playerName = $(rosterPlayer).children().eq(1).text().trim().split(', '),
                    playerHeight = $(rosterPlayer).children().eq(4).text().trim().split('\''),
                    uniformNum = $(rosterPlayer).children().eq(0).text().trim(),
                    posInArray = null;

                playerHeight[1] = playerHeight[1].replace('"', '');

                if (isNaN(parseInt(uniformNum, 10))) {
                    uniformNum = 0;
                } else {
                    uniformNum = parseInt(uniformNum, 10);
                }


                if ((posInArray = findByURL(players, baseUrl + playerURL)) === null ) {
                    request(baseUrl + playerURL, function (err, resp, body) {
                        var $ = cheerio.load(body);
                        var gsis = $('*').html().match(/GSIS\s+ID:\s+([0-9-]+)/);
                        console.log('Found New Player GSIS: ' + gsis[1]);

                        players[gsis[1]] = {
                            player_first_name: playerName[1],
                            player_last_name: playerName[0],
                            player_position: $(rosterPlayer).children().eq(2).text().trim(),
                            player_dob: $(rosterPlayer).children().eq(6).text().trim(),
                            player_weight_lb: parseInt($(rosterPlayer).children().eq(5).text().trim(), 10),
                            player_height_cm: Math.round((parseInt(playerHeight[0], 10) * 30.48)
                                + parseInt(playerHeight[1] * 2.54, 10)),
                            player_college: $(rosterPlayer).children().eq(8).text().trim(),
                            player_years_exp: parseInt($(rosterPlayer).children().eq(7).text().trim(), 10),
                            player_uniform_num: uniformNum,
                            player_status: $(rosterPlayer).children().eq(3).text().trim(),
                            player_profile_url: baseUrl + playerURL
                        };

                        setTimeout(function () {
                            callback();
                        }, Math.floor(Math.random() * (5000 - 500 + 1)) + 500);

                    });
                } else {
                    console.log('Found Player in Mapping, Updating Details:');
                    //Player was found in mapping, update details
                    players[posInArray] = {
                        player_team_id: team.team_id,
                        player_first_name: playerName[1],
                        player_last_name: playerName[0],
                        player_position: $(rosterPlayer).children().eq(2).text().trim(),
                        player_dob: $(rosterPlayer).children().eq(6).text().trim(),
                        player_weight_lb: parseInt($(rosterPlayer).children().eq(5).text().trim(), 10),
                        player_height_cm: Math.round((parseInt(playerHeight[0], 10) * 30.48)
                            + parseInt(playerHeight[1] * 2.54, 10)),
                        player_college: $(rosterPlayer).children().eq(8).text().trim(),
                        player_years_exp: parseInt($(rosterPlayer).children().eq(7).text().trim(), 10),
                        player_uniform_num: uniformNum,
                        player_status: $(rosterPlayer).children().eq(3).text().trim(),
                        player_profile_url: baseUrl + playerURL
                    }

                    console.log('Updated: ' + posInArray + ' (' +
                        playerName[1] + ' ' + playerName[0] + ')');

                    callback();
                }

            }, function (err) {
                if (err) {
                    return console.log(err);
                }

                savePlayers(players, function (err, result) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log(result);
                    callback();
                });

            });
        });

    }, function (err) {
        if (err) {
            return console.log(err);
        }

        callback(null);
    });
}

function savePlayers(players, callback) {
    fs.writeFile('/home/vagrant/fyp/fyp-app/jsonData/players.json', JSON.stringify(players),
        { flags: 'wx' }, function (err) {
            if (err) {
                return callback(err);
            }

            callback(null, 'Saved Players to File');
        });
}

function main() {

    async.waterfall([
        loadPlayerJSON,
        getPlayerProfileIDs,
        getTeamAbbrs,
        checkTeamRosters
    ], function (err) {
        if (err) {
            return console.log(err);
        }
    });
}

main();
