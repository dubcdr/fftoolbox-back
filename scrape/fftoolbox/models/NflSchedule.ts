/* tslint:disable */

declare var Object: any;
export interface NflScheduleInterface {
  "teamId": number;
  "year": number;
  "wk1Opp": number;
  "wk2Opp": number;
  "wk3Opp": number;
  "wk4Opp": number;
  "wk5Opp": number;
  "wk6Opp": number;
  "wk7Opp": number;
  "wek8Opp": number;
  "wk9Opp": number;
  "wk11Opp": number;
  "wk12Opp": number;
  "wk13Opp": number;
  "wk14Opp": number;
  "wk15Opp": number;
  "wk16Opp": number;
  "wk17Opp": number;
  "id"?: number;
}

export class NflSchedule implements NflScheduleInterface {
  "teamId": number;
  "year": number;
  "wk1Opp": number;
  "wk2Opp": number;
  "wk3Opp": number;
  "wk4Opp": number;
  "wk5Opp": number;
  "wk6Opp": number;
  "wk7Opp": number;
  "wek8Opp": number;
  "wk9Opp": number;
  "wk11Opp": number;
  "wk12Opp": number;
  "wk13Opp": number;
  "wk14Opp": number;
  "wk15Opp": number;
  "wk16Opp": number;
  "wk17Opp": number;
  "id": number;
  constructor(data?: NflScheduleInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `NflSchedule`.
   */
  public static getModelName() {
    return "NflSchedule";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of NflSchedule for dynamic purposes.
  **/
  public static factory(data: NflScheduleInterface): NflSchedule{
    return new NflSchedule(data);
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
      name: 'NflSchedule',
      plural: 'NflSchedules',
      path: 'NflSchedules',
      properties: {
        "teamId": {
          name: 'teamId',
          type: 'number'
        },
        "year": {
          name: 'year',
          type: 'number'
        },
        "wk1Opp": {
          name: 'wk1Opp',
          type: 'number'
        },
        "wk2Opp": {
          name: 'wk2Opp',
          type: 'number'
        },
        "wk3Opp": {
          name: 'wk3Opp',
          type: 'number'
        },
        "wk4Opp": {
          name: 'wk4Opp',
          type: 'number'
        },
        "wk5Opp": {
          name: 'wk5Opp',
          type: 'number'
        },
        "wk6Opp": {
          name: 'wk6Opp',
          type: 'number'
        },
        "wk7Opp": {
          name: 'wk7Opp',
          type: 'number'
        },
        "wek8Opp": {
          name: 'wek8Opp',
          type: 'number'
        },
        "wk9Opp": {
          name: 'wk9Opp',
          type: 'number'
        },
        "wk11Opp": {
          name: 'wk11Opp',
          type: 'number'
        },
        "wk12Opp": {
          name: 'wk12Opp',
          type: 'number'
        },
        "wk13Opp": {
          name: 'wk13Opp',
          type: 'number'
        },
        "wk14Opp": {
          name: 'wk14Opp',
          type: 'number'
        },
        "wk15Opp": {
          name: 'wk15Opp',
          type: 'number'
        },
        "wk16Opp": {
          name: 'wk16Opp',
          type: 'number'
        },
        "wk17Opp": {
          name: 'wk17Opp',
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
