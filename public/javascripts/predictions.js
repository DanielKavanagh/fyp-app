var template;

$(document).ready(function () {
    registerHelpers();

    var predictionTemplate = $('#prediction').html();
    template = Handlebars.compile(predictionTemplate);

    getAvailableSeasons();
    getInitialPredictions();
    initialiseEvents();

});

/**
 * Retrieves an array of the available seaons and appends them to the season
 * dropdown
 * */
function getAvailableSeasons() {
    $.ajax({
        url: '/api/predictions/seasons',
        method: 'GET',
        dataType: 'json',
        timeout: 5000
    })
    .done(function (data) {
        $.each(data, function (index, season) {
            $('.season-dropdown').append('<li id="'+ season.season +'"><a href="#">' + season.season + '</a></li>');
            $('#' + season.season).on('click', seasonButtonClicked);
        });
    })
    .fail(function (jqxhr, textStatus) {
        showError({
            status: jqxhr.status,
            message: jqxhr.statusText
        });
    });
}

/**
 * Called on page load. Retrieves the weeks predictions
 * */
function getInitialPredictions() {
    var week = $('#prediction-data').data('week');
    var season = $('#prediction-data').data('season');

    getPredictionData(season, week);
}

/**
 * Initialises the button events
 * */
function initialiseEvents() {
    $('.week-button').on('click', weekButtonClicked);
}

/**
 * Function that triggers when a season is selected from the season dropdown.
 * */
function seasonButtonClicked() {
    getPredictionData($(this).text(), $('#prediction-data').data('week'));
}

/**
 * Function that triggers when a week button is clicked
 * */
function weekButtonClicked() {
    if (!$(this).hasClass('active')) {
        var season = $('#prediction-data').data('season');
        var week = $(this).text();
        
        updateWeekButton($(this));
        getPredictionData(season, week);
    }
}

/**
 * Retrieves the prediction data for a specific season and week
 *
 * @param {integer} season - The requested season
 * @param {integer} week - The requested week
 * */
function getPredictionData(season, week) {
    $('.prediction-list').empty();
    $('.prediction-list').append('<div class="text-center loading-div">' +
            '<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>' +
            '<p>Loading...</p>' +
        '</div>');

    $('#prediction-data').data('week', week);
    $('#prediction-data').data('season', season);

    console.log('Getting Data');
    $.ajax({
            url: '/api/predictions/'+ season +'-' + week,
            method: 'GET',
            dataType: 'json',
            timeout: 5000
        })
        .done(function (data) {
            if (data.length === 0) {
                showError({
                    status: '',
                    message: 'Returned an Empty Data Set, Try Selecting Another Week'
                });
            } else {
                updatePredictionHeader(season, week);
                updatePredictionTable(data);
                updateChart(data);
            }
        })
        .fail(function (jqxhr, textStatus) {
            showError({
                status: jqxhr.status,
                message: jqxhr.statusText
            });
        });
}

/**
 * Function that shows an error on the screen
 * @param {object} error - The error object to display
 * */
function showError(error) {
    $('.prediction-list').empty();

    if(error.status === 500) {
        $('.prediction-list').append('<div class="text-center">' +
            '<p>' + error.status + '</p>' +
            '<p>' + error.message + '</p>' +
            '<p><a href="https://github.com/DanielKavanagh/fyp-app/issues">Report this issue</a></p>' +
            '</div>');
    } else {
        $('.prediction-list').append('<div class="text-center">' +
            '<p>' + error.status + '</p>' +
            '<p>' + error.message + '</p>' +
            '</div>');
    }
}

/**
 * Function that updates the header which shows the current season and week
 *
 * @param {integer} season - The current season
 * @param {integer} week - The current week
 * */
function updatePredictionHeader(season, week) {
    $('.prediction-subheader').text(season + ', Week ' + week);
}

/**
 * Updates the prediction list with a set of predictions
 *
 * @param {array} predictions - An array of prediction objects
 * */
function updatePredictionTable(predictions) {
    $('.prediction-list').empty();
    $.each(predictions, function (index, prediction) {
        prediction.probability = (prediction.probability).toFixed(2);
        $('.prediction-list').append (template (prediction));
    });
}

/**
 * Updates the current active week button
 *
 * @param {object} clickedButton - The button that was clicked by the user
 * */
function updateWeekButton(clickedButton) {
    $('.week-button.active').removeClass('active');
    clickedButton.addClass('active');
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
