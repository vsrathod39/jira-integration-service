import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './mongoose.service';

@Module({
  imports: [
    // MongooseModule.forRootAsync({
    //   useFactory: async (configService: ConfigService) => ({
    //     uri: `mongodb+srv://${configService.get<string>('DB_USERNAME')}:${configService.get<string>('DB_PASSWORD')}@dev.x3s3osv.mongodb.net/${configService.get<string>('DB_NAME')}?retryWrites=true&w=majority&appName=dev`,
    //   }),
    //   inject: [ConfigService], // inject the ConfigService to use it to get the environment variables for the database connection string and the database name from the .env file or the environment variables of the system where the application is running
    // }),
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService, // use the DatabaseConfigService class to create the MongooseModuleOptions object or a Promise of a MongooseModuleOptions object
    }),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
