/**
 * Created by Daniel on 26/03/2016.
 */

'use strict';

var mysql = require('mysql');
var config = require('./config');

var db_dev = config.db_dev;

var pool = mysql.createPool({
    connectionLimit: 20,
    host: db_dev.host,
    user: db_dev.user,
    password: db_dev.password,
    database: db_dev.database,
    multipleStatements: db_dev.multipleStatements
});

module.exports = pool;