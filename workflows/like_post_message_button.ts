import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { LINK_TRIGGER } from "../consts.ts";

const LikePostButtonWorkflow = DefineWorkflow({
  callback_id: "like_post_button",
  title: "Send Like a Post Button",
  description: "Send Like a Post Button",
  input_parameters: {
    properties: {
      message: {
        type: Schema.types.string,
        description: "The message received",
      },
      channel_id: {
        type: Schema.slack.types.channel_id,
        description: "The channel id",
      },
      // TODO: Enable these
      // user_id: {
      //   type: Schema.slack.types.user_id,
      //   description: "The user id",
      // },
      // message_ts: {
      //   type: Schema.slack.types.timestamp,
      //   description: "The timestamp",
      // },
    },
    required: [],
  },
});

LikePostButtonWorkflow.addStep(Schema.slack.functions.SendMessage, {
  channel_id: LikePostButtonWorkflow.inputs.channel_id,
  message: `Click below`,
  interactive_blocks: [
    {
      type: "actions",
      elements: [
        {
          type: "workflow_button",
          text: {
            type: "plain_text",
            text: "Firgun",
          },
          workflow: {
            trigger: {
              url: LINK_TRIGGER,
              customizable_input_parameters: [
                {
                  name: "message",
                  value: LikePostButtonWorkflow.inputs.message,
                },
                {
                  name: "channel_id",
                  value: LikePostButtonWorkflow.inputs.channel_id,
                },
                // TODO: Enable these
                // {
                //   name: "user_id",
                //   value: LikePostButtonWorkflow.inputs.user_id,
                // },
                // {
                //   name: "message_ts",
                //   value: LikePostButtonWorkflow.inputs.message_ts,
                // },
              ],
            },
          },
        },
      ],
    },
  ],
});

export default LikePostButtonWorkflow;
