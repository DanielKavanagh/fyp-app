var template;

$(document).ready(function () {

    registerHelpers();

    var predictionTemplate = $('#prediction').html();
    template = Handlebars.compile(predictionTemplate);

    getAvailableSeasons();
    getInitialPredictions();
    initialiseEvents();

});

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

    });
}

function getInitialPredictions() {
    var week = $('#prediction-data').data('week');
    var season = $('#prediction-data').data('season');

    getPredictionData(season, week);
}

function initialiseEvents() {
    $('.week-button').on('click', weekButtonClicked);
}

function seasonButtonClicked() {
    getPredictionData($(this).text(), $('#prediction-data').data('week'));
}

function weekButtonClicked() {
    if (!$(this).hasClass('active')) {
        var season = $('#prediction-data').data('season');
        var week = $(this).text();
        
        updateWeekButton($(this));
        getPredictionData(season, week);
    }
}

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
            url: '/api/predictions/' + season + '-' + week,
            method: 'GET',
            dataType: 'json',
            timeout: 5000
        })
        .done(function (data) {
            if (data.length === 0) {
                showError('No data was found');
            } else {
                updatePredictionHeader(season, week);
                updatePredictionTable(data);
                updateChart(data);
            }
        })
        .fail(function (jqxhr, textStatus) {
            console.log(textStatus);
        });
}

function showError(error) {
    $('.prediction-list').empty();
    $('.prediction-list').append('<div class="text-center">' +
            '<p>' + error + '</p>' +
            '<p>Please try selecting another week</p>' +
        '</div>')
}

function updatePredictionHeader(season, week) {
    $('.prediction-subheader').text(season + ', Week ' + week);
}

function updatePredictionTable(predictions) {
    $('.prediction-list').empty();
    $.each(predictions, function (index, prediction) {
        prediction.probability = (prediction.probability).toFixed(2);
        $('.prediction-list').append (template (prediction));
    });
}

function updateChart(data) {

}

function updateWeekButton(clickedButton) {
    $('.week-button.active').removeClass('active');
    clickedButton.addClass('active');
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
