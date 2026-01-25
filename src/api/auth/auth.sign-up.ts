import axios from "axios";
import { API_URL } from "@/api/api.constants";
import { LoginUserDto, Token, AuthResponse } from "@/types/auth";
import { LoveLanguage, MBTI, RoleType, ZodiacSign } from "@/common/enums";

export interface SignUpPayload {
  user: {
    displayName: string;
    email: string;
    password: string;
    mbti?: MBTI;
    zodiacSign?: ZodiacSign;
    loveLanguages?: LoveLanguage[];
  };
  deviceId: string;
  avatar?: File;
}

export async function signUp(
  payload: SignUpPayload,
): Promise<{ user: LoginUserDto; token: Token }> {
  // Create FormData for multipart/form-data upload
  const formData = new FormData();

  // Add user data as JSON string
  formData.append("user", JSON.stringify(payload.user));
  formData.append("deviceId", payload.deviceId);

  // Add avatar file if present
  if (payload.avatar) {
    formData.append("avatar", payload.avatar);
  }

  const response = await axios.post<AuthResponse>(
    `${API_URL}/local/sign-up`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
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
