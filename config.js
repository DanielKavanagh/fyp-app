/**
 * Created by Daniel on 26/03/2016.
 */
module.exports = {
    db_dev: {
        host: 'localhost',
        user: 'root',
        password: 'root123',
        database: 'FYP_DB',
        multipleStatements: true
    },

    db_prod: {
        host: 'fyp-rds.cz7l4bwnbihx.eu-west-1.rds.amazonaws.com',
        user: 'appuser',
        password: '*293962D1A8BEBEBE5F3ADF59F6530940F2CF2273',
        database: 'FYP_DB',
        multipleStatements: true
    }
};