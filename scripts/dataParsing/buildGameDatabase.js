/**
 * Created by Daniel Kavanagh on 22/02/2016.
 *
 * This command line script parses the nfl json data retrieved using
 * retrieveGameData.js. The parsed data is inserted into the mysql db
 * and split into game, drive, player, player_play, and agg_play tables.
 */

'use strict';

var async = require('async');
var mysql = require('mysql');
var fs = require('fs');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root123',
    database: 'FYP_DB'
});

connection.connect(function (err) {
    if (err) {
        return console.log('Connection Error:\n\n' + err);
    }

    console.log('Connected to DB');
});

/**
 * Reads the directory specified through command line argument, converts
 * them to JSON objects, and pushes them onto an array
 *
 * @param - {string} directory - The directory to parse
 * @param - {function} callback - Moves async waterfall to next function
 */
function readDirectory(directory, callback) {
    var gameArray = [];

    fs.readdir(directory, function (err, files) {
        if (err) {
            return console.log(err);
        }

        //Read each file in the directory
        async.each(files, function (file, readCallback) {
            fs.readFile(directory + file, 'utf-8', function (err, content) {
                if (err) {
                    return console.log(err);
                }

                gameArray.push(JSON.parse(content));
                readCallback();
            });
        }, function (err) {
            if (err) {
                return console.log(err);
            } else {
                //Pass gameArray to next function using callback
                callback(null, gameArray);
            }
        });
    });
}

/**
 * Inserts the game data into the game, drive, play, agg_play, and play_player
 * tables. Refer to https://github.com/DanielKavanagh/fyp-db for details
 * about the schema and table associations*/
function insertGameData(gameArray, callback) {
    async.each(gameArray, function (game, gameCallback) {
        var gameRef = game[Object.keys(game)[0]], gameObj = {};
        //TODO: Insert data into game table
        async.series([
            function (callback) {
                connection.query('SELECT team_id FROM team ' +
                    'WHERE team_abbr = ?', [gameRef.home.abbr],
                    function (err, results) {
                        if (err) {
                            return console.log(err);
                        }

                        if (results.length !== 1) {
                            return console.log('More than one team_id returned (Check Database)');
                        }

                        gameObj.game_eid = parseInt(Object.keys(game)[0], 10);
                        gameObj.home_team_id = results[0].team_id;
                        gameObj.home_score_final = gameRef.home.score.T;
                        gameObj.home_score_q1 = gameRef.home.score['1'];
                        gameObj.home_score_q2 = gameRef.home.score['2'];
                        gameObj.home_score_q3 = gameRef.home.score['3'];
                        gameObj.home_score_q4 = gameRef.home.score['4'];
                        gameObj.home_score_q5 = gameRef.home.score['5'];
                        gameObj.home_total_fds = gameRef.home.stats.team.totfd;
                        gameObj.home_total_yds = gameRef.home.stats.team.totyds;
                        gameObj.home_total_pass_yards = gameRef.home.stats.team.pyds;
                        gameObj.home_total_rush_yards = gameRef.home.stats.team.ryds;
                        gameObj.home_total_pens = gameRef.home.stats.team.pen;
                        gameObj.home_total_pen_yards = gameRef.home.stats.team.penyds;
                        gameObj.home_time_of_pos = gameRef.home.stats.team.top;
                        gameObj.home_turnovers = gameRef.home.stats.team.trnovr;
                        gameObj.home_total_punts = gameRef.home.stats.team.pt;
                        gameObj.home_total_punt_yards = gameRef.home.stats.team.ptyds;
                        gameObj.home_total_punt_avg = gameRef.home.stats.team.ptavg;

                        callback(null);

                    });
            },
            function (callback) {
                connection.query('SELECT team_id FROM team ' +
                    'WHERE team_abbr = ?', [gameRef.away.abbr],
                    function (err, results) {
                        if (err) {
                            return console.error(err);
                        }

                        if (results.length !== 1) {
                            return console.error('More than one team_id returned (Check Database)');
                        }

                        gameObj.away_team_id = results[0].team_id;
                        gameObj.away_score_final = gameRef.away.score.T;
                        gameObj.away_score_q1 = gameRef.away.score['1'];
                        gameObj.away_score_q2 = gameRef.away.score['2'];
                        gameObj.away_score_q3 = gameRef.away.score['3'];
                        gameObj.away_score_q4 = gameRef.away.score['4'];
                        gameObj.away_score_q5 = gameRef.away.score['5'];
                        gameObj.away_total_fds = gameRef.away.stats.team.totfd;
                        gameObj.away_total_yds = gameRef.away.stats.team.totyds;
                        gameObj.away_total_pass_yards = gameRef.away.stats.team.pyds;
                        gameObj.away_total_rush_yards = gameRef.away.stats.team.ryds;
                        gameObj.away_total_pens = gameRef.away.stats.team.pen;
                        gameObj.away_total_pen_yards = gameRef.away.stats.team.penyds;
                        gameObj.away_time_of_pos = gameRef.away.stats.team.top;
                        gameObj.away_turnovers = gameRef.away.stats.team.trnovr;
                        gameObj.away_total_punts = gameRef.away.stats.team.pt;
                        gameObj.away_total_punt_yards = gameRef.away.stats.team.ptyds;
                        gameObj.away_total_punt_avg = gameRef.away.stats.team.ptavg;

                        callback();
                    });
            },
            function (callback) {
                connection.query('INSERT IGNORE INTO game SET ?', gameObj, function (err) {
                    if (err) {
                        return connection.rollback(function () {
                            throw err;
                        });
                    }

                    callback();
                });
            },
            function (callback) {
                var driveArr = Object.keys(gameRef.drives).map(function (k) {
                    return gameRef.drives[k];
                });

                driveArr.pop();

                var gameID, driveObj = {}, driveID = 1;

                connection.query('SELECT game_id FROM game WHERE game_eid = ?',
                    [gameObj.game_eid], function (err, results) {
                        if (err) {
                            return console.error(err);
                        }

                        if (results.length !== 1) {
                            return console.error('More than one result returned');
                        }

                        gameID = results[0].game_id;

                    });

                console.log(driveArr);

                async.each(driveArr, function (drive, driveCallback) {
                    //TODO: Insert data into the drive table
                    async.series([
                        function (callback) {
                            connection.query('SELECT team_id FROM team ' +
                                'WHERE team_abbr = ?', [drive.posteam],
                                function (err, results) {
                                    if (err) {
                                        return console.error(err);
                                    }

                                    if (results.length !== 1) {
                                        return console.error('More than one returned');
                                    }

                                    driveObj.game_id = gameID;
                                    driveObj.drive_id = driveID;
                                    driveObj.team_id = results[0].team_id;

                                    driveObj.drive_pos_time = drive.postime;
                                    driveObj.drive_total_plays = drive.numplays;
                                    driveObj.drive_first_downs = drive.fds;
                                    driveObj.drive_yards_gained = drive.ydsgained;
                                    driveObj.drive_yards_pen = drive.penyds;
                                    driveObj.drive_result = drive.result;

                                    driveObj.drive_start_time = drive.start.time;
                                    driveObj.drive_start_quarter = drive.start.qtr;
                                    driveObj.drive_start_position = drive.start.yrdln;

                                    driveObj.drive_end_time = drive.end.time;
                                    driveObj.drive_end_quarter = drive.end.qtr;
                                    driveObj.drive_end_position = drive.end.yrdln;

                                    driveID++;
                                    callback();

                                });
                        },
                        function (callback) {
                            connection.query('INSERT INTO drive SET ?', driveObj, function (err) {
                                if (err) {
                                    return console.error(err);
                                }

                                callback();
                            });
                        },
                        function (callback) {
                            var playArr = Object.keys(drive.plays).map(function (k) {
                                return drive.plays[k];
                            });

                            async.each(playArr, function (play, playCallback) {
                                console.log(play);
                                //TODO: Insert data into play table
                                playCallback();
                            },
                                function (err) {
                                    if (err) {
                                        return console.log(err);
                                    }

                                    driveCallback();
                                });
                        }
                    ]);


                },
                    function (err) {
                        if (err) {
                            return console.log(err);
                        }

                        callback();
                    });
            }],
            function (err, result) {
                if (err) {
                    return console.error(err);
                }

                gameCallback();
            });
    },
        function (err) {
            if (err) {
                return console.log(err);
            }

            callback();
        });
}

/**
 * Controls the async functions, and parses the command line arguments
 *
 * @author - Daniel Kavanagh
 */
function main() {
    if (process.argv.length !== 3) {
        return console.log('Usage: node buildRelationalModel.js ' +
            'path/to/directory');
    }

    async.waterfall([
            async.apply(readDirectory, process.argv[2]),
            insertGameData
        ],
        function (err) {
            if (err) {
                return console.log(err);
            }

            /*Close DB connection*/
            connection.end(function (err) {
                if (err) {
                    return console.log(err);
                }

                return console.log('Database Connection Closed...');
            });
        });
}

main();