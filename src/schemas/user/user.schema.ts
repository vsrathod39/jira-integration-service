import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({
  timestamps: true, // set to true to add createdAt and updatedAt fields to the schema
  _id: true, // set to false to disable the generation of the _id field in the documents
})
export class User {
  @Prop({
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    required: true,
  })
  name: string;
}

// The @Schema() decorator is used to define the schema for the User model
// The timestamps option is set to true to add createdAt and updatedAt fields to the schema
// The versionKey option is set to true to enable the version key in the documents
// The _id option is set to true to enable the generation of the _id field in the documents
// The @Prop() decorator is used to define the properties of the User model
// The required option is set to true to make the property required
// The unique option is set to true to make the property unique
// The type of the property is defined as a string
// The name of the property is defined as email
// The type of the property is defined as a string
// The name of the property is defined as name
// The User model is exported to be used in other parts of the application
// The User model is a Mongoose schema that represents the user collection in the database
// The user collection is used to store user information such as email and name

const schema = SchemaFactory.createForClass(User);
export const UserSchema = schema;
export const USER_MODEL = User.name;
export type UserDocument = User & Document;
