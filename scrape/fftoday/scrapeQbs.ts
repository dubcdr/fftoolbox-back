// import prompt = require('prompt');
// import app = require('../../server/server');
// import loopback = require('loopback');
import osmosis = require('osmosis');
import { FftodayTools } from './';
import { Fftoolbox } from './../fftoolbox';

export class FftodayQbScrape {
  public projSeasStatUrl = 'http://www.fftoday.com/rankings/playerproj.php?Season=2017&PosID=10';
  public osmosis = osmosis(this.projSeasStatUrl);
  public limit = 5;

  public loopback = new Fftoolbox.Loopback();

  constructor() {

  }

  public scrapeQbs() {
    this.osmosis.get(this.projSeasStatUrl)
      .find(`td.bodycontent > table:last-of-type table tr:not(.tablehdr):not(.tableclmhdr)`)
      .set({
        'name': 'td:nth-child(2) > a',
        'name_link': 'td:nth-child(2) > a > @href',
        'team': 'td:nth-child(3)',
        'bye': 'td:nth-child(4)',
        'ps_cmp': 'td:nth-child(5)',
        'ps_att': 'td:nth-child(6)',
        'ps_yd': 'td:nth-child(7)',
        'ps_td': 'td:nth-child(8)',
        'int': 'td:nth-child(8)',
        'ru_att': 'td:nth-child(8)',
        'ru_yd': 'td:nth-child(8)',
        'ru_td': 'td:nth-child(8)'
      })
      .data((response: IScrapeQbResponse) => {
        this.parseQbData(response);
      })
      .log(console.log)
      .error(console.log)
      .debug(console.log);
  }

  public parseQbData(obj: IScrapeQbResponse): Fftoolbox.IProjSeasStat {
    let data = {} as Fftoolbox.IProjSeasStat;

    let name = FftodayTools.parseName(obj.name);
    let id = FftodayTools.getFftodayIdFromLink(obj.name_link);
    this.loopback.findPlayerIdByFirstLast(name.first, name.last).then((response => {
      console.log(name);
      console.log('fftodayId', id);
      console.log('fftoolboxId', response);
    }));

    return data;
  }
}

interface IScrapeQbResponse {
  name: string;
  name_link: string;
  team: string;
  bye: string;
  ps_cmp: string;
  ps_att: string;
  ps_yd: string;
  pd_td: string;
  int: string;
  ru_att: string;
  ru_yd: string;
  ru_td: string;
}

let test = new FftodayQbScrape();
test.scrapeQbs();
