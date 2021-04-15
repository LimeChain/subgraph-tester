import yaml from "yaml";

interface IEventHandler {
  event: string;
  handler: string;
}

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
      return JSON.stringify(this.data);
  }

  public getEventNames = (eventHandles: IEventHandler[]) => {
    return Array.from(eventHandles).map((eh: IEventHandler) => {
      return eh.event.substring(0, eh.event.indexOf("("));
    });
  }
}
