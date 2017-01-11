"use strict";

/* eslint-env mocha */

const { expect } = require("chai");
const timeParse = require("../lib/time-parse.js");

describe("test time unitimeParse parser", () => {
    it("normal", () => {
        expect(timeParse("")).to.equal(0);
        expect(timeParse(10)).to.equal(10);
        expect(timeParse("10")).to.equal(10);
        expect(timeParse("10.0")).to.equal(10);
        expect(timeParse("1ms")).to.equal(1);
        expect(timeParse("1s 10ms")).to.equal(1010);
        expect(timeParse("10.5s")).to.equal(10.5 * 1000);
        expect(timeParse("8h30min 10s 10ms")).to.equal(8 * 60 * 60 * 1000 + 30 * 60 * 1000 + 10 * 1000 + 10);
        expect(timeParse("4days 8h30min 10s 10ms")).to.equal(4 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000 + 30 * 60 * 1000 + 10 * 1000 + 10);
        expect(timeParse("30min 10s 10ms")).to.equal(30 * 60 * 1000 + 10 * 1000 + 10);
    });
    it("is NaN", () => {
        expect(timeParse()).to.be.NaN;
        expect(timeParse("1 s 10ms")).to.be.NaN;
        expect(timeParse("10ms10")).to.be.NaN;
        expect(timeParse("10m in10ms")).to.be.NaN;
        expect(timeParse("10ms 1s")).to.be.NaN;
        expect(timeParse("10ms1ms")).to.be.NaN;
    });
});
