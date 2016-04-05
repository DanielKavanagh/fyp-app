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
        host: '',
        user: '',
        password: '',
        database: 'FYP_DB',
        multipleStatements: true
    }
};