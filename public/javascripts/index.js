var template;

$(document).ready(function () {

    registerHelpers();

    var predictionTemplate = $('#prediction').html();
    template = Handlebars.compile(predictionTemplate);

    getInitialPredictions();
});

function getInitialPredictions() {
    var week = $('#prediction-data').data('week');
    var season = $('#prediction-data').data('season');

    getPredictionData(season, week);
}

function getPredictionData(season, week) {
    console.log('Getting Data');
    $.ajax({
            url: '/api/predictions/' + season + '-' + week,
            method: 'GET',
            dataType: 'json',
            timeout: 5000
        })
        .done(function (data) {
            updatePredictionTable(data);
        })
        .fail(function (jqxhr, textStatus) {
            console.log(textStatus);
        });
}

function updatePredictionTable(predictions) {
    $('.prediction-list').empty();
    $.each(predictions, function (index, prediction) {
        if (prediction.predicted_winner_id === prediction.actual_winner_id) {
            prediction.probability = (prediction.probability).toFixed(2);
            $('.prediction-list').append (template (prediction));

            if (index === 4) {
                return false;
            }
        }

    });
}

function registerHelpers() {
    Handlebars.registerHelper('equal', function (lvalue, rvalue, options) {
        if (arguments.length < 3) {
            throw new Error("Handlebars Helper equal needs 2 parameters");
        }

        if (lvalue != rvalue) {
            return options.inverse(this);
        } else {
            return options.fn(this);
        }
    });
}
