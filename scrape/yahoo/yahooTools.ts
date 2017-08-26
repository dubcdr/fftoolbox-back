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

  public getOutletIdFromLink(link: string): number {
    return 0;
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
