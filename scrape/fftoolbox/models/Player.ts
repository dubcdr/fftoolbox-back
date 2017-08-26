/* tslint:disable */
import {
  OffSeasonStat,
  OffWeekStat,
  PlayerBio,
  ProjSeasStat,
  AveDraftPos
} from '../index';

declare var Object: any;
export interface PlayerInterface {
  "first_name": string;
  "last_name": string;
  "suffix"?: string;
  "position": string;
  "teamId"?: number;
  "pfrId"?: string;
  "espnId"?: number;
  "fftodayId"?: number;
  "fantasyProsId"?: string;
  "cbsId"?: string;
  "yahooId"?: string;
  "createdOn"?: Date;
  "modifiedOn"?: Date;
  "id"?: number;
  season?: OffSeasonStat[];
  week?: OffWeekStat[];
  bio?: PlayerBio;
  projSeasStats?: ProjSeasStat[];
  aveDraftPos?: AveDraftPos[];
}

export class Player implements PlayerInterface {
  "first_name": string;
  "last_name": string;
  "suffix": string;
  "position": string;
  "teamId": number;
  "pfrId": string;
  "espnId": number;
  "fftodayId": number;
  "fantasyProsId": string;
  "cbsId": string;
  "yahooId": string;
  "createdOn": Date;
  "modifiedOn": Date;
  "id": number;
  season: OffSeasonStat[];
  week: OffWeekStat[];
  bio: PlayerBio;
  projSeasStats: ProjSeasStat[];
  aveDraftPos: AveDraftPos[];
  constructor(data?: PlayerInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Player`.
   */
  public static getModelName() {
    return "Player";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Player for dynamic purposes.
  **/
  public static factory(data: PlayerInterface): Player{
    return new Player(data);
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
      name: 'Player',
      plural: 'Players',
      path: 'Players',
      properties: {
        "first_name": {
          name: 'first_name',
          type: 'string'
        },
        "last_name": {
          name: 'last_name',
          type: 'string'
        },
        "suffix": {
          name: 'suffix',
          type: 'string'
        },
        "position": {
          name: 'position',
          type: 'string'
        },
        "teamId": {
          name: 'teamId',
          type: 'number'
        },
        "pfrId": {
          name: 'pfrId',
          type: 'string'
        },
        "espnId": {
          name: 'espnId',
          type: 'number'
        },
        "fftodayId": {
          name: 'fftodayId',
          type: 'number'
        },
        "fantasyProsId": {
          name: 'fantasyProsId',
          type: 'string'
        },
        "cbsId": {
          name: 'cbsId',
          type: 'string'
        },
        "yahooId": {
          name: 'yahooId',
          type: 'string'
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
        season: {
          name: 'season',
          type: 'OffSeasonStat[]',
          model: 'OffSeasonStat'
        },
        week: {
          name: 'week',
          type: 'OffWeekStat[]',
          model: 'OffWeekStat'
        },
        bio: {
          name: 'bio',
          type: 'PlayerBio',
          model: 'PlayerBio'
        },
        projSeasStats: {
          name: 'projSeasStats',
          type: 'ProjSeasStat[]',
          model: 'ProjSeasStat'
        },
        aveDraftPos: {
          name: 'aveDraftPos',
          type: 'AveDraftPos[]',
          model: 'AveDraftPos'
        },
      }
    }
  }
}
