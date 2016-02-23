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
var Game = require('../../models/game.js');

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
        var gameRef = game[Object.keys(game)[0]];

        //TODO: Insert data into game table
        var game = new Game(game);

        //Convert the drive objects into an array which can be iterated over
        var driveArr = Object.keys(gameRef.drives).map(function (k) {
            return gameRef.drives[k];
        });

        driveArr.pop();

        async.each(driveArr, function (drive, driveCallback) {
            //TODO: Insert data into the drive table

            var playArr = Object.keys(drive.plays).map(function (k) {
                return drive.plays[k];
            });

            async.each(playArr, function (play, playCallback) {
                //TODO: Insert data into play table
                console.log(play.desc);
            },
                function (err) {
                    if (err) {
                        return console.log(err);
                    }

                    driveCallback();
                });
        },
            function (err) {
                if (err) {
                    return console.log(err);
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