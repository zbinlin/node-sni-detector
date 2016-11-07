"use strict";

/* eslint-env mocha */
const detectSNIProxy = require("../lib/detect-sni-proxy");

describe("test detectSNIProxy function", () => {
    it("", () => {
        return detectSNIProxy(
            "14.215.177.38", ["www.baidu.com", "img.baidu.com"]
        );
    });
    it("", done => {
        detectSNIProxy(
            "14.215.177.38", ["www.baidu.com", "www.google.com"]
        ).then(() => {
            done(new Error("14.215.177.38 is not a sni proxy"));
        }, () => {
            done();
        });
    });
});
