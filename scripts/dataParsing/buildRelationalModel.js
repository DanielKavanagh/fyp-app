/** Created by Daniel on 04/1/2016
 *
 * */

/* Import dependencies */
var async = require('async');
var mysql = require('mysql');
var fs = require('fs');

function main() {
    if(process.argv.length != 3) {

    }

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

    async.waterfall([
        async.apply(readDirectory, process.argv[2]),
        insertGames
    ], function (err) {
        if (err) {
            console.log(err);
        } else {
            /*Close DB connection*/
            connection.end(function(err) {
                if(err) {
                    return console.log(err);
                }

                return console.log('Database Connection Closed...');
            });
        }
    });
}

/*Read each file in the directory specified and return the json files as objects*/
function readDirectory(directory, readDirectoryCallback) {
    var gameObjectArray = [];
    fs.readdir(directory, function(err, files) {
        if(err) {
            return console.log(err);
        }

        async.each(files, function(file, readCallback) {
            fs.readFile(directory + file, 'utf-8', function(err, content) {
                if(err) {
                    return console.log(err);
                }

                gameObjectArray.push(JSON.parse(content));
                readCallback();
            });
        }, function(err) {
            if(err) {
                console.log(err);
            } else {
                readDirectoryCallback(null, gameObjectArray);
            }
        });
    })
}

/** Takes an array of json game objects, and inserts them into the database *
 *
 * @param gameObjArr
 */
function insertGames(gameObjArr, insertGameCallback) {

}

main();