import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MongooseModuleOptions, MongooseOptionsFactory } from "@nestjs/mongoose";

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  constructor(private configService: ConfigService) {} // inject the ConfigService to use it to get the environment variables for the database connection string and the database name from the .env file or the environment variables of the system where the application is running

  createMongooseOptions(): MongooseModuleOptions | Promise<MongooseModuleOptions> {
    // create a method called createMongooseOptions() that returns a MongooseModuleOptions object or a Promise of a MongooseModuleOptions object
    return {
      uri: `mongodb+srv://${this.configService.get<string>("DB_USERNAME")}:${this.configService.get<string>("DB_PASSWORD")}@dev.x3s3osv.mongodb.net/${this.configService.get<string>("DB_NAME")}?retryWrites=true&w=majority&appName=dev`,
      // useNewUrlParser: true, // set to true to opt in to using the MongoDB driver's new connection management engine
      // useUnifiedTopology: true, // set to true to opt in to using the MongoDB driver's new connection management engine
      // useCreateIndex: true, // set to true to make Mongoose's default index build use createIndex() instead of ensureIndex() to avoid deprecation warnings from MongoDB
      // useFindAndModify: false, // set to false to make findOneAndUpdate() and findOneAndRemove() use native findOneAndUpdate() rather than findAndModify()
    };
  }
}
