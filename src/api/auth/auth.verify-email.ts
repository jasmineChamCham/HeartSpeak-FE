import axios from "axios";
import { API_URL } from "@/api/api.constants";
import { LoginUserDto, Token, AuthResponse } from "@/types/auth";

export interface VerifyEmailPayload {
  email: string;
  token: string;
  deviceId: string;
}

export async function verifyEmail(
  payload: VerifyEmailPayload,
): Promise<{ user: LoginUserDto; token: Token }> {
  const response = await axios.post<AuthResponse>(
    `${API_URL}/local/verify-email`,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  const { user, access_token, refresh_token } = response.data;

  // Log the user in — save tokens to localStorage
  localStorage.setItem("access_token", access_token);
  localStorage.setItem("refresh_token", refresh_token);
  localStorage.setItem("user", JSON.stringify(user));

  return {
    user,
    token: { access_token, refresh_token },
  };
}
