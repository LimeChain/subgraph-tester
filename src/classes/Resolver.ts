import { assert } from "chai";
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
      assert(
        this.subgraphData.getEventNames().includes(event.name),
        `Event ${event.name} not found in subgraph yaml.`,
      );
      this.eventHandlers.get(event.name)!(event);
    });
  }

  public setEventHandlers = (handlers: Map<string, (event: Event) => void>) => {
    const notFoundInSubgraphData: string[] = [];
    Array.from(handlers.keys()).forEach((name) => {
      if (!this.subgraphData.getEventNames().includes(name)) {
        notFoundInSubgraphData.push(name);
      }
    });
    assert(
      notFoundInSubgraphData.length === 0,
      `The following events do not exist in the subgraph yaml: ${notFoundInSubgraphData.join(
        "\n",
      )}`,
    );
    this.eventHandlers = handlers;
  }

  public addEventHandler = (name: string, handler: (event: Event) => void) => {
    assert(
      this.subgraphData.getEventNames().includes(name),
      `Cannot add handler for ${name}. Event not found in subgraph yaml.`,
    );
    if (this.eventHandlers.get(name) === undefined) {
      this.eventHandlers.set(name, handler);
    }
  }

  public getEventHandlers = () => {
    return new Map(this.eventHandlers);
  }

  public clearEventHandlers = () => {
    this.eventHandlers.clear();
  }
}
