var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Home',
        initialSeason: '2015',
        initialWeek: '17'
    });
});

module.exports = router;

