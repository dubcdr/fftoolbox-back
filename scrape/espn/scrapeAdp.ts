import osmosis = require('osmosis');
import * as sleep from 'sleep';
import * as chalk from 'chalk';
import { EspnTools } from './espnScrape';
import { Fftoolbox } from './../fftoolbox';
import * as _ from 'lodash';

export class EspnAdpScrape extends EspnTools {
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
      result.espnId = this.getOutletIdFromLink(result.fantasyProsId);
      result.teamId = this.getTeamIdFromLink(result.team_string);
      result.outletId = Fftoolbox.EOutlets.fpros;
      result.position = this.parsePos(result.pos_string);
      try {
        let model = await this.loopback.convertAveDraftPosScrape2Model(result);
        model = await this.loopback.aveDraftPosUpsertWithWhere(model);
        results.push(model);
      } catch (err) {
        console.log(err);
        console.log(`error for ${result.name_link}`);
      }

    }

    return results;
  }

  public scrapeAdp(): Promise<Array<IYahooAvgDraftPosScrape>> {
    // const limit = 1;
    const limit = 300;
    const avgDraftPosUrl = `https://www.fantasypros.com/nfl/adp/overall.php`;
    return new Promise((resolve, reject) => {
      let responses = new Array<IYahooAvgDraftPosScrape>();
      osmosis(avgDraftPosUrl).get(avgDraftPosUrl)
        .find(`table.player-table tbody tr:limit(${limit})`)
        .set({
          name_link: 'td.player-label a',
          fantasyProsId: 'td.player-label a @href',
          pos_string: 'td:nth-of-type(3)',
          team_string: 'td.player-label small:first-of-type',
          pick: 'td:last-of-type'
        })
        .data((response: IYahooAvgDraftPosScrape) => {
          if (!this.isDefOrK(response.pos_string) && response.team_string !== undefined) {
            responses.push(response);
          } else {
            console.log(chalk.yellow(`SKIPPING DEFENSE OR K: ${response.pos_string} for ${response.name_link}`));
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
    return str.match(/(QB|WR|RB|TE)/) === null;
  }

  public parsePos(str: string): 'QB' | 'WR' | 'TE' | 'RB' {
    const regEx = /(\w{2})/;
    let results = regEx.exec(str);
    // console.log(`results for ${str}`, results);
    if (results != null && typeof results[1] === 'string') {
      // console.log(`results for parsePos: ${str}`, results);
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

let adpScrape = new EspnAdpScrape();
adpScrape.getAdp().then((responses) => {
    console.log(responses);
    console.log(responses.length);
})
// adpScrape.getAdp().then((results) => {
//   console.log(results);
// }, (err) => {
//   console.log('Error in Yahoo getAdp()', err);
// })
