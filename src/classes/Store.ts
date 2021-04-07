import Entity from "./Entity";

export default class Store {
    private state: Map<string, Entity> = new Map();

    public hydrateWithEntities = (entities: Map<string, Entity>) => {
        this.state = entities;
    }

    public readState = () => {
        return JSON.stringify(Array.from(this.state.entries()));
    }

    // TODO: hydrate with JSON
}
