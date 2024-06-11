import { DefineOAuth2Provider, Schema } from "deno-slack-sdk/mod.ts";

const LinkedInProvider = DefineOAuth2Provider({
  provider_key: "linkedin",
  provider_type: Schema.providers.oauth2.CUSTOM,
  options: {
    provider_name: "LinkedIn",
    authorization_url: "https://www.linkedin.com/oauth/v2/authorization",
    token_url: "https://www.linkedin.com/oauth/v2/accessToken",
    client_id: "LINKEDIN_APP_CLIENT_ID",
    scope: [
      "email",
      "openid",
      "profile",
      "w_member_social",
    ],
    authorization_url_extras: {
      prompt: "consent",
      access_type: "offline",
    },
    identity_config: {
      url: "https://api.linkedin.com/v2/userinfo",
      account_identifier: "$.sub",
      http_method_type: "GET",
    },
    use_pkce: false,
  },
});

export default LinkedInProvider;
