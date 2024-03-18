import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { TOKEN_MODEL, TokenDocument } from "src/schemas/token";
import { CreateTokenDto } from "./dto/create-token.dto";

@Injectable()
export class TokensService {
  constructor(@InjectModel(TOKEN_MODEL) private readonly userModel: Model<TokenDocument>) {}

  async getTokensByUserId(userId: string) {
    const token = await this.userModel.find({ userId });
    if (!token) {
      throw new NotFoundException("Token not found");
    }
    return token;
  }

  async create(token: CreateTokenDto) {
    const tokenEntry = await this.userModel.create(token);
    if (!tokenEntry) {
      throw new NotFoundException("Token not created");
    }
    return tokenEntry;
  }

  async updateToken(userId: string, token: CreateTokenDto) {
    const tokenEntry = await this.userModel.findOneAndUpdate({ userId }, token, { new: true });
    if (!tokenEntry) {
      throw new NotFoundException("Token not updated");
    }
    return tokenEntry;
  }
}
