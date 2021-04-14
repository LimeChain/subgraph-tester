import { expect } from "chai";
import MockContract from "../src/classes/MockContract";
import Store from "../src/classes/Store";
import "../src/extensions/object";
import { IMockFunctionArgs, IRunFunctionArgs } from "../src/models/Contract";
import NewGravatar from "./mocks/classes/NewGravatar";
import { ERC20TransferABI } from "./mocks/sampleContractABI";

describe("Contract functions", () => {
  const store = new Store();
  const mockContract = new MockContract(ERC20TransferABI);

  const mockBody = () => {
    return "myReturnValue";
  };

  const baseMockFunctionArgs: IMockFunctionArgs = {
    fName: "transfer",
    mockBody,
  };

  const baseRunFunctionArgs: IRunFunctionArgs = {
    eventsToEmit: [],
    fName: "transfer",
  };

  const newGravatar: NewGravatar = new NewGravatar({
    color: "purple",
    displayName: "Harold",
    id: "444",
    owner: "0x1234567",
  });

  const anotherNewGravatar: NewGravatar = new NewGravatar({
    color: "yellow",
    displayName: "Gerald",
    id: "555",
    owner: "0x1234567",
  });

  afterEach(() => {
    mockContract.clearMocks();
    store.clear();
  });

  it("Fails when trying to mock function that doesn't exist in the contract", () => {
    expect(() => {
      mockContract.mockFunction({
        ...baseMockFunctionArgs,
        fName: "nonExistent",
      });
    }).throws("Function nonExistent does not exist in contract.");
  });

  it("Can mock contract function and return mocked value", () => {
    mockContract.mockFunction(baseMockFunctionArgs);
    expect(mockContract.runFunction(baseRunFunctionArgs)).equals(
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
      mockBody: updatedReturnValue,
    });

    expect(mockContract.runFunction(baseRunFunctionArgs)).equals(
      "myUpdatedReturnValue",
    );
  });

  it("Fails when attempting to run function that hasn't been mocked yet", () => {
    expect(() => {
      mockContract.runFunction(baseRunFunctionArgs);
    }).throws("This function has not been mocked yet.");
  });

  it("Mocked function can be more complex and affect wider scope", () => {
    let num = 1;

    const widerScopeFunction = () => {
      num++;
      return num;
    };
    mockContract.mockFunction({
      ...baseMockFunctionArgs,
      mockBody: widerScopeFunction,
    });

    mockContract.runFunction(baseRunFunctionArgs);
    expect(num).equals(2);
  });

  it("Can pass optional arguments to mocked function", () => {
    const mockBodyWithArgs = () => {
      return "pong";
    };

    mockContract.mockFunction({
      ...baseMockFunctionArgs,
      mockBody: mockBodyWithArgs,
      withArgs: ["ping"],
    });

    expect(
      mockContract.runFunction({ ...baseRunFunctionArgs, withArgs: ["ping"] }),
    ).equals("pong");
  });

  it("Can pass multiple optional arguments to mocked function", () => {
    const mockBodyWithArgs = () => {
      return "ping pong ping";
    };

    mockContract.mockFunction({
      ...baseMockFunctionArgs,
      mockBody: mockBodyWithArgs,
      withArgs: ["ping", 1, 5],
    });

    expect(
      mockContract.runFunction({
        ...baseRunFunctionArgs,
        withArgs: ["ping", 1, 5],
      }),
    ).equals("ping pong ping");
  });

  it("Can mock function revert with a message", () => {
    mockContract.mockFunction({
      ...baseMockFunctionArgs,
      reverts: true,
      revertsMsg: "Not enough balance",
    });
    expect(() => {
      mockContract.runFunction(baseRunFunctionArgs);
    }).throws(
      `Function "${baseRunFunctionArgs.fName}" reverted. Reason: Not enough balance`,
    );
  });

  it("Can mock function revert without message", () => {
    mockContract.mockFunction({ ...baseMockFunctionArgs, reverts: true });
    expect(() => {
      mockContract.runFunction(baseRunFunctionArgs);
    }).throws(
      `Function "${baseRunFunctionArgs.fName}" reverted. No reason specified.`,
    );
  });

  it("Can emit events when invoking contract function", () => {
    mockContract.mockFunction(baseMockFunctionArgs);
    const eventFixtures = [newGravatar, anotherNewGravatar];

    mockContract.runFunction({ ...baseRunFunctionArgs, eventsToEmit: eventFixtures });
  });
});
