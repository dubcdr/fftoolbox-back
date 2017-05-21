// let osmosis = require('osmosis');
var path = require('path');
var app = require(path.resolve(__dirname, '../server/server'));
var osmosis = require('osmosis');
var loopback = require('loopback');
var _ = require('lodash');

var ScrapeUtility = require('./pro_fb_ref');

let limit = 1; //limit number of players to scrape
let pfr_id;
let teams;


getTeams();


function getTeams() {
  app.models.NflTeam.find().then((response) => {
    teams = _.keyBy(response, 'abbr');
    getPlayers(); // next step is called after promise
  })
}

function getTeamId(str) {
  return teams[ScrapeUtility.pfrTeam2Abbr(str)].id;
}

function getPlayers() {
  osmosis.get('http://www.pro-football-reference.com/years/2016/fantasy.htm')
    .find(`#fantasy > tbody > tr:not(.thead):limit(${limit})`)
    .set({
      'name': 'td[csk] > @csk',
      'team': 'td[data-stat="team"] > a',
      'pos': 'td[data-stat="fantasy_pos"]',
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
      "pfr_id": 'td[data-append-csv] > @data-append-csv',
    })
    .find(`td[csk]:limit(${limit}) > a`)
    .follow('@href')
    .find('#meta')
    .set({
      'dob': 'span[itemprop="birthDate"] > @data-birth',
      'height': 'span[itemprop="height"]',
      'weight': 'span[itemprop="weight"]',
      'college': 'div:nth-child(2) > p:nth-child(7) > a',
      'twitter': 'div:nth-child(2) > p:nth-child(11) > a',
      'draft_year': 'div:nth-child(2) > p:nth-child(10) > a:nth-child(3)'
    })
    .data((response) => {
      createPlayer(response);
      /*chain the rest after promises*/
    })
    .log(console.log)
    .error(console.log)
    .debug(console.log);
}


function parsePlayer(json) {
  let player = {};
  let name = ScrapeUtility.parseName(json.name)
  player.first_name = name.first;
  player.last_name = name.last;
  player.position = json.pos;
  player.pfr_id = json.pfr_id;
  player.team_id = getTeamId(json.team);

  return player;
}

function createPlayer(json) {
  app.models.Player.create(parsePlayer(json)).then((response) => {
    let playerId = parseInt(response.id);
    console.log('---');
    console.log('player_id: ', playerId);
    console.log('---');
    createBio(json, playerId);
    createSeason(json, playerId);
    getWeeks(json.pfr_id, playerId)
  });
}

function parseBio(json, playerId) {
  let bio = {
    dob: json.dob,
    height: json.height,
    weight: parseInt(json.weight.substring(0, 3)),
    college: json.college,
    twitter: json.twitter,
    draft_year: parseInt(json.draft_year.substring(0, 4)),
    player_id: playerId
  }
  return bio;
}

function createBio(json, playerId) {
  app.models.PlayerBio.create(parseBio(json, playerId)).then((response) => {})
}

function parseStatToInt(str) {
  if (str == null) {
    return 0;
  } else {
    return parseInt(str);
  }
}

function parseBasicStats(json) {
  return {
    ps_cmp: parseStatToInt(json.ps_cmp),
    ps_att: parseStatToInt(json.ps_att),
    ps_yd: parseStatToInt(json.ps_yd),
    ps_td: parseStatToInt(json.ps_td),
    int: parseStatToInt(json.int),
    ru_att: parseStatToInt(json.ru_att),
    ru_yd: parseStatToInt(json.ru_yd),
    rec_tg: parseStatToInt(json.rec_tg),
    rec: parseStatToInt(json.rec),
    rec_yd: parseStatToInt(json.rec_yd),
    rec_td: parseStatToInt(json.rec_td),
    team: getTeamId(json.team)
  };
}

function parseSeason(json, playerId) {
  let season = {
    gp: parseInt(json.gp),
    fantasy_pts: parseInt(json.fantasy_pts),
    vbd: parseInt(json.vbd),
    player_id: playerId,
    year: 2016 //notice this is not dynamic
  }
  _.assign(season, parseBasicStats(json))
  return season;
}

function createSeason(json, playerId) {
  app.models.OffSeasonStat.create(parseSeason(json, playerId)).then((response) => {

  })
}

function getWeeks(pfr_id, playerId) {
  osmosis.get(`http://www.pro-football-reference.com/players/${pfr_id.charAt(0)}/${pfr_id}/gamelog/`)
    .find('#div_stats tbody tr:not(.thead)')
    .set({
      'year': 'td[data-stat="year_id"]',
      'date': 'td[data-stat="game_date"]',
      'week': 'td[data-stat="game_num"]',
      'team': 'td[data-stat="team"]',
      'opp': 'td[data-stat="opp"]',
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
    })
    .data((response) => {
      createWeek(response, playerId);
    })
    .log(console.log)
    .error(console.log)
    .debug(console.log);
}

function parseWeek(json, playerId) {
  let week = {
    player_id: playerId,
    year: parseInt(json.year),
    date: ScrapeUtility.convert2Date(json.date),
    week: parseInt(json.week),
    team: getTeamId(json.team),
    opp: getTeamId(json.opp)
  }
  _.assign(week, parseBasicStats(json));
  return week;
}

function createWeek(json, playerId) {
  app.models.OffWeekStat.create(parseWeek(json, playerId));
}
