import axios from "axios";
import { API_URL } from "@/api/api.constants";
import {
  TokenType,
  UpdateTokenRequestBody,
  UpdateTokenResponse,
} from "@/types/token";
import { clearLocalStorage } from "@/common/utils";

/**
 * Refresh access token using refresh token
 * @param deviceId - Device ID
 * @returns New access and refresh tokens
 */
export async function refreshAccessToken(
  deviceId: string,
): Promise<UpdateTokenResponse> {
  try {
    const refreshToken = localStorage.getItem("refresh_token");

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const payload: UpdateTokenRequestBody = {
      deviceId,
      refreshToken,
      type: TokenType.ACCESS_TOKEN,
    };

    const response = await axios.put<UpdateTokenResponse>(
      `${API_URL}/refresh`,
      payload,
    );

    // Update localStorage with new tokens and user data
    localStorage.setItem("access_token", response.data.access_token);
    localStorage.setItem("refresh_token", response.data.refresh_token);
    localStorage.setItem("user", JSON.stringify(response.data.user));

    return response.data;
  } catch (error: any) {
    clearLocalStorage();
    throw new Error(error.response?.data?.message || "Token refresh failed");
  }
}

/**
 * Refresh refresh token using existing refresh token
 * @param deviceId - Device ID
 * @returns New access and refresh tokens
 */
export async function refreshRefreshToken(
  deviceId: string,
): Promise<UpdateTokenResponse> {
  try {
    const refreshToken = localStorage.getItem("refresh_token");

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const payload: UpdateTokenRequestBody = {
      deviceId,
      refreshToken,
      type: TokenType.REFRESH_TOKEN,
    };

    const response = await axios.put<UpdateTokenResponse>(
      `${API_URL}/refresh`,
      payload,
    );

    // Update localStorage with new tokens and user data
    localStorage.setItem("access_token", response.data.access_token);
    localStorage.setItem("refresh_token", response.data.refresh_token);
    localStorage.setItem("user", JSON.stringify(response.data.user));

    return response.data;
  } catch (error: any) {
    clearLocalStorage();
    throw new Error(error.response?.data?.message || "Token refresh failed");
  }
}

/**
 * Get device ID from localStorage or generate a new one manually
 */
export function getDeviceId(): string {
  let deviceId = localStorage.getItem("deviceId");

  if (!deviceId) {
    deviceId = `web-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem("deviceId", deviceId);
  }

  return deviceId;
}
