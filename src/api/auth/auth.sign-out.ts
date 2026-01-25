import { clearLocalStorage } from "@/common/utils";
import apiClient from "../api.client";

export async function signOut() {
  try {
    await apiClient.post("/logout");
  } catch (error: any) {
    console.warn("API Logout failed:", error);
  } finally {
    clearLocalStorage();
  }
}
