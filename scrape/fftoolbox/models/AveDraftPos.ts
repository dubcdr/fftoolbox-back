/* tslint:disable */
import {
  Player
} from '../index';

declare var Object: any;
export interface AveDraftPosInterface {
  "playerId": number;
  "pick"?: number;
  "roundNumber"?: number;
  "roundPick"?: number;
  "outletId": number;
  "posRank"?: number;
  "year": number;
  "createdOn"?: Date;
  "modifiedOn"?: Date;
  "id"?: number;
  player?: Player;
}

export class AveDraftPos implements AveDraftPosInterface {
  "playerId": number;
  "pick": number;
  "roundNumber": number;
  "roundPick": number;
  "outletId": number;
  "posRank": number;
  "year": number;
  "createdOn": Date;
  "modifiedOn": Date;
  "id": number;
  player: Player;
  constructor(data?: AveDraftPosInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `AveDraftPos`.
   */
  public static getModelName() {
    return "AveDraftPos";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of AveDraftPos for dynamic purposes.
  **/
  public static factory(data: AveDraftPosInterface): AveDraftPos{
    return new AveDraftPos(data);
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
      name: 'AveDraftPos',
      plural: 'AveDraftPos',
      path: 'AveDraftPos',
      properties: {
        "playerId": {
          name: 'playerId',
          type: 'number'
        },
        "pick": {
          name: 'pick',
          type: 'number'
        },
        "roundNumber": {
          name: 'roundNumber',
          type: 'number'
        },
        "roundPick": {
          name: 'roundPick',
          type: 'number'
        },
        "outletId": {
          name: 'outletId',
          type: 'number'
        },
        "posRank": {
          name: 'posRank',
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
