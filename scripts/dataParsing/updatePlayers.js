/**
 * Created by Daniel on 03/03/2016.
 */

'use strict';

//Script dependencies
var request = require('request');
var async = require('async');
var mysql = require('mysql');
var cheerio = require('cheerio');
var mkdirp = require('mkdirp');
var fs = require('fs');

var Player = require('../../models/player.js');
var pool = require('../../models/mysqldb.js');

//Global variables
var gsisProfileUrl = 'http://www.nfl.com/players/profile?id=',
    rosterUrl = 'http://www.nfl.com/players/profile?id=';

function getPlayerGSIS(path, callback) {
    var playerArray = [];

}

function main() {

    async.waterfall([
        async.apply(getPlayerGSIS, process.argv[2])
    ], function (err) {
        if (err) {
            return console.log(err);
        }
    });
}

main();
