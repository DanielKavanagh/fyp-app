/**
 * Created by Daniel on 21/02/2016.
 */

'use strict';

var mysql = require('mysql');

var Play = function (data) {
    this.play = data;
};

Play.prototype.getAttribute = function (attribute) {
    return this.play[attribute];
};

Play.prototype.setAttribute = function (attribute, value) {
    this.play[attribute] = value;
};

Play.prototype.insert = function (connection, callback) {
    connection.query('INSERT INTO play SET ?', [this.play],
        function (err, result) {
            if (err) {
                return callback(err);
            }

            callback(null, result);
        });
};

Play.prototype.delete = function (callback) {
    callback();
};

Play.prototype.findByID = function (id, callback) {
    callback();
};

module.exports = Play;
