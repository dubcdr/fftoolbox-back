function convert2Date(str) {
    return new Date(str);
}
function pfrTeam2Abbr(str) {
    if (str === 'NWE') {
        return 'NE';
    }
    else if (str === 'TAM') {
        return 'TB';
    }
    else if (str === 'SFO') {
        return 'SF';
    }
    else if (str === 'NOR') {
        return 'NO';
    }
    else if (str === 'SDG') {
        return 'LAR';
    }
    else if (str === 'SD') {
        return 'LAR';
    }
    else if (str === 'KAN') {
        return 'KC';
    }
    else if (str === 'GNB') {
        return 'GB';
    }
    else if (str === 'STL') {
        return 'LAR';
    }
    else {
        return str;
    }
}
function parseName(str) {
    var index = str.indexOf(',');
    var last = str.substring(0, index);
    var first = str.substring(index + 1, str.length);
    return {
        first: first,
        last: last
    };
}
module.exports = {
    convert2Date: convert2Date,
    pfrTeam2Abbr: pfrTeam2Abbr,
    parseName: parseName
};
//# sourceMappingURL=index.js.map