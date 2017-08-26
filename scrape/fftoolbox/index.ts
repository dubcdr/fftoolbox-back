// const prompt = require('prompt');
// const path = require('path');
// const app = require(path.resolve(__dirname, '../server/server'));

import prompt from 'prompt';

import * as _ from 'lodash';
import * as moment from 'moment';
import * as chalk from 'chalk';

/* This is to export the models from the sdk generator */
export * from './models/index';

import * as LbModelGenerator from './models'

const app = require('./../../server/server');

export namespace Fftoolbox {
  export enum EOutlets {
    pfr = 1,
    fftoday,
    espn,
    fpros,
    cbs,
    yahoo
  }

  export enum EPosition {
    QB,
    WR,
    RB,
    TE,
    K,
    DEF
  }

  export namespace models {
    export interface IPlayer extends LbModelGenerator.PlayerInterface {
      position: 'QB' | 'WR' | 'TE' | 'RB',
    }

    export interface INflTeam extends LbModelGenerator.NflTeamInterface { }

    export interface IOffWeekStat extends LbModelGenerator.OffWeekStatInterface { }

    export interface IOffSeasStat extends LbModelGenerator.OffSeasonStatInterface { }

    export interface IOffProjSeasStat extends LbModelGenerator.ProjSeasStatInterface { }
  }

  export namespace scrape {
    export interface IPlayer {
      name: string,
      name_link?: string,
      first_name?: string,
      last_name?: string,
      suffix?: string,
      position: 'QB' | 'WR' | 'TE' | 'RB',
      teamId?: number,
      team: string,
      pfrId?: string,
      espnId?: number,
      fftodayId?: number,
      cbsId?: string,
      id?: number
    }

    export interface IBaseStat {
      ps_yd?: string;
      ps_att?: string;
      ps_cmp?: string;
      ps_td?: string;
      ru_att?: string;
      ru_yd?: string;
      ru_td?: string;
      rec_tg?: string;
      rec?: string;
      rec_yd?: string;
      rec_td?: string;
      two_pt?: string;
      ret_td?: string;
      fum?: string;
      int?: string;
      year?: number;
      teamId?: number;
      playerId?: number;
      outletId?: number;
    }

    export interface IOffWeekStat extends IBaseStat {
      week?: string;
      oppId?: string;
    }

    export interface IOffSeasStat extends IBaseStat {
      gp?: string;
      fantasy_pts?: string;
      vbd?: string
    }

    export interface IOffProjSeasStat extends IBaseStat {
      fantasy_pts: string;
      date?: moment.Moment;
    }

    export interface IScrapeProjSeasResponse extends Fftoolbox.scrape.IPlayer, Fftoolbox.scrape.IOffProjSeasStat {
      dateString: string;
      name: string;
      name_link: string;
      team: string;
    }

    export abstract class ScrapeTools {
      public abstract baseUrl: string;
      public abstract outletId: number;

      public abstract parseDate(str: string): moment.Moment;
      public abstract getOutletIdFromLink(link: string): number | string;

      public loopback = new Fftoolbox.Loopback();

      constructor() {
      }

      public parseName(str: string): { first: string, last: string, suffix?: string } | null {
        const regEx = /([\w-.']+)\s([\w-.']+)(?:\s)?([\w.]+)?/g
        let matches = regEx.exec(str);
        if (matches) {
          let name = {
            first: matches[1],
            last: matches[2]
          };
          if (typeof matches[3] === 'string') {
            name = _.extend(name, { suffix: matches[3] })
          };
          return name;
        } else {
          return null;
        }
      }

      public parseOutletPlayer(data: IPlayer, pos: 'QB' | 'WR' | 'TE' | 'RB'): Fftoolbox.scrape.IPlayer {
        let { first, last, suffix } = this.parseName(data.name);

        let player: Fftoolbox.scrape.IPlayer = _.extend({}, data, {
          first_name: first,
          last_name: last,
          suffix,
          teamId: this.getTeam(data.team.toUpperCase()).id,
          position: pos
        });

        return player;
      }

      public getTeam(short: string): Fftoolbox.models.INflTeam {
        let unconvetionalShorts = [
          'NWE', 'TAM', 'SFO', 'NOR', 'SDG', 'SD', 'KAN',
          'GNB', 'STL', 'JAC', 'WSH'
        ]

        if (_.indexOf(unconvetionalShorts, short.toUpperCase()) >= 0) {
          short = this.convertUnconventialShort(short);
        }

        return this.loopback.nflTeams[short.toUpperCase()];
      }

      public convertUnconventialShort(str: string): string {
        str = str.toUpperCase();
        if (str === 'NWE') {
          return 'NE';
        } else if (str === 'TAM') {
          return 'TB';
        } else if (str === 'SFO') {
          return 'SF';
        } else if (str === 'NOR') {
          return 'NO';
        } else if (str === 'SDG') {
          return 'LAC';
        } else if (str === 'SD') {
          return 'LAC';
        } else if (str === 'KAN') {
          return 'KC';
        } else if (str === 'GNB') {
          return 'GB';
        } else if (str === 'STL') {
          return 'LAR';
        } else if (str === 'JAC') {
          return 'JAX';
        } else if (str === 'WSH') {
          return 'WAS';
        }
        else {
          console.log(chalk.bgRed(`ERROR TRYING TO FIND TEAM FOR ${str}`));
          return null;
        }
      }
    }

    export function parseBaseStat(obj: scrape.IBaseStat): models.IBaseStat {
      const parseStrToStat = Fftoolbox.Utilities.parseStatToInt;
      return {
        ps_att: parseStrToStat(obj.ps_att),
        ps_cmp: parseStrToStat(obj.ps_cmp),
        ps_td: parseStrToStat(obj.ps_td),
        ps_yd: parseStrToStat(obj.ps_yd),
        ru_att: parseStrToStat(obj.ru_att),
        ru_td: parseStrToStat(obj.ru_td),
        ru_yd: parseStrToStat(obj.ru_yd),
        rec: parseStrToStat(obj.rec),
        rec_td: parseStrToStat(obj.rec_td),
        rec_tg: parseStrToStat(obj.rec_tg),
        rec_yd: parseStrToStat(obj.rec_yd),
        two_pt: parseStrToStat(obj.two_pt),
        ret_td: parseStrToStat(obj.ret_td),
        fum: parseStrToStat(obj.fum),
        int: parseStrToStat(obj.int),
        year: obj.year,
        outletId: obj.outletId,
        teamId: obj.teamId,
        playerId: obj.playerId
      }
    }

    export function parseOffProjSeasStat(obj: scrape.IOffProjSeasStat): models.IOffProjSeasStat {
      const parseStrToStat = Fftoolbox.Utilities.parseStatToInt;
      return _.extend({}, scrape.parseBaseStat(obj), {
        fantasy_pts: parseStrToStat(obj.fantasy_pts),
        date: obj.date
      });
    }
  }

  export class Utilities {
    public static parseStatToInt(str: string) {
      if (str == null) {
        return 0;
      } else {
        let noCommas = str.replace(/,/g, '');
        let parsed = parseInt(noCommas);
        if (isNaN(parsed)) {
          return 0;
        } else {
          return parsed;
        }
      }
    }
  }

  export class Loopback {
    public lb: any = app;
    public nflTeams: any;

    constructor() {
      this.initNflTeams().then((response) => {
        this.nflTeams = response;
      });
    }

    /**
     *
     *  PLAYERS
     *
     */

    public playerUpsertWithWhere(model: scrape.IPlayer, where?: any): Promise<models.IPlayer> {
      console.log(chalk.blue(`Fftoolbox: playerUpsertWithWhere for ${model.first_name} ${model.last_name}`));
      let filterWhere = _.extend({}, {
        first_name: model.first_name,
        last_name: model.last_name
      }, where);
      if (model.id !== null) {
        where = _.extend(where, { id: model.id });
      }
      // console.log(chalk.dim('filterWhere'), filterWhere);
      return new Promise((resolve, reject) => {
        this.lb.models.Player.upsertWithWhere(filterWhere, model, (err, model: models.IPlayer) => {
          if (err) {
            console.error(chalk.bgRed(`error on playerUpsertWithWhere:`), model);
            reject(err);
          } else {
            resolve(model);
          }
        })
      })
    }

    public getAllPlayers(filter = {}): Promise<Array<models.IPlayer>> {
      return new Promise((resolve, reject) => {
        this.lb.models.Player.find(filter, (err, responses) => {
          if (err) reject(err);
          resolve(responses);
        });
      });
    }

    public findPlayerByFirstLast(first_name: string, last_name: string): Promise<models.IPlayer> {
      return new Promise((resolve, reject) => {
        this.lb.models.Player.find({
          where: {
            first_name,
            last_name
          }
        }).then((response: Array<models.IPlayer>) => {
          if (response.length > 1) {
            console.error(`Multiple Entries Found for ${first_name} ${last_name}`);
            // reject(response);
            console.log(response);
            resolve(null);
          } else if (response.length === 0) {
            console.log(`No Entry Found for ${first_name} ${last_name}`)
            resolve(null);
          } else {
            resolve(response[0]);
          }
        }, (err) => {
          console.error(chalk.bgRed(`Error in findPlayerByFirstLast for: ${first_name} ${last_name}`));
        })
      })
    }

    public findPlayerIdByFirstLast(first_name, last_name): Promise<number> {
      return new Promise((resolve, reject) => {
        this.findPlayerByFirstLast(first_name, last_name).then((response) => {
          resolve(response.id);
        }, (error) => {
          reject(error);
        })
      })
    }

    /**
     *
     *  PROJECTED SEASON
     *
     */

    public projSeasonUpsertWithWhere(model: scrape.IOffProjSeasStat, where?: any): Promise<models.IOffProjSeasStat> {
      // console.log(chalk.blue(`Fftoolbox: projSeasonUpsertWithWhere for ${model.playerId}`));
      let transformed = scrape.parseOffProjSeasStat(model);
      let whereFilter = _.assign({}, {
        year: model.year,
        outletId: model.outletId,
        playerId: model.playerId,
        date: {
          gt: moment(model.date).subtract(2, 'd').toDate(),
          lt: moment(model.date).add(2, 'd').toDate()
        }
      }, where);

      return new Promise((resolve, reject) => {
        this.lb.models.ProjSeasStat.upsertWithWhere(whereFilter, transformed, (err, model) => {
          if (err) {
            reject(err);
          } else {
            resolve(model);
          }
        })
      })
    }

    /**
     *
     *  TEAMS
     *
     */

    public initNflTeams(): Promise<any> {
      if (this.nflTeams == null) {
        this.nflTeams = new Array<models.INflTeam>();
      }
      return new Promise((resolve, reject) => {
        this.lb.models.NflTeam.find().then((response) => {
          resolve(_.keyBy(response, 'abbr'))
        }, (err) => {
          reject(err);
        });
      });
    }
  }
}

