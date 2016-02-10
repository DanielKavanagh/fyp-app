var exports = module.exports = {};

exports.convertMinSecToSec = function minSecToSec(data) {
    var time = data.split(':');

    if (time.length === 2) {
        return (parseInt(time[0]) * 60) + parseInt(time[1]);
    }

    throw 'Incorrect Format Exception';
};