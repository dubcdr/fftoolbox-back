/* tslint:disable */

declare var Object: any;
export interface NflTeamInterface {
  "id": number;
  "abbr": string;
  "city": string;
  "name": string;
  "conf": string;
  "div": string;
}

export class NflTeam implements NflTeamInterface {
  "id": number;
  "abbr": string;
  "city": string;
  "name": string;
  "conf": string;
  "div": string;
  constructor(data?: NflTeamInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `NflTeam`.
   */
  public static getModelName() {
    return "NflTeam";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of NflTeam for dynamic purposes.
  **/
  public static factory(data: NflTeamInterface): NflTeam{
    return new NflTeam(data);
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
      name: 'NflTeam',
      plural: 'NflTeams',
      path: 'NflTeams',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "abbr": {
          name: 'abbr',
          type: 'string'
        },
        "city": {
          name: 'city',
          type: 'string'
        },
        "name": {
          name: 'name',
          type: 'string'
        },
        "conf": {
          name: 'conf',
          type: 'string'
        },
        "div": {
          name: 'div',
          type: 'string'
        },
      },
      relations: {
      }
    }
  }
}
