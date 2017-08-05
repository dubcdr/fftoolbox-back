// let osmosis = require('osmosis');
var path = require('path');
var app = require(path.resolve(__dirname, '../server/server'));
const osmosis = require('osmosis');
const loopback = require('loopback');
const _ = require('lodash');

var ScrapeUtility = require('./pro_fb_ref');

let limit = 300; //limit number of players to scrape
let pfr_id;
let teams;

getTeams();


function getTeams() {
  app.models.NflTeam.find().then((response) => {
    teams = _.keyBy(response, 'abbr');
    // console.log(teams);
    getPlayers(); // next step is called after promise
  })
}

function getTeamId(str) {
  // console.log('team attempted', str);
  let team = teams[ScrapeUtility.pfrTeam2Abbr(str)];
  if (team == null) {
    return null;
  } else {
    return team.id;
  }
}

function getPlayers() {
  osmosis.get('http://www.pro-football-reference.com/years/2016/fantasy.htm')
    .find(`#fantasy > tbody > tr:not(.thead):limit(${limit})`)
    .delay(2500)
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
    // .find(`td[csk]:limit(${limit}) > a`)
    .follow('td[csk] > a')
    .find('#meta')
    .delay(2500)
    .set({
      'dob': 'span[itemprop="birthDate"] > @data-birth',
      'height': 'span[itemprop="height"]',
      'weight': 'span[itemprop="weight"]',
      'college': 'div:nth-child(2) > p > a[href^="/schools/"][href$="/"]',
      'twitter': 'div:nth-child(2) > p > a[href*="twitter"]',
      'draft_year': 'div:nth-child(2) > p > a[href^="/years/"][href$="draft.htm"]'
    })
    .find('#rushing_and_receiving')
    .set({
      'fum': 'tr:last-of-type td[data-stat="fumbles"]'
    })
    .data((response) => {
      console.log('found fumbles', response.fum);
      updatePlayer(response);
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
    console.log(`player name: ${response.first_name} ${response.last_name}`)
    console.log('---');
    createBio(json, playerId);
    createSeason(json, playerId);
    getWeeks(json.pfr_id, playerId);
  });
}


function updatePlayer(json) {
  let player = parsePlayer(json);
  // console.log(`first: ${player.first_name}, last: ${player.last_name}`)
  let where = {
    "where": {
      "first_name": player.first_name,
      "last_name": player.last_name
    }
  };
  // console.log('where', where);
  app.models.Player.find(where, (err, models) => {
    models.forEach((model) => {
      updateSeason(json, model.id);
    })
  })
}

function updateSeason(json, player_id) {
  // console.log(`update season for player_id: ${player_id}, json`)
  let newSeason = parseSeason(json, player_id);
  // console.log('new season', newSeason);
  let where = {
    "player_id": player_id,
    "year": 2016
  }
  app.models.OffSeasonStat.upsertWithWhere(where, newSeason, (err, obj) => {
    // console.log('update successful?')
    // console.log(obj);
  });
}


function parseBio(json, playerId) {
  // console.log('parseBio json', json);
  let weight = json.weight ? json.weight.substring(0, 3) : null;
  if (weight === 0) {
    console.log(`why so skinny | playerId: ${playerId}, name: ${json.name}`)
  }
  let draft_year = json.draft_year ? json.draft_year.substring(0, 4) : null;
  if (draft_year === 0) {
    console.log(`why no draft year | playerId: ${playerId}, name: ${json.name}`)
  }
  let bio = {
    dob: json.dob,
    height: json.height,
    weight,
    college: json.college,
    twitter: json.twitter,
    draft_year,
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
    let parsed = parseInt(str);
    if (isNaN(parsed)) {
      return 0;
    } else {
      return parsed;
    }
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
    ru_td: parseStatToInt(json.ru_td),
    rec_tg: parseStatToInt(json.rec_tg),
    rec: parseStatToInt(json.rec),
    rec_yd: parseStatToInt(json.rec_yd),
    rec_td: parseStatToInt(json.rec_td),
    team_id: getTeamId(json.team),
    fum: parseStatToInt(json.fum)
  };
}

function parseSeason(json, playerId) {
  // console.log('start of parseSeason');
  // console.log('json', json);
  // console.log('playerId', playerId);
  let season = {
    gp: parseStatToInt(json.gp),
    fantasy_pts: parseInt(json.fantasy_pts),
    vbd: parseStatToInt(json.vbd),
    player_id: playerId,
    year: 2016 //notice this is not dynamic
  }
  _.assign(season, parseBasicStats(json))
  // console.log('season object', season);
  return season;
}

function createSeason(json, playerId) {
  app.models.OffSeasonStat.create(parseSeason(json, playerId)).then((response) => {
    // console.log('response for create season', response)
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
      'opp_id': 'td[data-stat="opp"]',
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
      "ret_td": 'td[data-stat="kick_ret_td]',
      "2pt": 'td[data-stat="two_pt_md"]'
    })
    .data((response) => {
      console.log(`start of week create | playerId: ${playerId}, year: ${response.year}, week: ${response.week}`);
      createWeek(response, playerId);
      // console.log('end of create week');
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
    opp_id: getTeamId(json.opp_id)
  }
  _.assign(week, parseBasicStats(json));
  // console.log('parse week result', week);
  return week;
}

function createWeek(json, playerId) {
  app.models.OffWeekStat.create(parseWeek(json, playerId)).then((response) => {
    // console.log('api response', response);
  });;
}
