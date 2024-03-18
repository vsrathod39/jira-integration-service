import { Controller } from "@nestjs/common";
import { TokensService } from "./tokens.service";

@Controller("token")
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}
}
