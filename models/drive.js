/**
 * Created by Daniel on 21/02/2016.
 */

'use strict';

var mysql = require('mysql');

var Drive = function (data) {
    this.drive = data;
};

Drive.prototype.getAttribute = function (attribute) {
    return this.drive[attribute];
};

Drive.prototype.setAttribute = function (attribute, value) {
    this.drive[attribute] = value;
};

Drive.prototype.insert = function (connection, callback) {
    connection.query('INSERT INTO drive SET ?', [this.drive],
        function (err, result) {
            if (err) {
                return callback(err);
            }

            callback(null, result);
        });
};

Drive.prototype.delete = function (callback) {

};

Drive.prototype.findByID = function (id, callback) {

};

module.exports = Drive;
