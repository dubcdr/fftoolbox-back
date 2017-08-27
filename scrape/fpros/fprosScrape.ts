import { Fftoolbox } from './../fftoolbox';
import * as chalk from 'chalk';
import * as moment from 'moment';
import * as _ from 'lodash';

export class FProsScrape extends Fftoolbox.scrape.ScrapeTools {
  public baseUrl = 'https://www.fantasypros.com/nfl';
  public outletId = Fftoolbox.EOutlets.fpros;

  public players = new Array<Fftoolbox.models.IPlayer>();

  constructor() {
    super();
  }

  public getOutletIdFromLink(link: string): string {
    const regEx = /(?:\/)([\w.'-]+)(?:.php)$/;
    let matches = regEx.exec(link);
    // console.log(`matches for getOutletIdFromLin ${link}`, matches);
    if (matches[1] !== null && typeof matches[1] === 'string') {
        return matches[1];
    } else {
        throw Error(`Error in getOutletIdFromLink for ${link} for fprosScrape`)
    }
  }

  public parseDate(str: string): moment.Moment {
    return moment();
  }

  public getTeamIdFromLink(str: string): number {
    return this.getTeam(str.toUpperCase()).id;
  }

  public async getAllFProsPlayers(filter = {}) {
    console.log('premerge filter', filter);
    _.merge(filter, {
      where: {
        fprosId: { neq: null }
      }
    });
    console.log('postmerge filter', filter);
    return await this.loopback.getAllPlayers(filter);
  }

};


