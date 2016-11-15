"use strict";

class Task {
    constructor(parallels, iterator) {
        this.parallels = parallels;
        this.iter = iterator();
    }
    start(fn) {
        const iter = this.iter;
        const parallels = this.parallels;
        let resolve, reject;
        for (let i = 0; i < this.parallels; i++) {
            next();
        }
        let count = 0;
        function next() {
            return iter.next().then(result => {
                const { value, done } = result;
                if (done) {
                    ++count;
                    if (count >= parallels) {
                        resolve();
                    }
                    return;
                } else {
                    try {
                        const result = fn(value);
                        Promise.resolve(result).catch(ex => {
                            console.error(ex);
                        }).then(() => {
                            next();
                        });
                    } catch (ex) {
                        reject(ex);
                    }
                }
            }, reject);
        }
        this.result = new Promise((...args) => {
            ([resolve, reject] = args);
        });
        return this.result;
    }
    stop() {
        this.iter.return();
        if (this.result) {
            return this.result;
        } else {
            return Promise.reject(new Error("the task has not yet started"));
        }
    }
}

module.exports = Task;
