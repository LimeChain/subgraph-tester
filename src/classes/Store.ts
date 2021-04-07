import { assert } from "chai";
import equal from "fast-deep-equal/es6";
import Entity from "./Entity";

export default class Store {
  private state: Map<string, Entity> = new Map();

  public hydrateWithEntities = (entities: Map<string, Entity>) => {
    assert(
      this.state.size === 0,
      "State is not empty. Please use state.clear() to clear the state before hydrating."
    );
    this.state = entities;
  };

  public hydrateWithJson = (stringifiedJson: string) => {
    assert(
      this.state.size === 0,
      "State is not empty. Please use state.clear() to clear the state before hydrating."
    );
    assert(stringifiedJson.trim() !== "", "JSON cannot be an empty string.");
    this.state = new Map(JSON.parse(stringifiedJson));
  };

  public readState = () => {
    return JSON.stringify(Array.from(this.state.entries()));
  };

  public addEntity = (entityKey: string, entity: Entity): void => {
    assert(entityKey.trim() !== "", "Entity key cannot be an empty string.");
    this.state.set(entityKey, entity);
  };

  public assertStateSnapshotEq = (snapshot: string) => {
    assert(
      this.state.size > 0,
      "Cannot check for equality when the state is empty. You need to first hydrate the state."
    );

    const snapshotMap: Map<string, Entity> = new Map(JSON.parse(snapshot));
    return equal(snapshotMap, this.state);
  };

  public assertEntityEq = (entityKey: string, entity: Entity) => {
    assert(entityKey.trim() !== "", "Entity key cannot be an empty string.");
    assert(
      this.state.get(entityKey) !== undefined,
      `Entity key ${entityKey} not found in the state.`
    );

    return equal(this.state.get(entityKey), entity);
  };

  public entityExists = (entity: Entity): boolean => {
    const entitiesList: Entity[] = [];
    Array.from(this.state.values()).forEach((e) => entitiesList.push(e));

    return (
      entitiesList.findIndex((e) => {
        return equal(e, entity);
      }) > -1
    );
  };

  public entityKeyExists = (entityKey: string): boolean => {
    assert(entityKey.trim() !== "", "Entity key cannot be an empty string.");
    return this.state.get(entityKey) !== undefined;
  };

  public clear = (): void => {
    this.state.clear();
  };

  public size = (): number => {
    return this.state.size;
  };
}
