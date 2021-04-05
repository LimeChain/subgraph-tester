import { assert } from "chai";
import Web3 from "web3";
import { address, ERC20TransferABI } from "./mocks/sampleContractABI";

const web3 = new Web3("https://cloudflare-eth.com");
const sampleContract = new web3.eth.Contract(ERC20TransferABI, address);

const mockContractFunction = (contract: any, functionName: string) => {
  assert(
    functionName in contract.methods,
    "Function does not exist in contract.",
  );
  return contract.methods[functionName];
};

const res = mockContractFunction(sampleContract, "transfer");
console.log(res);
