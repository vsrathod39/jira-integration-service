import { Global, Module } from "@nestjs/common";
import { TOKEN_MODEL, TokenSchema } from "./token";
import { USER_MODEL, UserSchema } from "./user";
import { MongooseModule } from "@nestjs/mongoose";

const MODELS = [
  { name: TOKEN_MODEL, schema: TokenSchema },
  { name: USER_MODEL, schema: UserSchema },
];

@Global()
@Module({
  imports: [MongooseModule.forFeature(MODELS)],
  exports: [MongooseModule],
})
export class MongooseModelsModule {}
