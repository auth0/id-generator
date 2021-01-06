var expect = require('chai').expect;
var { assert } = require('chai');
var randomInteger = require('../lib/randomInteger');

describe("randomInteger", function () {
    it("should throw when passed a negative value", function () {
        expect(function () {
            randomInteger(-10);
        }).to.throw(Error, /must be a natural number/);
    });

    it("should throw when passed an unsafe integer", function () {
        expect(function () {
            randomInteger(Number.MAX_VALUE);
        }).to.throw(Error, /must be a safe integer/);
    });

    it("should return a random number less than the specified maximum and greater than 0", function () {
        var randomInts = [];

        for (var i = 0; i <= 1000; i++) {
            randomInts.push(randomInteger(16));
        }
        randomInts.forEach(e => {
            assert.isAtMost(e, 16);
            assert.isAtLeast(e, 0);
        });
    });
});