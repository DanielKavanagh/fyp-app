/**
 * Created by Daniel on 02/01/2016.
 * */

'use strict';

/* Import dependencies */
var async = require('async');
var mysql = require('mysql');
var fs = require('fs');
var Game = require('../../models/game.js');
var pool = require('../../models/mysqldb.js');

//var connection = mysql.createConnection({
//    host: 'localhost',
//    user: 'root',
//    password: 'root123',
//    database: 'FYP_DB'
//});
//
//connection.connect(function (err) {
//    if (err) {
//        return console.log('Connection Error:\n\n' + err);
//    }
//
//    console.log('Connected to DB');
//    main();
//});

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

function insertGameData(gameArray, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            return console.log(err);
        }

        async.each(gameArray, function (game, gameCallback) {
            var gameRef = game[Object.keys(game)[0]];
            connection.query('SELECT team_id, team_abbr FROM team ' +
                'WHERE team_abbr = ? OR team_abbr = ?',
                [gameRef.home.abbr, gameRef.away.abbr],
                function (err, results) {
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
                        home_total_pens: gameRef.home.stats.team.pen,
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
                        away_total_pens: gameRef.away.stats.team.pen,
                        away_total_pen_yards: gameRef.away.stats.team.penyds,
                        away_time_of_pos: gameRef.away.stats.team.top,
                        away_turnovers: gameRef.away.stats.team.trnovr,
                        away_total_punts: gameRef.away.stats.team.pt,
                        away_total_punt_yards: gameRef.away.stats.team.ptyds,
                        away_total_punt_avg: gameRef.away.stats.team.ptavg
                    });

                    gameObj.insert(connection, function (err, result) {
                        if (err) {
                            return console.log(err);
                        }

                        //console.log(result);
                    });

                    gameCallback();
                });
        }, function (err, results) {
            if (err) {
                return console.log(err);
            }
            console.log('hello');
            callback(null);
        });
    });
}

function insertDriveData() {

}

function insertPlayData() {

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
        });
}

main();