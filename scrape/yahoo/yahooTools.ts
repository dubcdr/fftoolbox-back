import { Fftoolbox } from './../fftoolbox';
import * as chalk from 'chalk';
import * as moment from 'moment';
import * as _ from 'lodash';

export class YahooTools extends Fftoolbox.scrape.ScrapeTools {
  public baseUrl = 'https://football.fantasysports.yahoo.com';
  public outletId = Fftoolbox.EOutlets.yahoo;

  public yahooPlayers = new Array<Fftoolbox.models.IPlayer>();

  constructor() {
    super();
  }

  public getOutletIdFromLink(link: string): string {
    const regEx = /\/(\d+)$/
    let matches = regEx.exec(link);
    if (matches !== null) {
      return matches[1];
    } else {
      throw new Error('No outletId found in Yahoo getOutletIdFromLink');
    }
  }

  public getTeamIdFromLink(link: string): number {
    const regEx = /^(\w{2,3})/
    let matches = regEx.exec(link);
    // console.log(`matches for ${link}`, matches);
    if (matches !== null) {
      return this.getTeam(matches[1].toUpperCase()).id;
    } else {
      throw new Error(`No teamId for ${link}, consider making a new rule`);
    }
  }

  public parseDate(str: string): moment.Moment {
    return moment();
  }

  public async getAllPfrPlayers(filter = {}) {
    _.merge(filter, {
      where: {
        yahooId: { neq: null }
      }
    });
    return await this.loopback.getAllPlayers(filter);
  }

};
