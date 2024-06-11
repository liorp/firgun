// The message trigger would intercept every message and check if it contains a LinkedIn post URL.
// If it does, it would send the user a DM with a button to like the post.

import { Trigger } from "deno-slack-api/types.ts";
import {
  TriggerContextData,
  TriggerEventTypes,
  TriggerTypes,
} from "deno-slack-api/mod.ts";
import LikePostButtonWorkflow from "../workflows/like_post_message_button.ts";
import { CHANNEL } from "../consts.ts";

const trigger: Trigger<typeof LikePostButtonWorkflow.definition> = {
  type: TriggerTypes.Event,
  name: "Linkedin post message event",
  description:
    "Checks messages for linkedin posts and responds with a like button",
  workflow: `#/workflows/${LikePostButtonWorkflow.definition.callback_id}`,
  event: {
    event_type: TriggerEventTypes.MessagePosted,
    channel_ids: [CHANNEL],
    filter: {
      version: 1,
      root: {
        statement: "{{data.text}} CONTAINS 'linkedin.com'",
      },
    },
  },
  inputs: {
    message: {
      value: TriggerContextData.Event.MessagePosted.text,
    },
    channel_id: {
      value: TriggerContextData.Event.MessagePosted.channel_id,
    },
    // TODO: Enable these
    // user_id: {
    //   value: TriggerContextData.Event.MessagePosted.user_id,
    // },
    // message_ts: {
    //   value: TriggerContextData.Event.MessagePosted.message_ts,
    // },
  },
};

export default trigger;
