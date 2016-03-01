/**
 * Created by Daniel on 01/03/2016.
 */

'use strict';

var mysql = require('mysql');

var PlayerPlay = function (data) {
    this.playerPlay = data;
};

PlayerPlay.prototype.getAttribute = function (attribute) {
    return this.playerPlay[attribute];
};

PlayerPlay.prototype.setAttribute = function (attribute, value) {
    this.playerPlay[attribute] = value;
};

PlayerPlay.prototype.insert = function (connection, callback) {
    connection.query('INSERT INTO player_play SET ?', [this.playerPlay],
        function (err, result) {
            if (err) {
                return callback(err);
            }

            callback(null, result);
        });
};

PlayerPlay.prototype.delete = function (callback) {
    callback();
};

PlayerPlay.prototype.findByID = function (id, callback) {
    callback();
};

module.exports = PlayerPlay;
