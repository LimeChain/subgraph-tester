import { expect } from "chai";
import Event from "../src/classes/Event";
import MockContract from "../src/classes/MockContract";
import { ERC20TransferABI } from "./mocks/sampleContractABI";

describe("Contract events", () => {
  const mockContract = new MockContract(ERC20TransferABI);

  const transferEvent = new Event("Transfer", {
    amount: 15,
    from: "456",
    to: "674",
  });
  const anotherTransferEvent = new Event("Transfer", {
    amount: 20,
    from: "323",
    to: "534",
  });

  afterEach(() => {
    mockContract.clearEmittedEvents();
  });

  it("Can emit events successfully", () => {
    mockContract.emitEvent(transferEvent);
    mockContract.emitEvent(anotherTransferEvent);

    expect(mockContract.emittedEventsCount()).equals(2);
  });

  it("Faild when trying to emit event that does not exist in the contract", () => {
    const nonExistentEvent = new Event("someEvent", {});

    expect(() => {
      mockContract.emitEvent(nonExistentEvent);
    }).throws(`Event ${nonExistentEvent.name} does not exist in the contract.`);
  });

  it("Clear function clears event array", () => {
    mockContract.emitEvent(transferEvent);
    expect(mockContract.emittedEventsCount()).equals(1);
    mockContract.clearEmittedEvents();
    expect(mockContract.emittedEventsCount()).equals(0);
  });

  it("Print function works correctly", () => {
    mockContract.emitEvent(transferEvent);
    mockContract.emitEvent(anotherTransferEvent);

    const emittedEvents = mockContract.printEmittedEvents();
    expect(emittedEvents).equals(
      JSON.stringify([transferEvent, anotherTransferEvent]),
    );
  });
});
