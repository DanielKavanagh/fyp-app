/**
 * Created by Daniel on 28/03/2016.
 */

var expect = require('chai').expect;
var should = require('chai').should();
var supertest = require('supertest');
var api = supertest('http://localhost:3000/api');

describe('api', function () {
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

            it('should have these property types', function (done) {
                api.get('/predictions')
                    .end(function (err, res) {
                        expect(res.body).to.satisfy(hasPropertyType);
                        done();

                        function hasPropertyType(array) {
                            return array.every(function (item) {
                                return expect(item.prediction_id).to.be.a('number') &&
                                    expect(item.game_id).to.be.a('number') &&
                                    expect(item.predicted_winner_id).to.be.a('number') &&
                                    expect(item.actual_winner_id).to.be.a('number') &&
                                    expect(item.probability).to.be.a('number') &&
                                    expect(item.home_team_id).to.be.a('number') &&
                                    expect(item.home_team_abbr).to.be.a('string') &&
                                    expect(item.home_team_name).to.be.a('string') &&
                                    expect(item.away_team_id).to.be.a('number') &&
                                    expect(item.away_team_abbr).to.be.a('string') &&
                                    expect(item.away_team_name).to.be.a('string');
                            })
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
        });

        describe('get-season', function () {
            it('should return a 200', function (done) {
                api.get('/predictions/2015')
                    .expect(200, done);
            });

            it('should return an empty array', function (done) {
                api.get('/predictions/null')
                    .expect(200)
                    .end(function (err, res) {
                        expect(res.body).to.satisfy(isEmptyArray);
                        done();
                    });

                function isEmptyArray(array) {
                    if (array.length === 0) {
                        return true;
                    }
                }
            });

            it('should return an array', function (done) {
                api.get('/predictions/')
                    .expect(200)
                    .end(function (err, res) {
                        expect(res.body).to.be.an('array');
                        done();
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

            it('should have these property types', function (done) {
                api.get('/predictions')
                    .end(function (err, res) {
                        expect(res.body).to.satisfy(hasPropertyType);
                        done();

                        function hasPropertyType(array) {
                            return array.every(function (item) {
                                return expect(item.prediction_id).to.be.a('number') &&
                                    expect(item.game_id).to.be.a('number') &&
                                    expect(item.predicted_winner_id).to.be.a('number') &&
                                    expect(item.actual_winner_id).to.be.a('number') &&
                                    expect(item.probability).to.be.a('number') &&
                                    expect(item.home_team_id).to.be.a('number') &&
                                    expect(item.home_team_abbr).to.be.a('string') &&
                                    expect(item.home_team_name).to.be.a('string') &&
                                    expect(item.away_team_id).to.be.a('number') &&
                                    expect(item.away_team_abbr).to.be.a('string') &&
                                    expect(item.away_team_name).to.be.a('string');
                            })
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
        });

        describe('get-season-week', function () {
            it('should return a 200', function (done) {
                api.get('/predictions/2015-17')
                    .expect(200, done);
            });

            it('should return an empty array', function (done) {
                api.get('/predictions/null')
                    .expect(200)
                    .end(function (err, res) {
                        expect(res.body).to.satisfy(isEmptyArray);
                        done();
                    });

                function isEmptyArray(array) {
                    if (array.length === 0) {
                        return true;
                    }
                }
            });

            it('should return an array', function (done) {
                api.get('/predictions/')
                    .expect(200)
                    .end(function (err, res) {
                        expect(res.body).to.be.an('array');
                        done();
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

            it('should have these property types', function (done) {
                api.get('/predictions')
                    .end(function (err, res) {
                        expect(res.body).to.satisfy(hasPropertyType);
                        done();

                        function hasPropertyType(array) {
                            return array.every(function (item) {
                                return expect(item.prediction_id).to.be.a('number') &&
                                    expect(item.game_id).to.be.a('number') &&
                                    expect(item.predicted_winner_id).to.be.a('number') &&
                                    expect(item.actual_winner_id).to.be.a('number') &&
                                    expect(item.probability).to.be.a('number') &&
                                    expect(item.home_team_id).to.be.a('number') &&
                                    expect(item.home_team_abbr).to.be.a('string') &&
                                    expect(item.home_team_name).to.be.a('string') &&
                                    expect(item.away_team_id).to.be.a('number') &&
                                    expect(item.away_team_abbr).to.be.a('string') &&
                                    expect(item.away_team_name).to.be.a('string');
                            })
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
        });

        describe('get-available-seasons', function () {
            it('should return a 200', function (done) {
                api.get('/predictions/seasons')
                    .expect(200, done);
            });

            it('should return an array', function (done) {
                api.get('/predictions/')
                    .expect(200)
                    .end(function (err, res) {
                        expect(res.body).to.be.an('array');
                        done();
                    });
            });

            it('should have these object keys', function (done) {
                api.get('/predictions/seasons/')
                    .end(function (err, res) {
                        if (err) {
                            throw err;
                        }

                        expect(res.body).to.satisfy(hasKeys);
                        done();

                        function hasKeys(array) {
                            return array.every(function (item) {
                                return expect(item).to.have.property('season');
                            });
                        }
                    });
            });

            it('should have these property types', function (done) {
                api.get('/predictions/seasons')
                    .end(function (err, res) {
                        expect(res.body).to.satisfy(hasPropertyType);
                        done();

                        function hasPropertyType(array) {
                            return array.every(function (item) {
                                return expect(item.season).to.be.a('number');
                            })
                        }
                    });
            });

            it('should have no null values', function (done) {
                api.get('/predictions/seasons/')
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
        });
    });
});