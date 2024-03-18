import { BadGatewayException, Injectable } from "@nestjs/common";
import * as querystring from "querystring";
import { generateState } from "src/util/helpers";
import axios from "axios";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "src/users/users.service";
import { TokensService } from "src/tokens/tokens.service";

@Injectable()
export class JiraService {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly tokensService: TokensService,
  ) {}

  connectToJira() {
    const jiraOAuthConfig = {
      clientId: this.configService.get<string>("JIRA_CLIENT_ID"),
      clientSecret: this.configService.get<string>("JIRA_CLIENT_SECRET"),
      redirectUri: "https://8e90-122-161-50-130.ngrok-free.app/jira/oauth/callback",
      authorizationUrl: "https://auth.atlassian.com/authorize",
      audience: "api.atlassian.com",
      scope: "read:me read:account read:jira-work read:jira-user offline_access",
      state: generateState(),
      responseType: "code",
      prompt: "consent",
    };

    const authorizationUri =
      jiraOAuthConfig.authorizationUrl +
      "?" +
      querystring.stringify({
        audience: jiraOAuthConfig.audience,
        client_id: jiraOAuthConfig.clientId,
        scope: jiraOAuthConfig.scope,
        redirect_uri: jiraOAuthConfig.redirectUri,
        state: jiraOAuthConfig.state,
        response_type: jiraOAuthConfig.responseType,
        prompt: jiraOAuthConfig.prompt,
      });
    return authorizationUri;
  }

  async exchangeCodeForAccessToken(code: string, state: string, req: any, res: any) {
    const jiraOAuthConfig = {
      grantType: "authorization_code",
      clientId: this.configService.get<string>("JIRA_CLIENT_ID"),
      clientSecret: this.configService.get<string>("JIRA_CLIENT_SECRET"),
      redirectUri: "https://8e90-122-161-50-130.ngrok-free.app/jira/oauth/callback",
      audience: "api.atlassian.com",
      tokenUrl: "https://auth.atlassian.com/oauth/token",
    };

    if (!state) {
      return res.status(403).send("Invalid state");
    }

    try {
      const tokenResponse = await axios.post(
        jiraOAuthConfig.tokenUrl,
        querystring.stringify({
          grant_type: jiraOAuthConfig.grantType,
          client_id: jiraOAuthConfig.clientId,
          client_secret: jiraOAuthConfig.clientSecret,
          redirect_uri: jiraOAuthConfig.redirectUri,
          code,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      console.log("tokenResponse", tokenResponse);

      const accessToken = tokenResponse.data.access_token;
      const jiraUser = await this.getJiraUser(accessToken);
      if (!jiraUser) {
        return res.status(500).send("Failed to get Jira user");
      }
      try {
        const user = await this.usersService.findOneByEmail(jiraUser.email);
      } catch (error) {
        if (error.status === 404) {
          const user = await this.usersService.create({ email: jiraUser.email, name: jiraUser.name });
          const cloudId = await this.getJiraCloudId(accessToken);
          const tokenPayload = {
            userId: user._id,
            accessToken,
            cloudId,
            refreshToken: tokenResponse.data.refresh_token,
            tokenType: tokenResponse.data.token_type,
            expiresIn: tokenResponse.data.expires_in,
            scope: tokenResponse.data.scope,
          };
          const token = await this.tokensService.create(tokenPayload);
        } else {
          throw new BadGatewayException("Failed to authenticate user");
        }
      }
      return res.redirect("/success");
    } catch (error) {
      console.error("Error exchanging code for access token:", error);
      res.status(500).send("Failed to exchange code for access token");
    }
  }

  async getJiraUser(accessToken: string) {
    try {
      const response = await axios.get("https://api.atlassian.com/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error getting Jira user:", error);
      return null;
    }
  }

  async getJiraCloudId(accessToken: string) {
    try {
      const response = await axios.get("https://api.atlassian.com/oauth/token/accessible-resources", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data[0].id;
    } catch (error) {
      console.error("Error getting Jira cloud ID:", error);
      return null;
    }
  }

  async refreshAccessToken(refreshToken: string) {
    const jiraOAuthConfig = {
      grantType: "refresh_token",
      clientId: this.configService.get<string>("JIRA_CLIENT_ID"),
      clientSecret: this.configService.get<string>("JIRA_CLIENT_SECRET"),
      tokenUrl: "https://auth.atlassian.com/oauth/token",
    };

    try {
      const tokenResponse = await axios.post(
        jiraOAuthConfig.tokenUrl,
        querystring.stringify({
          grant_type: jiraOAuthConfig.grantType,
          client_id: jiraOAuthConfig.clientId,
          client_secret: jiraOAuthConfig.clientSecret,
          refresh_token: refreshToken,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );
      console.log("tokenResponse", tokenResponse);
      return tokenResponse.data;
    } catch (error) {
      console.error("Error refreshing access token:", error);
      return null;
    }
  }

  async getTicketDetails(ticketId: string, userId: string) {
    const accessToken = this.tokensService.getTokensByUserId(userId);
    try {
      const response = await axios.get(`https://api.atlassian.com/ex/jira/${ticketId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error getting ticket details:", error);
      return null;
    }
  }
}
