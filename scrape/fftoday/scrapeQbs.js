let prompt = require('prompt');
var path = require('path');
var app = require(path.resolve(__dirname, '../../server/server'));
var loopback = require('loopback');
let FftodayTools = require('./');

let FFTODAY = new FftodayTools.FftodayTools();

FFTODAY.appendIdsToPlayerModel('Tom', 'Brady', 1812).then((response) => {
  console.log('Worked');
  console.log(response);
});
