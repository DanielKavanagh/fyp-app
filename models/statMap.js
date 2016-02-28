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

module.exports = statMap;