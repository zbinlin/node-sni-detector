"use strict";

/* eslint-env mocha */
const detectSNI = require("../lib/detect-sni-servernames");

describe("test detectSNIProxy function", () => {
    it("", () => {
        return detectSNI(
            "14.215.177.38", ["www.baidu.com", "img.baidu.com"]
        );
    });
    it("", done => {
        detectSNI(
            "14.215.177.38", ["www.baidu.com", "www.google.com"]
        ).then(() => {
            done(new Error("14.215.177.38 is not a sni proxy"));
        }, () => {
            done();
        });
    });
});
