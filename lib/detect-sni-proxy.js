"use strict";

const tls = require("tls");

function detect(ip, servername, timeout = 10000) {
    return new Promise((resolve, reject) => {
        const conn = tls.connect({
            port: 443,
            host: ip,
            rejectUnauthorized: true,
            servername,
        });
        conn.setTimeout(timeout, () => {
            conn.destroy();
            reject();
        });
        conn.once("error", () => {
            reject();
        });
        conn.once("secureConnect", () => {
            conn.end();
            resolve();
        });
    });
}
module.exports = function detectSNIProxy(ip, servernames, timeout) {
    return Promise.all(
        servernames.map(servername => detect(ip, servername, timeout))
    );
};
