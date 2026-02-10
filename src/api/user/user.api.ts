import apiClient from "@/api/api.client";
import { LoginUserDto } from "@/types/auth";
import { UpdateUserRequestBody, User } from "@/types/user";

/**
 * Get current user's profile
 * @returns User profile data
 */
export async function getMyProfile(): Promise<User> {
  const response = await apiClient.get<User>("/self/my-profile");
  return response.data;
}

/**
 * Update current user's profile
 * Uses the /self/profile endpoint for the authenticated user
 * @param body - Partial user data to update
 */
export async function updateMyProfile(
  body: UpdateUserRequestBody,
): Promise<LoginUserDto> {
  const response = await apiClient.put<User>("/self/profile", body);
  return response.data;
}

/**
 * Update user profile
 * Only sends fields that are being updated (partial update)
 * @param userId - User ID
 * @param body - Partial user data to update
 */
export async function updateUser(
  userId: string,
  body: UpdateUserRequestBody,
): Promise<User> {
  const response = await apiClient.put<User>(`/users/${userId}`, body);
  return response.data;
}
