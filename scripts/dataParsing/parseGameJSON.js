/**
 * Created by Daniel on 29/02/2016.
 */

'use strict'

var async = require('async');
var mysql = require('mysql');
var fs = require('fs');
var pool = require('../../models/mysqldb.js');
var Game = require('../../models/game.js');
var Drive = require('../../models/drive.js');
var Play = require('../../models/play.js');
var StatMap = require('../../models/statMap.js');

//function readWeekDirectory(directory, callback) {
//    var gameArray = [];
//
//    console.log('Reading Game Directory');
//
//    fs.readdir(directory, function (err, files) {
//        if (err) {
//            return console.log(err);
//        }
//
//        //Read each file in the directory
//        async.eachLimit(files, 1, function (file, readCallback) {
//            console.log('Reading File: ' + file);
//            fs.readFile(directory + file, 'utf-8', function (err, content) {
//                if (err) {
//                    return console.log(err);
//                }
//
//                gameArray.push(JSON.parse(content));
//
//                process.nextTick(function () {
//                    readCallback();
//                });
//            });
//        }, function (err) {
//            if (err) {
//                return console.log(err);
//            } else {
//                //Pass gameArray to next function using callback
//                callback(null, gameArray);
//            }
//        });
//    });
//}

function parseGameData(directory, callback) {

    console.log('Reading Directory (' + directory + ')');

    pool.getConnection(function (err, connection) {
        if (err) {
            return console.log(err);
        }

        fs.readdir(directory, function (err, files) {
            if (err) {
                return console.log(err);
            }

            async.eachLimit(files, 1, function (file, callback) {

                console.log('Reading File (' + file + ')');

                fs.readFile(directory + file, 'utf-8', function (err, content) {
                    if (err) {
                        return console.log(err);
                    }

                    async.waterfall([
                        async.apply(insertGame, JSON.parse(content), connection),
                        insertGameDrives,
                        insertGamePlays
                    ], function (err) {
                        if (err) {
                            return console.log(err);
                        }

                        callback();
                    });
                });
            }, function (err) {
                if (err) {
                    return console.log(err);
                }

                connection.release();
                callback(null);
            });
        });
    });
}

function insertGame(game, connection, callback) {
    console.log('Parsing Game');

    var gameRef = game[Object.keys(game)[0]];

    connection.query('SELECT team_id, team_abbr FROM team '
        + 'WHERE team_abbr = ? OR team_abbr = ?',
        [gameRef.home.abbr, gameRef.away.abbr], function (err, results) {
            if (err) {
                return console.log(err);
            }

            var gameObj = new Game({
                game_eid: parseInt(Object.keys(game)[0], 10),

                home_team_id: results.filter(function(obj) {
                    return obj.team_abbr === gameRef.home.abbr;
                })[0].team_id,
                home_score_final: gameRef.home.score.T,
                home_score_q1: gameRef.home.score['1'],
                home_score_q2: gameRef.home.score['2'],
                home_score_q3: gameRef.home.score['3'],
                home_score_q4: gameRef.home.score['4'],
                home_score_q5: gameRef.home.score['5'],
                home_total_fds: gameRef.home.stats.team.totfd,
                home_total_yds: gameRef.home.stats.team.totyds,
                home_total_pass_yards: gameRef.home.stats.team.pyds,
                home_total_rush_yards: gameRef.home.stats.team.ryds,
                home_total_pens : gameRef.home.stats.team.pen,
                home_total_pen_yards: gameRef.home.stats.team.penyds,
                home_time_of_pos: gameRef.home.stats.team.top,
                home_turnovers: gameRef.home.stats.team.trnovr,
                home_total_punts: gameRef.home.stats.team.pt,
                home_total_punt_yards: gameRef.home.stats.team.ptyds,
                home_total_punt_avg: gameRef.home.stats.team.ptavg,

                away_team_id: results.filter(function(obj) {
                    return obj.team_abbr === gameRef.away.abbr;
                })[0].team_id,
                away_score_final: gameRef.away.score.T,
                away_score_q1: gameRef.away.score['1'],
                away_score_q2: gameRef.away.score['2'],
                away_score_q3: gameRef.away.score['3'],
                away_score_q4: gameRef.away.score['4'],
                away_score_q5: gameRef.away.score['5'],
                away_total_fds: gameRef.away.stats.team.totfd,
                away_total_yds: gameRef.away.stats.team.totyds,
                away_total_pass_yards: gameRef.away.stats.team.pyds,
                away_total_rush_yards: gameRef.away.stats.team.ryds,
                away_total_pens : gameRef.away.stats.team.pen,
                away_total_pen_yards: gameRef.away.stats.team.penyds,
                away_time_of_pos: gameRef.away.stats.team.top,
                away_turnovers: gameRef.away.stats.team.trnovr,
                away_total_punts: gameRef.away.stats.team.pt,
                away_total_punt_yards: gameRef.away.stats.team.ptyds,
                away_total_punt_avg: gameRef.away.stats.team.ptavg
            });

            callback(null, game, 1, connection);
            //gameObj.insert(connection, function (err, result) {
            //    if (err) {
            //        return console.log(err);
            //    }
            //
            //    //Release the connection back to the pool
            //    connection.release();
            //
            //    callback(null, game, result.insertId);
            //});
        });

}

function insertGameDrives(game, gameId, connection, callback) {
    console.log('Inserting Drives for Game');
    var gameRef = game[Object.keys(game)[0]], driveId = 0, gamePlays = [];
    //Extract drives from game JSON
    var driveArr = Object.keys(gameRef.drives).map(function (k) {
        return gameRef.drives[k];
    });
    //Pop last element off the drive array (It's not a drive object)
    driveArr.pop();

    async.eachLimit(driveArr, 1, function (drive, callback) {
        connection.query('SELECT team_id FROM team ' +
            'WHERE team_abbr = ?', [drive.posteam],
            function (err, results) {
                if (err) {
                    return console.log(err);
                }

                var driveObj = new Drive({
                    game_id: gameId,
                    drive_id: driveId,
                    team_id: results[0].team_id,
                    drive_pos_time: drive.postime,
                    drive_total_plays: drive.numplays,
                    drive_first_downs: drive.fds,
                    drive_yards_gained: drive.ydsgained,
                    drive_yards_pen: drive.penyds,
                    drive_result: drive.result,
                    drive_start_time: drive.start.time,
                    drive_start_quarter: drive.start.qtr,
                    drive_start_position: drive.start.yrdln,
                    drive_end_time: drive.end.time,
                    drive_end_quarter: drive.end.qtr,
                    drive_end_position: drive.end.yrdln
                });

                driveId++;

                var playArr = Object.keys(drive.plays).map(function (k) {
                    return drive.plays[k];
                });

                playArr.forEach(function (play) {
                    play.driveID = driveObj.getAttribute('drive_id');
                    play.posteamID = driveObj.getAttribute('team_id');
                });

                gamePlays.push.apply(gamePlays, playArr);

                callback();

                //driveObj.insert(connection, function (err, result) {
                //    if (err) {
                //        return console.log(err);
                //    }
                //
                //    var playArr = Object.keys(drive.plays).map(function (k) {
                //        return drive.plays[k];
                //    });
                //
                //    playArr.forEach(function (play) {
                //        play.driveID = driveObj.getAttribute('drive_id');
                //        play.posteamID = driveObj.getAttribute('team_id');
                //    });
                //
                //    gamePlays.push.apply(gamePlays, playArr);
                //
                //    callback();
                //});
            });
    }, function (err) {
        if (err) {
            return console.log(err);
        }

        callback(null, gameId, gamePlays);
    });
}

function insertGamePlays(gameId, playArr, callback) {
    console.log('Inserting Plays for Game');
    var playId = 1;

    async.eachLimit(playArr, 1, function (play, callback) {
        //console.log(play);
        //callback();
        var playObj = new Play({
            game_id: gameId,
            drive_id: play.driveID,
            play_id: playId,
            team_id: play.posteamID,
            quarter: play.qtr,
            down: play.down,
            start_time: play.time,
            yard_line: play.yrdln,
            yards_to_first_down: play.ydstogo,
            yards_this_drive: play.ydsnet,
            play_description: play.desc,
            play_note: play.note
        });

        if ('0' in play.players) {
            play.players['0'].forEach(function (sequence) {

                //Retrieve statId information from map
                var stat = StatMap.get(sequence.statId);

                if (stat !== 'undefined') {
                    stat.fields.forEach(function (field) {
                        playObj.setAttribute(field, 1);
                    });
                }

                console.log(playObj);
            });
        }

        //console.log(playObj);

        callback();
    }, function (err) {
        if (err) {
            return console.log(err);
        }

        callback(null);
    });
}

function main() {
    if (process.argv.length !== 3) {
        return console.log('Usage: node buildRelationalModel.js ' +
            'path/to/directory');
    }

    async.waterfall([
        async.apply(parseGameData, process.argv[2])
    ], function (err) {
        if (err) {
            return console.log(err);
        }
    });
}

main();