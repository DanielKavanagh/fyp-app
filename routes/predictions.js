var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('predictions', {
        initialSeason: '2015',
        initialWeek: '17'
    });
});

module.exports = router;