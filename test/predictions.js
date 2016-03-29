/**
 * Created by Daniel on 29/03/2016.
 */

var expect = require('chai').expect;
var should = require('chai').should();
var supertest = require('supertest');
var predictions = supertest('http://localhost:3000/predictions');

describe('predictions', function () {
    it('should return a 200', function (done) {
        predictions.get('/')
            .expect(200, done);
    });

    it('should return html', function (done) {
        predictions.get('/')
            .expect(200)
            .expect('Content-Type', /text\/html/, done);
    });
});