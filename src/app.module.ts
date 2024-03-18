import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import * as Joi from "joi";
import { DatabaseModule } from "./infra/mongoose/database.module";
import { JiraModule } from "./jira/jira.module";
import { MongooseModelsModule } from "./schemas/mongooseModels.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // No need to import into other modules as it is global now
      validationSchema: Joi.object({
        // Joi is a validation library for JavaScript that is used here to validate the environment variables that are being used in the application
        ENV: Joi.string().valid("DEV", "UAT", "PRODUCTION").default("DEV"),
        PORT: Joi.number().port().default(3000),
        AUTH_ENABLED: Joi.boolean().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
      }),
      validationOptions: {
        allowUnknown: true, // allows the validation of unknown keys in the environment variables if set to true (default) or disallows them if set to false
        // abortEarly: true, // stops validation on the first error if set to true or continue validation for all properties if set to false (default)
      },
    }),
    DatabaseModule,
    JiraModule,
    MongooseModelsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
