import apiClient from "../api.client";

export async function signOut() {
  try {
    await apiClient.post("/logout");
  } catch (error: any) {
    console.warn("API Logout failed:", error);
  } finally {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
  }
}
