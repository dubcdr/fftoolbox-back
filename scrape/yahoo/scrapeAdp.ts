import osmosis = require('osmosis');
import * as sleep from 'sleep';
import { PfrTools, IPfrSeasonScrape, IPfrWeekScrape } from './pfrTools';
import { Fftoolbox } from './../fftoolbox';
import * as _ from 'lodash';

export class YahAdpScrape extends PfrTools {
  public year = 2017;
  // public osmosis = osmosis();
  public limit = Number.MAX_SAFE_INTEGER;

  constructor() {
    super();

  }

  public scrapeAdp(playerId: string): Promise<Array<IPfrSeasonScrape>> {
    const basePlayerUrl = `https://football.fantasysports.yahoo.com/f1/draftanalysis`;
    let responses = new Array<IPfrSeasonScrape>();
    return new Promise((resolve, reject) => {
      osmosis(basePlayerUrl).get(basePlayerUrl)
        // .find(`#all_passing div table.stats_table > tbody > tr`)
        // .set({
        //   year_str: 'th > a',
        //   team_str: 'td[data-stat="team"]',
        //   gp: 'td[data-stat="g"]',
        //   ps_yd: 'td[data-stat="pass_yds"]',
        //   ps_att: 'td[data-stat="pass_att"]',
        //   ps_cmp: 'td[data-stat="pass_cmp"]',
        //   ps_td: 'td[data-stat="passs_td"]',
        //   int: 'td[data-stat="pass_int"]'
        // })
        // .find('#all_rushing_and_receiving')
        // .set({
        //   title: '.section_heading > h2'
        // })
        // .find(`#all_rushing_and_receiving div:last-of-type`)
        .find('#all_rushing_and_receiving')
        .set('html')
        // .set({
        //   ru_att: 'td[data-stat="rush_att"]',
        //   ru_yd: 'td[data-stat="rush_yds"]',
        //   ru_td: 'td[data-stat="rush_td"]',
        //   rec: 'td[data-stat="rec"]',
        //   rec_tg: 'td[data-stat="targets"]',
        //   rec_yd: 'td[data-stat="rec_yds"]',
        //   rec_td: 'td[data-stat="rec_td"]',
        //   fum: 'td[data-stat="fumbles"]'
        // })
        .data((response: IPfrSeasonScrape) => {
          responses.push(response);
        })
        .done(() => {
          console.log(responses);
          resolve(responses);
        })
        .log(console.log)
        .error(console.log)
        .debug(console.log);
    })
  }

  // public async parseWeeklyData(obj: IPfrWeekScrape): Promise<Fftoolbox.models.IOffWeekStat {

  // }
}

let test = new PfrQbScrape();
test.parseSeaonData();

