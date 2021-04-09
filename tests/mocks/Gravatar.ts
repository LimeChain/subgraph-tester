// tslint:disable-next-line: no-var-requires
const sparkles = require("sparkles")();

export default class Gravatar {
  public id: string | number;
  public owner: string = "";
  public displayName: string = "";
  public imageUrl: string = "";

  constructor(id: string | number) {
    this.id = id;
  }

  public save = () => {
    sparkles.emit("persistEvent", this);
  }
}
