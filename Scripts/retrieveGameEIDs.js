/* Retrieves the NFL Game Center EIDs and write them to a file */

var request = require('request');
var mysql = require('mysql');
var async = require('async');
var fs = require('fs');
var parseString = require('xml2js').parseString;

var idArray = [];
var seasons = ['2009', '2010', '2011', '2012', '2013', '2014', '2015'];
var weekIndex;

begin();

function begin() {
    if(process.argv.length != 3) {
        console.log('Usage: nodejs retrieveGameEIDs.js [season]');
    }

    getSeasonWeeks(process.argv[2]);
}

function getSeasonWeeks(season) {

    var weekIndex = 1;

    async.whilst(

        function() {
            return weekIndex < 18;
        },

        function(callback) {

            request('http://www.nfl.com/ajax/scorestrip?season='+ season +'&seasonType=REG&week=' + weekIndex, function(err, response, body) {
                console.log('Got Week');
            });

            weekIndex++;
            callback(null, weekIndex);

        },

        function(error) {
            if(error) {
                console.log(error);
            }
        }
    )
}

