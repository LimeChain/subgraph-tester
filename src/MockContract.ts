import { assert } from "chai";
import sha256 from "crypto-js/sha256";
import sinon from "sinon";
import Web3 from "web3";
import {
  IAbiItem,
  IMockFunctionArgs,
  IRunFunctionArgs,
} from "./models/Contract";

export default class MockContract {
  public abi: IAbiItem[];
  private mockReturns: Map<string, () => {}> = new Map();

  private functions: any[];

  constructor(abi: IAbiItem[]) {
    const web3 = new Web3();
    const testContract = new web3.eth.Contract(abi);

    this.abi = abi;
    this.functions = testContract.methods;
  }

  public mockFunction = ({
    fName,
    mockReturn,
    withArgs,
    reverts,
    revertsMsg,
  }: IMockFunctionArgs): void => {
    const raw = withArgs ? fName.concat(JSON.stringify(withArgs)) : fName;
    const key = sha256(raw).toString();

    assert(fName in this.functions, "Function does not exist in contract.");

    const revertsResponse = () => {
      throw Error(
        `Function "${fName}" reverted. ${
          revertsMsg ? "Reason: " + revertsMsg : "No reason specified."
        }`,
      );
    };

    const mockRes = reverts
      ? revertsResponse
      : sinon.mock().returns(mockReturn)();
    this.mockReturns.set(key, mockRes);
  }

  public runFunction = ({ fName, withArgs }: IRunFunctionArgs) => {
    const raw = withArgs ? fName.concat(JSON.stringify(withArgs)) : fName;
    const key = sha256(raw).toString();

    assert(
      this.mockReturns.get(key) !== undefined,
      "This function has not been mocked yet.",
    );

    return this.mockReturns.get(key)!();
  }

  public clearMocks = () => {
    this.mockReturns.clear();
  }
}
