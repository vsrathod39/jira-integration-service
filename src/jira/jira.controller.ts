import { Body, Controller, Get, Param, Query, Req, Res, Session } from "@nestjs/common";
import { JiraService } from "./jira.service";
import { query } from "express";

@Controller("jira")
export class JiraController {
  constructor(private readonly jiraService: JiraService) {}

  @Get("oauth/connect")
  connectToJira(@Res() res: any) {
    console.log("Before");
    const authorizationUri = this.jiraService.connectToJira();
    console.log("authorizationUri", authorizationUri);
    return res.redirect(authorizationUri);
  }

  @Get("oauth/callback")
  callback(
    @Query("code") code: string,
    @Query() query: Record<string, any>,
    @Session() session: Record<string, any>,
    @Req() req: any,
    @Res() res: any,
  ) {
    console.log("code", code, query, req);
    return this.jiraService.exchangeCodeForAccessToken(code, query?.state, req, res);
  }

  @Get("oauth/refresh")
  refreshAccessToken(@Body("refreshToken") refreshToken: string) {
    return this.jiraService.refreshAccessToken(refreshToken);
  }

  @Get("ticket-details")
  getTicketDetails(@Param("ticketId") ticketId: string) {
    // return this.jiraService.getTicketDetails(ticketId);
  }
}
