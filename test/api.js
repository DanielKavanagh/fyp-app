/**
 * Created by Daniel on 28/03/2016.
 */

var expect = require('chai').expect;
var should = require('chai').should();
var supertest = require('supertest');
var api = supertest('http://localhost:3000/api');

describe('predictions', function () {
    describe('get-all', function () {
        it('should return a 200', function (done) {
            api.get('/predictions/')
                .expect(200, done);
        });

        it('should return json', function (done) {
            api.get('/predictions/')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/, done);
        });

        it('should return an array', function (done) {
            api.get('/predictions/')
                .expect(200)
                .end(function (err, res) {
                    expect(res.body).to.be.an('array');
                    done();
                });
        });

        it('should not be an empty array', function (done) {
            api.get('/predictions')
                .end(function (err, res) {
                    expect(res.body).to.satisfy(isNotEmpty);
                    done();
                    function isNotEmpty(array) {
                        if (array.length !== 0) {
                            return true;
                        }
                    }
                });
        });

        it('should have these object keys', function (done) {
            api.get('/predictions')
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    expect(res.body).to.satisfy(hasKeys);
                    done();

                    function hasKeys(array) {
                        return array.every(function (item) {
                            return expect(item).to.have.property('prediction_id') &&
                                expect(item).to.have.property('game_id') &&
                                expect(item).to.have.property('predicted_winner_id') &&
                                expect(item).to.have.property('actual_winner_id') &&
                                expect(item).to.have.property('probability') &&
                                expect(item).to.have.property('home_team_id') &&
                                expect(item).to.have.property('home_team_abbr') &&
                                expect(item).to.have.property('home_team_name') &&
                                expect(item).to.have.property('away_team_id') &&
                                expect(item).to.have.property('away_team_abbr') &&
                                expect(item).to.have.property('away_team_name');

                        });
                    }
                });
        });

        it('should have no null values', function (done) {
            api.get('/predictions')
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    expect(res.body).to.satisfy(noNullValues);
                    done();

                    function noNullValues(array) {
                        return array.every(function (item) {
                            for (property in item) {
                                return expect(property).to.not.be.null;
                            }
                        });
                    }

                });
        });
    })
});