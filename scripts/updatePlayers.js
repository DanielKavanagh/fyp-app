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

var Player = require('../models/player.js');
var pool = require('../models/mysqldb.js');

//Global variables
var baseUrl = 'http://www.nfl.com',
    gsisProfileUrl = 'http://www.nfl.com/players/profile?id=',
    rosterUrl = 'http://www.nfl.com/teams/roster?team=';

function findByURL(array, url) {
    var keyArray = Object.keys(array),
        i;

    for (i = 0; i < keyArray.length; i++) {
        if (array[keyArray[i]].player_profile_url === url) {
            return keyArray[i];
        }
    }
    return null;
}

function savePlayers(players, callback) {
    fs.writeFile('/home/vagrant/fyp/fyp-app/data/players/players.json',
        JSON.stringify(players), {flags: 'wx'}, function (err) {
            if (err) {
                return callback(err);
            }

            callback(null, 'Saved Players to File');
        });
}

function loadPlayerJSON(callback) {
    fs.readFile('/home/vagrant/fyp/fyp-app/data/players/players.json', 'utf-8',
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
                }

                players[player].player_profile_url = baseUrl
                    + resp.client._httpMessage.path;

                console.log('Writing Changes to Disk');

                savePlayers(players, function (err, result) {
                    if (err) {
                        return console.log(err);
                    }

                    console.log(result);

                    setTimeout(function () {
                        callback();
                    }, Math.floor(Math.random() * (5000 - 500 + 1)) + 500);
                });
            });
        } else {
            process.nextTick(function () {
                callback();
            });
        }
    }, function (err) {
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

                if (teams.length === 0) {
                    return callback('No Teams Found (Check Database)');
                }

                connection.release();
                callback(null, teams, players);
            });
    });
}

function checkTeamRosters(teams, players, callback) {
    if (process.argv.indexOf('--no-roster-update') !== -1) {
        console.log('Skipping Player Roster Update');
        return callback(null, players);
    }

    async.eachLimit(teams, 1, function (team, callback) {
        console.log('Getting Team Roster (' + team.team_abbr + ')');
        request(rosterUrl + team.team_abbr, function (err, resp, body) {
            if (err) {
                return console.log(err);
            }

            var $ = cheerio.load(body),
                rosterPlayers = $('#team-stats-wrapper').children('#result')
                    .children().last('tbody').children();

            async.eachLimit(rosterPlayers, 1, function (rosterPlayer, callback) {
                var playerURL = $(rosterPlayer).children().eq(1)
                    .children().attr('href'),
                    playerName = $(rosterPlayer).children().eq(1)
                    .text().trim().split(', '),
                    playerHeight = $(rosterPlayer).children().eq(4)
                    .text().trim().split('\''),
                    uniformNum = $(rosterPlayer).children().eq(0)
                    .text().trim(),
                    posInArray;

                playerHeight[1] = playerHeight[1].replace('"', '');

                if (isNaN(parseInt(uniformNum, 10))) {
                    uniformNum = 0;
                } else {
                    uniformNum = parseInt(uniformNum, 10);
                }


                if ((posInArray = findByURL(players, baseUrl + playerURL)) === null) {
                    request(baseUrl + playerURL, function (err, resp, body) {
                        if (err) {
                            return console.log(err);
                        }

                        var $ = cheerio.load(body),
                            gsis = $('*').html().match(/GSIS\s+ID:\s+([0-9-]+)/);

                        if (gsis[1].length > 4) {
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
                        }

                        setTimeout(function () {
                            $ = null;
                            callback();
                        }, Math.floor(Math.random() * (5000 - 500 + 1)) + 500);

                    });
                } else {
                    console.log('Found Player in Mapping, Updating Details:');
                    //Player was found in mapping, update details
                    players[posInArray] = {
                        team_id: team.team_id,
                        player_first_name: playerName[1],
                        player_last_name: playerName[0],
                        player_position: $(rosterPlayer).children()
                            .eq(2).text().trim(),
                        player_dob: $(rosterPlayer).children().eq(6).text().trim(),
                        player_weight_lb: parseInt($(rosterPlayer).children()
                            .eq(5).text().trim(), 10),
                        player_height_cm: Math.round((parseInt(playerHeight[0], 10) * 30.48)
                            + parseInt(playerHeight[1] * 2.54, 10)),
                        player_college: $(rosterPlayer).children().eq(8).text().trim(),
                        player_years_exp: parseInt($(rosterPlayer).children()
                            .eq(7).text().trim(), 10),
                        player_uniform_num: uniformNum,
                        player_status: $(rosterPlayer).children().eq(3)
                            .text().trim(),
                        player_profile_url: baseUrl + playerURL
                    };

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

        callback(null, players);
    });
}

function getNonRosterPlayers(players, callback) {
    var playerCounter = 0;
    console.log('Getting Players not on a Roster');

    async.eachLimit(players, 1, function (player, callback) {
        //console.log(player.player_team_id);
        if (player.hasOwnProperty('team_id') === false) {
            console.log('Requesting Player: ' + player.gsis_name);

            request(player.player_profile_url, function (err, resp, body) {
                if (err) {
                    return console.log(err);
                }

                var $ = cheerio.load(body),
                    playerName = '',
                    dobString = '',
                    physicalString = '',
                    heightString = '',
                    playerExperience = 0,
                    playerCollege = '',
                    playerNumber = 0;

                if ($('.player-info > .player-team-links').length === 0) {
                    //Player is retired

                    playerName = $('.player-name').text().trim().split(' ');
                    dobString = $('.player-info').children('p').eq(2).text().trim().split(' ');
                    physicalString = $('.player-info').children('p').eq(1).text().trim().split(' ');
                    heightString = physicalString[1].trim().split('-');
                    playerExperience = $('.player-info').children('p').eq(4).text().trim().split(' ');
                    playerCollege =  $('.player-info').children('p').eq(3).text().trim().split(': ');

                    player.team_id = 33;
                    player.player_first_name = playerName[0];
                    player.player_last_name = playerName[1];
                    player.player_position = '';
                    player.player_uniform_num = 0;
                    player.player_dob = dobString[1];
                    player.player_weight_lb = parseInt(physicalString[4], 10);
                    player.player_height_cm = Math.round((parseInt(heightString[0], 10) * 30.48) +
                        parseInt(heightString[1] * 2.54, 10));
                    player.player_college = playerCollege[1];

                    if (playerExperience[1] === 'Rookie') {
                        player.player_years_exp = 0;
                    } else {
                        player.player_years_exp = parseInt(playerExperience[1], 10);
                    }

                    player.player_status = 'RET';

                } else {
                    //Player is Free Agent
                    playerName = $('.player-name').text().trim().split(' ');
                    playerNumber = $('.player-number').text().trim().split(' ');
                    dobString = $('.player-info').children('p').eq(3).text().trim().split(' ');
                    physicalString = $('.player-info').children('p').eq(2).text().trim().split(' ');
                    heightString = physicalString[1].trim().split('-');
                    playerCollege = $('.player-info').children('p').eq(4).text().trim().split(': ');
                    playerExperience = $('.player-info').children('p').eq(5).text().trim().split(' ');

                    player.team_id = 33;
                    player.player_first_name = playerName[0];
                    player.player_last_name = playerName[1];
                    player.player_position = playerNumber[1];
                    player.player_dob = dobString[1];
                    player.player_uniform_num = 0;
                    player.player_weight_lb = parseInt(physicalString[4], 10);
                    player.player_height_cm = Math.round((parseInt(heightString[0], 10) * 30.48)
                        + parseInt(heightString[1] * 2.54, 10));
                    player.player_college = playerCollege[1];

                    if (playerExperience[1] === 'Rookie') {
                        player.player_years_exp = 0;
                    } else {
                        player.player_years_exp = parseInt(playerExperience[1], 10);
                    }

                    player.player_status = 'FA';
                }

                console.log(player);

                if ((playerCounter % 10) === 0) {
                    savePlayers(players, function (err, result) {
                        if (err) {
                            return console.log(err);
                        }

                        console.log(result);
                    });
                }

                console.log('Waiting');
                playerCounter++;
                setTimeout(function () {
                    $ = null;
                    callback();
                }, Math.floor(Math.random() * (5000 - 500 + 1)) + 500);


            });
        } else {
            process.nextTick(function () {
                callback();
            });
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
            callback(null, players);
        });


    });
}

function insertPlayersIntoDB(players, callback) {
    console.log('Saving Players to DB');
    pool.getConnection(function (err, connection) {
        if (err) {
            return console.log(err);
        }

        //console.log(players);
        async.each(Object.keys(players), function (player, callback) {
            //console.log(player);
            players[player].player_gsis = player;
            connection.query('INSERT INTO player SET ?', {
                team_id: players[player].team_id,
                player_gsis: players[player].player_gsis,
                player_first_name: players[player].player_first_name,
                player_last_name: players[player].player_last_name,
                player_position: players[player].player_position,
                player_dob: players[player].player_dob,
                player_weight_lb: players[player].player_weight_lb,
                player_height_cm: players[player].player_height_cm,
                player_college: players[player].player_college,
                player_years_exp: players[player].player_years_exp,
                player_uniform_num: players[player].player_uniform_num,
                player_status: players[player].player_status,
                player_profile_url: players[player].player_profile_url
            }, function (err, result) {
                if (err) {
                    console.log(err);
                }

                callback();
            });
        }, function (err) {
            if (err) {
                return console.log(err);
            }

            callback(null);
        });


    });
}

function main() {
    async.waterfall([
        loadPlayerJSON,
        getPlayerProfileIDs,
        getTeamAbbrs,
        checkTeamRosters,
        getNonRosterPlayers,
        insertPlayersIntoDB
    ], function (err) {
        if (err) {
            return console.log(err);
        }

        process.exit(0);
    });
}

main();
