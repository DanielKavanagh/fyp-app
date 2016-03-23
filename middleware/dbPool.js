/**
 * Created by Daniel on 23/03/2016.
 */

'use strict';

var mysql = require('mysql');
var config = require('../config');
var dbDev = config.db_dev;

var pool = mysql.createPool({
    connectionLimit: 20,
    host: dbDev.host,
    user: dbDev.user,
    password: dbDev.password,
    database: dbDev.database,
    multipleStatements: dbDev.multipleStatements
});

module.exports = pool;