import MockContract from "../src/classes/MockContract";
import { ERC20TransferABI } from "./mocks/sampleContractABI";

describe("Contract events", () => {
    const mockContract = new MockContract(ERC20TransferABI);
});
