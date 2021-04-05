import { expect } from "chai";
import Web3 from "web3";
import { clearMocks, mock, run } from "../src/app";
import { address, ERC20TransferABI } from "./mocks/sampleContractABI";

const web3 = new Web3("https://cloudflare-eth.com");
const testContract = new web3.eth.Contract(ERC20TransferABI, address);

describe("Contract functions", () => {
  afterEach(() => {
    clearMocks();
  });

  it("Can mock contract function and return mocked value", () => {
    mock(testContract, "transfer", "myReturnValue");

    expect(run("transfer")).to.be.equal("myReturnValue");
  });
  it("Can override contract function mock and return updated mocked value", () => {
    mock(testContract, "transfer", "myReturnValue");
    mock(testContract, "transfer", "myUpdatedReturnValue");

    expect(run("transfer")).to.be.equal("myUpdatedReturnValue");
  });
  it("Fails when attempting to run function that hasn't been mocked yet", () => {
    expect(() => {
      run("transfer");
    }).to.throw();
  });
});
