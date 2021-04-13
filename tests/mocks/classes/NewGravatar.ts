import Event from "../../../src/classes/Event";

export default class NewGravatar extends Event {
  constructor(params?: any) {
    super("NewGravatar", params);
  }
}
