/* tslint:disable */

declare var Object: any;
export interface OffWeekStatInterface {
  "week": number;
  "oppId": number;
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
}

export class OffWeekStat implements OffWeekStatInterface {
  "week": number;
  "oppId": number;
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
  constructor(data?: OffWeekStatInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `OffWeekStat`.
   */
  public static getModelName() {
    return "OffWeekStat";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of OffWeekStat for dynamic purposes.
  **/
  public static factory(data: OffWeekStatInterface): OffWeekStat{
    return new OffWeekStat(data);
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
      name: 'OffWeekStat',
      plural: 'OffWeekStats',
      path: 'OffWeekStats',
      properties: {
        "week": {
          name: 'week',
          type: 'number'
        },
        "oppId": {
          name: 'oppId',
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
      }
    }
  }
}
