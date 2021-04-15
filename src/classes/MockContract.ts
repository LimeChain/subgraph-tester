import { assert } from "chai";
import sha256 from "crypto-js/sha256";
import sinon from "sinon";
import Web3 from "web3";
import "../extensions/object";
// tslint:disable-next-line: no-var-requires
const stringify = require("fast-json-stable-stringify");

import {
  IAbiItem,
  IMockFunctionArgs,
  IRunFunctionArgs,
} from "../models/Contract";

export default class MockContract {
  private mockBodies: Map<string, () => {}> = new Map();
  private functions: IAbiItem[];

  constructor(abi: IAbiItem[]) {
    const web3 = new Web3();
    const testContract = new web3.eth.Contract(abi);
    this.functions = testContract.methods;
  }

  public mockFunction = ({
    fName,
    mockBody,
    withArgs,
    reverts,
    revertsMsg,
  }: IMockFunctionArgs): void => {
    const raw = withArgs ? fName.concat(stringify(withArgs)) : fName;
    const key = sha256(raw).toString();

    assert(
      fName in this.functions,
      `Function ${fName} does not exist in contract.`,
    );

    const revertsResponse = () => {
      throw Error(
        `Function "${fName}" reverted. ${
          revertsMsg ? "Reason: " + revertsMsg : "No reason specified."
        }`,
      );
    };

    const mockRes = reverts
      ? revertsResponse
      : sinon.mock().returns(mockBody)();
    this.mockBodies.set(key, mockRes);
  }

  public runFunction = ({
    fName,
    withArgs,
    eventsToEmit,
  }: IRunFunctionArgs) => {
    const raw = withArgs ? fName.concat(stringify(withArgs)) : fName;
    const key = sha256(raw).toString();

    assert(
      this.mockBodies.get(key) !== undefined,
      "This function has not been mocked yet.",
    );

    eventsToEmit.forEach((e) => {
      e.emit();
    });
    return this.mockBodies.get(key)!();
  }

  public clearMocks = () => {
    this.mockBodies.clear();
  }
}
