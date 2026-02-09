import { MessageRole } from "@/common/enums";
import { Upload } from "./upload";

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: MessageRole;
  content: string;
  createdAt: string;
  uploads?: Upload[];
}

export interface SendChatMessagePayload {
  sessionId: string;
  role: "user" | "assistant";
  content: string;
  mediaUrls?: string[];
  analysisContext?: string;
}
