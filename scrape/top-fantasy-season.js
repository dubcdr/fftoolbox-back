// let osmosis = require('osmosis');
var path = require('path');
var app = require(path.resolve(__dirname, '../server/server'));
const osmosis = require('osmosis');
const loopback = require('loopback');
const _ = require('lodash');

var ScrapeUtility = require('./pro_fb_ref');

let limit = 5; //limit number of players to scrape
let pfrId;
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
    .find(`#fantasy > tbody > tr:not(.thead):range(11,300)`)
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
      "pfrId": 'td[data-append-csv] > @data-append-csv',
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
    // .find('#rushing_and_receiving')
    // .set({
    //   'fum': 'tr:last-of-type td[data-stat="fumbles"]'
    // })
    .data((response) => {
      // console.log('found fumbles', response.fum);
      console.log('---')
      console.log('---');
      console.log(`start of ${response.name}`);
      console.log('---')
      console.log('---')
      updatePlayer(response);
      /*chain the rest after promises*/
    })
    // .log(console.log)
    .error(console.log)
  // .debug(console.log);
}


function parsePlayer(json) {
  let player = {};
  let name = ScrapeUtility.parseName(json.name)
  player.first_name = name.first;
  player.last_name = name.last;
  player.position = json.pos;
  player.pfrId = json.pfrId;
  player.teamId = getTeamId(json.team);

  return player;
}

function createPlayer(json) {
  app.models.Player.create(parsePlayer(json)).then((response) => {
    let playerId = parseInt(response.id);
    console.log('---');
    console.log('playerId: ', playerId);
    console.log(`player name: ${response.first_name} ${response.last_name}`)
    console.log('---');
    createBio(json, playerId);
    createSeason(json, playerId);
    getWeeks(json.pfrId, playerId);
  });
}


function updatePlayer(json) {
  let player = parsePlayer(json);
  // console.log(`first: ${player.first_name}, last: ${player.last_name}`)
  let where = {
    "first_name": player.first_name,
    "last_name": player.last_name
  };
  // console.log('where', where);
  app.models.Player.upsertWithWhere(where, player, (err, model) => {
    // console.log('---');
    // console.log('playerId: ', model.id);
    // console.log(`player name: ${model.first_name} ${model.last_name}`)
    // console.log('---');
    updateSeason(json, model.id);
    updateBio(json, model.id);
    getWeeks(json.pfrId, model.id);
  });
}

function updateSeason(json, playerId) {
  // console.log(`update season for playerId: ${playerId}, json`)
  let newSeason = parseSeason(json, playerId);
  // console.log('new season', newSeason);
  let where = {
    "playerId": playerId,
    "year": 2016
  }
  app.models.OffSeasonStat.upsertWithWhere(where, newSeason, (err, obj) => {
    if (err) {
      cosnole.log('error in update season');
      console.log(err);
    }
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
    playerId: playerId
  }
  return bio;
}

function updateBio(json, playerId) {
  app.models.PlayerBio.upsertWithWhere({
    playerId
  }, parseBio(json, playerId), (err, obj) => {
    if (err) {
      console.log(err);
    }
  });
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
    teamId: getTeamId(json.team),
    fum: parseStatToInt(json.fum)
  };
}

function parseSeason(json, playerId) {
  // console.log('start of parseSeason');
  // console.log('json', json);
  // console.log('playerId', playerId);
  let season = {
    outletId: 1,
    gp: parseStatToInt(json.gp),
    fantasy_pts: parseInt(json.fantasy_pts),
    vbd: parseStatToInt(json.vbd),
    playerId: playerId,
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

function getWeeks(pfrId, playerId) {
  osmosis.get(`http://www.pro-football-reference.com/players/${pfrId.charAt(0)}/${pfrId}/gamelog/`)
    .find('#div_stats tbody tr:not(.thead)')
    .set({
      'year': 'td[data-stat="year_id"]',
      'date': 'td[data-stat="game_date"]',
      'week': 'td[data-stat="game_num"]',
      'team': 'td[data-stat="team"]',
      'oppId': 'td[data-stat="opp"]',
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
      // console.log(`start of week create | playerId: ${playerId}, year: ${response.year}, week: ${response.week}`);
      updateWeek(response, playerId);
      // console.log('end of create week');
    })
  // .log(console.log)
  // .error(console.log)
  // .debug(console.log);
}

function parseWeek(json, playerId) {
  let week = {
    playerId: playerId,
    year: parseInt(json.year),
    date: ScrapeUtility.convert2Date(json.date),
    week: parseInt(json.week),
    team: getTeamId(json.team),
    oppId: getTeamId(json.oppId),
    outletId: 1
  }
  _.assign(week, parseBasicStats(json));
  // console.log('parse week result', week);
  return week;
}

function updateWeek(json, playerId) {
  app.models.OffWeekStat.upsertWithWhere({
    playerId,
    year: json.year,
    week: json.week
  }, parseWeek(json, playerId), (err, obj) => {
    if (err) {
      console.log(`failure in update week playerId: ${playerId}`);
      console.log('json', json);
      console.log(err);
    }
  })
}
