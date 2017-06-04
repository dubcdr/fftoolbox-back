let prompt = require('prompt');
var path = require('path');
var app = require(path.resolve(__dirname, '../../server/server'));
var loopback = require('loopback');


class FftodayTools {
  constructor() {
    this.baseUrl = 'http://www.fftoday.com/'
  }

  appendIdsToPlayerModel(first_name, last_name, fftoday_id) {
    fftoday_id = parseInt(fftoday_id);
    return new Promise((resolve, reject) => {
      app.models.Player.upsertWithWhere({
        first_name,
        last_name
      }, {
        fftoday_id
      }, (err, object) => {
        if (err) {
          reject(err);
        } else {
          resolve(object);
        }
      })
    });
  }
}

module.exports = {
  FftodayTools
};
