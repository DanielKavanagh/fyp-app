/**
 * Created by Daniel on 02/01/2016.
 * */

'use strict';

/* Import dependencies */
var async = require('async');
var mysql = require('mysql');
var fs = require('fs');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root123',
    database: 'FYP_DB'
});

connection.connect(function (err) {
    if (err) {
        console.log('Could not connect to DB');
    } else {
        console.log('Connected successfully!');
    }
});

/*Read files in the directory specified and return the json files as objects*/
function readDirectory(directory, readDirectoryCallback) {
    var gameObjectArray = [];
    fs.readdir(directory, function (err, files) {
        if (err) {
            return console.log(err);
        }

        async.each(files, function (file, readCallback) {
            fs.readFile(directory + file, 'utf-8', function (err, content) {
                if (err) {
                    return console.log(err);
                }

                gameObjectArray.push(JSON.parse(content));
                readCallback();
            });
        }, function (err) {
            if (err) {
                console.log(err);
            } else {
                readDirectoryCallback(null, gameObjectArray);
            }
        });
    });
}

function createGameObject(gameObj) {
    var obj = {}, gameRef = gameObj[Object.keys(gameObj)[0]];

    obj.eid = Object.keys(gameObj)[0];

    async.series([
        function(callback) {
            connection.query('SELECT team_id, team_abbr FROM team WHERE `team_abbr` = ?', [gameRef.home.abbr],
                function (err, results, fields) {
                    if (err) {
                        return console.log(err);
                    }

                    if (results.length !== 1) {
                        console.log(results);
                        return console.log('Error: Zero (or more than one) results');
                    }
                    obj.home_team_id = results[0].team_id;
                    obj.home_score_final        = gameRef.home.score.T;
                    obj.home_score_q1           = gameRef.home.score['1'];
                    obj.home_score_q2           = gameRef.home.score['2'];
                    obj.home_score_q3           = gameRef.home.score['3'];
                    obj.home_score_q4           = gameRef.home.score['4'];
                    obj.home_score_q5           = gameRef.home.score['5'];
                    obj.home_total_fds          = gameRef.home.stats.team.totfd;
                    obj.home_total_yds          = gameRef.home.stats.team.totyds;
                    obj.home_total_pass_yards   = gameRef.home.stats.team.pyds;
                    obj.home_total_rush_yards   = gameRef.home.stats.team.ryds;
                    obj.home_total_pens         = gameRef.home.stats.team.pen;
                    obj.home_total_pen_yards    = gameRef.home.stats.team.penyds;
                    obj.home_time_of_pos        = gameRef.home.stats.team.top;
                    obj.home_turnovers          = gameRef.home.stats.team.trnovr;
                    obj.home_total_punts        = gameRef.home.stats.team.pt;
                    obj.home_total_punt_yards   = gameRef.home.stats.team.ptyds;
                    obj.home_total_punt_avg     = gameRef.home.stats.team.ptavg;

                    callback(null);
                });
        },
        function(callback) {
            connection.query('SELECT team_id, team_abbr FROM team WHERE `team_abbr` = ?', [gameRef.away.abbr],
                function (err, results, fields) {
                    if (err) {
                        return console.log(err);
                    }

                    if (results.length !== 1) {
                        console.log(results);
                        return console.log('Error: Zero (or more than one) results');
                    }

                    obj.away_team_id = results[0].team_id;
                    obj.away_score_final        = gameRef.away.score.T;
                    obj.away_score_q1           = gameRef.away.score['1'];
                    obj.away_score_q2           = gameRef.away.score['2'];
                    obj.away_score_q3           = gameRef.away.score['3'];
                    obj.away_score_q4           = gameRef.away.score['4'];
                    obj.away_score_q5           = gameRef.away.score['5'];
                    obj.away_total_fds          = gameRef.away.stats.team.totfd;
                    obj.away_total_yds          = gameRef.away.stats.team.totyds;
                    obj.away_total_pass_yards   = gameRef.away.stats.team.pyds;
                    obj.away_total_rush_yards   = gameRef.away.stats.team.ryds;
                    obj.away_total_pens         = gameRef.away.stats.team.pen;
                    obj.away_total_pen_yards    = gameRef.away.stats.team.penyds;
                    obj.away_time_of_pos        = gameRef.away.stats.team.top;
                    obj.away_turnovers          = gameRef.away.stats.team.trnovr;
                    obj.away_total_punts        = gameRef.away.stats.team.pt;
                    obj.away_total_punt_yards   = gameRef.away.stats.team.ptyds;
                    obj.away_total_punt_avg     = gameRef.away.stats.team.ptavg;

                    callback(null);
                });
        }
    ],
    function(err) {
        if(err) {
            console.log(err);
        }

        console.log(obj);
    })





}

function insertGames(gameObjArr, insertGameCallback) {
    async.each(gameObjArr, function(game, callback) {
        connection.beginTransaction(function (err) {
            if (err) {
                return console.log(err);
            }


            var gameObj = createGameObject(game);

            connection.query('INSERT INTO game VALUES ?', gameObj,
                function (err, result) {
                    if (err) {
                        return connection.rollback(function () {
                            throw err;
                        });
                    }

                    //console.log('Inserted: ' + result);
                }
            );

            connection.commit(function (err) {
                if (err) {
                    return console.log(err);
                }
                callback();
            });
        });
    }, function (err) {
        if (err) {
            return console.log(err);
        }
        insertGameCallback();
    });
}

function main() {
    if (process.argv.length !== 3) {
        return console.log('Usage: node buildRelationalModel.js ' +
            'path/to/directory');
    }

    async.waterfall([
        async.apply(readDirectory, process.argv[2]),
        insertGames
    ], function (err) {
        if (err) {
            console.log(err);
        } else {
            /*Close DB connection*/
            connection.end(function (err) {
                if (err) {
                    return console.log(err);
                }

                return console.log('Database Connection Closed...');
            });
        }
    });
}

main();