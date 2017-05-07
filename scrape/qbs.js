let osmosis = require('osmosis');
var path = require('path');
var loopback = require('loopback');

var app = require(path.resolve(__dirname, '../server/server'));

function parseName(str) {
  let index = str.indexOf(',');
  let last = str.substring(0, index);
  let first = str.substring(index + 1, str.length)
  return {
    first,
    last
  };
}

function parseWeb(json) {
  let player = {};
  let name = parseName(json.name);
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

osmosis
  .get('http://www.pro-football-reference.com/years/2016/passing.htm')
  .find('#passing > tbody > tr:not(.thead)')
  .set({
    'name': 'td:nth-child(2) > @csk',
    'team': 'td[data-stat="team"] > a',
    'pos': 'td[data-stat="pos"]',
    'gp': 'td[data-stat="g"]',
    'cmp': 'td[data-stat="pass_cmp"]',
    'att': 'td[data-stat="pass_att"]',
    'pass_yds': 'td[data-stat="pass_yds"]',
    'pass_td': 'td[data-stat="pass_td"]',
    "pass_int": 'td[data-stat="pass_int"]',
    "pass_rating": 'td[data-stat="pass_rating"]',
    "qbr": 'td[data-stat="qbr"]'
  })
  .data((response) => {
    let player = parsePlayer(response);
    if (player != null) {
      app.models.Player.create(player, (response) => {
        console.log('success?');
      });
    }
  });
