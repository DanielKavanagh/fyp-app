/**
 * Created by Daniel on 25/03/2016.
 */

'use strict';

var fs = require('fs');
var async = require('async');
var pool = require('../db');
var mysql = require('mysql');

function main() {
    if (process.argv.length !== 3) {
        return console.log('Error: Must provide path to json prediction file');
    }

    async.waterfall([
        async.apply(loadPredictionJSON, process.argv[2]),
        insertPredictions
    ], function (err) {
        if (err) {
            return console.log(err);
        }

    });
}

main();

function loadPredictionJSON(filePath, callback) {
    fs.readFile(filePath, function (err, file) {
        if (err) {
            return callback(err);
        }

        callback(null, JSON.parse(file));
    });
}

function insertPredictions(predictionJSON, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            return callback(err);
        }

        async.eachLimit(predictionJSON, 1, function (prediction, loopCallback) {
            async.waterfall([
                function (callback) {
                    connection.query('SELECT game_id FROM game WHERE game_eid = ?', [prediction.geid], function (err, result) {
                        if (err) {
                            return callback(err);
                        }

                        callback(null, result[0].game_id);
                    });
                },
                function (gameID, callback) {
                    console.log('Inserting Prediction');
                    var predictedWinnerID = 0;
                    var actualWinnerID = 0;

                    if (prediction.predicted === '1:h') {
                        predictedWinnerID = prediction.htid;
                    } else {
                        predictedWinnerID = prediction.atid;
                    }

                    if (prediction.actual === '1:h') {
                        actualWinnerID = prediction.htid;
                    } else {
                        actualWinnerID = prediction.atid;
                    }

                    console.log(actualWinnerID);

                    connection.query('INSERT INTO prediction SET ?', {
                        game_id: gameID,
                        predicted_winner_id: predictedWinnerID,
                        actual_winner_id: actualWinnerID,
                        probability: prediction.prediction
                    }, function (err, result) {
                        if (err) {
                            return callback(err);
                        }

                        callback(null);
                    });
                }
            ], function (err) {
                if (err) {
                    return callback(err);
                }

                loopCallback();
            });
        }, function (err) {
            if (err) {
                return callback(err);
            }

            callback(null);
        });
    });

}