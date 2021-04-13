import Event from "../../../src/classes/Event";

export default class NewTransfer extends Event {
  constructor(params?: any) {
    super("NewTransfer", params);
  }
}
