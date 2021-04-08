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
});
