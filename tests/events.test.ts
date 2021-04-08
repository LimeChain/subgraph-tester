import { expect } from "chai";
import Event from "../src/classes/Event";
import MockContract from "../src/classes/MockContract";
import Store from "../src/classes/Store";
import { ERC20TransferABI } from "./mocks/sampleContractABI";

describe("Contract events", () => {
  const mockContract = new MockContract(ERC20TransferABI);
  const store = new Store();

  const simpleTransferEvent = new Event("Transfer", {
    amount: 20,
    from: "323",
    to: "534",
  });

  const transferEventWithReason = new Event("Transfer", {
    amount: 15,
    from: "456",
    reason: "salary",
    to: "674",
  });

  it("Can run a handler function on an event", () => {
    let resolverEvent: Event;

    const handleTransfer = (transferEvent: Event) => {
      resolverEvent = new Event("Transfer", {});
      resolverEvent.parameters.reason = transferEvent.parameters.reason;
      resolverEvent.parameters.amount = transferEvent.parameters.amount + 100;
      store.addEventEntity("transferEventWithoutReasonKey", resolverEvent);
    };

    handleTransfer(transferEventWithReason);
    expect(store.size()).equals(1);
    expect(store.entityKeyExists("transferEventWithoutReasonKey")).equals(true);
  });
});
