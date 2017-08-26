import osmosis = require('osmosis');
import { FftodayTools } from './';
import { Fftoolbox } from './../fftoolbox';
import * as moment from 'moment';
import * as _ from 'lodash';
import * as chalk from 'chalk';

const app = require('./../../server/server');

export class FftodayRbScrape extends FftodayTools {
  public limit = Number.MAX_SAFE_INTEGER;
  public year = 2017;
  public projSeasStatUrl = `http://www.fftoday.com/rankings/playerproj.php?Season=${this.year}&PosID=20&LeagueID=17`;
  public osmosis = osmosis(this.projSeasStatUrl);

  constructor() {
    super();
  }

  public scrapeProjSeas() {
    this.osmosis.get(this.projSeasStatUrl)
      .paginate('div[align="center"] > a:contains("Next Page")', 3)
      .delay(2500)
      .find('body')
      .set({
        'dateString': '.update'
      })
      .find(`td.bodycontent > table:last-of-type table tr:not(.tablehdr):not(.tableclmhdr):limit(${this.limit})`)
      .set({
        'name': 'td:nth-child(2) > a',
        'name_link': 'td:nth-child(2) > a > @href',
        'team': 'td:nth-child(3)',
        'bye': 'td:nth-child(4)',
        'ru_att': 'td:nth-child(5)',
        'ru_yd': 'td:nth-child(6)',
        'ru_td': 'td:nth-child(7)',
        'rec': 'td:nth-child(8)',
        'rec_yd': 'td:nth-child(9)',
        'rec_td': 'td:nth-child(10)',
        'fantasy_pts': 'td:nth-child(11)'
      })
      .data((response: IScrapeRbResponse) => {
        // console.log(response);
        this.parseProjSeas(response);
      })
  }

  public async parseProjSeas(obj: IScrapeRbResponse): Promise<Fftoolbox.models.IOffProjSeasStat> {
    obj.position = 'RB';

    let projSeason = await this.upsertProjOffSeasStat(obj);

    return projSeason
  }

}

interface IScrapeRbResponse extends Fftoolbox.scrape.IScrapeProjSeasResponse {
  rec: string;
  rec_yd: string;
  rec_td: string;
  ru_att: string;
  ru_yd: string;
  ru_td: string;
}

let test = new FftodayRbScrape();
test.scrapeProjSeas();
