import { expect } from "chai";
import Entity from "../src/classes/Entity";
import Store from "../src/classes/Store";
import { fantasyEntities, sciFiEntities } from "./mocks/mockEntities";

describe("Store", () => {
  const entities: Map<string, Entity> = new Map();
  const dragonEntity = new Entity("1", "Dragon", "The dragon is green");
  const coinEntity = new Entity("34", "Coin", "Old coin made of silver");

  entities.set("dragonEntityKey", dragonEntity);
  entities.set("coinEntityKey", coinEntity);

  it("Should hydrate the state with a list of entities", () => {
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

    const deepEqual = store.assertStateSnapshotEq(JSON.stringify(fantasyEntities));
    // tslint:disable-next-line: no-unused-expression
    expect(deepEqual).to.be.true;
  });

  it("Should deeply compare the state to a given JSON snapshot and return false when they are not equal", () => {
    const store = new Store();
    store.hydrateWithJson(JSON.stringify(fantasyEntities));

    const deepEqual = store.assertStateSnapshotEq(JSON.stringify(sciFiEntities));
    // tslint:disable-next-line: no-unused-expression
    expect(deepEqual).to.be.false;
  });

  it("Fails when attempting to hydrate a non-empty state", () => {
    const store = new Store();
    store.hydrateWithJson(JSON.stringify(fantasyEntities));

    expect(() => {
      store.hydrateWithJson(JSON.stringify(sciFiEntities));
    }).to.throw(
      `State is not empty. Please use state.clear() to clear the state before hydrating.`,
    );

    expect(() => {
      store.hydrateWithEntities(entities);
    }).to.throw(
      `State is not empty. Please use state.clear() to clear the state before hydrating.`,
    );
  });

  it("Fails when attempting ot hydrate state with an empty map", () => {
    const store = new Store();

    expect(() => {
      store.hydrateWithJson("   ");
    }).to.throw(
      `JSON cannot be an empty string.`,
    );
  });

  it("Fails when asserting equality of snapshot when state is empty", () => {
    const store = new Store();

    expect(() => {
      store.assertStateSnapshotEq(JSON.stringify(fantasyEntities));
    }).to.throw(
      `Cannot check for equality when the state is empty. You need to first hydrate the state.`,
    );
  });

  it("Fails when asserting equality of snapshot with an empty string as snapshot", () => {
    const store = new Store();
    store.hydrateWithJson(JSON.stringify(fantasyEntities));

    expect(() => {
      store.assertStateSnapshotEq(JSON.stringify("  "));
    }).to.throw();
  });

  it("Fails when providing an empty entity key when asserting equality of Entity objects", () => {
    const store = new Store();
    store.hydrateWithJson(JSON.stringify(fantasyEntities));

    expect(() => {
      store.assertEntityEq("  ", dragonEntity);
    }).to.throw(
      `Entity key cannot be an empty string.`,
    );
  });

  // tslint:disable-next-line: max-line-length
  it("Fails when attempting to assert equality of entities when the given entity key does not exist in the state", () => {
    const store = new Store();
    store.hydrateWithJson(JSON.stringify(fantasyEntities));

    expect(() => {
      store.assertEntityEq("rabbitEntityKey", dragonEntity);
    }).to.throw(
      `Entity key rabbitEntityKey not found in the state.`,
    );
  });

  it("Checks properly for entity equality", () => {
    const store = new Store();
    store.hydrateWithEntities(entities);
    let equal = store.assertEntityEq("dragonEntityKey", dragonEntity);
    // tslint:disable-next-line: no-unused-expression
    expect(equal).to.be.true;

    equal = store.assertEntityEq("dragonEntityKey", coinEntity);
    // tslint:disable-next-line: no-unused-expression
    expect(equal).to.be.false;
  });
});
