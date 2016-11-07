"use strict";

class Task {
    constructor(parallels, iterator) {
        this.parallels = parallels;
        this.iter = iterator();
    }
    start(fn) {
        const iter = this.iter;
        const promises = [];
        for (let i = 0; i < this.parallels; i++) {
            promises.push(next());
        }
        function next() {
            return iter.next().then(result => {
                const { value, done } = result;
                if (done) {
                    return;
                } else {
                    return fn(value).catch(ex => {
                        console.error(ex);
                    }).then(next);
                }
            });
        }
        return Promise.all(promises);
    }
    stop() {
        return this.iter.return();
    }
}

module.exports = Task;
