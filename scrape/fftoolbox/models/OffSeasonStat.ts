/* tslint:disable */
import {
  Player
} from '../index';

declare var Object: any;
export interface OffSeasonStatInterface {
  "gp"?: number;
  "fantasy_pts"?: number;
  "vbd"?: number;
  "ps_yd"?: number;
  "ps_att"?: number;
  "ps_cmp"?: number;
  "ps_td"?: number;
  "ru_att"?: number;
  "ru_yd"?: number;
  "ru_td"?: number;
  "rec_tg"?: number;
  "rec"?: number;
  "rec_yd"?: number;
  "rec_td"?: number;
  "two_pt"?: number;
  "ret_td"?: number;
  "fum"?: number;
  "int"?: number;
  "teamId"?: number;
  "playerId": number;
  "outletId": number;
  "year": number;
  "createdOn"?: Date;
  "modifiedOn"?: Date;
  "id"?: number;
  player?: Player;
}

export class OffSeasonStat implements OffSeasonStatInterface {
  "gp": number;
  "fantasy_pts": number;
  "vbd": number;
  "ps_yd": number;
  "ps_att": number;
  "ps_cmp": number;
  "ps_td": number;
  "ru_att": number;
  "ru_yd": number;
  "ru_td": number;
  "rec_tg": number;
  "rec": number;
  "rec_yd": number;
  "rec_td": number;
  "two_pt": number;
  "ret_td": number;
  "fum": number;
  "int": number;
  "teamId": number;
  "playerId": number;
  "outletId": number;
  "year": number;
  "createdOn": Date;
  "modifiedOn": Date;
  "id": number;
  player: Player;
  constructor(data?: OffSeasonStatInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `OffSeasonStat`.
   */
  public static getModelName() {
    return "OffSeasonStat";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of OffSeasonStat for dynamic purposes.
  **/
  public static factory(data: OffSeasonStatInterface): OffSeasonStat{
    return new OffSeasonStat(data);
  }
  /**
  * @method getModelDefinition
  * @author Julien Ledun
  * @license MIT
  * This method returns an object that represents some of the model
  * definitions.
  **/
  public static getModelDefinition() {
    return {
      name: 'OffSeasonStat',
      plural: 'OffSeasonStats',
      path: 'OffSeasonStats',
      properties: {
        "gp": {
          name: 'gp',
          type: 'number'
        },
        "fantasy_pts": {
          name: 'fantasy_pts',
          type: 'number'
        },
        "vbd": {
          name: 'vbd',
          type: 'number'
        },
        "ps_yd": {
          name: 'ps_yd',
          type: 'number'
        },
        "ps_att": {
          name: 'ps_att',
          type: 'number'
        },
        "ps_cmp": {
          name: 'ps_cmp',
          type: 'number'
        },
        "ps_td": {
          name: 'ps_td',
          type: 'number'
        },
        "ru_att": {
          name: 'ru_att',
          type: 'number'
        },
        "ru_yd": {
          name: 'ru_yd',
          type: 'number'
        },
        "ru_td": {
          name: 'ru_td',
          type: 'number'
        },
        "rec_tg": {
          name: 'rec_tg',
          type: 'number'
        },
        "rec": {
          name: 'rec',
          type: 'number'
        },
        "rec_yd": {
          name: 'rec_yd',
          type: 'number'
        },
        "rec_td": {
          name: 'rec_td',
          type: 'number'
        },
        "two_pt": {
          name: 'two_pt',
          type: 'number'
        },
        "ret_td": {
          name: 'ret_td',
          type: 'number'
        },
        "fum": {
          name: 'fum',
          type: 'number'
        },
        "int": {
          name: 'int',
          type: 'number'
        },
        "teamId": {
          name: 'teamId',
          type: 'number'
        },
        "playerId": {
          name: 'playerId',
          type: 'number'
        },
        "outletId": {
          name: 'outletId',
          type: 'number'
        },
        "year": {
          name: 'year',
          type: 'number'
        },
        "createdOn": {
          name: 'createdOn',
          type: 'Date'
        },
        "modifiedOn": {
          name: 'modifiedOn',
          type: 'Date'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
      },
      relations: {
        player: {
          name: 'player',
          type: 'Player',
          model: 'Player'
        },
      }
    }
  }
}
