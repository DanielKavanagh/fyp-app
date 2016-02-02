/**
 * Created by Daniel on 01/02/2016.
 * What: Command line script which retrieves the JSON Data for an NFL season (Regular season only).
 * How: Retrieves the game-center identifiers (EIDs) for all weeks in a season. These EIDs are then used to query the
 *      play-by-play JSON stream. The json files are then saved, to be entered into the database at a later time.
 */

/* Import dependencies */
var request = require('request');
var async = require('async');
var fs = require('fs');
var parseString = require('xml2js').parseString;

function main() {
    if(process.argv.length != 3) {
        console.log('A season must be specified (2009 - 2015)');
        return;
    }

    async.waterfall([
        async.apply(getEIDs, process.argv[2])
    ], function (err, result) {
        if (err) {
            console.log('Error: ' + err);
        } else {
            console.log(result);
        }
    });
}

function getEIDs(season, getEIDCallback) {
    var weekIndex = 1;
    var eidArray = [];

    /*Loop over each week in the season*/
    async.whilst(
        function () { return weekIndex < 2; },
        function (weekCallback) {
            request('http://www.nfl.com/ajax/scorestrip?season='+ season +'&seasonType=REG&week=' + weekIndex, function (err, response, body) {
                    if(err) {
                        console.log('HTTP Error: ' + err);
                        return;
                    }

                    response.resume();

                    /*Add game EIDs to eidArray*/
                    parseString(body, function(err, result) {
                        async.each(result.ss.gms[0].g, function (id, callback) {
                            eidArray.push(id.$.eid);
                            callback();
                        });
                    });



                    weekIndex++;
                    weekCallback(null, weekIndex);
                });
        },
        function (err, loopResult) {
            /* Whilst has completed at this point */
            if (err) {
                console.log('Error: ' + err);
            } else {
                console.log(loopResult);
            }

            getEIDCallback(null, 'Done!');
        }
    );
}

main();