"use strict";

const units = [
    [["days", "d"], 24 * 60 * 60 * 1000],
    [["hours", "h"], 60 * 60 * 1000],
    [["minutes", "mins", "min", "m"], 60* 1000],
    [["seconds", "sec", "s"], 1000],
    [["milliseconds", "ms"], 1],
];
const re = generateUnitParseRegExp(units);

function generateUnitParseRegExp(units) {
    const reStr = units.reduce((reStr, unit) => {
        return reStr + `(?:(\\d+(?:\\.\\d+)?)(?:${unit[0].join("|")})\\s*)?`;
    }, "");
    return new RegExp(`^${reStr}$`);
}

function parseDuration(duration) {
    if (!isNaN(duration)) {
        return Number(duration);
    }
    if (duration == null) {
        return NaN;
    }
    const r = duration.match(re);
    if (r === null) {
        return NaN;
    } else {
        return r.slice(1)
            .reduce((total, num, idx) => total + (num || 0) * units[idx][1], 0);
    }
}

module.exports = parseDuration;
