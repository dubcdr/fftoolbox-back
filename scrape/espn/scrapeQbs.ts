import osmosis = require('osmosis');
import { EspnTools } from './espnScrape';
import { Fftoolbox } from './../fftoolbox';
import * as moment from 'moment';
import * as _ from 'lodash';

export class EspnQbScrape extends EspnTools {
  public year = 2017;
  public projSeasStatUrl = 'http://games.espn.com/ffl/tools/projections?slotCategoryId=0';
  public osmosis = osmosis(this.projSeasStatUrl);
  public limit = Number.MAX_SAFE_INTEGER;

  constructor() {
    super();
  }

  public scrapeProjSeas() {
    this.osmosis.get(this.projSeasStatUrl)
      .find(`.pncPlayerRow:limit(${this.limit})`)
      .set({
        'name': '.playertablePlayerName > a:first-of-type',
        'name_link': '.playertablePlayerName > a > @href',
        'team': '.playertablePlayerName',
        'pos': '.playertablePlayerName',
        'ps_cmp': 'td:nth-child(3)',
        'ps_att': 'td:nth-child(3)',
        'ps_yd': 'td:nth-child(4)',
        'ps_td': 'td:nth-child(5)',
        'int': 'td:nth-child(6)',
        'ru_att': 'td:nth-child(7)',
        'ru_yd': 'td:nth-child(8)',
        'ru_td': 'td:nth-child(9)',
        'fantasy_pts': 'td:nth-child(13)'
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
    obj.position = 'QB';

    let projSeason = await this.upsertProjOffSeasStat(obj);

    return projSeason;
  }
}

let test = new EspnQbScrape();
test.scrapeProjSeas();
