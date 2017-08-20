import osmosis = require('osmosis');
import { EspnTools } from './espnScrape';
import { Fftoolbox } from './../fftoolbox';
import * as moment from 'moment';
import * as _ from 'lodash';

export class EspnTesScrape extends EspnTools {
  public year = 2017;
  public projSeasStatUrl = 'http://games.espn.com/ffl/tools/projections?slotCategoryId=6';
  public osmosis = osmosis(this.projSeasStatUrl);
  public limit = Number.MAX_SAFE_INTEGER;

  constructor() {
    super();
  }

  public scrapeProjSeas() {
    this.osmosis.get(this.projSeasStatUrl)
      .paginate('.paginationNav a:contains("NEXT")', 2)
      .delay(2500)
      .find(`.pncPlayerRow:limit(${this.limit})`)
      .set({
        'name': '.playertablePlayerName > a:first-of-type',
        'name_link': '.playertablePlayerName > a > @href',
        'team': '.playertablePlayerName',
        'pos': '.playertablePlayerName',
        'rec': 'td:nth-child(10)',
        'rec_yd': 'td:nth-child(11)',
        'rec_td': 'td:nth-child(12)',
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
    obj.position = 'TE';

    let projSeason = await this.upsertProjOffSeasStat(obj);

    return projSeason;
  }
}

let test = new EspnTesScrape();
test.scrapeProjSeas();
