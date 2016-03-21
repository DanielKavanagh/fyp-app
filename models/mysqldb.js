/**
 * Created by Daniel on 25/02/2016.
 */
var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit: 20,
    host: 'localhost',
    user: 'root',
    password: 'root123',
    database: 'FYP_DB',
    multipleStatements: true
});

module.exports = pool;