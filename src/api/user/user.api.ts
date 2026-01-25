import apiClient from "@/api/api.client";
import { UpdateUserRequestBody, User } from "@/types/user";

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
