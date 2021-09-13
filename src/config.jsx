import ForgeUI, { render, MacroConfig, TextField } from "@forge/ui";
import { defaultConfig } from "./constants";

const Config = () => {
  return (
    <MacroConfig>
      <TextField
        name="title"
        label="Title"
        defaultValue={defaultConfig.title}
      />
      <TextField
        name="message"
        label="Default message"
        defaultValue={defaultConfig.message}
      />
      <TextField
        name="minimumLikes"
        label="Minimum amount of likes"
        defaultValue={defaultConfig.minimumLikes}
      />
    </MacroConfig>
  );
};

export const config = render(<Config />);
