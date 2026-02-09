import apiClient from "@/api/api.client";
import {
  CreateAnalysisSessionRequestBody,
  AnalysisSession,
} from "@/types/analysis-session";

export async function createAnalysisSession(
  body: CreateAnalysisSessionRequestBody,
  mediaUrls?: string[],
): Promise<AnalysisSession> {
  const response = await apiClient.post<AnalysisSession>("/analysis-sessions", {
    contextMessage: body.contextMessage,
    mediaUrls,
    model: body.model,
  });

  return response.data;
}
