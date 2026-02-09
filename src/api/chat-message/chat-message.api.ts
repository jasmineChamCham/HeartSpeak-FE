import { ChatMessage, SendChatMessagePayload } from "@/types";
import apiClient from "@/api/api.client";

export const sendChatMessage = async (
  payload: SendChatMessagePayload,
): Promise<ChatMessage> => {
  const response = await apiClient.post<ChatMessage>("/chat-messages", payload);
  return response.data;
};
