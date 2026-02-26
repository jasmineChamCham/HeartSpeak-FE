import { clearLocalStorage } from "@/common/utils";
import apiClient from "../api.client";
import { getDeviceId } from "./auth.refresh-token";

export async function signOut() {
  try {
    const deviceId = getDeviceId();
    await apiClient.post("/logout", { deviceId });
  } catch (error: any) {
    console.warn("API Logout failed:", error);
  } finally {
    clearLocalStorage();
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
  }
}
