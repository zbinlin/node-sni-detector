"use strict";

/* eslint-env mocha */

const { expect } = require("chai");
const Task = require("../lib/task.js");

function asyncIterator(max = 10) {
    let i = -1;
    return {
        next() {
            i += 1;
            if (i < max) {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve({
                            value: i,
                            done: false,
                        });
                    }, 10);
                });
            } else {
                return Promise.resolve({
                    done: true,
                });
            }
        },
        return() {
            i = max;
            return Promise.resolve({
                done: true,
            });
        },
    };
}

describe("test Task class", () => {
    it("should finish with 1 parallel", done => {
        const task = new Task(1, asyncIterator);
        const result = [];
        const start = Date.now();
        task.start(i => {
            result.push(i);
        }).then(() => {
            try {
                expect(result.length).to.be.eq(10);
                expect(Date.now() - start).to.be.at.most(105);
                done();
            } catch (ex) {
                done(ex);
            }
        });
    });
    it("should finish with 5 parallels", done => {
        const task = new Task(5, asyncIterator);
        const result = [];
        const start = Date.now();
        task.start(i => {
            result.push(i);
        }).then(() => {
            try {
                expect(result.length).to.be.eq(10);
                expect(Date.now() - start).to.be.at.most(25);
                done();
            } catch (ex) {
                done(ex);
            }
        });
    });
    it("should finish with 10 parallels", done => {
        const task = new Task(10, asyncIterator);
        const result = [];
        const start = Date.now();
        task.start(i => {
            result.push(i);
        }).then(() => {
            try {
                expect(result.length).to.be.eq(10);
                expect(Date.now() - start).to.be.at.most(15);
                done();
            } catch (ex) {
                done(ex);
            }
        });
    });
    it("should finish with 100 parallels", done => {
        const task = new Task(100, asyncIterator);
        const result = [];
        const start = Date.now();
        task.start(i => {
            result.push(i);
        }).then(() => {
            try {
                expect(result.length).to.be.eq(10);
                expect(Date.now() - start).to.be.at.most(15);
                done();
            } catch (ex) {
                done(ex);
            }
        });
    });
    it("should stop with manual call stop", done => {
        const task = new Task(1, asyncIterator);
        const result = [];
        task.start(i => {
            result.push(i);
        }).then(() => {
            try {
                expect(result.length).to.be.not.eq(10);
                done();
            } catch (ex) {
                done(ex);
            }
        });
        task.stop();
    });
    it("", done => {
        const task = new Task(1, asyncIterator);
        const ret = task.stop();
        expect(ret).to.be.instanceof(Promise);
        ret.then(() => {
            done(new Error(""));
        }, reason => {
            try {
                expect(reason).to.be.instanceof(Error);
                done();
            } catch (ex) {
                done(ex);
            }
        });
    });
});
