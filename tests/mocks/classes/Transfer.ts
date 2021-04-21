export default class Transfer {
  public id: string = "";
  public to: string = "";
  public from: string = "";
  public amount: number = 0;

  constructor(id: string) {
    this.id = id;
  }
}
