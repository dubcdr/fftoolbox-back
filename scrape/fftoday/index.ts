import { Fftoolbox } from './../fftoolbox';

export class FftodayTools extends Fftoolbox.Loopback {
  public static baseUrl = 'http://www.fftoday.com/';
  public static outletId = 3;

  constructor() {
    super();
  }

  public appendIdsToPlayerModel(first_name: string, last_name: string, fftodayId: number) {
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

  public static getFftodayIdFromLink(link: string): number {
    let reg = /\/\d*\//;
    let response = link.match(reg) as RegExpMatchArray;
    return parseInt(response[0].substr(1, response[0].length - 1));
  }
};
