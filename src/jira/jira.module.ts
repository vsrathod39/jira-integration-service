import { Module } from "@nestjs/common";
import { JiraService } from "./jira.service";
import { JiraController } from "./jira.controller";
import { UsersModule } from "src/users/users.module";
import { TokensModule } from "src/tokens/tokens.module";

@Module({
  imports: [UsersModule, TokensModule],
  controllers: [JiraController],
  providers: [JiraService],
  exports: [],
})
export class JiraModule {}
