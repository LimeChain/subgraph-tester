import { expect } from "chai";
import Entity from "../src/classes/Entity";
import Store from "../src/classes/Store";
import { fantasyEntities, sciFiEntities } from "./mocks/mockEntities";

describe("Store", () => {
  const entities: Map<string, Entity> = new Map();
  const dragonEntity = new Entity("1", "The dragon is green");
  const coinEntity = new Entity("34", "Old coin made of silver");
  const rabbitEntity = new Entity("66", {
    color: "White",
    speed: 10,
  });

  let store: Store;

  beforeEach(() => {
    store = new Store();

    entities.set("dragonEntityKey", dragonEntity);
    entities.set("coinEntityKey", coinEntity);
    entities.delete("rabbitEntityKey");
  });

  it("Should hydrate the state with a list of entities", () => {
    store.hydrateWithEntities(entities);

    const entitiesJson = JSON.stringify(Array.from(entities.entries()));
    const endStateJson = store.readStateJson();
    const endStateMap = store.readStateMap();

    expect(endStateMap).length(2);
    expect(entitiesJson).equals(endStateJson);
  });

  it("Should hydrate the state with a store JSON", () => {
    store.hydrateWithJson(JSON.stringify(fantasyEntities));

    const endStateMap = store.readStateMap();
    expect(endStateMap).length(3);
    expect(JSON.stringify(Array.from(endStateMap.entries()))).equals(
      JSON.stringify(fantasyEntities)
    );
  });

  it("Should deeply compare the state to a given JSON snapshot and return true when they are equal", () => {
    store.hydrateWithJson(JSON.stringify(fantasyEntities));
    expect(() => {
      store.assertStateSnapshotEq(JSON.stringify(fantasyEntities));
    }).not.throws();
  });

  it("Should deeply compare the state to a given JSON snapshot and return false when they are not equal", () => {
    store.hydrateWithJson(JSON.stringify(fantasyEntities));

    expect(() => {
      store.assertStateSnapshotEq(JSON.stringify(sciFiEntities));
    }).throws(`Provided snapshot map is not equal to the store.`);
  });

  it("Fails when attempting to hydrate a non-empty state", () => {
    store.hydrateWithJson(JSON.stringify(fantasyEntities));

    expect(() => {
      store.hydrateWithJson(JSON.stringify(sciFiEntities));
    }).throws(
      `State is not empty. Please use state.clear() to clear the state before hydrating.`
    );

    expect(() => {
      store.hydrateWithEntities(entities);
    }).throws(
      `State is not empty. Please use state.clear() to clear the state before hydrating.`
    );
  });

  it("Fails when attempting ot hydrate state with an empty map", () => {
    expect(() => {
      store.hydrateWithJson("   ");
    }).throws(`JSON cannot be an empty string.`);
  });

  it("Fails when asserting equality of snapshot when state is empty", () => {
    expect(() => {
      store.assertStateSnapshotEq(JSON.stringify(fantasyEntities));
    }).throws(
      `Cannot check for equality when the state is empty. You need to first hydrate the state.`
    );
  });

  it("Fails when asserting equality of snapshot with an empty string as snapshot", () => {
    store.hydrateWithJson(JSON.stringify(fantasyEntities));

    expect(() => {
      store.assertStateSnapshotEq(JSON.stringify("  "));
    }).throws();
  });

  it("Fails when providing an empty entity key when asserting equality of Entity objects", () => {
    store.hydrateWithJson(JSON.stringify(fantasyEntities));

    expect(() => {
      store.assertEntityEq("  ", dragonEntity);
    }).throws(`Entity key cannot be an empty string.`);
  });

  it("Fails entity equality assertion when entity key doesn't exist in state", () => {
    store.hydrateWithJson(JSON.stringify(fantasyEntities));

    expect(() => {
      store.assertEntityEq("rabbitEntityKey", dragonEntity);
    }).throws(`Entity key rabbitEntityKey not found in the state.`);
  });

  it("Checks properly for entity equality", () => {
    store.hydrateWithEntities(entities);

    expect(() => {
      store.assertEntityEq("dragonEntityKey", dragonEntity);
    }).not.throws();
    expect(() => {
      store.assertEntityEq("dragonEntityKey", coinEntity);
    }).throws(
      `Provided entity is not equal to corresponding entity with given entity key in the state.`
    );
  });

  it("Correctly checks whether entity object exists in the state", () => {
    store.hydrateWithEntities(entities);

    let exists = store.entityExists(dragonEntity);
    expect(exists).equals(true);

    exists = store.entityExists(rabbitEntity);
    expect(exists).equals(false);
  });

  it("Correctly checks whether entity key exists in the state", () => {
    store.hydrateWithEntities(entities);

    const exists = store.entityKeyExists("dragonEntityKey");
    expect(exists).equals(true);
  });

  it("Fails when checking whether entity key exists in state when the given key is an empty string", () => {
    store.hydrateWithEntities(entities);

    expect(() => {
      store.entityKeyExists("  ");
    }).throws(`Entity key cannot be an empty string.`);
  });

  it("Clears state successfully", () => {
    store.hydrateWithEntities(entities);
    expect(store.size()).equals(2);

    store.clear();
    expect(store.size()).equals(0);
  });

  it("Can add new entity", () => {
    store.hydrateWithEntities(entities);
    store.addEntity("rabbitEntityKey", rabbitEntity);

    const newEntityExists = store.entityExists(rabbitEntity);
    expect(newEntityExists).equals(true);

    const entityKeyExists = store.entityKeyExists("rabbitEntityKey");
    expect(entityKeyExists).equals(true);
  });

  it("Fails if an empty string is provided when adding a new entity", () => {
    store.hydrateWithEntities(entities);

    expect(() => {
      store.addEntity("  ", rabbitEntity);
    }).throws(`Entity key cannot be an empty string.`);
  });

  it("Fails if an empty string is provided when deleting an entity", () => {
    store.hydrateWithEntities(entities);

    expect(() => {
      store.deleteEntity("  ");
    }).throws(`Entity key cannot be an empty string.`);
  });

  it("Fails if a key that doesn't exist in the store is provided when attempting to delete an entity", () => {
    store.hydrateWithEntities(entities);

    expect(() => {
      store.deleteEntity("FishEntityKey");
    }).throws(`Entity key FishEntityKey not found in the state.`);
  });

  it("Can successfully delete an entity", () => {
    store.hydrateWithEntities(entities);
    store.deleteEntity("dragonEntityKey");

    const dragonEntityKeyExists = store.entityKeyExists("dragonEntityKey");
    const dragonEntityExists = store.entityExists(dragonEntity);
    expect(dragonEntityKeyExists).equals(false);
    expect(dragonEntityExists).equals(false);
    expect(store.size()).equals(1);
  });
});
