import axios from "axios";
import { API_URL } from "@/api/api.constants";
import { LoginUserDto, Token, AuthResponse } from "@/types/auth";

interface SignInPayload {
  email: string;
  password: string;
  deviceId: string;
}

export async function signIn(
  payload: SignInPayload,
): Promise<{ user: LoginUserDto; token: Token }> {
  try {
    const response = await axios.post<AuthResponse>(
      `${API_URL}/login/local`,
      payload,
    );
    const { user, access_token, refresh_token } = response.data;

    const token: Token = { access_token, refresh_token };

    // Save to localStorage
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
    localStorage.setItem("user", JSON.stringify(user));

    return { user, token };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to sign in");
  }
}

// Fetch current auth data from storage
export function getAuthData(): {
  user: LoginUserDto | null;
  token: Token | null;
} {
  try {
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");
    const userJson = localStorage.getItem("user");

    if (accessToken && refreshToken && userJson) {
      return {
        token: { access_token: accessToken, refresh_token: refreshToken },
        user: JSON.parse(userJson) as LoginUserDto,
      };
    }
  } catch (e) {
    // Ignore JSON parse errors or other issues
  }
  return { user: null, token: null };
}

export async function signOut() {
  try {
    // Attempt to call API logout, but don't block local cleanup on failure
    await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
  } catch (error: any) {
    console.warn("API Logout failed:", error);
  } finally {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
  }
}

// Lightweight polling-based auth state subscription for cross-tab sync or changes
export function onAuthStateChange(
  callback: (
    event: string,
    token: Token | null,
    user: LoginUserDto | null,
  ) => void,
) {
  let lastTokenHash: string | null = null;
  let cancelled = false;

  const poll = () => {
    const { token, user } = getAuthData();
    const tokenHash = token ? token.access_token : null;

    if (tokenHash !== lastTokenHash) {
      const event =
        lastTokenHash === null && token
          ? "SIGNED_IN"
          : token
            ? "TOKEN_REFRESH"
            : "SIGNED_OUT";
      lastTokenHash = tokenHash;
      callback(event, token, user);
    }
  };

  poll();
  const id = setInterval(() => {
    if (cancelled) return;
    poll();
  }, 1000);

  return {
    unsubscribe: () => {
      cancelled = true;
      clearInterval(id);
    },
  };
}
