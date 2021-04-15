import { expect } from "chai";
import Event from "../src/classes/Event";
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
    expect(resolver.getEventHandlers().size).equals(1);
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
      `[["393939",{"id":"393939","params":{"displayName":"Gerard","id":"393939","owner":"0x1234567"}}],["3131353535",{"id":"3131353535","params":{"displayName":"Don Draper","id":"3131353535","owner":"0x1234567"}}]]`,
    );
  });

  it("Fails when attempting to add a handler for an event that is not declared in the subgraph yaml", () => {
    expect(() => {
      resolver.addEventHandler("IDoNotExistEvent", handleNewGravatar);
    }).throws(
      `Cannot add handler for IDoNotExistEvent. Event not found in subgraph yaml.`,
    );

    const eventHandlers: Map<string, (event: Event) => void> = new Map();
    eventHandlers.set("NewGravatar", handleNewGravatar);
    eventHandlers.set("IDoNotExistEvent", handleNewGravatar);

    expect(() => {
      resolver.setEventHandlers(eventHandlers);
    }).throws("The following events do not exist in the subgraph yaml: IDoNotExistEvent");
  });
});
