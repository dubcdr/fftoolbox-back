// const prompt = require('prompt');
// const path = require('path');
// const app = require(path.resolve(__dirname, '../server/server'));
// const loopback = require('loopback');

import prompt from 'prompt';
import loopback = require('./../../server/server');

export namespace Fftoolbox {
  export enum EOutlets {
    pff = 1,
    espn,
    fftoday
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
    team_id?: number;
    player_id: number;
  }

  export interface IProjSeasStat extends IBaseStat {
    year: number;
    player_id: number;
    fantasy_pts?: number;
    outlet_id: number;
    date: Date;
  }

  export class Loopback {
    public static app: any = loopback;
    constructor() {
    }

    public findPlayerIdByFirstLast(first_name, last_name) {
      return new Promise((resolve, reject) => {
        Loopback.app.models.Player.find({
          where: {
            first_name,
            last_name
          }
        }).then((response) => {
          if (response.length === 0) {
            console.log(`There were no results for ${first_name} ${last_name}`);
            console.log(`Enter 'quit' to exit or the id to continue`);
            prompt.start();
            prompt.get(['id'], (err, result) => {
              Loopback.app.models.Player.find({
                where: {
                  id: result.id
                }
              }).then((response) => {
                if (response.length === 1) {
                  resolve(result.id);
                } else {
                  process.exit(1);
                }
              })
            })
          } else if (response.length > 1) {
            console.log(`Multiple results were returned for ${first_name} ${last_name}`);
            console.log(response);
            console.log('Enter the zero based index of desired or -1 to exit');
            prompt.start();
            prompt.get(['index'], (err, result) => {
              if (parseInt(result.index) === -1) {
                process.exit(1);
              } else {
                resolve(response[parseInt(result.index)].id);
              }
            })
          } else {
            console.log(response[0]);
            resolve(response[0].id);
          }
        }, (error) => {
          console.log(error);
        });
      })
    }
  }
}

