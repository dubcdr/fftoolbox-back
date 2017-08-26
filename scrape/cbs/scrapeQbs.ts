import osmosis = require('osmosis');
import { CbsTools } from './cbsScrape';
import { Fftoolbox } from './../fftoolbox';
import * as moment from 'moment';
import * as _ from 'lodash';

export class CbsQbScrape extends CbsTools {
  public year = 2017;
  public projSeasStatUrl = 'https://www.cbssports.com/fantasy/football/stats/sortable/points/QB/standard/projections/2017/ytd';
  public osmosis = osmosis(this.projSeasStatUrl);
  public limit = Number.MAX_SAFE_INTEGER;

  constructor() {
    super();
  }

  public scrapeProjSeas() {
    this.osmosis.get(this.projSeasStatUrl)
      .find(`tr[class^="row"]:not(#special):limit(${this.limit})`)
      .set({
        'name': 'td:nth-child(1) > a',
        'name_link': 'td:nth-child(1) > a > @href',
        'team': 'td:nth-child(1)',
        'ps_att': 'td:nth-child(2)',
        'ps_cmp': 'td:nth-child(3)',
        'ps_yd': 'td:nth-child(4)',
        'ps_td': 'td:nth-child(5)',
        'int': 'td:nth-child(6)',
        'ru_att': 'td:nth-child(8)',
        'ru_yd': 'td:nth-child(9)',
        'ru_td': 'td:nth-child(11)',
        'fantasy_pts': 'td:nth-child(18)'
      })
      .data((response) => {
        // console.log(response.name);
        this.parseProjSeas(response);
      })
      .log(console.log)
      .error(console.log)
      .debug(console.log);
  }

  public async parseProjSeas(obj: Fftoolbox.scrape.IScrapeProjSeasResponse) {
    obj.position = 'QB';

    let projSeason = await this.upsertProjOffSeasStat(obj);

    return projSeason;
  }
}

let test = new CbsQbScrape();
test.scrapeProjSeas();
