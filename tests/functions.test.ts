import { expect } from "chai";
import MockContract from "../src/classes/MockContract";
import { IMockFunctionArgs, IRunFunctionArgs } from "../src/models/Contract";
import { ERC20TransferABI } from "./mocks/sampleContractABI";

describe("Contract functions", () => {
  const mockContract = new MockContract(ERC20TransferABI);

  const testReturnValue = () => {
    return "myReturnValue";
  };

  const baseMockFunctionArgs: IMockFunctionArgs = {
    fName: "transfer",
    mockReturn: testReturnValue,
  };

  const baseRunFunctionArgs: IRunFunctionArgs = {
    fName: "transfer",
  };

  afterEach(() => {
    mockContract.clearMocks();
  });

  it("Fails when trying to mock function that doesn't exist in the contract", () => {
    expect(() => {
      mockContract.mockFunction({
        ...baseMockFunctionArgs,
        fName: "nonExistent",
      });
    }).to.throw("Function does not exist in contract.");
  });

  it("Can mock contract function and return mocked value", () => {
    mockContract.mockFunction(baseMockFunctionArgs);
    expect(mockContract.runFunction(baseRunFunctionArgs)).to.be.equal(
      "myReturnValue",
    );
  });

  it("Can override contract function mock and return updated mocked value", () => {
    mockContract.mockFunction(baseMockFunctionArgs);

    const updatedReturnValue = () => {
      return "myUpdatedReturnValue";
    };
    mockContract.mockFunction({
      ...baseMockFunctionArgs,
      mockReturn: updatedReturnValue,
    });

    expect(mockContract.runFunction(baseRunFunctionArgs)).to.be.equal(
      "myUpdatedReturnValue",
    );
  });

  it("Fails when attempting to run function that hasn't been mocked yet", () => {
    expect(() => {
      mockContract.runFunction(baseRunFunctionArgs);
    }).to.throw("This function has not been mocked yet.");
  });

  it("Mocked function can be more complex and affect wider scope", () => {
    let num = 1;

    const widerScopeFunction = () => {
      num++;
      return num;
    };
    mockContract.mockFunction({
      ...baseMockFunctionArgs,
      mockReturn: widerScopeFunction,
    });

    mockContract.runFunction(baseRunFunctionArgs);
    expect(num).to.be.equal(2);
  });

  it("Can pass optional arguments to mocked function", () => {
    const mockReturnWithArgs = () => {
      return "pong";
    };

    mockContract.mockFunction({
      ...baseMockFunctionArgs,
      mockReturn: mockReturnWithArgs,
      withArgs: ["ping"],
    });

    expect(
      mockContract.runFunction({ ...baseRunFunctionArgs, withArgs: ["ping"] }),
    ).to.be.equal("pong");
  });

  it("Can pass multiple optional arguments to mocked function", () => {
    const mockReturnWithArgs = () => {
      return "ping pong ping";
    };

    mockContract.mockFunction({
      ...baseMockFunctionArgs,
      mockReturn: mockReturnWithArgs,
      withArgs: ["ping", 1, 5],
    });

    expect(
      mockContract.runFunction({
        ...baseRunFunctionArgs,
        withArgs: ["ping", 1, 5],
      }),
    ).to.be.equal("ping pong ping");
  });

  it("Can mock function revert with a message", () => {
    mockContract.mockFunction({
      ...baseMockFunctionArgs,
      reverts: true,
      revertsMsg: "Not enough balance",
    });
    expect(() => {
      mockContract.runFunction(baseRunFunctionArgs);
    }).to.throw(
      `Function "${baseRunFunctionArgs.fName}" reverted. Reason: Not enough balance`,
    );
  });

  it("Can mock function revert without message", () => {
    mockContract.mockFunction({ ...baseMockFunctionArgs, reverts: true });
    expect(() => {
      mockContract.runFunction(baseRunFunctionArgs);
    }).to.throw(
      `Function "${baseRunFunctionArgs.fName}" reverted. No reason specified.`,
    );
  });
});
