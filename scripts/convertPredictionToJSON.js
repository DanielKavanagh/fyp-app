/**
 * Created by Daniel on 23/03/2016.
 */

'use strict';

var fs = require('fs');
var Converter = require('csvtojson').Converter;
var converter = new Converter({});

function convertCSVToJSON() {
    if (process.argv.length !== 4) {
        return console.log('Must supply path to csv file and json file destination');
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


