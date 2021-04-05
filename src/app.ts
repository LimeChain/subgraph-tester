import { assert } from "chai";
import sinon from "sinon";
import Web3 from "web3";
import { address, ERC20TransferABI } from "./mocks/sampleContractABI";

const web3 = new Web3("https://cloudflare-eth.com");
const sampleContract = new web3.eth.Contract(ERC20TransferABI, address);

const mockContractFunction = (contract: any, functionName: string, mockReturn: any) => {
  assert(
    functionName in contract.methods,
    "Function does not exist in contract.",
  );

  const mockRes = sinon.mock().returns(mockReturn);
  return mockRes();
};

const res = mockContractFunction(sampleContract, "transfer", "done");
console.log(res);
