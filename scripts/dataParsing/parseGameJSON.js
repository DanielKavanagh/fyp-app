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
var StatMap = require('../../models/statMap.js');

function readWeekDirectory(directory, callback) {
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

function parseGameData(gameArray, callback) {
    async.each(gameArray, function (game, callback) {
        async.waterfall([
            async.apply(insertGame, game)
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

function insertGame(game, callback) {
    var gameRef = game[Object.keys(game)[0]];

    pool.getConnection(function (err, connection) {
        if (err) {
            return console.log(err);
        }

        connection.query('SELECT team_id, team_abbr FROM team '
            + 'WHERE team_abbr = ? OR team_abbr = ?',
            [gameRef.home.abbr, gameRef.away.abbr],
            function (err, results) {
                if (err) {
                    return console.log(err);
                }

                //var gameObj = new Game({
                //    game_eid: parseInt(Object.keys(game)[0], 10),
                //    home_team_id: results.filter(function(obj) {
                //        return obj.team_abbr === gameRef.home.abbr;
                //    })[0].team_id,
                //    home_score_final: gameRef.home.score.T,
                //    home_score_q1: gameRef.home.score['1'],
                //    home_score_q2: gameRef.home.score['2'],
                //    home_score_q3: gameRef.home.score['3'],
                //    home_score_q4: gameRef.home.score['4'],
                //    home_score_q5: gameRef.home.score['5'],
                //    home_total_fds: gameRef.away.stats.team.totfd,
                //    home_total_yds: gameRef.away.stats.team.totyds,
                //    home_total_pass_yards:
                //});
            });


        console.log('I have the connection');
    });
}

function main() {
    if (process.argv.length !== 3) {
        return console.log('Usage: node buildRelationalModel.js ' +
            'path/to/directory');
    }

    async.waterfall([
        async.apply(readWeekDirectory, process.argv[2]),
        parseGameData
    ], function (err) {
        if (err) {
            return console.log(err);
        }
    });
}

main();