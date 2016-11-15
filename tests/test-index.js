"use strict";

/* eslint-env mocha */

const fs = require("fs");
const os = require("os");
const path = require("path");
const childProcess = require("child_process");
const { expect } = require("chai");
const BIN_PATH = path.resolve(__dirname, "../bin/cli");

function cli(cmd) {
    return `node ${BIN_PATH} ${cmd.replace("sni-detect", "")}`;
}
function cd(dir) {
    return `cd ${dir}`;
}
function combineExec(...args) {
    return exec(args.join(" && "));
}

function exec(cmd, options = {}) {
    return new Promise((resolve, reject) => {
        childProcess.exec(cmd, options, (err, stdout, stderr) => {
            if (err) {
                reject(err);
            } else {
                resolve([stdout, stderr]);
            }
        });
    });
}
function read(file, options = { encoding: "UTF8" }) {
    return new Promise((resolve, reject) => {
        fs.readFile(file, options, (err, chunk) => {
            if (err) {
                reject(err);
            } else {
                resolve(chunk);
            }
        });
    });
}

class Env {
    create() {
        const baseDir = path.join(os.tmpdir(), "snid-");
        this.ready = new Promise((resolve, reject) => {
            fs.mkdtemp(baseDir, (err, folder) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(folder);
                }
            });
        });
    }
    destory() {
        const ready = this.ready;
        this.ready = Promise.resolve();
        return ready.then(folder => {
            return exec(`rm -r ${folder}`);
        });
    }
}

describe("test cli", () => {
    describe("test -c, --continue", () => {
        let env = new Env();
        before(() => {
            return env.create();
        });
        after(() => {
            return env.destory();
        });
        it("创建一个 scan-result.txt 文件，当使用 -c, --continue 参数时", () => {
            return env.ready.then(folder => {
                return combineExec(
                    cd(folder),
                    cli("sni-detect -c -- 127.0.0.1")
                ).then(([stdout, stderr]) => {
                    const output = path.join(folder, "scan-result.txt");
                    expect(
                        fs.existsSync(output)
                    ).to.be.truly;
                    return read(output).then(str => {
                        expect(str.trim()).to.be.eq("127.0.0.1,Failure");
                    });
                });
            });
        });
        const FILENAME = "test.txt";
        it(`创建一个 ${FILENAME} 文件，当使用 -c, --continue 参数后面加上 ${FILENAME} 时`, () => {
            return env.ready.then(folder => {
                return combineExec(
                    cd(folder),
                    cli(`sni-detect --continue ${FILENAME} -- 127.0.0.1`)
                ).then(([stdout, stderr]) => {
                    const output = path.join(folder, FILENAME);
                    expect(
                        fs.existsSync(output)
                    ).to.be.truly;
                    return read(output).then(str => {
                        expect(str.trim()).to.be.eq("127.0.0.1,Failure");
                    });
                });
            });
        });
    });
});
