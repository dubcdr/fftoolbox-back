import { Fftoolbox } from './../fftoolbox';
import * as chalk from 'chalk';
import * as moment from 'moment';
import * as _ from 'lodash';

export class CbsTools extends Fftoolbox.scrape.ScrapeTools {
  public baseUrl = 'http://www.cbssports.com/';
  public outletId = Fftoolbox.EOutlets.cbs;

  public getOutletIdFromLink(link: string): string {
    return link;
  }

  public parseDate(str: string): moment.Moment {
    return moment();
  }

  public parseTeam(str: string): { team: string } {
    // console.log('parsePosAndTeam', str);
    const regEx = /(?:,\s)(\w{2,3})/;
    let matches = regEx.exec(str);
    // console.log(matches);
    return { team: matches[1].toUpperCase() };
  }

  public parseOutletPlayer(data: Fftoolbox.scrape.IScrapeProjSeasResponse, pos: 'QB' | 'WR' | 'TE' | 'RB'): Fftoolbox.scrape.IPlayer {
    data.team = this.parseTeam(data.team).team;
    data.cbsId = data.name_link;
    let player = super.parseOutletPlayer(data, pos);

    return player;
  }

  public async upsertProjOffSeasStat(scrapeData: Fftoolbox.scrape.IScrapeProjSeasResponse): Promise<Fftoolbox.models.IOffProjSeasStat> {
    console.log(chalk.cyan(`CBS: upsertProjOffSeasStat for ${scrapeData.name}`));

    let scrapePlayer = this.parseOutletPlayer(scrapeData, scrapeData.position);

    let player = await this.loopback.playerUpsertWithWhere(scrapePlayer);

    let projDate = this.parseDate(scrapeData.dateString);
    let data = _.extend({}, scrapeData, {
      playerId: player.id,
      teamId: player.teamId,
      outletId: Fftoolbox.EOutlets.cbs,
      date: projDate,
      year: projDate.get('y')
    });

    // console.log(data);

    let projSeason = await this.loopback.projSeasonUpsertWithWhere(data);

    console.log(chalk.bgGreen(`Success upsertProjOffSeasStat for ${player.first_name} ${player.last_name} | projSeasId: ${projSeason.id}`))

    return projSeason;
    // return null;
  }

}
