var express = require('express');
var router = express.Router();

/**
 * GET route for the about page
 * */
router.get('/', function(req, res, next) {
    res.render('about', { title: 'About'});
});

module.exports = router;