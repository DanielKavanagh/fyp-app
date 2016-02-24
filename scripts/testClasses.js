/**
 * Created by Daniel on 24/02/2016.
 */

var Player = require('../models/player.js');

var player = new Player(
    {
        player_id: 1,
        gsis: 738733,
        team_id: 26,

        first_name: 'Daniel',
        last_name: 'Kavanagh',
        position: 'QB',
        dob: '02/22/1994',
        weight_lb: 180,
        height_cm: 185,
        college: 'DIT',
        years_exp: 0,
        uniform_num: 7,
        status: 'ACT',
        profile_url: 'Sup'
    }
);

console.log(player);

player.setAttribute('profile_url', undefined);

console.log(player);