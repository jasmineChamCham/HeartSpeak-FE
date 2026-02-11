import { ChatMessage, SendChatMessagePayload } from "@/types";
import apiClient from "@/api/api.client";

export const sendChatMessage = async (
  payload: SendChatMessagePayload,
): Promise<ChatMessage> => {
  const response = await apiClient.post<ChatMessage>("/chat-messages", payload);
  return response.data;
};

export const getChatMessagesBySessionId = async (
  sessionId: string,
  page: number = 1,
  limit: number = 20,
): Promise<ChatMessage[]> => {
  const response = await apiClient.get<[number, ChatMessage[]]>(
    `/chat-messages/session/${sessionId}?page=${page}&perPage=${limit}`,
  );
  return (response.data as any).data || response.data;
};
