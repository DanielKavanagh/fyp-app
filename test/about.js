/**
 * Created by Daniel on 29/03/2016.
 */

var expect = require('chai').expect;
var should = require('chai').should();
var supertest = require('supertest');
var about = supertest('http://localhost:3000/about');

describe('about', function () {
    it('should return a 200', function (done) {
        about.get('/')
            .expect(200, done);
    });

    it('should return html', function (done) {
        about.get('/')
            .expect(200)
            .expect('Content-Type', /text\/html/, done);
    });
});