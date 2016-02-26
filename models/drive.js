/**
 * Created by Daniel on 21/02/2016.
 */

'use strict';

var mysql = require('mysql');

var Drive = function (data) {

};

var method = Drive.prototype;

method.getAttribute = function (attribute) {
    return this[attribute];
};

method.setAttribute = function (attribute, value) {
    this[attribute] = value;
};

method.save = function (callback) {

};

method.delete = function (callback) {

}

method.findByID = function (id, callback) {

};

module.exports = Drive;
