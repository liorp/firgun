import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { LikeLinkedInPostFunctionDefinition } from "../functions/like_linkedin_post.ts";

const LikePostWorkflow = DefineWorkflow({
  callback_id: "like_post",
  title: "Like a Post",
  description: "Like a Post",
  input_parameters: {
    properties: {
      message: {
        type: Schema.types.string,
        description: "The message",
      },
      channel_id: {
        type: Schema.slack.types.channel_id,
        description: "The channel id in which the origiinal message was sent",
      },
      user_id: {
        type: Schema.slack.types.user_id,
        description: "The id of the user that clicked the button",
      },
      // TODO: Enable these
      // sending_user_id: {
      //   type: Schema.slack.types.user_id,
      //   description: "The original message sending user id",
      // },
      // timestamp: {
      //   type: Schema.types.string,
      //   description: "The timestamp",
      // },
    },
    required: [
      "message",
      "user_id",
      "channel_id",
      // TODO: Enable these
      // "sending_user_id",
      // "timestamp",
    ],
  },
});

const likeStep = LikePostWorkflow.addStep(
  LikeLinkedInPostFunctionDefinition,
  {
    linkedin_access_token_id: {
      credential_source: "END_USER",
    },
    message: LikePostWorkflow.inputs.message,
    user_id: LikePostWorkflow.inputs.user_id,
    channel_id: LikePostWorkflow.inputs.channel_id,
    // TODO: Enable these
    // sending_user_id: LikePostWorkflow.inputs.sending_user_id,
    // timestamp: LikePostWorkflow.inputs.timestamp,
  },
);

LikePostWorkflow.addStep(Schema.slack.functions.SendDm, {
  user_id: LikePostWorkflow.inputs.user_id,
  message: `${likeStep.outputs.message}${
    likeStep.outputs.error ? " " + likeStep.outputs.error.toString() : ""
  }`,
});

export default LikePostWorkflow;
