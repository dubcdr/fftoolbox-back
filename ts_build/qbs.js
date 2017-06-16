var osmosis = require('osmosis');
var path = require('path');
var loopback = require('loopback');
var app = require(path.resolve(__dirname, '../server/server'));
function parseName(str) {
    var index = str.indexOf(',');
    var last = str.substring(0, index);
    var first = str.substring(index + 1, str.length);
    return {
        first: first,
        last: last
    };
}
function parseWeb(json) {
    var player = {};
    var name = parseName(json.name);
    player.first_name = name.first;
    player.last_name = name.last;
    player.position = json.pos.toUpperCase();
    player.teamId = json.team.toUpperCase();
    return player;
}
function parsePlayer(json) {
    if (json.pos.toUpperCase() === 'QB') {
        return parseWeb(json);
    }
}
console.log('what the hell is going on?');
osmosis
    .get('http://www.pro-football-reference.com/years/2016/passing.htm')
    .find('#passing > tbody > tr:not(.thead)')
    .set({
    'name': 'td:nth-child(2) > @csk',
    'team': 'td[data-stat="team"] > a',
    'pos': 'td[data-stat="pos"]',
    'gp': 'td[data-stat="g"]',
    'ps_cmp': 'td[data-stat="pass_cmp"]',
    'ps_att': 'td[data-stat="pass_att"]',
    'ps_yd': 'td[data-stat="pass_yds"]',
    'ps_td': 'td[data-stat="pass_td"]',
    "int": 'td[data-stat="pass_int"]'
})
    .data(function (response) {
    console.log(response);
})
    .log(console.log)
    .error(console.log)
    .debug(console.log);
//# sourceMappingURL=qbs.js.map