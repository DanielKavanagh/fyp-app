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
var path = require('path');
var parseString = require('xml2js').parseString;

function main() {
    if(process.argv.length != 3) {
        console.log('A season must be specified (2009 - 2015)');
        return;
    }

    async.waterfall([
        async.apply(getEIDs, process.argv[2]),
        getGameData
    ], function (err, result) {
        if (err) {
            console.log('Error: ' + err);
        } else {
            console.log(result);
        }
    });
}

function getEIDs(season, getEIDCallback) {
    var weekIndex = 0;
    var seasonArray = [];

    /*Loop over each week in the season*/
    async.whilst(
        function () { return weekIndex < 4; },
        function (weekCallback) {
            var eidArray = [];
            weekIndex++;

            request('http://www.nfl.com/ajax/scorestrip?season='+ season +'&seasonType=REG&week=' + weekIndex, function (err, response, body) {
                    if(err) {
                        console.log('HTTP Error: ' + err);
                        return;
                    }

                    /*Add game EIDs to eidArray*/
                    parseString(body, function(err, result) {
                        async.each(result.ss.gms[0].g, function (id, callback) {

                            eidArray.push(id.$.eid);
                            callback();
                        });
                    });

                    var weekObj = {
                        "week": weekIndex,
                        "eids": eidArray
                    };

                    seasonArray.push(weekObj);

                    response.resume();

                    weekCallback(null, weekIndex);
                });
        },
        function (err) {
            /* Whilst has completed at this point */
            if (err) {
                console.log('Error: ' + err);
                return;
            }

            getEIDCallback(null, seasonArray, season);
        }
    );
}

/*Get the game data for each eid*/
function getGameData(seasonArray, season, getGameCallback) {
    //console.log(seasonArray);
    async.each(seasonArray, function(obj, outerCallback) {
        console.log(obj.week);
        async.eachLimit(obj.eids, 1, function(weekObj, innerCallback) {
            request('http://www.nfl.com/liveupdate/game-center/'+ weekObj +'/'+ weekObj +'_gtd.json', function(err, resp, body) {
                if(!err && resp.statusCode == 200) {
                    var jsonObj = JSON.parse(body);
                    fs.writeFile(path.join(__dirname, '/data/' + season + '/week_' + obj.week + '/' + Object.keys(jsonObj)[0]), body, {flags: 'wx'}, function(err) {
                        if(err) {
                            return console.log('Error: ' + err);
                        }


                    });
                }

                innerCallback();

            });

        }, function(err) {
            if(err) {
                console.log(err);
            } else {
                outerCallback();
            }

        });

    });
}

main();