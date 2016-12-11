"use strict";

const stream = require("stream");
const Task = require("./task");
const detect = require("./detect-sni-servernames");
const {
    readLine,
    getIpFromLine,
    createReadableStreamFromString,
    noop,
} = require("./utils");

module.exports = schedule;

/**
 * @param {string|Stream} input
 * @param {string|string[]} serverNames
 * @param {number} timeout
 * @param {number} [parallels=1]
 * @param {Function} [filter=noop] - 如果调用 filter 返回 true，将忽略该 ip
 * @return {Observable} observable-like object
 */
function schedule(input, serverNames, timeout, parallels = 1, filter = noop) {
    if (typeof input === "string") {
        input = createReadableStreamFromString(input);
    } else if (!(input instanceof stream.Readable)) {
        throw new TypeError("argument 0 must be a string or readable stream");
    }
    if (typeof serverNames === "string") {
        serverNames = [serverNames];
    } else if (!Array.isArray(serverNames) || serverNames.some(name => typeof name !== "string")) {
        throw new TypeError("argument 1 must be a string or an array of string");
    }
    if (typeof timeout !== "number") {
        throw new TypeError("argument 2 must be a millisecond number");
    }
    return {
        subscribe(observer) {
            const task = new Task(parallels, getIpFromLine.bind(null, (readLine(input))));
            task.start(ip => {
                if (!filter(ip)) {
                    return detect(ip, serverNames, timeout).then(() => {
                        const state = {
                            ip,
                            success: true,
                        };
                        return observer.next(state);
                    }, err => {
                        const state = {
                            ip,
                            success: false,
                            reason: err,
                        };
                        return observer.next(state);
                    });
                }
                return Promise.resolve();
            }).then(() => {
                return observer.complete();
            }, err => {
                return observer.error(err);
            });
            observer.start(this);
            return {
                unsubscribe() {
                    return task.stop();
                },
            };
        },
    };
}
