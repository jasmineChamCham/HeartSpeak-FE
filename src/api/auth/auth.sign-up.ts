import axios from "axios";
import { API_URL } from "@/api/api.constants";
import { LoginUserDto, Token, AuthResponse } from "@/types/auth";
import { LoveLanguage, MBTI, RoleType, ZodiacSign } from "@/common/enums";

export interface SignUpPayload {
  user: {
    displayName: string;
    email: string;
    password: string;
    avatarUrl?: string;
    mbti?: MBTI;
    zodiacSign?: ZodiacSign;
    loveLanguages?: LoveLanguage[];
  };
  deviceId: string;
}

export async function signUp(
  payload: SignUpPayload,
): Promise<{ user: LoginUserDto; token: Token }> {
  const response = await axios.post<AuthResponse>(
    `${API_URL}/local/sign-up`,
    {
      user: payload.user,
      deviceId: payload.deviceId,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  const { user, access_token, refresh_token } = response.data;

  // Save to localStorage (triggers auth state change)
  localStorage.setItem("access_token", access_token);
  localStorage.setItem("refresh_token", refresh_token);
  localStorage.setItem("user", JSON.stringify(user));

  return { user, token: { access_token, refresh_token } };
}
