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
var baseUrl = 'http://www.nfl.com',
    gsisProfileUrl = 'http://www.nfl.com/players/profile?id=',
    rosterUrl = 'http://www.nfl.com/players/profile?id=';

function loadPlayerJSON(callback) {
    fs.readFile('/home/vagrant/fyp/fyp-app/jsonData/players.json', 'utf-8',
        function (err, content) {
            if (err) {
                return console.log(err);
            }

            callback(null, JSON.parse(content));
        });
}

function getPlayerProfileIDs(players, callback) {

    //request({
    //    url: 'http://www.nfl.com/players/profile?id=00-0027023',
    //    method: 'HEAD'
    //}, function (err, resp) {
    //    if (err) {
    //        console.log(err);
    //    }
    //
    //    console.log(resp.location);
    //});
    async.eachLimit(Object.keys(players), 1, function (player, callback) {
        console.log('Doing Request');
        if (!(players[player].hasOwnProperty('player_profile'))) {
            var reqURL = gsisProfileUrl + player;

            request({
                url: reqURL,
                method: 'HEAD'
            }, function (err, resp) {
                if (err) {
                    return console.log(err);
                }

                players[player].player_profile_url = baseUrl
                    + resp.client._httpMessage.path;

                console.log(players[player]);

                console.log('Waiting');
                setTimeout(function () {
                    callback();
                }, 750);

            });
        }
    }, function (err) {
        if (err) {
            return console.log(err);
        }

        callback(null, players);
    });
}

function savePlayerJSON(players, callback) {
    fs.writeFile('/home/vagrant/fyp/fyp-app/jsonData/players.json', players,
        { flags: 'wx' }, function (err) {
            if (err) {
                return console.log(err);
            }

            callback(null);
        });
}

function checkTeamRosters(players, callback) {
    callback(null, players);
}



function main() {

    async.waterfall([
        loadPlayerJSON,
        getPlayerProfileIDs,
        savePlayerJSON,
        checkTeamRosters
    ], function (err) {
        if (err) {
            return console.log(err);
        }
    });
}

main();
