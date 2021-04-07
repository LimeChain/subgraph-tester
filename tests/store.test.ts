import { expect } from "chai";
import Entity from "../src/classes/Entity";
import Store from "../src/classes/Store";
import { fantasyEntities, sciFiEntities } from "./mocks/mockEntities";

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

  it("Should hydrate the state with a store JSON", () => {
    const store = new Store();
    store.hydrateWithJson(JSON.stringify(fantasyEntities));

    const endStateMap = new Map(JSON.parse(store.readState()));
    expect(endStateMap).to.have.lengthOf(3);
    expect(JSON.stringify(Array.from(endStateMap.entries()))).to.equal(
      JSON.stringify(fantasyEntities),
    );
  });

  it("Should deeply compare the state to a given JSON snapshot and return true when they are equal", () => {
    const store = new Store();
    store.hydrateWithJson(JSON.stringify(fantasyEntities));

    const deepEqual = store.assertEq(JSON.stringify(fantasyEntities));
    // tslint:disable-next-line: no-unused-expression
    expect(deepEqual).to.be.true;
  });

  it("Should deeply compare the state to a given JSON snapshot and return false when they are not equal", () => {
    const store = new Store();
    store.hydrateWithJson(JSON.stringify(fantasyEntities));

    const deepEqual = store.assertEq(JSON.stringify(sciFiEntities));
    // tslint:disable-next-line: no-unused-expression
    expect(deepEqual).to.be.false;
  });
});
