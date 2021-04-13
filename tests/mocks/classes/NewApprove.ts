import Event from "../../../src/classes/Event";

export default class NewApprove extends Event {
  constructor(params?: any) {
    super("NewTransfer", params);
  }
}
