var expect = require('chai').expect;
const { assert } = require('chai');
var randomInt = require('../lib/randomInt');

describe("randomInt", function () {
    it("should throw when min greater than max", function () {
        expect(function () {
            randomInt(10, 0);
        }).to.throw(Error, /must be greater than the value of "min"/);
    });

    it("should throw when passed and unsafe integer", function () {
        expect(function () {
            randomInt(Number.MAX_VALUE);
        }).to.throw(Error, /must be a safe integer/);
    });

    it("should return a random number within the specified range", function () {
        let randomInts = [];

        for (let i = 0; i <= 1000; i++) {
            randomInts.push(randomInt(5, 10));
        }
        randomInts.forEach(e => {
            assert.isAtMost(e, 10);
            assert.isAtLeast(e, 5);
        });
    });

    it("should return a random number less than the specified maximum and great than 0", function () {
        let randomInts = [];

        for (let i = 0; i <= 1000; i++) {
            randomInts.push(randomInt(16));
        }
        randomInts.forEach(e => {
            assert.isAtMost(e, 16);
            assert.isAtLeast(e, 0);
        });
    });
});