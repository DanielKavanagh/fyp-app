var request = require('request');
var mysql = require('mysql');
var async = require('async');
var parseString = require('xml2js').parseString;
var customParse = require('./parseFunctions.js');

var gameArray = [];

/* Establish Database Connection */

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root123',
    database: 'FYP_DB'
});

connection.connect(function (err) {
    if(err) {
        console.log('Could not connect to DB');
    } else {
        console.log('Connected successfully!');
    }
});

//Get the game center IDs for the week
request('http://www.nfl.com/ajax/scorestrip?season=2015&seasonType=REG&week=1', function (err, response, body) {

    parseString(body, function(err, result) {

        var weekGames = result.ss.gms[0].g;
        getWeekGameData(weekGames);
    });
});


//For each ID get the data for each game in that week
function getWeekGameData(gameIDs) {

    async.each(gameIDs, function(id, callback) {
        request('http://www.nfl.com/liveupdate/game-center/'+ id.$.eid +'/'+ id.$.eid +'_gtd.json', function (err, response, body) {
            insertGame(body, id.$.eid, callback);
        });
    }, function (err) {
        console.log('done');
        //All requests and inserts are done
        var sql = "INSERT INTO Import_Game_Data VALUES ?";
        var query = connection.query(sql, [gameArray], function(err, result) {
            if(err) {
                console.log(err);
            }
        });

        console.log(query.sql);

    });
}

/*Parse the game's data and insert it into the database*/
function insertGame(game, gameID, callback) {

    var gameJSON = JSON.parse(game);
    var homeTeam = gameJSON[gameID].home;
    var awayTeam = gameJSON[gameID].away;

    var dataObject = [];

    dataObject.push(homeTeam.abbr);
    dataObject.push(homeTeam.score["1"]);
    dataObject.push(homeTeam.score["2"]);
    dataObject.push(homeTeam.score["3"]);
    dataObject.push(homeTeam.score["4"]);
    dataObject.push(homeTeam.score["5"]);
    dataObject.push(homeTeam.score["T"]);

    dataObject.push(homeTeam.stats.team.totfd);
    dataObject.push(homeTeam.stats.team.totyds);
    dataObject.push(homeTeam.stats.team.pyds);
    dataObject.push(homeTeam.stats.team.ryds);
    dataObject.push(homeTeam.stats.team.pen);
    dataObject.push(homeTeam.stats.team.penyds);
    dataObject.push(customParse.convertMinSecToSec(homeTeam.stats.team.top));
    dataObject.push(homeTeam.stats.team.trnovr);
    dataObject.push(homeTeam.stats.team.pt);
    dataObject.push(homeTeam.stats.team.ptyds);
    dataObject.push(homeTeam.stats.team.ptavg);

    /*Push Away Team Data*/
    dataObject.push(awayTeam.abbr);
    dataObject.push(awayTeam.score["1"]);
    dataObject.push(awayTeam.score["2"]);
    dataObject.push(awayTeam.score["3"]);
    dataObject.push(awayTeam.score["4"]);
    dataObject.push(awayTeam.score["5"]);
    dataObject.push(awayTeam.score["T"]);

    dataObject.push(awayTeam.stats.team.totfd);
    dataObject.push(awayTeam.stats.team.totyds);
    dataObject.push(awayTeam.stats.team.pyds);
    dataObject.push(awayTeam.stats.team.ryds);
    dataObject.push(awayTeam.stats.team.pen);
    dataObject.push(awayTeam.stats.team.penyds);
    dataObject.push(customParse.convertMinSecToSec(awayTeam.stats.team.top));
    dataObject.push(awayTeam.stats.team.trnovr);
    dataObject.push(awayTeam.stats.team.pt);
    dataObject.push(awayTeam.stats.team.ptyds);
    dataObject.push(awayTeam.stats.team.ptavg);

    gameArray.push(dataObject);

    console.log('callback');
    callback();
}