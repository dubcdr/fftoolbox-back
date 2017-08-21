import osmosis = require('osmosis');
import { CbsTools } from './cbsScrape';
import { Fftoolbox } from './../fftoolbox';
import * as moment from 'moment';
import * as _ from 'lodash';

export class CbsRbScrape extends CbsTools {
  public year = 2017;
  public projSeasStatUrl = 'https://www.cbssports.com/fantasy/football/stats/sortable/points/RB/standard/projections/2017/ytd?print_rows=9999';
  public osmosis = osmosis(this.projSeasStatUrl);
  public limit = 150;

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
        'ru_att': 'td:nth-child(8)',
        'ru_yd': 'td:nth-child(9)',
        'ru_td': 'td:nth-child(11)',
        'rec_tg': 'td:nth-child(12)',
        'rec': 'td:nth-child(13)',
        'rec_yd': 'td:nth-child(14)',
        'rec_td': 'td:nth-child(16)',
        'fum': 'td:nth-child(17)',
        'fantasy_pts': 'td:nth-child(18)'
      })
      .data((response) => {
        // console.log(response);
        this.parseProjSeas(response);
      })
      .log(console.log)
      .error(console.log)
      .debug(console.log);
  }

  public async parseProjSeas(obj: Fftoolbox.scrape.IScrapeProjSeasResponse) {
    obj.position = 'RB';

    let projSeason = await this.upsertProjOffSeasStat(obj);

    return projSeason;
  }
}

let test = new CbsRbScrape();
test.scrapeProjSeas();
