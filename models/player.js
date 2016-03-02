/**
 * Created by Daniel on 21/02/2016.
 */

'use strict';

var mysql = require('mysql');

var Player = function (data) {
    this.player = data;
};

Player.prototype.getAttribute = function (attribute) {
    return this.player[attribute];
};

Player.prototype.setAttribute = function (attribute, value) {
    this.player[attribute] = value;
};

Player.prototype.insert = function (connection, callback) {
    connection.query('INSERT INTO player SET ?', [this.player],
        function (err, result) {
            if (err) {
                return callback(err);
            }

            callback(null, result);
        });
};

Player.prototype.delete = function (connection, callback) {

}

Player.prototype.findByID = function (id, connection, callback) {

};

module.exports = Player;
