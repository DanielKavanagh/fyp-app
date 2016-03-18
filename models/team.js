/**
 * Created by Daniel on 21/02/2016.
 */

'use strict';

var mysql = require('mysql');

var Team = function (data) {
    this.team = data;
};

Team.prototype.getAttribute = function (attribute) {
    return this[attribute];
};

Team.prototype.setAttribute = function (attribute, value) {
    this[attribute] = value;
};

Team.prototype.insert = function (callback) {

};

Team.prototype.delete = function (callback) {

};

Team.prototype.findByID = function (id, callback) {

};
