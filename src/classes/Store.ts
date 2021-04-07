import Entity from "./Entity";

export default class Store {
    private state: Map<string, Entity> = new Map();

    public hydrateWithEntities = (entities: Map<string, Entity>) => {
        this.state = entities;
    }

    // TODO: hydrate with JSON
}
