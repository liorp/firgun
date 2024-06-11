import { Trigger } from "deno-slack-api/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import LikePostWorkflow from "../workflows/like_post_link.ts";

const trigger: Trigger<typeof LikePostWorkflow.definition> = {
  type: TriggerTypes.Shortcut,
  name: "Linkedin post link shortcut",
  description: "Responds to a linkedin post",
  workflow: `#/workflows/${LikePostWorkflow.definition.callback_id}`,
  inputs: {
    message: {
      customizable: true,
    },
    user_id: {
      value: TriggerContextData.Shortcut.user_id,
    },
    channel_id: {
      customizable: true,
    },
    // TODO: Enable these
    // sending_user_id: {
    //   customizable: true,
    // },
    // timestamp: {
    //   customizable: true,
    // },
  },
};

export default trigger;
