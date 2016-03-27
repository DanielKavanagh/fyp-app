var template;

$(document).ready(function () {

    registerHelpers();

    var predictionTemplate = $('#prediction').html();
    template = Handlebars.compile(predictionTemplate);

    $('.prediction-list').append (template ({
        predicted_winner_id: 2,
        actual_winner_id: 3,
        home_team_id: 3,
        home_team_abbr: 'BAL',
        home_team_name: 'Denver Broncos',
        away_team_id: 2,
        away_team_abbr: 'PHI',
        away_team_name: 'Philadelphia Eagles'
    }));

    getInitialPredictions();
    initialiseEvents();

});

function getInitialPredictions() {
    var week = $('#prediction-data').data('week');
    var season = $('#prediction-data').data('season');

    getPredictionData(season, week);
}

function initialiseEvents() {
    $('.week-button').on('click', weekButtonClicked);
}

function weekButtonClicked() {
    if (!$(this).hasClass('active')) {
        var season = $('#prediction-data').data('season');
        var week = $(this).text();
        
        updateWeekButton($(this));
        updatePredictionHeader(season, week);
        getPredictionData(season, week);
    }
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
        $('.prediction-list').append (template (prediction));
    });
}

function updateWeekButton(clickedButton) {
    $('.week-button.active').removeClass('active');
    clickedButton.addClass('active');
    $('#prediction-data').data('week', $(clickedButton).text());
}

function updatePredictionHeader(season, week) {
    $('.prediction-subheader').text(season + ', Week ' + week);
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
