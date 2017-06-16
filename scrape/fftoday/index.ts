import * as prompt from 'prompt';

import loopback = require('loopback');

export class FftodayTools {
  public static baseUrl = 'http://www.fftoday.com/';
  public static app: any = loopback();
  public static outletId = 3;

  constructor() {
  }

  public static appendIdsToPlayerModel(first_name: string, last_name: string, fftoday_id: number) {
    return new Promise<any>((resolve, reject) => {
      FftodayTools.app.models.Player.upsertWithWhere({
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

  public static parseName(str: string): { first: string, last: string } {
    let index = str.indexOf(' ');
    let first = str.substring(0, index);
    let last = str.substring(index + 1, str.length)
    return {
      first,
      last
    };
  }

  public static getFftodayIdFromLink(link: string): number {
    let reg = /\/\d*\//;
    let response = link.match(reg) as RegExpMatchArray;
    return parseInt(response[0].substr(1, response[0].length - 1));
  }
};
