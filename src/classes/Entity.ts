import sha256 from "crypto-js/sha256";
// tslint:disable-next-line: no-var-requires
const stringify = require("fast-json-stable-stringify");

export default class Entity {
  public id: string;
  public params: any;

  constructor(id: string, params?: any) {
    this.id = id;
    this.params = params || {};
  }

  public equals = (e: Entity) => {
    return (
      sha256(stringify(e)).toString() === sha256(stringify(this)).toString()
    );
  }
}
