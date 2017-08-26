/* tslint:disable */

declare var Object: any;
export interface PlayerBioInterface {
  "playerId": number;
  "dob"?: Date;
  "height"?: string;
  "weight"?: number;
  "college"?: string;
  "twitter"?: string;
  "draft_year"?: number;
  "jersey_num"?: number;
  "id"?: number;
}

export class PlayerBio implements PlayerBioInterface {
  "playerId": number;
  "dob": Date;
  "height": string;
  "weight": number;
  "college": string;
  "twitter": string;
  "draft_year": number;
  "jersey_num": number;
  "id": number;
  constructor(data?: PlayerBioInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `PlayerBio`.
   */
  public static getModelName() {
    return "PlayerBio";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of PlayerBio for dynamic purposes.
  **/
  public static factory(data: PlayerBioInterface): PlayerBio{
    return new PlayerBio(data);
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
      name: 'PlayerBio',
      plural: 'PlayerBios',
      path: 'PlayerBios',
      properties: {
        "playerId": {
          name: 'playerId',
          type: 'number'
        },
        "dob": {
          name: 'dob',
          type: 'Date'
        },
        "height": {
          name: 'height',
          type: 'string'
        },
        "weight": {
          name: 'weight',
          type: 'number'
        },
        "college": {
          name: 'college',
          type: 'string'
        },
        "twitter": {
          name: 'twitter',
          type: 'string'
        },
        "draft_year": {
          name: 'draft_year',
          type: 'number'
        },
        "jersey_num": {
          name: 'jersey_num',
          type: 'number'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
