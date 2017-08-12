import osmosis = require('osmosis');
import { FftodayTools, IScrapeFFtodayResponse } from './';
import { Fftoolbox } from './../fftoolbox';
import * as moment from 'moment';
import * as _ from 'lodash';

const app = require('./../../server/server');

export class FftodayQbScrape extends FftodayTools {
  public projSeasStatUrl = 'http://www.fftoday.com/rankings/playerproj.php?Season=2017&PosID=10&LeagueID=17';
  public osmosis = osmosis(this.projSeasStatUrl);
  public limit = 50;

  constructor() {
    super();
  }

  public scrapeQbs() {
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

  public async parseQbData(obj: IScrapeQbResponse): Promise<Fftoolbox.IProjOffSeasStat> {
    let name = FftodayTools.parseName(obj.name);

    let projData = await this.initProjOffSeasStat(obj, 'QB')

    await this.appendIdsToPlayerModel(name.first, name.last, projData.outletId);

    let data: Fftoolbox.IProjOffSeasStat = _.extend(projData, {
      ps_att: Fftoolbox.Utilities.parseStatToInt(obj.ps_att),
      ps_cmp: Fftoolbox.Utilities.parseStatToInt(obj.ps_cmp),
      ps_td: Fftoolbox.Utilities.parseStatToInt(obj.ps_td),
      ps_yd: Fftoolbox.Utilities.parseStatToInt(obj.ps_yd),
      int: Fftoolbox.Utilities.parseStatToInt(obj.int),
      ru_att: Fftoolbox.Utilities.parseStatToInt(obj.ru_att),
      ru_td: Fftoolbox.Utilities.parseStatToInt(obj.ru_td),
      ru_yd: Fftoolbox.Utilities.parseStatToInt(obj.ru_yd),
    });

    let projSeason = await this.projSeasonFindOrCreate(data);

    return projSeason;
  }
}

interface IScrapeQbResponse extends IScrapeFFtodayResponse {
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
test.scrapeQbs();
