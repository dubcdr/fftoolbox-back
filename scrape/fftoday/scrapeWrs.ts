import osmosis = require('osmosis');
import { FftodayTools, IScrapeFFtodayResponse } from './';
import { Fftoolbox } from './../fftoolbox';
import * as moment from 'moment';
import * as _ from 'lodash';
import * as chalk from 'chalk';

const app = require('./../../server/server');

export class FftodayWrScrape extends FftodayTools {
  public limit = 1;
  public year = 2017;
  public projSeasStatUrl = `http://www.fftoday.com/rankings/playerproj.php?Season=${this.year}&PosID=30&LeagueID=17`;
  public osmosis = osmosis(this.projSeasStatUrl);

  constructor() {
    super();
  }

  public scrapeWrs() {
    this.osmosis.get(this.projSeasStatUrl)
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
        'rec': 'td:nth-child(5)',
        'rec_yd': 'td:nth-child(6)',
        'rec_td': 'td:nth-child(7)',
        'ru_att': 'td:nth-child(8)',
        'ru_yd': 'td:nth-child(9)',
        'ru_td': 'td:nth-child(10)',
        'fantasy_pts': 'td:nth-child(11)'
      })
      .data((response: IScrapeWrResponse) => {
        this.parseWrData(response);
      })
  }

  public async parseWrData(obj: IScrapeWrResponse): Promise<Fftoolbox.IProjOffSeasStat> {
    console.log(chalk.blue('Start of parseWrData'));
    let name = FftodayTools.parseName(obj.name);

    let projData = await this.initProjOffSeasStat(obj, 'WR');

    await this.appendIdsToPlayerModel(name.first, name.last, projData.outletId);

    const parseStrToStat = Fftoolbox.Utilities.parseStatToInt;

    let data: Fftoolbox.IProjOffSeasStat = _.extend(projData, {
      rec: parseStrToStat(obj.rec),
      rec_yd: parseStrToStat(obj.rec_yd),
      rec_td: parseStrToStat(obj.rec_td),
      ru_att: parseStrToStat(obj.ru_att),
      ru_yd: parseStrToStat(obj.ru_yd),
      ru_td: parseStrToStat(obj.ru_td)
    });

    console.log(chalk.cyan('result of initProjOffSeasStat and extend'), data);

    let projSeason = await this.projSeasonFindOrCreate(data);

    console.log(chalk.cyan('result from create in backend'), projSeason);

    console.log(chalk.blue('End of parseWrData'));
    return projSeason;
  }

}

interface IScrapeWrResponse extends IScrapeFFtodayResponse {
  rec: string;
  rec_yd: string;
  rec_td: string;
  ru_att: string;
  ru_yd: string;
  ru_td: string;
}

let test = new FftodayWrScrape();
test.scrapeWrs();
