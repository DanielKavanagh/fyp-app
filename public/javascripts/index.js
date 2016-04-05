var template;

$(document).ready(function () {
    registerHelpers();

    /*Compiles the Handlebars template for the predictions*/
    var predictionTemplate = $('#prediction').html();
    template = Handlebars.compile(predictionTemplate);

    getInitialPredictions();
});

/**
 * Called on page load. Retrieves the weeks predictions
 * */
function getInitialPredictions() {
    var week = $('#prediction-data').data('week');
    var season = $('#prediction-data').data('season');

    getPredictionData(season, week);
}

/**
 * Retrieves the prediction data for a specific season and week
 *
 * @param {integer} season - The requested season
 * @param {integer} week - The requested week
 * */
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

/**
 * Updates the prediction list with a set of predictions
 *
 * @param {array} predictions - An array of prediction objects
 * */
function updatePredictionTable(predictions) {
    $('.prediction-list').empty();

    $.each(predictions, function (index, prediction) {
        if (prediction.predicted_winner_id === prediction.actual_winner_id) {
            prediction.probability = (prediction.probability).toFixed(2);
            $('.prediction-list').append (template (prediction));

            /*Breaks from the loop so only the first four predictions are
             * displayed on the page*/
            if (index === 4) {
                return false;
            }
        }
    });
}

/**
 * Registers the additional helper functions for Handlebars
 * */
function registerHelpers() {

    /*Creates a helper which checks if two given values are equal*/
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
