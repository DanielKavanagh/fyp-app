/**
 * Created by Daniel on 01/03/2016.
 */

'use strict';

var mysql = require('mysql');

var AggPlay = function (data) {
    this.aggPlay = data;
};

AggPlay.prototype.getAttribute = function (attribute) {
    return this.aggPlay[attribute];
};

AggPlay.prototype.setAttribute = function (attribute, value) {
    this.aggPlay[attribute] = value;
};

AggPlay.prototype.insert = function (connection, callback) {
    connection.query('INSERT INTO agg_play SET ?', [this.aggPlay],
        function (err, result) {
            if (err) {
                return callback(err);
            }

            callback(null, result);
        });
};

AggPlay.prototype.delete = function (callback) {
    callback();
};

AggPlay.prototype.findByID = function (id, callback) {
    callback();
};

module.exports = AggPlay;
