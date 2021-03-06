/**
 * Created by Daniel on 02/01/2016.
 * What: Command line script which retrieves the JSON Data for an NFL season (Regular season only).
 * How: Retrieves the game-center identifiers (EIDs) for all weeks in a season. These EIDs are then used to query the
 *      play-by-play JSON stream. The json files are then saved, to be entered into the database at a later time.
 */

'use strict';

/* Import dependencies */
var request = require('request');
var async = require('async');
var fs = require('fs');
var mkdirp = require('mkdirp');
var parseString = require('xml2js').parseString;

function getEIDs(season, getEIDCallback) {
    var weekIndex = 0, seasonArray = [];

    /*Loop over each week in the season*/
    async.whilst(
        function () {
            return weekIndex < 17;
        },

        function (weekCallback) {
            var eidArray = [];
            weekIndex++;

            request('http://www.nfl.com/ajax/scorestrip?season=' + season + '&seasonType=REG&week=' + weekIndex,
                function (err, response, body) {
                    if (err) {
                        console.log('HTTP Error: ' + err);
                        return;
                    }

                    /*Add game EIDs to eidArray*/
                    parseString(body, function (err, result) {
                        if (err) {
                            return console.log(err);
                        }

                        async.each(result.ss.gms[0].g, function (id, callback) {
                            eidArray.push({
                                eid: id.$.eid,
                                time: id.$.t,
                                type: id.$.gt
                            });

                            callback();
                        });
                    });

                    var weekObj = {
                        week: weekIndex,
                        games: eidArray
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

function readPlayerJson(seasonArray, season, callback) {
    fs.readFile('/home/vagrant/fyp/fyp-app/data/players/players.json', 'utf-8', function (err, content) {
        if (err) {
            return console.log(err);
        }

        callback(null, seasonArray, season, JSON.parse(content));
    });
}

/*Get the game data for each eid*/
function getGameData(seasonArray, season, playersObj, getGameCallback) {
    async.each(seasonArray, function (obj, outerCallback) {
        async.eachLimit(obj.games, 1, function (weekObj, innerCallback) {
            console.log('Getting:\t' + weekObj.eid);

            request('http://www.nfl.com/liveupdate/game-center/' + weekObj.eid + '/' + weekObj.eid + '_gtd.json', function (err, resp, body) {
                if (!err) {
                    console.log('Got:\t\t' + weekObj.eid);
                    var jsonObj = JSON.parse(body),
                        gameRef = jsonObj[Object.keys(jsonObj)[0]];

                    //console.log('Getting Home Team Stats');
                    for (var stat in gameRef.home.stats) {
                        if (stat !== 'team') {
                            var statObj = gameRef.home.stats[stat];

                            for (var prop in statObj) {
                                if (!(prop in playersObj)) {
                                    console.log('Found New Player: ' + prop);
                                    playersObj[prop] = {
                                        name: statObj[prop].name
                                    };
                                }
                            }
                        }
                    }

                    //console.log('Getting Away Team Stats');
                    for (var stat in gameRef.away.stats) {
                        if (stat !== 'team') {
                            var statObj = gameRef.away.stats[stat];

                            for (var prop in statObj) {
                                if (!(prop in playersObj)) {
                                    console.log('Found New Player: ' + prop);
                                    playersObj[prop] = {
                                        name: statObj[prop].name
                                    };
                                }
                            }
                        }
                    }

                    for (var drive in gameRef.drives) {
                        if (drive !== 'crntdrive') {
                            for (var play in gameRef.drives[drive].plays) {
                                //console.log(gameRef.drives[drive].plays[play]);
                                var playPlayers = Object.keys(gameRef.drives[drive].plays[play].players);

                                if (playPlayers.length !== 0) {
                                    playPlayers.forEach(function (gsis) {
                                        if (gsis !== '0') {
                                            if(!(gsis in playersObj)) {
                                                //Player not in mapping

                                                console.log(gsis + ' not in mapping');
                                                playersObj[gsis] = {
                                                    gsis_name: gameRef.drives[drive].plays[play].players[gsis][0].playerName
                                                };

                                                console.log(playersObj[gsis]);
                                            }


                                        }
                                    });
                                }
                            }
                        }
                    }

                    gameRef.season = season;
                    gameRef.week = obj.week;
                    gameRef.time = weekObj.time;
                    gameRef.gameType = weekObj.type;

                    fs.writeFile('/home/vagrant/fyp/fyp-app/data/games/' + weekObj.eid, JSON.stringify(jsonObj), { flags: 'wx' }, function (err) {
                        if (err) {
                            return console.log(err);
                        }

                        setTimeout(function () {
                            innerCallback();
                        }, 1500);
                    });
                }
            });
        }, function (err) {
            if (err) {
                console.log(err);
            } else {
                outerCallback();
            }
        });

    }, function (err) {
        if (err) {
            console.log(err);
        }

        console.log('Writing Player Changes to File');

        fs.writeFile('/home/vagrant/fyp/fyp-app/data/players/players.json', JSON.stringify(playersObj), { flags: 'wx' }, function (err) {
            if (err) {
                return console.log(err);
            }

            getGameCallback();
        });
    });
}

function main() {
    if (process.argv.length !== 3) {
        return console.log('A season must be specified (2009 - 2015)');
    }

    async.waterfall([
        async.apply(getEIDs, process.argv[2]),
        readPlayerJson,
        getGameData
    ], function (err) {
        if (err) {
            console.log('Error: ' + err);
        } else {
            console.log('Finished!');
        }
    });
}

main();
