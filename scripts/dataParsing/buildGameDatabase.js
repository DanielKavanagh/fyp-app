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

function parseGame(game, callback) {
    var gameRef = game[Object.keys(game)[0]];

    var gameObj = {};

    connection.query('SELECT team_id, team_abbr FROM team ' +
        'WHERE team_abbr = ? OR team_abbr = ?',
        [gameRef.home.abbr, gameRef.away.abbr],
        function (err, results) {
            gameObj.game_eid = parseInt(Object.keys(game)[0], 10);

            gameObj.home_team_id = results.filter(function(obj) {
                return obj.team_abbr === gameRef.home.abbr;
            })[0].team_id;
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

            gameObj.away_team_id = results.filter(function(obj) {
                return obj.team_abbr === gameRef.away.abbr;
            })[0].team_id;
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

            connection.query('INSERT IGNORE INTO game SET ?', gameObj, function (err, result) {
                if (err) {
                    return connection.rollback(function () {
                        throw err;
                    });
                }

                var driveArr = Object.keys(gameRef.drives).map(function (k) {
                    return gameRef.drives[k];
                });

                driveArr.pop();

                callback(null, result.insertId, driveArr);
            });
        });
}

function parseDrive(gameID, driveArr, callback) {
    if (gameID === 0) {
        return console.log('Error');
    }

    var gamePlays = [];

    var driveID = 1;

    async.each(driveArr, function (drive, callback) {
        var driveObj = {};

        connection.query('SELECT team_id FROM team ' +
            'WHERE team_abbr = ?', [drive.posteam],
            function (err, results) {
                if (err) {
                    return console.log(err);
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

                connection.query('INSERT INTO drive SET ?', driveObj, function (err, result) {
                    if (err) {
                        return console.error(err);
                    }

                    var playArr = Object.keys(drive.plays).map(function (k) {
                        return drive.plays[k];
                    });

                    playArr.forEach(function (play) {
                        play.driveID = driveObj.drive_id;
                        play.posteamID = driveObj.team_id;
                    });

                    gamePlays.push.apply(gamePlays, playArr);

                    callback();
                });
            });
    }, function (err) {
        if (err) {
            return console.log(err);
        }

        callback(null, gameID, gamePlays);
    });
}

function parsePlays(gameID, gamePlays, callback) {

    var playID = 1;

    async.each(gamePlays, function(play, callback) {
        var playObj = {};

        playObj.game_id = gameID;
        playObj.drive_id = play.driveID;
        playObj.play_id = playID;
        playObj.team_id = play.posteamID;

        playObj.quarter = play.qtr;
        playObj.down = play.down;
        playObj.start_time = play.time;
        playObj.yard_line = play.yrdln;
        playObj.yards_to_first_down = play.ydstogo;
        playObj.yards_this_drive = play.ydsnet;
        playObj.play_description = play.desc;
        playObj.play_note = play.note;

        if ('0' in play.players) {
            console.log(play.players['0'][0]);
            play.players['0'].forEach(function (teamStat) {
                switch(teamStat.statId) {
                    case 3:
                        playObj.rushing_first_down = 1;
                        break;
                    case 4:
                        playObj.passing_first_down = 1;
                        break;
                    case 5:
                        playObj.penalty_first_down = 1;
                        break;
                    case 6:
                        playObj.third_down_att = 1;
                        playObj.third_down_cmp = 1;
                        break;
                    case 7:
                        playObj.third_down_att = 1;
                        break;
                    case 8:
                        playObj.fourth_down_att = 1;
                        playObj.fourth_down_cmp = 1;
                        break;
                    case 9:
                        playObj.fourth_down_att = 1;
                        break;
                    case 68:
                        playObj.timeout = 1;
                        break;
                    case 301:
                        playObj.xp_aborted = 1;
                        break;
                    default:
                        break;
                }

                if (play.note === 'PENALTY') {
                    playObj.penalty = 1;
                }
            });
        }

        playID++;



        console.log(playObj);

        connection.query('INSERT INTO play SET ?', [playObj], function (err, result) {
            if (err) {
                console.log(err);
            }

            callback();
        });
    }, function (err, results) {
        if (err) {
            return console.log(err);
        }
    });

}

function insertGameData(gameArray, callback) {

    async.each(gameArray, function (game, callback) {
        async.waterfall([
            async.apply(parseGame, game),
            parseDrive,
            parsePlays
        ], function (err) {
            if (err) {
                return console.log(err);
            }
            callback();
        });
    }, function (err) {
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