/**
 * Created by Daniel on 21/02/2016.
 */

'use strict';

var mysql = require('mysql');

var Team = function (data) {
    this.team_abbr = data.abbr;
    this.team_name = data.name;
    this.team_city = data.city;
    this.team_division = data.division;
    this.team_conference = data.conference;
};

var method = Team.prototype;

method.getAttribute = function (attribute) {
    return this[attribute];
};

method.setAttribute = function (attribute, value) {
    this[attribute] = value;
};

method.save = function (callback) {

};

method.delete = function (callback) {

};

method.findByID = function (id, callback) {

};
