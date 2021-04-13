export default class Gravatar {
  public id: string;
  public owner: string = "";
  public displayName: string = "";
  public imageUrl: string = "";

  constructor(id: string) {
    this.id = id;
  }
}
