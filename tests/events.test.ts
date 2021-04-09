import { expect } from "chai";
import Event from "../src/classes/Event";
import SubgraphData from "../src/classes/SubgraphData";
import Gravatar from "./mocks/Gravatar";
import yamlString from "./mocks/subgraphYml";

describe("Contract events", () => {

  class NewGravatar extends Event {}

  // Example mapping function
  function handleNewGravatar(event: NewGravatar): void {
    const gravatar = new Gravatar(event.params.id.toHex());
    gravatar.owner = event.params.owner;
    gravatar.displayName = event.params.displayName;
    gravatar.imageUrl = event.params.imageUrl;
    gravatar.save();
  }

  it("Can parse .yml file and get events correctly.", () => {
    const subgraphData = new SubgraphData(yamlString);
    const events = subgraphData.getEvents();
    const eventsArray = Array.from(events.entries());
    expect(eventsArray).length(3);
    expect(JSON.stringify(eventsArray)).equals(`[[0,"Transfer"],[1,"Approval"],[2,"NewGravatar"]]`);
  });
});
