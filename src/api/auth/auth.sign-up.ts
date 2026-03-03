import axios from "axios";
import { API_URL } from "@/api/api.constants";
import { LoveLanguage, MBTI, ZodiacSign } from "@/common/enums";

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

export async function signUp(payload: SignUpPayload): Promise<boolean> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const latitude = localStorage.getItem("latitude");
  const longitude = localStorage.getItem("longitude");
  if (latitude && longitude) {
    headers["x-latitude"] = latitude;
    headers["x-longitude"] = longitude;
  }

  const response = await axios.post<boolean>(
    `${API_URL}/local/sign-up`,
    {
      user: payload.user,
      deviceId: payload.deviceId,
    },
    { headers },
  );
  // Do NOT save tokens here — user must verify email first.
  // After verifying, the /verify-email endpoint will return tokens.
  return response.data;
}
