var expect = require('chai').expect;
var should = require('chai').should();
var supertest = require('supertest');
var index = supertest('http://localhost:3000');

describe('index', function () {

    it('should return a 200', function (done) {
        index.get('/')
            .expect(200, done);
    });

    it('should return html', function (done) {
        index.get('/')
            .expect(200)
            .expect('Content-Type', /text\/html/, done);
    });
});

