/*Require Dependencies*/
var request = require('request');
var async = require('async');
var mysql = require('mysql');
var parseString = require('xml2js').parseString;

var gameCollection = [];

/*Setup DB Connection*/

/*Async Request Queue */
var gameIDQueue = async.queue(function(task, callback) {
	request(task, function(error, response, body) {
		if(!error && response.statusCode == 200) {
			var xml = body;

			parseString(xml, function(error, result) {
				var weekGames = result.ss.gms[0].g;
				weekGames.forEach(function(element, index){
					jsonStreamQueue.push(element.$.eid);

				});
			});
		}

		callback();
	});
});

for(var i=0; i <=16; i++) {
	gameIDQueue.push('http://www.nfl.com/ajax/scorestrip?season='+ '2015' +'&seasonType=REG&week=' + (i+1));
}

var jsonStreamQueue = async.queue(function(task, callback) {
	request('http://www.nfl.com/liveupdate/game-center/'+ task +'/'+ task +'_gtd.json', function(error, response, body) {
		var jsonData = JSON.parse(body);

		console.log(jsonData[task].home.abbr + ' - ' + jsonData[task].away.abbr);
		callback();
	})
});
