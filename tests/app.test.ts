import { expect } from "chai";
import Web3 from "web3";
import {
  clearMocks,
  IMockFunctionArgs,
  IRunFunctionArgs,
  mock,
  run,
} from "../src/app";
import { address, ERC20TransferABI } from "./mocks/sampleContractABI";

const web3 = new Web3("https://cloudflare-eth.com");
const testContract = new web3.eth.Contract(ERC20TransferABI, address);

describe("Contract functions", () => {
  const testReturnValue = () => {
    return "myReturnValue";
  };

  const baseMockFunctionArgs: IMockFunctionArgs = {
    contract: testContract,
    fName: "transfer",
    mockReturn: testReturnValue,
  };

  const baseRunFunctionArgs: IRunFunctionArgs = {
    fName: "transfer",
  };

  afterEach(() => {
    clearMocks();
  });

  it("Can mock contract function and return mocked value", () => {
    mock(baseMockFunctionArgs);
    expect(run(baseRunFunctionArgs)).to.be.equal("myReturnValue");
  });

  it("Can override contract function mock and return updated mocked value", () => {
    mock(baseMockFunctionArgs);

    const updatedReturnValue = () => {
      return "myUpdatedReturnValue";
    };
    mock({ ...baseMockFunctionArgs, mockReturn: updatedReturnValue });

    expect(run(baseRunFunctionArgs)).to.be.equal("myUpdatedReturnValue");
  });

  it("Fails when attempting to run function that hasn't been mocked yet", () => {
    expect(() => {
      run(baseRunFunctionArgs);
    }).to.throw();
  });

  it("Mocked function can be more complex and affect wider scope", () => {
    let num = 1;

    const widerScopeFunction = () => {
      num++;
      return num;
    };
    mock({ ...baseMockFunctionArgs, mockReturn: widerScopeFunction });

    run(baseRunFunctionArgs);
    expect(num).to.be.equal(2);
  });

  it("Can pass optional arguments to mocked function", () => {
    const mockReturnWithArgs = () => {
      return "pong";
    };

    mock({
      ...baseMockFunctionArgs,
      mockReturn: mockReturnWithArgs,
      withArgs: ["ping"],
    });

    expect(run({ ...baseRunFunctionArgs, withArgs: ["ping"] })).to.be.equal(
      "pong",
    );
  });
});
