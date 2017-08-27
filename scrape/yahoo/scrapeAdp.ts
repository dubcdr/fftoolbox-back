import osmosis = require('osmosis');
import * as sleep from 'sleep';
import * as chalk from 'chalk';
import { YahooTools } from './yahooTools';
import { Fftoolbox } from './../fftoolbox';
import * as _ from 'lodash';

export class YahAdpScrape extends YahooTools {
  public year = 2017;
  // public osmosis = osmosis();
  public limit = 1;

  constructor() {
    super();

  }

  public async getAdp(): Promise<Array<Fftoolbox.models.IAvgDraftPos>> {
    let scrapeResults = await this.scrapeAdp();
    let results = new Array<Fftoolbox.models.IAvgDraftPos>();

    for (let result of scrapeResults) {
      this.parseScrapeName(result);
      result.yahooId = this.getOutletIdFromLink(result.yahooId);
      result.teamId = this.getTeamIdFromLink(result.team_string);
      result.outletId = Fftoolbox.EOutlets.yahoo;
      result.position = this.parsePos(result.pos_string);

      let model = await this.loopback.convertAveDraftPosScrape2Model(result);
      model = await this.loopback.aveDraftPosUpsertWithWhere(model);
      results.push(model);
    }

    return results;
  }

  public scrapeAdp(): Promise<Array<IYahooAvgDraftPosScrape>> {
    // const limit = Number.MAX_SAFE_INTEGER;
    const limit = Number.MAX_SAFE_INTEGER;
    const avgDraftPosUrl = `https://football.fantasysports.yahoo.com/f1/draftanalysis`;
    return new Promise((resolve, reject) => {
      let responses = new Array<IYahooAvgDraftPosScrape>();
      osmosis(avgDraftPosUrl).get(avgDraftPosUrl)
        .paginate('#playerspagenav2 li:last-of-type a', 3)
        .find(`#draftanalysistable tbody tr:limit(${limit})`)
        .set({
          name_link: 'td:nth-of-type(1) div.ysf-player-name a',
          yahooId: 'td:nth-of-type(1) div.ysf-player-name a @href',
          pos_string: 'td:nth-of-type(1) div.ysf-player-name span',
          team_string: 'td:nth-of-type(1) div.ysf-player-name span',
          pick: 'td:nth-of-type(2)'
        })
        .data((response: IYahooAvgDraftPosScrape) => {
          if (!this.isDefOrK(response.pos_string)) {
            responses.push(response);
          } else {
            console.log(chalk.yellow(`SKIPPING DEFENSE OR K: ${response.pos_string}`));
          }
        })
        .done(() => {
          resolve(responses);
        })
        .log(console.log)
        .error(console.log)
        .debug(console.log);
    })
  }

  public isDefOrK(str: string): boolean {
    return str.match(/(DEF|K)$/) !== null;
  }

  public parsePos(str: string): 'QB' | 'WR' | 'TE' | 'RB' {
    const regEx = /\b(\w{2})$/;
    let results = regEx.exec(str);
    if (results !== null) {
      return results[1].toUpperCase() as 'QB' | 'WR' | 'TE' | 'RB';
    } else {
      throw Error(`parse position error on ${str}`);
    }
  }

  public parseScrapeName(scrapeResult: IYahooAvgDraftPosScrape): void {
    let name = super.parseName(scrapeResult.name_link);
    scrapeResult.first_name = name.first;
    scrapeResult.last_name = name.last;
    if (name.suffix) {
      scrapeResult.suffix = name.suffix;
    }
  }

}

export interface IYahooAvgDraftPosScrape extends Fftoolbox.scrape.IAvgDraftPost {

}

let adpScrape = new YahAdpScrape();
adpScrape.getAdp().then((results) => {
  console.log(results);
}, (err) => {
  console.log('Error in Yahoo getAdp()', err);
})
