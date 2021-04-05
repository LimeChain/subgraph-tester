import { assert } from "chai";
import sinon from "sinon";
import Web3 from "web3";
import { address, ERC20TransferABI } from "./mocks/sampleContractABI";

const web3 = new Web3("https://cloudflare-eth.com");
const sampleContract = new web3.eth.Contract(ERC20TransferABI, address);

const mockReturns: Map<string, any> = new Map();

const runContractFunction = (fName: string) => {
  assert(mockReturns.get(fName) !== undefined, "This function has not yet been mocked.");
  return mockReturns.get(fName);
};

const mockContractFunction = (
  contract: any,
  fName: string,
  mockReturn: any,
) => {
  assert(fName in contract.methods, "Function does not exist in contract.");

  const mockRes = sinon.mock().returns(mockReturn)();
  mockReturns.set(fName, mockRes);
};

mockContractFunction(sampleContract, "transfer", "done");
const res = runContractFunction("transfer");

console.log("Mocked return value: ", res);
