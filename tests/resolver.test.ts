import { expect } from "chai";
import MockContract from "../src/classes/MockContract";
import Resolver from "../src/classes/Resolver";
import Store from "../src/classes/Store";
import { IMockFunctionArgs, IRunFunctionArgs } from "../src/models/Contract";
import Gravatar from "./mocks/classes/Gravatar";
import NewGravatar from "./mocks/classes/NewGravatar";
import { MockAbi } from "./mocks/sampleContractABI";

describe("Resolver", () => {
  const mockContract = new MockContract(MockAbi);
  const resolver = new Resolver();
  const store = new Store();

  afterEach(() => {
    mockContract.clearMocks();
    store.clear();
    resolver.clearEventHandlers();
  });

  // TODO: export these in a global mocks/fixtures file
  const newGravatar: NewGravatar = new NewGravatar({
    color: "purple",
    displayName: "Gerard",
    id: "999",
    owner: "0x1234567",
  });

  const anotherNewGravatar: NewGravatar = new NewGravatar({
    color: "red",
    displayName: "Don Draper",
    id: "11555",
    owner: "0x1234567",
  });

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

  // TODO: extract these handlers into mocks file
  const handleNewGravatar = (event: NewGravatar): void => {
    const gravatar = new Gravatar(event.params.id.toHex());
    gravatar.owner = event.params.owner;
    gravatar.displayName = event.params.displayName;
    gravatar.imageUrl = event.params.imageUrl;
    gravatar.save();
  };

  it("Can load handler functions into the Resolver", () => {
    resolver.addEventHandler("NewGravatar", handleNewGravatar);
    expect(resolver.getEventHandler().size).equals(1);
  });

  it("Can emit, catch and handle events when invoking contract function", () => {
    resolver.addEventHandler("NewGravatar", handleNewGravatar);

    mockContract.mockFunction(baseMockFunctionArgs);
    const eventFixtures = [newGravatar, anotherNewGravatar];

    mockContract.runFunction({
      ...baseRunFunctionArgs,
      eventsToEmit: eventFixtures,
    });

    expect(store.readStateJson()).equals(
      `[["393939",{"id":"393939","params":{"owner":"0x1234567","displayName":"Gerard","id":"393939"}}],["3131353535",{"id":"3131353535","params":{"owner":"0x1234567","displayName":"Don Draper","id":"3131353535"}}]]`
    );
  });
});
