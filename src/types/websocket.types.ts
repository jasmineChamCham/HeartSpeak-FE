import { AnalysisResponse } from "./analysis.types";

export interface StartChatPayload {
  sessionId: string;
}

export interface JoinedConversationPayload {
  sessionId: string;
  message?: string;
}

export interface AnalysisSessionCompletePayload {
  sessionId: string;
  status: string;
  analysisResult: AnalysisResponse;
}

export interface ChatAnalysisProgressPayload {
  messageId: string;
  chunk: string;
}
