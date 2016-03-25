/**
 * Created by Daniel on 24/03/2016.
 */

'use strict';

// $(document).ready(function () {
//     populatePredictionTable();
//
//     alert('Hi');
// });
//
// function populatePredictionTable() {
//     var predictionContent = '';
//
//     $.getJSON('/api/predictions/latest/8', function (predictions) {
//         $.each(predictions, function(index, prediction) {
//             predictionContent +=
//                 '<div class="panel panel-default row"' +
//                     '<div class="panel-body">' +
//                         '<div class="col-xs-2">' +
//                             '<img class="prediction-team-img" src="/img/'+ prediction.htabbr +'-min.png">' +
//                         '</div>' +
//                         '<div class="col-xs-3">' +
//                             '<p>'+ prediction.htabbr +'</p>' +
//                         '</div>' +
//                         '<div class="col-xs-2">' +
//                             '<h4>@</h4>' +
//                         '</div>' +
//                         '<div class="col-xs-3">' +
//
//                         '</div>' +
//                         '<div class="col-xs-2">' +
//                             '<img class="prediction-team-img" src="/img/'+ prediction.atabbr +'-min.png">' +
//                         '</div>' +
//                     '</div>' +
//                 '</div>';
//         });
//
//         $('#index-predictions').html(predictionContent);
//     });
// }