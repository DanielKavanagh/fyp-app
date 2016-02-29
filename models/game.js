/**
 * Created by Daniel on 21/02/2016.
 */

'use strict';

var mysql = require('mysql');
var pool = require('./mysqldb.js');

var Game = function (data) {
    if (data) {
        this.game_eid = data.game_eid;

        this.home_team_id = data.home_team_id;
        this.home_score_final = data.home_score_final;
        this.home_score_q1 = data.home_score_q1;
        this.home_score_q2 = data.home_score_q2;
        this.home_score_q3 = data.home_score_q3;
        this.home_score_q4 = data.home_score_q4;
        this.home_score_q5 = data.home_score_q5;
        this.home_total_fds = data.home_total_fds;
        this.home_total_yds = data.home_total_yds;
        this.home_total_pass_yards = data.home_total_pass_yards;
        this.home_total_rush_yards = data.home_total_rush_yards;
        this.home_total_pens = data.home_total_pens;
        this.home_total_pen_yards = data.home_total_pen_yards;
        this.home_time_of_pos = data.home_time_of_pos;
        this.home_turnovers = data.home_turnovers;
        this.home_total_punts = data.home_total_punts;
        this.home_total_punt_yards = data.home_total_punt_yards;
        this.home_total_punt_avg = data.home_total_punt_avg;

        this.away_team_id = data.away_team_id;
        this.away_score_final = data.away_score_final;
        this.away_score_q1 = data.away_score_q1;
        this.away_score_q2 = data.away_score_q2;
        this.away_score_q3 = data.away_score_q3;
        this.away_score_q4 = data.away_score_q4;
        this.away_score_q5 = data.away_score_q5;
        this.away_total_fds = data.away_total_fds;
        this.away_total_yds = data.away_total_yds;
        this.away_total_pass_yards = data.away_total_pass_yards;
        this.away_total_rush_yards = data.away_total_rush_yards;
        this.away_total_pens = data.away_total_pens;
        this.away_total_pen_yards = data.away_total_pen_yards;
        this.away_time_of_pos = data.away_time_of_pos;
        this.away_turnovers = data.away_turnovers;
        this.away_total_punts = data.away_total_punts;
        this.away_total_punt_yards = data.away_total_punt_yards;
        this.away_total_punt_avg = data.away_total_punt_avg;
    }
};

Game.prototype.getAttribute = function (attribute) {
    return this[attribute];
};

Game.prototype.setAttribute = function (attribute, value) {
    this[attribute] = value;
};

Game.prototype.insert = function (connection, callback) {
    connection.query('INSERT INTO game SET ?', [this],
        function (err, result) {
            if (err) {
                return callback(err);
            }

            return callback(null, result);
        });
};

Game.prototype.delete = function (callback) {

}

Game.prototype.findByID = function (id, callback) {

};

module.exports = Game;