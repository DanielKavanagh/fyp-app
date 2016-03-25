/**
 * Created by Daniel on 24/03/2016.
 */

'use strict';

var express = require('express');
var router = express.Router();

var team = require('../../models/team');

router.route('/api/teams/')
    .get(function (req, res) {
        team.getAllTeams(function (err, result) {
            if (err) {
                return res.status(500).send({
                    error: err
                });
            }

            res.json(result);
        });
    });

router.route('/api/teams/:abbr')
    .get(function (req, res) {
        var abbr = req.params.abbr;

        if (abbr.length > 4) {
            return res.status(400).send({
                error: 'Parameter must be less the 4 characters'
            });
        }

        team.findByAbbr(abbr, function (err, result) {
            if (err) {
                return res.status(404).send({
                    error: 'Could not find team'
                });
            }

            res.json(result);
        });
    });

module.exports = router;