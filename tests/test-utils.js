"use strict";

/* eslint-env mocha */

const { Readable } = require("stream");
const { expect } = require("chai");
const {
    readLine,
    createReadableStreamFromString,
} = require("../lib/utils.js");

describe("test readLine function", () => {
    function createStreamFromString(string, highWaterMark = 6) {
        let start = 0;
        const input = new Readable({
            highWaterMark,
            read() {
                if (start >= string.length) {
                    this.push(null);
                    return;
                }
                const end = start + Math.floor(Math.random() * highWaterMark * 1.5);
                const str = string.slice(start, end);
                start = end;
                this.push(str);
            },
        });
        return input;
    }
    function spawn(iter) {
        return new Promise((resolve, reject) => {
            const result = [];
            function next(iter) {
                const promise = iter.next();
                promise.then(({ value, done }) => {
                    if (done) {
                        resolve(result);
                    } else {
                        result.push(value);
                        next(iter);
                    }
                }, reject);
            }
            next(iter);
        });
    }
    it("empty", () => {
        const expected = "";
        return spawn(readLine(createStreamFromString(expected))).then(result => {
            expect(result.join("\n")).to.be.eq(expected);
        });
    });
    it("only one line", () => {
        const expected = "有草焉，名曰鬼草，其叶如葵而赤茎，其秀如禾，服之不忧。";
        return spawn(readLine(createStreamFromString(expected))).then(result => {
            expect(result.join("\n")).to.be.eq(expected);
        });
    });
    it("multiple line", () => {
        const expected = `有草焉，名曰鬼草，
            其叶如葵而赤茎，
            其秀如禾，服之不忧。`;
        return spawn(readLine(createStreamFromString(expected))).then(result => {
            expect(result.join("\n")).to.be.eq(expected);
        });
    });
});

describe("test createReadableStreamFromString function", () => {
    it("empty string", done => {
        const reader = createReadableStreamFromString("");
        let count = 0;
        reader.on("data", () => {
            ++count;
        });
        reader.on("end", () => {
            expect(count).to.be.eq(0);
            done();
        });
        reader.on("error", done);
    });
    it("highWaterMark large than string length", done => {
        const reader = createReadableStreamFromString("abcdefg", {
            highWaterMark: 8,
        });
        let count = 0;
        reader.on("data", () => {
            ++count;
        });
        reader.on("end", () => {
            expect(count).to.be.eq(1);
            done();
        });
        reader.on("error", done);
    });
    it("highWaterMark less than string length", done => {
        const reader = createReadableStreamFromString("abcdefg", {
            highWaterMark: 4,
        });
        let count = 0;
        reader.on("data", () => {
            ++count;
        });
        reader.on("end", () => {
            expect(count).to.be.eq(2);
            done();
        });
        reader.on("error", done);
    });
    it("highWaterMark is zero", done => {
        const reader = createReadableStreamFromString("abcdefg", {
            highWaterMark: 0,
        });
        let count = 0;
        reader.on("data", () => {
            ++count;
        });
        reader.on("end", () => {
            expect(count).to.be.eq(1);
            done();
        });
        reader.on("error", done);
    });
});
