import { expect } from "chai";
import Entity from "../src/classes/Entity";
import Store from "../src/classes/Store";

describe("Store", () => {
  it("Should hydrate the state with a list of entities", () => {
    const entities: Map<string, Entity> = new Map();
    const dragonEntity = new Entity("1", "Dragon", "The dragon is green");
    const coinEntity = new Entity("34", "Coin", "Old coin made of silver");

    entities.set("dragonEntityKey", dragonEntity);
    entities.set("coinEntityKey", coinEntity);

    const store = new Store();
    store.hydrateWithEntities(entities);

    const entitiesJson = JSON.stringify(Array.from(entities.entries()));
    const endStateJson = store.readState();
    const endStateMap = new Map(JSON.parse(endStateJson));

    expect(endStateMap).to.have.lengthOf(2);
    expect(entitiesJson).to.be.equal(endStateJson);
  });
});
