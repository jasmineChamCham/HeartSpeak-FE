import { MBTI, RoleType, LoveLanguage, ZodiacSign } from "@/common/enums";

export interface LoginUserDto {
  id: string;
  displayName?: string;
  avatarUrl?: string;
  email: string;
  role: RoleType;
  mbti?: MBTI;
  zodiacSign?: ZodiacSign;
  loveLanguages?: LoveLanguage[];
  createdAt: Date;
}

export interface Token {
  access_token: string;
  refresh_token: string;
}

export interface AuthResponse {
  user: LoginUserDto;
  access_token: string;
  refresh_token: string;
}
