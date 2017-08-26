/* tslint:disable */

declare var Object: any;
export interface OutletInterface {
  "name": string;
  "base_url"?: string;
  "short"?: string;
  "id"?: number;
}

export class Outlet implements OutletInterface {
  "name": string;
  "base_url": string;
  "short": string;
  "id": number;
  constructor(data?: OutletInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Outlet`.
   */
  public static getModelName() {
    return "Outlet";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Outlet for dynamic purposes.
  **/
  public static factory(data: OutletInterface): Outlet{
    return new Outlet(data);
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
      name: 'Outlet',
      plural: 'Outlets',
      path: 'Outlets',
      properties: {
        "name": {
          name: 'name',
          type: 'string'
        },
        "base_url": {
          name: 'base_url',
          type: 'string'
        },
        "short": {
          name: 'short',
          type: 'string'
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
