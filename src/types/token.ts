import { LoginUserDto } from "./auth";

export enum TokenType {
  ACCESS_TOKEN = "ACCESS_TOKEN",
  REFRESH_TOKEN = "REFRESH_TOKEN",
}

export interface UpdateTokenRequestBody {
  deviceId: string;
  refreshToken: string;
  type: TokenType;
}

export interface UpdateTokenResponse {
  access_token: string;
  refresh_token: string;
  user: LoginUserDto;
}
