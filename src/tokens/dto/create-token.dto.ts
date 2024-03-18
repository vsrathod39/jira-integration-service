import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateTokenDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  @IsString()
  accessToken: string;

  @IsNotEmpty()
  @IsString()
  refreshToken: string;

  @IsNotEmpty()
  @IsString()
  cloudId: string;

  @IsNotEmpty()
  @IsNumber()
  expiresIn: number;

  @IsNotEmpty()
  @IsString()
  tokenType: string;

  @IsNotEmpty()
  @IsString()
  scope: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsDate()
  tokenExpiresAt?: Date;

  @IsOptional()
  @IsDate()
  refreshTokenExpiresAt?: Date;

  @IsOptional()
  @IsDate()
  lastUsedAt?: Date;
}
