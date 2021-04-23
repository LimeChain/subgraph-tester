import { assert } from "chai";
import sha256 from "crypto-js/sha256";
import Entity from "./Entity";
// tslint:disable-next-line: no-var-requires
const stringify = require("fast-json-stable-stringify");
// tslint:disable-next-line: no-var-requires
const sparkles = require("sparkles")();

export default class Store {
  private state: Map<string, Entity> = new Map();

  constructor() {
    sparkles.on("persistEntity", (item: any) => {
      const entity = new Entity(item.id, item);

      if (!this.entityExists(entity)) {
        this.addEntity(item.id, entity);
      }
    });
  }

  public get(entity = "", id: string): Entity {
    assert(id.trim() !== "", "Entity key cannot be an empty string.");
    assert(
      this.state.get(id) !== undefined,
      `Entity with key ${id} does not exist in the state.`,
    );
    return this.state.get(id)!;
  }

  public set = (entity = "", id: string, data: Entity): void => {
    assert(id.trim() !== "", "Entity key cannot be an empty string.");
    this.state.set(id, data);
  }

  public hydrateWithEntities = (entities: Map<string, Entity>) => {
    assert(
      this.state.size === 0,
      "State is not empty. Please use state.clear() to clear the state before hydrating.",
    );
    this.state = entities;
  }

  public hydrateWithJson = (stringifiedJson: string) => {
    assert(
      this.state.size === 0,
      "State is not empty. Please use state.clear() to clear the state before hydrating.",
    );
    assert(stringifiedJson.trim() !== "", "JSON cannot be an empty string.");
    this.state = new Map(JSON.parse(stringifiedJson));
  }

  public readStateJson = () => {
    return stringify(Array.from(this.state.entries()));
  }

  public readStateMap = (): Map<string, Entity> => {
    return new Map(this.state);
  }

  public addEntity = (entityKey: string, entity: Entity): void => {
    assert(entityKey.trim() !== "", "Entity key cannot be an empty string.");
    assert(
      this.state.get(entityKey) === undefined,
      `Entity with key ${entityKey} already exists in the state. If you want to update it, use state.updateEntity().`,
    );
    this.state.set(entityKey, entity);
  }

  public updateEntity = (entityKey: string, entity: Entity): void => {
    assert(entityKey.trim() !== "", "Entity key cannot be an empty string.");
    assert(
      this.state.get(entityKey) !== undefined,
      `Entity key ${entityKey} not found in state. Try adding the entity first with store.addEntity().`,
    );

    this.state.set(entityKey, entity);
  }

  public deleteEntity = (entityKey: string): void => {
    assert(entityKey.trim() !== "", "Entity key cannot be an empty string.");
    assert(
      this.state.get(entityKey) !== undefined,
      `Entity key ${entityKey} not found in the state.`,
    );

    this.state.delete(entityKey);
  }

  public assertStateSnapshotEq = (snapshotRaw: string) => {
    const snapshotMap = new Map(JSON.parse(snapshotRaw));
    const snapshot = stringify(Array.from(snapshotMap.entries()));

    assert(
      this.state.size > 0,
      "Cannot check for equality when the state is empty. You need to first hydrate the state.",
    );

    const snapshotHash = sha256(snapshot).toString();
    const stateHash = sha256(this.readStateJson()).toString();
    assert(
      snapshotHash === stateHash,
      "Provided snapshot map is not equal to the store.",
    );
  }

  public assertEntityEq = (entityKey: string, entity: Entity) => {
    assert(entityKey.trim() !== "", "Entity key cannot be an empty string.");
    assert(
      this.state.get(entityKey) !== undefined,
      `Entity key ${entityKey} not found in the state.`,
    );

    assert(
      entity.equals(this.state.get(entityKey)!),
      "Provided entity is not equal to corresponding entity with given entity key in the state.",
    );
  }

  public entityExists = (entity: Entity): boolean => {
    const entitiesList: Entity[] = [];
    Array.from(this.state.values()).forEach((e) => entitiesList.push(e));

    return (
      entitiesList.findIndex((e) => {
        return e.equals(entity);
      }) > -1
    );
  }

  public entityKeyExists = (entityKey: string): boolean => {
    assert(entityKey.trim() !== "", "Entity key cannot be an empty string.");
    return this.state.get(entityKey) !== undefined;
  }

  public clear = (): void => {
    this.state.clear();
  }

  public size = (): number => {
    return this.state.size;
  }
}
