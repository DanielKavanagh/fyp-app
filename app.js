'use strict';

var express = require('express');
var app = express();
var router = express.Router();

var port = process.env.PORT || 3000;

app.use(require('./controllers/api/predictions'));

// router.route('/')
//     .get(function (req, res) {
//         res.render('index', {
//             'predictionList': [
//                 {
//                     'season': 2015,
//                     'week': 16
//                 }
//             ],
//             'user': {
//                 'username': 'dkavanagh',
//                 'email': 'danielkavanaghwex@gmail.com'
//             }
//         });
//     });
//
// router.route('/players')
//     .get(function (req, res) {
//         res.json({message: 'hello'});
//     });
//
// router.route('/players/:id')
//     .get(function (req, res) {
//
//     });
//
// router.route('/predictions/:id')
//     .get(function (req, res) {
//
//     });


app.use('/', router);
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'jade');
app.listen(port);
console.log('Server Started: ' + port);
