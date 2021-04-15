import { expect } from "chai";
import MockContract from "../src/classes/MockContract";
import Resolver from "../src/classes/Resolver";
import Store from "../src/classes/Store";
import { handleNewGravatar } from "./mocks/eventHandlers";
import {
  anotherNewGravatar,
  baseMockFunctionArgs,
  baseRunFunctionArgs,
  newGravatar,
} from "./mocks/fixtures";
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
      `[["393939",{"id":"393939","params":{"owner":"0x1234567","displayName":"Gerard","id":"393939"}}],["3131353535",{"id":"3131353535","params":{"owner":"0x1234567","displayName":"Don Draper","id":"3131353535"}}]]`,
    );
  });
});
