import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { USER_MODEL } from "../user/user.schema";

@Schema({
  timestamps: true, // set to true to add createdAt and updatedAt fields to the schema
  _id: true, // set to false to disable the generation of the _id field in the documents
})
export class Token {
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: USER_MODEL,
  })
  userId: Types.ObjectId | string;

  @Prop({
    required: true,
  })
  accessToken: string;

  @Prop({ required: true })
  refreshToken: string;

  @Prop({ required: true })
  cloudId: string;

  @Prop({ required: true })
  expiresIn: number;

  @Prop({ required: true })
  tokenType: string;

  @Prop({ required: true })
  scope: string;

  @Prop()
  state?: string;

  @Prop()
  tokenExpiresAt?: Date;

  @Prop()
  refreshTokenExpiresAt?: Date;

  @Prop()
  lastUsedAt?: Date;
}

const schema = SchemaFactory.createForClass(Token);
export const TokenSchema = schema;
export const TOKEN_MODEL = Token.name;
export type TokenDocument = Token & Document;
