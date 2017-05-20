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
  let name = parseName(json.name)
}

function createPlayer(json) {

}

function createSeason(json) {

}

for (let i = 0; i < 400; i++) {
  console.log('iteration: ', i);
  osmosis.get('http://www.pro-football-reference.com/years/2016/fantasy.htm')
    .find('#fantasy > tbody > tr')
    .set({
      'name': 'td > @csk',
      'team': 'td[data-stat="team"] > a',
      'pos': 'td[data-stat="pos"]',
      'gp': 'td[data-stat="g"]',
      'ps_cmp': 'td[data-stat="pass_cmp"]',
      'ps_att': 'td[data-stat="pass_att"]',
      'ps_yd': 'td[data-stat="pass_yds"]',
      'ps_td': 'td[data-stat="pass_td"]',
      "int": 'td[data-stat="pass_int"]',
      "ru_att": 'td[data-stat="rush_att"]',
      "ru_yd": 'td[data-stat="rush_yds"]',
      "ru_td": 'td[data-stat="rush_td"]',
      "rec_tg": 'td[data-stat="targets"]',
      "rec": 'td[data-stat="rec"]',
      "rec_yd": 'td[data-stat="rec_yds"]',
      "rec_td": 'td[data-stat="rec_td"]',
      "fantasy_pts": 'td[data-stat="fantasy_points"]',
      "vbd": 'td[data-stat="vbd"]',
      "pfr_id": 'td[data-stat="data-append-csv"]',
    })
    .find('td > @csk > a')
    .follow('@href')
    .data((response) => {
      console.log('got response', response);
    })
    .log(console.log)
    .error(console.log)
    .debug(console.log);
}
