import { Fftoolbox } from './../fftoolbox';
import * as chalk from 'chalk';
import * as moment from 'moment';
import * as _ from 'lodash';

export class PfrTools extends Fftoolbox.scrape.ScrapeTools {
  public baseUrl = 'www.pro-football-reference.com';
  public outletId = Fftoolbox.EOutlets.fftoday;

  public pfrPlayers = new Array<Fftoolbox.models.IPlayer>();

  constructor() {
    super();
  }

  public getOutletIdFromLink(link: string): number {
    return 0;
  }

  public parseDate(str: string): moment.Moment {
    return moment();
  }

  public async getAllPfrPlayers(filter = {}) {
    console.log('premerge filter', filter);
    _.merge(filter, {
      where: {
        pfrId: { neq: null }
      }
    });
    console.log('postmerge filter', filter);
    return await this.loopback.getAllPlayers(filter);
  }

};

export interface IPfrSeasonScrape extends Fftoolbox.scrape.IOffSeasStat {
  year_str?: string
  team_str?: string
}

export interface IPfrWeekScrape extends Fftoolbox.scrape.IOffWeekStat {

}
