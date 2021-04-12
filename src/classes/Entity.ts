import sha256 from "crypto-js/sha256";

export default class Entity {
  public id: string;
  public params: any;

  constructor(id: string, params?: any) {
    this.id = id;
    this.params = params || {};
  }

  public equals = (e: Entity) => {
    return (
      sha256(JSON.stringify(e)).toString() ===
      sha256(JSON.stringify(this)).toString()
    );
  }
}
