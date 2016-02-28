/**
 * Created by Daniel on 28/02/2016.
 */

'use strict';

var statMap = new Map();

statMap.set(2, {
    category: 'punting',
    fields: ['punting_blk'],
    yards: '',
    description: 'Punt blocked (offense)'
});

statMap.set(3, {
    category: 'team',
    fields: ['first_down', 'rushing_first_down'],
    yards: '',
    description: '1st down (rushing)'
});

statMap.set(4, {
    category: 'team',
    fields: ['first_down', 'passing_first_down'],
    yards: '',
    description: '1st down (passing)'
});

statMap.set(5, {
    category: 'team',
    fields: ['first_down', 'penalty_first_down'],
    yards: '',
    description: '1st down (penalty)'
});

statMap.set(6, {
    category: 'team',
    fields: ['third_down_att', 'third_down_cmp'],
    yards: '',
    description: '3rd down attempt (successful)'
});

statMap.set(7, {
    category: 'team',
    fields: ['third_down_att'],
    yards: '',
    description: '3rd down attempt (unsuccessful)'
});

statMap.set(8, {
    category: 'team',
    fields: ['fourth_down_att', 'fourth_down_cmp'],
    yards: '',
    description: '4th down attempt (successful)'
});

statMap.set(9, {
    category: 'team',
    fields: ['fourth_down_att'],
    yards: '',
    description: '4th down attempt (unsuccessful)'
});

statMap.set(10, {
    category: 'rushing',
    fields: ['rushing_att'],
    yards: 'rushing_yds',
    description: 'Rushing attempt with yards'
});

statMap.set(11, {
    category: 'rushing',
    fields: ['rushing_att', 'rushing_td'],
    yards: 'rushing_yds',
    description: 'Rushing attempt with yards, resulting in a touchdown'
});

statMap.set(12, {
    category: 'rushing',
    fields: [],
    yards: 'rushing_yds',
    description: 'Rushing yards, with no attempt ' +
        '(i.e. After a lateral beyond the line of scrimmage)'
});

statMap.set(13, {
    category: 'rushing',
    fields: ['rushing_td'],
    yards: 'rushing_yds',
    description: 'Rushing yards, with no attempt, resulting in a touchdown'
});

statMap.set(14, {
    category: 'passing',
    fields: ['passing_att', 'passing_incmp'],
    yards: '',
    description: 'Passing attempt, incomplete'
});

statMap.set(15, {
    category: 'passing',
    fields: ['passing_att', 'passing_cmp'],
    yards: 'passing_cmp_tot_yds',
    description: 'Passing attempt, complete (air yards and YAC)'
});

statMap.set(16, {
    category: 'passing',
    fields: ['passing_att', 'passing_cmp', 'passing_td'],
    yards: 'passing_cmp_tot_yds',
    description: 'Passing attempt and completion, resulting in a touchdown'
});

statMap.set(16, {
    category: 'passing',
    fields: ['passing_att', 'passing_cmp', 'passing_td'],
    yards: 'passing_cmp_tot_yds',
    description: 'Passing attempt and completion, resulting in a touchdown'
});

statMap.set(19, {
    category: 'passing',
    fields: ['passing_att', 'passing_incmp', 'passing_int'],
    yards: '',
    description: 'Passing attempt resulting in an interception'
});

statMap.set(20, {
    category: 'passing',
    fields: ['passing_sack'],
    yards: 'passing_sack_yds',
    description: 'Passing attempt resulting in a sack, with yards lost'
});

statMap.set(21, {
    category: 'receiving',
    fields: ['receiving_rec'],
    yards: 'receiving_tot_yds',
    description: 'Pass reception with yards'
});

statMap.set(22, {
    category: 'receiving',
    fields: ['receiving_rec', 'receiving_tds'],
    yards: 'receiving_tot_yds',
    description: 'Pass reception with yards, resulting in a touchdown'
});

statMap.set(23, {
    category: 'receiving',
    fields: [],
    yards: 'receiving_tot_yds',
    description: 'Receiving yards, no reception ' +
        '(i.e. After a lateral beyond the line of scrimmage)'
});

statMap.set(24, {
    category: 'receiving',
    fields: ['receiving_tds'],
    yards: 'receiving_tot_yds',
    description: 'Receiving yards with no reception, resulting in a touchdown'
});

statMap.set(25, {
    category: 'defence',
    fields: ['defence_int'],
    yards: 'defence_int_yds',
    description: 'Interception and yards'
});

statMap.set(26, {
    category: 'defence',
    fields: ['defence_int', 'defence_int_tds'],
    yards: 'defence_int_yds',
    description: 'Interception and yards, resulting in a touchdown'
});

statMap.set(27, {
    category: 'defence',
    fields: [],
    yards: 'defence_int_yds',
    description: 'Interception yards, no interception (i.e. after a lateral)'
});

statMap.set(28, {
    category: 'defence',
    fields: ['defence_int_tds'],
    yards: 'defence_int_yds',
    description: 'Interception yards, no interception, resulting in a touchdown'
});

statMap.set(29, {
    category: 'punting',
    fields: ['punting_total'],
    yards: 'punting_yds',
    description: 'Punting yards, not used if a touchback, ' +
        'received in endzone, or blocked'
});

statMap.set(30, {
    category: 'punting',
    fields: ['punting_inside_20'],
    yards: '',
    description: 'Punt, where the return ended within the opponent\'s 20yd line'
});

statMap.set(31, {
    category: 'punting',
    fields: ['punting_total'],
    yards: 'punting_yds',
    description: 'Punt into endzone, returned'
});

statMap.set(32, {
    category: 'punting',
    fields: ['punting_total', 'punting_touchback'],
    yards: 'punting_yds',
    description: 'Punt, resulting in a touchback'
});

statMap.set(33, {
    category: 'puntret',
    fields: ['puntret_total'],
    yards: 'puntret_yds',
    description: 'Punt return and yards'
});

statMap.set(34, {
    category: 'puntret',
    fields: ['puntret_total', 'puntret_tds'],
    yards: 'puntret_yds',
    description: 'Punt return and yards, resulting in a touchdown'
});

statMap.set(35, {
    category: 'puntret',
    fields: [],
    yards: 'puntret_yds',
    description: 'Punt return yards, no return ' +
        '(i.e. after the ball is lateraled to another player)'
});

statMap.set(36, {
    category: 'puntret',
    fields: ['puntret_tds'],
    yards: 'puntret_yds',
    description: 'Punt return yards, no return, resulting in a touchdown' +
        '(i.e. after the ball is lateraled to another player)'
});

statMap.set(37, {
    category: 'team',
    fields: ['puntret_oob'],
    yards: '',
    description: 'Punt went out of bounds (no return)'
});

statMap.set(38, {
    category: 'team',
    fields: ['puntret_downed'],
    yards: '',
    description: 'Punt return downed by kicking team (no return)'
});

statMap.set(39, {
    category: 'puntret',
    fields: ['puntret_faircatch'],
    yards: '',
    description: 'Punt resulting in a faircatch'
});

statMap.set(40, {
    category: 'team',
    fields: ['puntret_touchback'],
    yards: 'puntret_yds',
    description: 'Punt resulting in a touchback (no return)'
});

module.exports = statMap;