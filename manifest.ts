import { Manifest } from "deno-slack-sdk/mod.ts";
import LinkedInProvider from "./external_auth/linkedin_provider.ts";
import LikePostWorkflow from "./workflows/like_post_link.ts";
import LikePostButtonWorkflow from "./workflows/like_post_message_button.ts";

export default Manifest({
  name: "Firgun",
  description:
    "A Slack workflow that will help you to like your team members efforts and give them a Firgun.",
  icon: "assets/app_icon.png",
  workflows: [LikePostWorkflow, LikePostButtonWorkflow],
  outgoingDomains: ["api.linkedin.com"],
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
    "datastore:read",
    "datastore:write",
    "channels:read",
    "channels:history",
    "groups:history",
    "im:read",
    "mpim:read",
    "triggers:write",
    "triggers:read",
  ],
  externalAuthProviders: [LinkedInProvider],
});
