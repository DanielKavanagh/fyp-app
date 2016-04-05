/**
 * Contains the different configurations for the development and prod databases.
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
        host: 'fyp-db.cz7l4bwnbihx.eu-west-1.rds.amazonaws.com',
        user: 'appuser',
        password: process.env.PROD_DB_PASS,
        database: 'FYP_DB',
        multipleStatements: true
    }
};