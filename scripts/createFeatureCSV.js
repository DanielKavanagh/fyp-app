/**
 * Created by Daniel on 17/03/2016.
 *
 * This script extracts feature attributes from the MySQL database.
 * Extraction occurs
 */

'use strict';

var async = require('async');
var mysql = require('mysql');
var pool = require('../models/mysqldb.js');
var fs = require('fs');
var json2csv = require('json2csv');

async.waterfall([
    retrieveGames,
    extractFeatureData_2
], function (err, result) {
    if (err) {
        return console.log(err);
    }

    console.log(result);
    process.exit(0);
});

function retrieveGames(callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            return callback(err);
        }

        console.log('Retrieving games from database...');

        connection.query('SELECT * FROM game ' +
            'WHERE game_year > 2009 and game_year < 2015', function (err, games) {
                if (err) {
                    return callback(err);
                }

                callback(null, games, connection);
            });
    });
}

function extractFeatureData_1(games, connection, callback) {
    var columnNames = ['hthwr', 'htowr', 'hthtor', 'hthtop',
            'atawr', 'atowr', 'atator', 'atatop', 'gw'],
        gameFeatureArray = [];

    async.each(games, function (game, callback) {
        console.log('Extracting game: ' + game.game_id);
        async.parallel({
            hthwr: function (callback) {
                var sql = 'CALL aggregateHomeTeamWinRate(' + game.home_team_id +
                    ', ' + game.game_id + ', 8, @returnValue );' +
                    'SELECT @returnValue';

                connection.query(sql, function (err, result) {
                    if (err) {
                        return callback(err);
                    }

                    callback(null, result[1][0]['@returnValue']);
                });
            },
            htowr: function (callback) {
                var sql = 'CALL aggregateOverallTeamWinRate(' +
                    game.home_team_id + ', ' + game.game_id +
                    ', 16, @returnValue );' + 'SELECT @returnValue';

                connection.query(sql, function (err, result) {
                    if (err) {
                        return callback(err);
                    }

                    callback(null, result[1][0]['@returnValue']);
                });
            },
            hthtor: function (callback) {
                var sql = 'CALL aggregateHomeTurnoverRate(' +
                        game.home_team_id + ', ' + game.game_id +
                        ', 8, @returnValue ); SELECT @returnValue';

                connection.query(sql, function (err, result) {
                    if (err) {
                        return callback(err);
                    }

                    callback(null, result[1][0]['@returnValue']);
                });
            },
            hthtop: function (callback) {
                var sql = 'CALL homeTimeOfPossession(' +
                    game.home_team_id + ', ' + game.game_id +
                    ', 8, @returnValue ); SELECT @returnValue';

                connection.query(sql, function (err, result) {
                    if (err) {
                        return callback(err);
                    }

                    callback(null, result[1][0]['@returnValue']);
                });
            },
            atawr: function (callback) {
                var sql = 'CALL aggregateAwayTeamWinRate(' + game.away_team_id +
                    ', ' + game.game_id + ', 8, @returnValue );' +
                    'SELECT @returnValue';

                connection.query(sql, function (err, result) {
                    if (err) {
                        return callback(err);
                    }

                    callback(null, result[1][0]['@returnValue']);
                });
            },
            atowr: function (callback) {
                var sql = 'CALL aggregateOverallTeamWinRate(' +
                    game.away_team_id + ', ' + game.game_id +
                    ', 16, @returnValue );' + 'SELECT @returnValue';

                connection.query(sql, function (err, result) {
                    if (err) {
                        return callback(err);
                    }

                    callback(null, result[1][0]['@returnValue']);
                });
            },
            atator: function (callback) {
                var sql = 'CALL aggregateAwayTurnoverRate(' +
                    game.away_team_id + ', ' + game.game_id +
                    ', 8, @returnValue ); SELECT @returnValue';

                connection.query(sql, function (err, result) {
                    if (err) {
                        return callback(err);
                    }

                    callback(null, result[1][0]['@returnValue']);
                });
            },
            atatop: function (callback) {
                var sql = 'CALL awayTimeOfPossession(' +
                    game.away_team_id + ', ' + game.game_id +
                    ', 8, @returnValue ); SELECT @returnValue';

                connection.query(sql, function (err, result) {
                    if (err) {
                        return callback(err);
                    }

                    callback(null, result[1][0]['@returnValue']);
                });
            },
            gw: function (callback) {
                if (game.home_score_final > game.away_score_final) {
                    callback(null, 'h');
                } else if (game.home_score_final < game.away_score_final) {
                    callback(null, 'a');
                } else {
                    callback(null, 'd');
                }
            }
        }, function (err, results) {
            if (err) {
                return callback(err);
            }

            console.log('Extracted Features for Game: ' + game.game_id);

            if (results.gw !== 'd') {
                gameFeatureArray.push(results);
            }

            callback(null);

        });
    }, function (err) {
        //Loop has completed
        if (err) {
            return callback(err);
        }

        //Export feature set as CSV
        console.log('Extracted features, exporting to csv');

        json2csv({
            data: gameFeatureArray,
            fields: columnNames
        }, function (err, csv) {
            if (err) {
                return callback(err);
            }

            fs.writeFile('/home/vagrant/fyp/fyp-app/data/features/' +
                'featureTesting_1.csv', csv, function (err) {
                    if (err) {
                        return callback(err);
                    }

                    callback(null, 'Feature File Saved');
                });
        });
    });
}

function extractFeatureData_2(games, connection, callback) {
    var columnNames = ['hthwr', 'htowr', 'atawr', 'atowr', 'gw'],
        gameFeatureArray = [];

    async.each(games, function (game, callback) {
        console.log('Extracting game: ' + game.game_id);
        async.parallel({
            hthwr: function (callback) {
                var sql = 'CALL aggregateHomeTeamWinRate(' + game.home_team_id +
                    ', ' + game.game_id + ', 8, @returnValue );' +
                    'SELECT @returnValue';

                connection.query(sql, function (err, result) {
                    if (err) {
                        return callback(err);
                    }

                    callback(null, result[1][0]['@returnValue']);
                });
            },
            htowr: function (callback) {
                var sql = 'CALL aggregateOverallTeamWinRate(' +
                    game.home_team_id + ', ' + game.game_id +
                    ', 16, @returnValue );' + 'SELECT @returnValue';

                connection.query(sql, function (err, result) {
                    if (err) {
                        return callback(err);
                    }

                    callback(null, result[1][0]['@returnValue']);
                });
            },
            atawr: function (callback) {
                var sql = 'CALL aggregateAwayTeamWinRate(' + game.away_team_id +
                    ', ' + game.game_id + ', 8, @returnValue );' +
                    'SELECT @returnValue';

                connection.query(sql, function (err, result) {
                    if (err) {
                        return callback(err);
                    }

                    callback(null, result[1][0]['@returnValue']);
                });
            },
            atowr: function (callback) {
                var sql = 'CALL aggregateOverallTeamWinRate(' +
                    game.away_team_id + ', ' + game.game_id +
                    ', 16, @returnValue );' + 'SELECT @returnValue';

                connection.query(sql, function (err, result) {
                    if (err) {
                        return callback(err);
                    }

                    callback(null, result[1][0]['@returnValue']);
                });
            },
            gw: function (callback) {
                if (game.home_score_final > game.away_score_final) {
                    callback(null, 'h');
                } else if (game.home_score_final < game.away_score_final) {
                    callback(null, 'a');
                } else {
                    callback(null, 'd');
                }
            }
        }, function (err, results) {
            if (err) {
                return callback(err);
            }

            console.log('Extracted Features for Game: ' + game.game_id);

            if (results.gw !== 'd') {
                gameFeatureArray.push(results);
            }

            callback(null);

        });
    }, function (err) {
        //Loop has completed
        if (err) {
            return callback(err);
        }

        //Export feature set as CSV
        console.log('Extracted features, exporting to csv');

        json2csv({
            data: gameFeatureArray,
            fields: columnNames
        }, function (err, csv) {
            if (err) {
                return callback(err);
            }

            fs.writeFile('/home/vagrant/fyp/fyp-app/data/features/' +
                'featureTraining_2.csv', csv, function (err) {
                if (err) {
                    return callback(err);
                }

                callback(null, 'Feature File Saved');
            });
        });
    });
}