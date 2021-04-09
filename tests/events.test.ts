import { expect } from "chai";
import Event from "../src/classes/Event";
import SubgraphData from "../src/classes/SubgraphData";
import yamlString from "./mocks/subgraphYml";

describe("Contract events", () => {

  // Example mapping function
  // function handleNewGravatar(event: Event): void {
  //   const gravatar = new Gravatar(event.params.id.toHex());
  //   gravatar.owner = event.params.owner;
  //   gravatar.displayName = event.params.displayName;
  //   gravatar.imageUrl = event.params.imageUrl;
  //   gravatar.save();
  // }

  it("Can parse .yml file and get events correctly.", () => {
    const subgraphData = new SubgraphData(yamlString);
    const events = subgraphData.getEvents();
    expect(Array.from(events.entries())).length(2);
  });

});
