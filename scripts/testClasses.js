/**
 * Created by Daniel on 24/02/2016.
 */

var Player = require('../models/player.js');
var AggPlay = require('../models/aggPlay.js');
var StatMap = require('../models/statMap.js');

var aggPlay = new AggPlay(null);

console.log(aggPlay.columnExistsInTable('test'));