import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

export const LikeLinkedInPostFunctionDefinition = DefineFunction({
  callback_id: "like_linkedin_post",
  title: "Like LinkedIn Post",
  description: "Like a LinkedIn post",
  source_file: "functions/like_linkedin_post.ts",
  input_parameters: {
    properties: {
      linkedin_access_token_id: {
        type: Schema.slack.types.oauth2,
        oauth2_provider_key: "linkedin",
      },
      message: {
        type: Schema.types.string,
        description: "The message containing the LinkedIn post URL",
      },
      user_id: {
        type: Schema.slack.types.user_id,
        description: "The id of the user that clicked the button",
      },
      channel_id: {
        type: Schema.slack.types.channel_id,
        description: "The channel id in which the origiinal message was sent",
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
    required: ["linkedin_access_token_id", "message", "user_id"],
  },
  output_parameters: {
    properties: {
      error: { type: Schema.types.string },
      message: { type: Schema.types.string },
    },
    required: [],
  },
});

const extractIdFromUrl = (url: string): string | null => {
  if (url.includes("linkedin.com/feed/update/urn:li:activity:")) {
    return url.split(":").at(-1)?.replace("/", "").replace(">", "") ?? "";
  }
  const match = url.match(/\/posts\/([^/?]+)/);
  if (!match || match.length < 2) return null;
  const id = match[1].split("-").at(-2);
  return id || null;
};

export default SlackFunction(
  LikeLinkedInPostFunctionDefinition,
  async ({ inputs, client }) => {
    let auth = await client.apps.auth.external.get({
      external_token_id: inputs.linkedin_access_token_id,
    });
    if (!auth.ok) {
      auth = await client.apps.auth.external.get({
        external_token_id: inputs.linkedin_access_token_id,
        force_refresh: true, // default force_refresh is false
      });
      if (!auth.ok) {
        return {
          outputs: {
            message: `Failed to collect LinkedIn auth token: ${auth.error}`,
          },
        };
      }
    }

    console.log("Getting linkedin userinfo");
    const userData = await fetch("https://api.linkedin.com/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${auth.external_token}`,
      },
    });
    const j = await userData.json();
    const userArn = `urn:li:person:${j.sub}`;
    console.log("Got ARN for user", userArn);

    const postId = extractIdFromUrl(inputs.message);
    if (!postId) {
      return {
        error: `Failed to extract post ID from message: ${inputs.message}`,
      };
    }

    console.log("Post ID", postId);

    console.log("Liking the post", postId, userArn);
    const url = `https://api.linkedin.com/rest/reactions?actor=${
      encodeURIComponent(userArn)
    }`;
    const like = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${auth.external_token}`,
        "LinkedIn-Version": "202306",
      },
      body: JSON.stringify({
        "root": `urn:li:activity:${postId}`,
        // TODO: Add more reaction types
        "reactionType": "PRAISE",
      }),
    });

    console.log("Liked post!", like.status);

    try {
      const response = await like.json();
      console.log("Response", response);
    } catch {
      console.log("Failed to parse response");
    }

    // TODO: DM the original user
    // const sendingUser = await client.users.info({
    //   user: inputs.sending_user_id,
    // });
    // const sendingUserRealName = sendingUser.user?.real_name || "Unknown";
    // const humanTime = inputs.timestamp
    //   ? new Date(parseInt(inputs.timestamp) * 1000)
    //     .toLocaleString()
    //   : "unknown";

    if (like.status === 409) {
      return {
        outputs: {
          message: `Already furgan! (Already liked the post)`,
        },
      };
    }

    if (like.status === 201) {
      return {
        outputs: {
          message: `Furgan! (Liked the post)`,
        },
      };
    }

    return {
      outputs: {
        message: `Failed to like the post. Response: ${await like
          .text()}, Status: ${like.status}`,
      },
    };
  },
);
