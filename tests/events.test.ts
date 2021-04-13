import { expect } from "chai";
import Event from "../src/classes/Event";
import Store from "../src/classes/Store";
import SubgraphData from "../src/classes/SubgraphData";
import "../src/extensions/object";
import "../src/extensions/string";
import Gravatar from "./mocks/Gravatar";
import yamlString from "./mocks/subgraphYml";

describe("Contract events", () => {
  const store = new Store();

  class NewGravatar extends Event {
    constructor(params?: any) {
      super("NewGravatar", params);
    }
  }

  const newGravatar: NewGravatar = new NewGravatar({
    color: "purple",
    displayName: "Harold",
    id: "444",
    owner: "0x1234567",
  });

  // Example mapping function
  function handleNewGravatar(event: NewGravatar): void {
    const gravatar = new Gravatar(event.params.id.toHex());
    gravatar.owner = event.params.owner;
    gravatar.displayName = event.params.displayName;
    gravatar.imageUrl = event.params.imageUrl;
    gravatar.save();
  }

  const subgraphData = new SubgraphData(yamlString);
  const events = subgraphData.getEvents();
  const eventsArray = Array.from(events.entries());

  it("Can parse .yml file and get events correctly.", () => {
    expect(eventsArray).length(3);
    expect(JSON.stringify(eventsArray)).equals(
      `[[0,"Transfer"],[1,"Approval"],[2,"NewGravatar"]]`,
    );
  });

  it("Can call function handler and populate the state", () => {
    handleNewGravatar(newGravatar);
    expect(store.readStateMap()).length(1);

    const storeMapJSON = store.readStateJson();
    expect(storeMapJSON).equals(
      `[["343434",{"id":"343434","params":{"owner":"0x1234567","displayName":"Harold","id":"343434"}}]]`,
    );
  });
});
