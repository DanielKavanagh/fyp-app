/**
 * Created by Daniel on 23/03/2016.
 */

'use strict';

var fs = require('fs');
var mysql = require('mysql');
var pool = require('../middleware/dbPool');

exports.getLatest = function (number, callback) {
    fs.readFile('../data/predictions/predictions_2015.json',
        function (err, data) {
            if (err) {
                return callback(err);
            }

            callback(null, data);
        });
};
