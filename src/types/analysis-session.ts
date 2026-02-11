import { AnalysisStatus, GeminiModel } from "@/common/enums";
import { Upload } from "./upload";
import { AnalysisResult } from "./analysis-result";
import { ChatMessage } from "./chat-message";
import { Relationship } from "./relationship";

export interface CreateAnalysisSessionRequestBody {
  contextMessage?: string;
  mediaUrls?: string[];
  model?: GeminiModel;
}

export interface AnalysisSession {
  id: string;
  userId: string;
  title?: string;
  contextMessage?: string;
  status: AnalysisStatus;
  createdAt: string;
  updatedAt: string;
  uploads?: Upload[];
  result?: AnalysisResult;
  messages?: ChatMessage[];
  relationship?: Relationship;
}

export interface GetMyAnalysisSessionsQuery {
  page?: number;
  perPage?: number;
  search?: string;
  status?: AnalysisStatus;
  order?: string;
}

export interface PaginatedAnalysisSessions {
  meta: {
    page: number;
    perPage: number;
    total: number;
  };
  data: AnalysisSession[];
}
