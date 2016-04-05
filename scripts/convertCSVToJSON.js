/**
 * This command line script converts a CSV file to JSON format.
 * Takes two arguments, the location of the CSV file, and
 * the desired destination of the JSON file
 */

'use strict';

var fs = require('fs');
var Converter = require('csvtojson').Converter;
var converter = new Converter({});

function convertCSVToJSON() {
    if (process.argv.length !== 4) {
        return console.log('node convertCSVToJSON <csv location > <json file destination>');
    }

    converter.fromFile(process.argv[2],
        function (err, result) {
            if (err) {
                return console.log(err);
            }

            fs.writeFile(process.argv[3],
                JSON.stringify(result), function (err) {
                    if (err) {
                        return console.log(err);
                    }

                    console.log('File Converted & Saved');
                });
        });
}

convertCSVToJSON();


