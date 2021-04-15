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

  it("Can load handler functions into the Resolver", () => {
    resolver.addEventHandler("NewGravatar", handleNewGravatar);
    expect(resolver.getEventHandler().size).equals(1);
  });

  it("Can emit events when invoking contract function", () => {
    resolver.addEventHandler("NewGravatar", handleNewGravatar);

    mockContract.mockFunction(baseMockFunctionArgs);
    const eventFixtures = [newGravatar, anotherNewGravatar];

    mockContract.runFunction({
      ...baseRunFunctionArgs,
      eventsToEmit: eventFixtures,
    });
  });

  // TODO: extract these handlers into mocks file
  const handleNewGravatar = (event: NewGravatar): void => {
    const gravatar = new Gravatar(event.params.id.toHex());
    gravatar.owner = event.params.owner;
    gravatar.displayName = event.params.displayName;
    gravatar.imageUrl = event.params.imageUrl;
    gravatar.save();
  };

  it("Can catch and handle events emitted by mocked contract calls", () => {
    mockContract.mockFunction(baseMockFunctionArgs);
  });
});
