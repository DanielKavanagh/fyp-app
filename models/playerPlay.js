/**
 * Created by Daniel on 01/03/2016.
 */

'use strict';

var mysql = require('mysql');

var PlayerPlay = function (data) {
    this.playerPlay = data;
};

var PlayerPlayColumns = [
    'game_id', 'drive_id', 'play_id',

    'passing_att', 'passing_cmp', 'passing_cmp_air_yds',
    'passing_cmp_tot_yds', 'passing_incmp', 'passing_incmp_air_yds',
    'passing_int', 'passing_sack', 'passing_sack_yds', 'passing_td',
    'passing_twopt_att', 'passing_twopt_cmp', 'passing_twopt_fail',

    'rushing_att', 'rushing_yds', 'rushing_loss', 'rushing_loss_yds',
    'rushing_td', 'rushing_twopt_att', 'rushing_two_point_cmp',
    'rushing_two_point_fail',

    'receiving_rec', 'receiving_target', 'receiving_yac_yds',
    'receiving_tot_yds', 'receiving_twopt_att', 'receiving_twopt_cmp',
    'receiving_twopt_fail',

    'defence_tkl_ast', 'defence_force_fum', 'defence_fum_rec',
    'defence_fum_rec_tds', 'defence_fum_rec_yds', 'defence_int',
    'defence_int_tds', 'defence_int_yds', 'defence_misc_tds',
    'defence_misc_yds', 'defence_pass_def', 'defence_punt_blk',
    'defence_qb_hit', 'defence_fg_blk', 'defence_safety', 'defence_sack',
    'defence_sack_yds', 'defence_tkl', 'defence_tkl_loss',
    'defence_tkl_loss_yds', 'defence_tkl_primary', 'defence_xp_block',

    'fumble_forced', 'fumble_lost', 'fumble_unforced', 'fumble_oob',
    'fumble_rec', 'fumble_rec_tds', 'fumble_rec_yds', 'fumble_total',

    'kicking_all_yds', 'kicking_downed', 'kicking_fg_att', 'kicking_fg_blk',
    'kicking_fg_blk_rec', 'kicking_fg_blk_tds',
    'kicking_fg_cmp', 'kicking_fg_cmp_yds', 'kicking_fg_miss',
    'kicking_fg_miss_yds', 'kicking_inside_20', 'kicking_rec',
    'kicking_rec_tds', 'kicking_total', 'kicking_touchback', 'kicking_xp_att',
    'kicking_xp_blk', 'kicking_xp_cmp', 'kicking_xp_miss', 'kicking_yds',

    'kickret_fair_catch', 'kickret_oob', 'kickret_return', 'kickret_tds',
    'kickret_touchback', 'kickret_yds',

    'punting_blk', 'punting_inside_20', 'punting_total', 'punting_touchback',
    'punting_yds',

    'puntret_faircatch', 'puntret_downed', 'puntret_oob', 'puntret_tds',
    'puntret_total', 'puntret_touchback', 'puntret_yds'
];



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

PlayerPlay.prototype.columnExistsInTable = function (column) {
    if (PlayerPlayColumns.indexOf(column) >= 0) {
        return true;
    }

    return false;
}

module.exports = PlayerPlay;
