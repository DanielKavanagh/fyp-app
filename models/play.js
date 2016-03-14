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
    connection.query('INSERT INTO play SET ?', {
        game_id: this.play.game_id,
        drive_id: this.play.drive_id,
        play_id: this.play.play_id,
        team_id: this.play.team_id,
        quarter: this.play.quarter,
        down: this.play.down,
        start_time: this.play.start_time,
        yard_line: this.play.yard_line,
        yards_to_first_down: this.play.yards_to_first_down,
        yards_this_drive: this.play.yards_this_drive,
        play_description: this.play.play_description,
        play_note: this.play.play_note,
        first_down: this.play.first_down || 0,
        rushing_first_down: this.play.rushing_first_down || 0,
        passing_first_down: this.play.passing_first_down || 0,
        penalty: this.play.penalty || 0,
        penalty_first_down: this.play.penalty_first_down || 0,
        third_down_att: this.play.third_down_att || 0,
        third_down_cmp: this.play.third_down_cmp || 0,
        fourth_down_att: this.play.fourth_down_att || 0,
        fourth_down_cmp: this.play.fourth_down_cmp || 0,
        timeout: this.play.timeout || 0,
        xp_aborted: this.play.xp_aborted || 0
    },
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
