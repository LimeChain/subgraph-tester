import subgraphYaml from "../../tests/mocks/subgraphYml";
import Event from "../classes/Event";
import SubgraphData from "./SubgraphData";

// tslint:disable-next-line: no-var-requires
const sparkles = require("sparkles")();

export default class Resolver {
  private eventHandlers: Map<string, (event: Event) => void> = new Map();
  private subgraphData = new SubgraphData(subgraphYaml);

  constructor() {
    sparkles.on("emitEvent", (event: Event) => {
      // TODO: assert exists
      this.eventHandlers.get(event.name)!(event);
    });
  }

  public setEventHandlers = (handlers: Map<string, (event: Event) => void>) => {
    // TODO: asser that this exist in the subgraph
    this.eventHandlers = handlers;
  }

  public addEventHandler = (name: string, handler: (event: Event) => void) => {
    // TODO: check if that this exist in the subgraph
    if (this.eventHandlers.get(name) === undefined) {
      this.eventHandlers.set(name, handler);
    }
  }

  public getEventHandler = () => {
    return new Map(this.eventHandlers);
  }

  public clearEventHandlers = () => {
    this.eventHandlers.clear();
  }
}
