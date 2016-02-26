/**
 * Created by Daniel on 21/02/2016.
 */

'use strict';

var mysql = require('mysql');

var Player = function (data) {
    this.player_id = data.player_id;
    this.gsis = data.gsis;
    this.team_id = data.team_id;
    this.first_name = data.first_name;
    this.last_name = data.last_name;
    this.position = data.position;
    this.dob = data.dob;
    this.weight_lb = data.weight_lb;
    this.height_cm = data.height_cm;
    this.college = data.college;
    this.years_exp = data.years_exp;
    this.uniform_num = data.uniform_num;
    this.status = data.status;
    this.profile_url = data.profile_url;
};

var method = Player.prototype;

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

module.exports = Player;
