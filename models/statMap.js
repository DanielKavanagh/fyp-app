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

statMap.set(41, {
    category: 'kicking',
    fields: ['kicking_total'],
    yards: 'kicking_yds',
    description: 'Kickoff and yards'
});

statMap.set(42, {
    category: 'kicking',
    fields: ['kicking_inside_20'],
    yards: '',
    description: 'Kickoff where the return ended within the opponents ' +
        '20 yard line (does not count toward kicking yards )'
});

statMap.set(43, {
    category: 'kicking',
    fields: ['kicking_total'],
    yards: 'kicking_yds',
    description: 'Kickoff and yards (received in endzone and returned))'
});

statMap.set(44, {
    category: 'kicking',
    fields: ['kicking_total', 'kicking_touchback'],
    yards: 'kicking_yds',
    description: 'Kickoff and yards resulting in a touchback'
});

statMap.set(45, {
    category: 'kickret',
    fields: ['kickret_return'],
    yards: 'kickret_yds',
    description: 'Kickoff return and yards'
});

statMap.set(46, {
    category: 'kickret',
    fields: ['kickret_return', 'kickret_tds'],
    yards: 'kickret_yds',
    description: 'Kickoff return and yards, resulting in a touchdown'
});

statMap.set(47, {
    category: 'kickret',
    fields: [],
    yards: 'kickret_yds',
    description: 'Kickoff return and yards, with no return ' +
        '(i.e. after the ball is lateraled to another player)'
});

statMap.set(48, {
    category: 'kickret',
    fields: ['kickret_tds'],
    yards: 'kickret_yds',
    description: 'Kickoff return and yards (no return), resulting ' +
        'in a touchdown'
});

statMap.set(49, {
    category: 'team',
    fields: ['kickret_oob'],
    yards: '',
    description: 'Kickoff that went out of bounds'
});

statMap.set(50, {
    category: 'kickret',
    fields: ['kickret_fair_catch'],
    yards: '',
    description: 'Kickoff resulting in a fair catch'
});

statMap.set(51, {
    category: 'team',
    fields: ['kickret_touchback'],
    yards: '',
    description: 'Kickoff return, resulting in a touchdown'
});

statMap.set(52, {
    category: 'fumbles',
    fields: ['fumble_total', 'fumble_forced'],
    yards: '',
    description: 'Ball was fumbled (forced by another player)'
});

statMap.set(53, {
    category: 'fumbles',
    fields: ['fumble_total', 'fumble_unforced'],
    yards: '',
    description: 'Ball was fumbled (not forced by another player)'
});

statMap.set(54, {
    category: 'fumbles',
    fields: ['fumble_oob'],
    yards: '',
    description: 'Ball was fumbled (ball went out of bounds)'
});

statMap.set(55, {
    category: 'fumbles',
    fields: ['fumble_rec'],
    yards: 'fumble_rec_yds',
    description: 'Fumble and yards lost/gained by a player who ' +
        'recovered a fumble by their own team'
});

statMap.set(56, {
    category: 'fumbles',
    fields: ['fumble_rec', 'fumble_rec_tds'],
    yards: 'fumble_rec_yds',
    description: 'Fumble and yards lost/gained by a player who ' +
        'recovered a fumble by their own team (resulting in a touchdown)'
});

statMap.set(57, {
    category: 'fumbles',
    fields: [],
    yards: 'fumble_rec_yds',
    description: 'Yards gained by a player who received a lateral ' +
        'after the ball was recovered by the fumbling team'
});

statMap.set(58, {
    category: 'fumbles',
    fields: ['fumble_rec_tds'],
    yards: 'fumble_rec_yds',
    description: 'Yards gained by a player who received a lateral ' +
        'after the ball was recovered by the fumbling team ' +
        '(resulting in a touchdown)'
});

statMap.set(59, {
    category: 'defence',
    fields: ['defence_fum_rec'],
    yards: 'defence_fum_rec_yds',
    description: 'Yards gained/lost by the player who recovered a ' +
        'fumble by the opposing team'
});

statMap.set(60, {
    category: 'defence',
    fields: ['defence_fum_rec', 'defence_fum_rec_tds'],
    yards: 'defence_fum_rec_yds',
    description: 'Yards gained/lost by the player who recovered a ' +
        'fumble by the opposing team (resulting in a touchdown)'
});

statMap.set(61, {
    category: 'defence',
    fields: [],
    yards: 'defence_fum_rec_yds',
    description: 'Fumble recovery by opposing team, with yards, no recovery' +
        '(i.e. the player receives a lateral)'
});


statMap.set(62, {
    category: 'defence',
    fields: ['defence_fum_rec_tds'],
    yards: 'defence_fum_rec_yds',
    description: 'Fumble recovery by opposing team, with yards, no recovery' +
        '(i.e. the player receives a lateral) resulting in a touchdown'
});

statMap.set(63, {
    category: 'defence',
    fields: [],
    yards: 'defence_misc_yds',
    description: 'Defence yards that doesn\'t fit into any other category'
});

statMap.set(64, {
    category: 'defence',
    fields: ['defence_misc_tds'],
    yards: 'defence_misc_yds',
    description: 'Miscellaneous defence yards, resulting in a touchdown'
});

statMap.set(68, {
    category: 'team',
    fields: ['timeout'],
    yards: '',
    description: 'Team took a timeout'
});

statMap.set(69, {
    category: 'kicking',
    fields: ['kicking_fg_att', 'kicking_fg_miss'],
    yards: 'kicking_fg_miss_yds',
    description: 'Field goal miss with yards'
});

statMap.set(70, {
    category: 'kicking',
    fields: ['kicking_fg_att', 'kicking_fg_cmp'],
    yards: 'kicking_fg_cmp_yds',
    description: 'Field goal completion with yards'
});

statMap.set(71, {
    category: 'kicking',
    fields: ['kicking_fg_att', 'kicking_fg_miss', 'kicking_fg_blk'],
    yards: 'kicking_fg_miss_yds',
    description: 'Field goal with attempted yards that was blocked'
});

statMap.set(72, {
    category: 'kicking',
    fields: ['kicking_xp_att', 'kicking_xp_cmp'],
    yards: '',
    description: 'Extra point attempt success'
});

statMap.set(73, {
    category: 'kicking',
    fields: ['kicking_xp_att', 'kicking_xp_miss'],
    yards: '',
    description: 'Extra point attempt miss'
});

statMap.set(74, {
    category: 'kicking',
    fields: ['kicking_xp_att', 'kicking_xp_miss', 'kicking_xp_blk'],
    yards: '',
    description: 'Extra point blocked'
});

module.exports = statMap;