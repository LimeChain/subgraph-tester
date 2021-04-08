import { expect } from "chai";
import Event from "../src/classes/Event";
import MockContract from "../src/classes/MockContract";
import { ERC20TransferABI } from "./mocks/sampleContractABI";

describe("Contract events", () => {
  const mockContract = new MockContract(ERC20TransferABI);

  const firstTransferEvent = new Event("Transfer", {
    amount: 15,
    from: "456",
    to: "674",
  });
  const secondTransferEvent = new Event("Transfer", {
    amount: 20,
    from: "323",
    to: "534",
  });

  afterEach(() => {
    mockContract.clearEmittedEvents();
  });

  it("Can emit events successfully", () => {
    mockContract.emitEvent(firstTransferEvent);
    mockContract.emitEvent(secondTransferEvent);

    expect(mockContract.getEmittedEvents()).length(2);
  });

  it("Faild when trying to emit event that does not exist in the contract", () => {
    const nonExistentEvent = new Event("someEvent", {});
    mockContract.emitEvent(nonExistentEvent);
  });
});
