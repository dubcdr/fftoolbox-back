// const prompt = require('prompt');
// const path = require('path');
// const app = require(path.resolve(__dirname, '../server/server'));

import prompt from 'prompt';

import * as _ from 'lodash';

const app = require('./../../server/server');

export namespace Fftoolbox {
  export enum EOutlets {
    pff = 1,
    fftoday,
    espn
  }

  export interface INflTeam {
    id?: number,
    abbr: string,
    city: string,
    name: string,
    conf: string,
    div: string
  }

  export interface IBaseStat {
    ps_yd?: number;
    ps_att?: number;
    ps_cmp?: number;
    ps_td?: number;
    ru_att?: number;
    ru_yd?: number;
    ru_td?: number;
    rec_tg?: number;
    rec?: number;
    rec_yd?: number;
    rec_td?: number;
    two_pt?: number;
    ret_td?: number;
    fum?: number;
    int?: number;
    teamId?: number;
    playerId: number;
    outletId: number;
  }

  export interface IPlayer {
    first_name: string,
    last_name: string,
    suffix?: string,
    position: 'QB' | 'WR' | 'TE' | 'RB',
    teamId?: number,
    pfrId?: number,
    espnId?: number,
    fftodayId?: number,
    id?: number
  }

  export interface IProjOffSeasStat extends IBaseStat {
    year: number,
    fantasy_pts?: number,
    outletId: number,
    date: Date
  }

  export class Utilities {
    public static parseStatToInt(str) {
      if (str == null) {
        return 0;
      } else {
        let parsed = parseInt(str);
        if (isNaN(parsed)) {
          return 0;
        } else {
          return parsed;
        }
      }
    }
  }

  export abstract class Loopback {
    public lb: any = app;
    public nflTeams: any;

    constructor() {
      this.initNflTeams().then((response) => {
        this.nflTeams = response;
      });
    }

    public initNflTeams(): Promise<any> {
      if (this.nflTeams == null) {
        this.nflTeams = new Array<INflTeam>();
      }
      return new Promise((resolve, reject) => {
        this.lb.models.NflTeam.find().then((response) => {
          resolve(_.keyBy(response, 'abbr'))
        }, (err) => {
          reject(err);
        });
      });
    }

    public playerUpsertWithWhere(where: any, model: IPlayer): Promise<IPlayer> {
      return new Promise((resolve, reject) => {
        this.lb.models.Player.upsertWithWhere(where, model, (err, model) => {
          if (err) {
            reject(err);
          } else {
            resolve(model);
          }
        })
      })
    }

    public getAllPlayers(filter = {}): Promise<Array<IPlayer>> {
      return new Promise((resolve, reject) => {
        this.lb.models.Player.find(filter, (err, responses) => {
          if (err) reject(err);
          resolve(responses);
        });
      });
    }

    public projSeasonUpsertWithWhere(where: any, model: IProjOffSeasStat): Promise<IProjOffSeasStat> {
      return new Promise((resolve, reject) => {
        this.lb.models.ProjSeasStat.upsertWithWhere(where, model, (err, model) => {
          if (err) {
            reject(err);
          } else {
            resolve(model);
          }
        })
      })
    }

    public projSeasonFindOrCreate(filter: any, model: IProjOffSeasStat): Promise<IProjOffSeasStat> {
      return new Promise((resolve, reject) => {
        this.lb.models.ProjSeasStat.findOrCreate(filter, model, (err, response: IProjOffSeasStat, created: boolean) => {
          if (err) reject(err);
          resolve(response);
        })
      })
    }

    public findPlayerIdByFirstLast(first_name, last_name): Promise<number> {
      return new Promise((resolve, reject) => {
        this.lb.models.Player.find({
          where: {
            first_name,
            last_name
          }
        }).then((response: Array<IPlayer>) => {
          if (response.length > 1) {
            console.error(`Multiple Entries Found for ${first_name} ${last_name}`);
            // reject(response);
            console.log(response);
            resolve(0);
          } else if (response.length === 0) {
            console.log(`No Entry Found for ${first_name} ${last_name}`)
            resolve(0);
          } else {
            resolve(response[0].id);
          }
        }, (error) => {
          reject(error);
        });
      })
    }

  }
}

