/**
 * Created by Daniel on 26/03/2016.
 */

'use strict';

var mysql = require('mysql');
var config = require('./config');

var db_dev = config.db_dev;
var db_prod = config.db_prod;

if (process.env.NODE_ENV === 'production') {
    var pool = mysql.createPool({
        connectionLimit: 50,
        host: db_prod.host,
        user: db_prod.user,
        password: db_prod.password,
        database: db_prod.database,
        multipleStatements: db_prod.multipleStatements
    });
} else {
    var pool = mysql.createPool({
        connectionLimit: 20,
        host: db_dev.host,
        user: db_dev.user,
        password: db_dev.password,
        database: db_dev.database,
        multipleStatements: db_dev.multipleStatements
    });
}



module.exports = pool;