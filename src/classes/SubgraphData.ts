import yaml from "yaml";
// tslint:disable-next-line: no-var-requires
const stringify = require("fast-json-stable-stringify");

export default class SubgraphData {
  private data: any;
  private events: string[];

  constructor(yamlString: string) {
    const fullData = yaml.parse(yamlString);

    this.data = fullData;
    // TODO: Should we always get the first?
    this.events = fullData.dataSources[0].mapping.eventHandlers;
  }

  public getEvents = () => {
    return this.events;
  }

  public printAllData = () => {
      return stringify(this.data);
  }

  public getEventNames = () => {
    return Array.from(this.data.dataSources[0].mapping.eventHandlers).map((eh: any) => {
      return eh.event.substring(0, eh.event.indexOf("("));
    });
  }
}
