/**
 * Created by Daniel on 21/02/2016.
 */

'use strict';

var mysql = require('mysql');
var pool = require('./mysqldb.js');

var Game = function (data) {
    this.game = data;
};

Game.prototype.getAttribute = function (attribute) {
    return this.game[attribute];
};

Game.prototype.setAttribute = function (attribute, value) {
    this.game[attribute] = value;
};

Game.prototype.insert = function (connection, callback) {
    connection.query('INSERT IGNORE INTO game SET ?', [this.game],
        function (err, result) {
            if (err) {
                return callback(err);
            }

            callback(null, result);
        });
};

Game.prototype.delete = function (callback) {

};

Game.prototype.findByID = function (id, callback) {
};

module.exports = Game;