import apiClient from "@/api/api.client";
import { AnalysisStatus } from "@/common/enums";
import {
  CreateAnalysisSessionRequestBody,
  AnalysisSession,
  GetMyAnalysisSessionsQuery,
  PaginatedAnalysisSessions,
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

export async function getMyAnalysisSessions(
  query: GetMyAnalysisSessionsQuery = {},
): Promise<PaginatedAnalysisSessions> {
  const params = new URLSearchParams();

  params.append("status", AnalysisStatus.COMPLETED);

  if (query.page !== undefined) params.append("page", query.page.toString());
  if (query.perPage !== undefined)
    params.append("perPage", query.perPage.toString());
  if (query.search) params.append("search", query.search);
  if (query.order) params.append("order", query.order);

  const response = await apiClient.get<PaginatedAnalysisSessions>(
    `/analysis-sessions?${params.toString()}`,
  );

  return response.data;
}

export async function getAnalysisSession(
  sessionId: string,
): Promise<AnalysisSession> {
  const response = await apiClient.get<AnalysisSession>(
    `/analysis-sessions/${sessionId}`,
  );
  return response.data;
}
