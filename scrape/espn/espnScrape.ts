import { Fftoolbox } from './../fftoolbox';
import * as chalk from 'chalk';
import * as moment from 'moment';
import * as _ from 'lodash';

export class EspnTools extends Fftoolbox.scrape.ScrapeTools {
  public baseUrl = 'http://www.espn.com/';
  public outletId = Fftoolbox.EOutlets.espn;

  public getOutletIdFromLink(link: string): string {
    return '';
  }

  public parseDate(str: string): moment.Moment {
    return moment();
  }

  public getTeamIdFromLink(str: string): number {
    return this.getTeam(str).id;
  }

  public parsePosAndTeamStr(str: string): { team: string, pos: 'QB' | 'WR' | 'TE' | 'RB' } {
    // console.log('parsePosAndTeam', str);
    const regEx = /(?:,\s)(\w{2,3})(?:\s)(\w{2})/;
    let matches = regEx.exec(str);
    // console.log(matches);
    return { team: matches[1].toUpperCase(), pos: matches[2].toUpperCase() as 'QB' | 'WR' | 'TE' | 'RB' };
  }

  public parseQbAttCmp(str: string): { att: string, cmp: string } {
    // console.log('parseQbAtt', str);
    const regEx = /([\d.]+)(?:\/)([\d.]+)/
    let matches = regEx.exec(str);
    // console.log('matches', matches);
    return { att: matches[2], cmp: matches[1] };
  }

  public parseOutletPlayer(data: Fftoolbox.scrape.IScrapeProjSeasResponse, pos: 'QB' | 'WR' | 'TE' | 'RB'): Fftoolbox.scrape.IPlayer {
    data.team = this.parsePosAndTeamStr(data.team).team;
    let player = super.parseOutletPlayer(data, pos);

    return player;
  }

  public async upsertProjOffSeasStat(scrapeData: Fftoolbox.scrape.IScrapeProjSeasResponse): Promise<Fftoolbox.models.IOffProjSeasStat> {
    console.log(chalk.cyan(`Espn: upsertProjOffSeasStat for ${scrapeData.name}`));
    if (scrapeData.position === 'QB') {
      scrapeData.ps_att = this.parseQbAttCmp(scrapeData.ps_att).att;
      scrapeData.ps_cmp = this.parseQbAttCmp(scrapeData.ps_cmp).cmp;
    }


    let scrapePlayer = this.parseOutletPlayer(scrapeData, scrapeData.position);

    let player = await this.loopback.playerUpsertWithWhere(scrapePlayer);
    if (player === undefined || player.id === null || player.id === undefined) {
      console.log(`cant parse ${scrapeData.name} has undefined id`);
    } else {
      // console.log(`${scrapePlayer.name}: id: ${player.id}`)
    }

    let projDate = this.parseDate(scrapeData.dateString);
    let data = _.extend({}, scrapeData, {
      playerId: player.id,
      teamId: player.teamId,
      outletId: Fftoolbox.EOutlets.espn,
      date: projDate,
      year: projDate.get('y')
    });

    // console.log(data);

    let projSeason = await this.loopback.projSeasonUpsertWithWhere(data);

    return projSeason;
    // return null;
  }

}
