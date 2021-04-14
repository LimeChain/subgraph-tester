import { expect } from "chai";
import Store from "../src/classes/Store";
import SubgraphData from "../src/classes/SubgraphData";
import "../src/extensions/object";
import "../src/extensions/string";
import Gravatar from "./mocks/classes/Gravatar";
import NewGravatar from "./mocks/classes/NewGravatar";
import NewTransfer from "./mocks/classes/NewTransfer";
import Transfer from "./mocks/classes/Transfer";
import yamlString from "./mocks/subgraphYml";

describe("Contract events", () => {
  const newGravatar: NewGravatar = new NewGravatar({
    color: "purple",
    displayName: "Harold",
    id: "444",
    owner: "0x1234567",
  });

  const anotherNewGravatar: NewGravatar = new NewGravatar({
    color: "yellow",
    displayName: "Gerald",
    id: "555",
    owner: "0x1234567",
  });

  const newTransfer: NewTransfer = new NewTransfer({
    amount: 5,
    from: "123",
    id: "999",
    to: "456",
  });

  const anotherNewTransfer: NewTransfer = new NewTransfer({
    amount: 5,
    from: "456",
    id: "333",
    to: "789",
  });

  const handleNewGravatar = (event: NewGravatar): void => {
    const gravatar = new Gravatar(event.params.id.toHex());
    gravatar.owner = event.params.owner;
    gravatar.displayName = event.params.displayName;
    gravatar.imageUrl = event.params.imageUrl;
    gravatar.save();
  };

  const handleNewTransfer = (event: NewTransfer): void => {
    const transfer = new Transfer(event.params.id.toHex());
    transfer.from = event.params.from;
    transfer.to = event.params.to;
    transfer.amount = event.params.amount;
    transfer.save();
  };

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
    const store = new Store();

    handleNewGravatar(newGravatar);
    expect(store.readStateMap()).length(1);

    const storeMapJSON = store.readStateJson();
    expect(storeMapJSON).equals(
      `[["343434",{"id":"343434","params":{"owner":"0x1234567","displayName":"Harold","id":"343434"}}]]`,
    );
  });

  it("Can run an events test fixture through a mapping function", () => {
    const store = new Store();

    const gravatarEventsFixture = [newGravatar, anotherNewGravatar];
    const transferEventsFixture = [newTransfer, anotherNewTransfer];

    gravatarEventsFixture.forEach((ge) => {
      handleNewGravatar(ge);
    });

    transferEventsFixture.forEach((te) => {
      handleNewTransfer(te);
    });

    expect(store.readStateMap().size).equals(4);
    expect(store.readStateJson()).equals(`[["343434",{"id":"343434","params":{"owner":"0x1234567","displayName":"Harold","id":"343434"}}],["353535",{"id":"353535","params":{"owner":"0x1234567","displayName":"Gerald","id":"353535"}}],["393939",{"id":"393939","params":{"id":"393939","to":"456","from":"123","amount":5}}],["333333",{"id":"333333","params":{"id":"333333","to":"789","from":"456","amount":5}}]]`);
  });
});
