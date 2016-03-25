'use strict';

var express = require('express');
var app = express();
var router = express.Router();

var port = process.env.PORT || 3000;

app.use(require('./controllers/index'));
app.use(require('./controllers/prediction'));

app.use(require('./controllers/api/predictions'));
app.use(require('./controllers/api/teams'));


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

// development error handler
// will print stacktrace


// production error handler
// no stacktraces leaked to user


app.use('/', router);

if (app.get('env') === 'development') {

    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });

}

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'jade');
app.listen(port);
console.log('Server Started: ' + port);
