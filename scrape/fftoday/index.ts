import { Fftoolbox } from './../fftoolbox';
import * as moment from 'moment';

export class FftodayTools extends Fftoolbox.Loopback {
  public static baseUrl = 'http://www.fftoday.com/';
  public static outletId = 3;

  constructor() {
    super();
  }

  public appendIdsToPlayerModel(first_name: string, last_name: string, fftodayId: number): Promise<Fftoolbox.IPlayer> {
    return new Promise<any>((resolve, reject) => {
      this.lb.models.Player.upsertWithWhere({
        first_name,
        last_name
      }, {
          fftodayId
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

  public getTeam(short: string) {
    if (short === 'JAC') {
      return this.nflTeams['JAX']
    } else {
      return this.nflTeams[short];
    }
  }

  public static getFftodayIdFromLink(link: string): number {
    let reg = /\/\d*\//;
    let response = link.match(reg) as RegExpMatchArray;
    return parseInt(response[0].substr(1, response[0].length - 1));
  }

  public static parseDate(str: string): moment.Moment {
    let regEx = /\b(\d{1,2})\/(\d{1,2})\/(\d{1,4})\b/
    let result = regEx.exec(str);
    if (result) {
      let M = Number.parseInt(result[1]) - 1;
      let d = Number.parseInt(result[2]);
      let y = Number.parseInt(result[3]) + 2000;
      let date = moment({ M, d, y });
      return date;
    } else {
      return moment();
    }
  }
};
