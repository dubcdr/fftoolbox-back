import { Fftoolbox } from './../fftoolbox';
import * as chalk from 'chalk';
import * as moment from 'moment';

export class FftodayTools extends Fftoolbox.Loopback {
  public static baseUrl = 'http://www.fftoday.com/';
  public static outletId = 3;

  public static getFftodayIdFromLink(link: string): number {
    let reg = /\/\d*\//;
    let response = link.match(reg) as RegExpMatchArray;
    return parseInt(response[0].substr(1, response[0].length - 1));
  }

  public static parseDate(str: string): moment.Moment {
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

  public async initProjOffSeasStat(scrapeData: IScrapeFFtodayResponse, pos: 'QB' | 'WR' | 'TE' | 'RB'): Promise<Fftoolbox.IProjOffSeasStat> {
    console.log(chalk.blue('Starting initProjOffSeasStat'))
    let name = FftodayTools.parseName(scrapeData.name);
    console.log(chalk.dim(`${name.first} ${name.last}`));
    let fftodayId = FftodayTools.getFftodayIdFromLink(scrapeData.name_link);

    let playerId = await this.findPlayerIdByFirstLast(name.first, name.last);
    if (playerId > 0) {
      console.log(chalk.dim(`playerdId: ${playerId}`));
    }
    let projDate = FftodayTools.parseDate(scrapeData.dateString);

    if (!(playerId > 0)) {
      console.log(chalk.bgRed(`Player ${name.first} ${name.last} not found. Creating...`));
      console.log('need to make player for', scrapeData);
      let player: Fftoolbox.IPlayer = {
        first_name: name.first,
        last_name: name.last,
        position: pos,
        teamId: this.nflTeams[scrapeData.team].id,
        fftodayId: fftodayId,
      }
      let where = {
        first_name: name.first,
        last_name: name.last
      }
      player = await this.playerUpsertWithWhere(where, player);
      console.log(chalk.bgGreen('Player Inserted'), player);
      if (player && player.id) {
        playerId = player.id;
      };
    }

    let data: Fftoolbox.IProjOffSeasStat = {
      date: projDate.toDate(),
      year: projDate.toDate().getFullYear(),
      outletId: Fftoolbox.EOutlets.fftoday,
      fantasy_pts: Fftoolbox.Utilities.parseStatToInt(scrapeData.fantasy_pts),
      playerId,
      teamId: this.getTeam(scrapeData.team).id
    }
    console.log(chalk.blue('End initProjOffSeasStat with result:'), data);

    return data;
  }

  public appendIdsToPlayerModel(first_name: string, last_name: string, fftodayId: number): Promise<Fftoolbox.IPlayer> {
    console.log(chalk.dim(`Adding fftoday player id: ${fftodayId} to ${first_name} ${last_name}`));
    return new Promise<any>((resolve, reject) => {
      this.lb.models.Player.upsertWithWhere({
        first_name,
        last_name
      }, {
          fftodayId
        }, (err, object) => {
          if (err) {
            reject(err);
          } else {
            console.log(chalk.dim('added, player object:', object));
            resolve(object);
          }
        })
    });
  }

  public static parseName(str: string): { first: string, last: string } {
    let index = str.indexOf(' ');
    let first = str.substring(0, index);
    let last = str.substring(index + 1, str.length)
    return {
      first,
      last
    };
  }

  public getTeam(short: string) {
    if (short === 'JAC') {
      return this.nflTeams['JAX']
    } else {
      return this.nflTeams[short];
    }
  }


};

export interface IScrapeFFtodayResponse {
  dateString: string;
  name: string;
  name_link: string;
  team: string;
  bye: string;
  fantasy_pts: string;
}
