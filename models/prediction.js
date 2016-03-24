/**
 * Created by Daniel on 23/03/2016.
 */

'use strict';

var fs = require('fs');
var mysql = require('mysql');
var pool = require('../middleware/dbPool');

var predictions2015 = require('../data/predictions/json/' +
    'predictions_2015.json');

var predictionYearsArr = [];

predictionYearsArr.push(predictions2015);


exports.getLatest = function (number, callback) {
    var arrLength = predictions2015.length,
        responseArr = predictions2015.slice(arrLength - number, arrLength);

    return callback(null, responseArr);
};

exports.getAll = function (callback) {
    return callback(null, predictionYearsArr);
};

exports.getSeason = function (season, callback) {
    predictionYearsArr.forEach(function (year, index) {
        if (year[0].gseason === season) {
            return callback(null, predictionYearsArr[index]);
        }
    });

    return callback('Cannot find season predictions');
};

exports.getByWeekSeason = function (season, week, callback) {
    var responseArr = [];

    predictionYearsArr.forEach(function (year, index) {
        if (year[0].gseason === season) {
            year.forEach(function (prediction, index) {
                if (prediction.gweek === week) {
                    responseArr.push(prediction);
                }
            });
        }
    });

    if (responseArr.length <= 0) {
        return callback('Not Found');
    }

    return callback(null, responseArr);
};

