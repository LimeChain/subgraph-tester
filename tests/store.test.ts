import { expect } from "chai";
import Entity from "../src/classes/Entity";
import Store from "../src/classes/Store";
import { fantasyEntities, sciFiEntities } from "./mocks/mockEntities";

describe("Store", () => {
  const entities: Map<string, Entity> = new Map();
  const dragonEntity = new Entity("1", "Dragon", "The dragon is green");
  const coinEntity = new Entity("34", "Coin", "Old coin made of silver");
  const rabbitEntity = new Entity("66", "Animal", "White rabbit");

  entities.set("dragonEntityKey", dragonEntity);
  entities.set("coinEntityKey", coinEntity);

  let store: Store;

  beforeEach(() => {
    store = new Store();
  });

  it("Should hydrate the state with a list of entities", () => {
    store.hydrateWithEntities(entities);

    const entitiesJson = JSON.stringify(Array.from(entities.entries()));
    const endStateJson = store.readState();
    const endStateMap = new Map(JSON.parse(endStateJson));

    expect(endStateMap).to.have.lengthOf(2);
    expect(entitiesJson).to.be.equal(endStateJson);
  });

  it("Should hydrate the state with a store JSON", () => {
    store.hydrateWithJson(JSON.stringify(fantasyEntities));

    const endStateMap = new Map(JSON.parse(store.readState()));
    expect(endStateMap).to.have.lengthOf(3);
    expect(JSON.stringify(Array.from(endStateMap.entries()))).to.equal(
      JSON.stringify(fantasyEntities),
    );
  });

  it("Should deeply compare the state to a given JSON snapshot and return true when they are equal", () => {
    store.hydrateWithJson(JSON.stringify(fantasyEntities));

    const deepEqual = store.assertStateSnapshotEq(
      JSON.stringify(fantasyEntities),
    );
    // tslint:disable-next-line: no-unused-expression
    expect(deepEqual).to.be.true;
  });

  it("Should deeply compare the state to a given JSON snapshot and return false when they are not equal", () => {
    store.hydrateWithJson(JSON.stringify(fantasyEntities));

    const deepEqual = store.assertStateSnapshotEq(
      JSON.stringify(sciFiEntities),
    );
    // tslint:disable-next-line: no-unused-expression
    expect(deepEqual).to.be.false;
  });

  it("Fails when attempting to hydrate a non-empty state", () => {
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
    expect(() => {
      store.hydrateWithJson("   ");
    }).to.throw(`JSON cannot be an empty string.`);
  });

  it("Fails when asserting equality of snapshot when state is empty", () => {
    expect(() => {
      store.assertStateSnapshotEq(JSON.stringify(fantasyEntities));
    }).to.throw(
      `Cannot check for equality when the state is empty. You need to first hydrate the state.`,
    );
  });

  it("Fails when asserting equality of snapshot with an empty string as snapshot", () => {
    store.hydrateWithJson(JSON.stringify(fantasyEntities));

    expect(() => {
      store.assertStateSnapshotEq(JSON.stringify("  "));
    }).to.throw();
  });

  it("Fails when providing an empty entity key when asserting equality of Entity objects", () => {
    store.hydrateWithJson(JSON.stringify(fantasyEntities));

    expect(() => {
      store.assertEntityEq("  ", dragonEntity);
    }).to.throw(`Entity key cannot be an empty string.`);
  });

  // tslint:disable-next-line: max-line-length
  it("Fails when attempting to assert equality of entities when the given entity key does not exist in the state", () => {
    store.hydrateWithJson(JSON.stringify(fantasyEntities));

    expect(() => {
      store.assertEntityEq("rabbitEntityKey", dragonEntity);
    }).to.throw(`Entity key rabbitEntityKey not found in the state.`);
  });

  it("Checks properly for entity equality", () => {
    store.hydrateWithEntities(entities);

    let equal = store.assertEntityEq("dragonEntityKey", dragonEntity);
    // tslint:disable-next-line: no-unused-expression
    expect(equal).to.be.true;

    equal = store.assertEntityEq("dragonEntityKey", coinEntity);
    // tslint:disable-next-line: no-unused-expression
    expect(equal).to.be.false;
  });

  it("Correctly checks whether entity object exists in the state", () => {
    store.hydrateWithEntities(entities);

    let exists = store.entityExists(dragonEntity);
    // tslint:disable-next-line: no-unused-expression
    expect(exists).to.be.true;

    exists = store.entityExists(rabbitEntity);
    // tslint:disable-next-line: no-unused-expression
    expect(exists).to.be.false;
  });

  it("Correctly checks whether entity key exists in the state", () => {
    store.hydrateWithEntities(entities);

    const exists = store.entityKeyExists("dragonEntityKey");
    // tslint:disable-next-line: no-unused-expression
    expect(exists).to.be.true;
  });

  it("Fails when checking whether entity key exists in state when the given key is an empty string", () => {
    store.hydrateWithEntities(entities);

    expect(() => {
      store.entityKeyExists("  ");
    }).to.throw(`Entity key cannot be an empty string.`);
  });

  it("Clears state successfully", () => {
    store.hydrateWithEntities(entities);
    expect(store.size()).to.be.equal(2);

    store.clear();
    expect(store.size()).to.be.equal(0);
  });
});
