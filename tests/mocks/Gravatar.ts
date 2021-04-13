export default class Gravatar {
  public id: string | number;
  public owner: string = "";
  public displayName: string = "";
  public imageUrl: string = "";

  constructor(id: string | number) {
    this.id = id;
  }
}
