import apiClient from "@/api/api.client";
import { AnalysisStatus } from "@/common/enums";
import {
  CreateAnalysisSessionRequestBody,
  AnalysisSession,
  GetMyAnalysisSessionsQuery,
  PaginatedAnalysisSessions,
  RefineCommentDto,
} from "@/types/analysis-session";

export async function createAnalysisSession(
  body: CreateAnalysisSessionRequestBody,
  mediaUrls?: string[],
): Promise<AnalysisSession> {
  const response = await apiClient.post<AnalysisSession>("/analysis-sessions", {
    contextMessage: body.contextMessage,
    mediaUrls,
    model: body.model,
    language: body.language,
  });

  return response.data;
}

export async function retryAnalysisSession(
  sessionId: string,
  body: { model?: string; language?: string },
): Promise<AnalysisSession> {
  const response = await apiClient.post<AnalysisSession>(
    `/analysis-sessions/${sessionId}/retry`,
    {
      model: body.model,
      language: body.language,
    },
  );

  return response.data;
}

export async function getMyAnalysisSessions(
  query: GetMyAnalysisSessionsQuery = {},
): Promise<PaginatedAnalysisSessions> {
  const params = new URLSearchParams();

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

export async function refineAnalysisSession(
  sessionId: string,
  comments: RefineCommentDto[],
): Promise<void> {
  await apiClient.post(`/analysis-sessions/${sessionId}/refine`, {
    comments,
  });
}
