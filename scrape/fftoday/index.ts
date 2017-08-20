import { Fftoolbox } from './../fftoolbox';
import * as chalk from 'chalk';
import * as moment from 'moment';
import * as _ from 'lodash';

export class FftodayTools extends Fftoolbox.scrape.ScrapeTools {
  public baseUrl = 'http://www.fftoday.com/';
  public outletId = Fftoolbox.EOutlets.fftoday;

  public getOutletIdFromLink(link: string): number {
    let reg = /\/\d*\//;
    let response = link.match(reg) as RegExpMatchArray;
    return parseInt(response[0].substr(1, response[0].length - 1));
  }

  public parseDate(str: string): moment.Moment {
    let regEx = /\b(\d{1,2})\/(\d{1,2})\/(\d{1,4})\b/
    let result = regEx.exec(str);
    if (result) {
      let M = Number.parseInt(result[1]) - 1;
      let d = Number.parseInt(result[2]);
      let y = Number.parseInt(result[3]) + 2000;
      let date = moment({ M, d, y });
      return date;
    } else {
      return moment();
    }
  }

  constructor() {
    super();
  }

  public parseOutletPlayer(data: Fftoolbox.scrape.IScrapeProjSeasResponse, pos: 'QB' | 'WR' | 'TE' | 'RB'): Fftoolbox.scrape.IPlayer {
    let player = super.parseOutletPlayer(data, pos);
    player.fftodayId = this.getOutletIdFromLink(data.name_link);

    return player;
  }

  public async upsertProjOffSeasStat(scrapeData: Fftoolbox.scrape.IScrapeProjSeasResponse): Promise<Fftoolbox.models.IOffProjSeasStat> {
    console.log(chalk.cyan(`Fftoday upsertProjOffSeasStat for ${scrapeData.name}`));
    let scrapePlayer = this.parseOutletPlayer(scrapeData, scrapeData.position);
    let player = await this.loopback.playerUpsertWithWhere(scrapePlayer);

    let projDate = this.parseDate(scrapeData.dateString);
    let data = _.extend({}, scrapeData, {
      playerId: player.id,
      outletId: this.outletId,
      teamId: player.teamId,
      date: projDate,
      year: projDate.get('y')
    });

    let projSeason = await this.loopback.projSeasonUpsertWithWhere(data)
    // console.log(chalk.dim(`proj season for ${player.first_name} ${player.last_name}`), projSeason);
    return projSeason;
  }

};
