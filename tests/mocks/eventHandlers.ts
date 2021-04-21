import Gravatar from "../mocks/classes/Gravatar";
import NewGravatar from "../mocks/classes/NewGravatar";

export const handleNewGravatar = (event: NewGravatar): void => {
    const gravatar = new Gravatar(event.params.id.toHex());
    gravatar.owner = event.params.owner;
    gravatar.displayName = event.params.displayName;
    gravatar.imageUrl = event.params.imageUrl;
    gravatar.save();
  };
