import osmosis = require('osmosis');
import { FftodayTools } from './';
import { Fftoolbox } from './../fftoolbox';
import * as moment from 'moment';
import * as _ from 'lodash';

const app = require('./../../server/server');

export class FftodayQbScrape extends FftodayTools {
  public year = 2017;
  public projSeasStatUrl = `http://www.fftoday.com/rankings/playerproj.php?Season=${this.year}&PosID=10&LeagueID=17`;
  public osmosis = osmosis(this.projSeasStatUrl);
  public limit = Number.MAX_SAFE_INTEGER;

  constructor() {
    super();
  }

  public scrapeProjSeas() {
    let projStatUrl
    this.osmosis.get(this.projSeasStatUrl)
      .find(`body`)
      .set({
        'dateString': '.update'
      })
      .find(`td.bodycontent > table:last-of-type table tr:not(.tablehdr):not(.tableclmhdr):limit(${this.limit})`)
      .set({
        'name': 'td:nth-child(2) > a',
        'name_link': 'td:nth-child(2) > a > @href',
        'team': 'td:nth-child(3)',
        'bye': 'td:nth-child(4)',
        'ps_cmp': 'td:nth-child(5)',
        'ps_att': 'td:nth-child(6)',
        'ps_yd': 'td:nth-child(7)',
        'ps_td': 'td:nth-child(8)',
        'int': 'td:nth-child(9)',
        'ru_att': 'td:nth-child(10)',
        'ru_yd': 'td:nth-child(11)',
        'ru_td': 'td:nth-child(12)',
        'fantasy_pts': 'td:nth-child(13)'
      })
      .data((response: IScrapeQbResponse) => {
        this.parseQbData(response);
      })
      .log(console.log)
      .error(console.log)
      .debug(console.log);
  }

  public async parseQbData(obj: IScrapeQbResponse): Promise<Fftoolbox.models.IOffProjSeasStat> {
    obj.position = 'QB';

    let projSeason = await this.upsertProjOffSeasStat(obj);

    return projSeason;
  }
}

interface IScrapeQbResponse extends Fftoolbox.scrape.IScrapeProjSeasResponse {
  ps_cmp: string;
  ps_att: string;
  ps_yd: string;
  ps_td: string;
  int: string;
  ru_att: string;
  ru_yd: string;
  ru_td: string;
}

let test = new FftodayQbScrape();
test.scrapeProjSeas();
